const config = require('../../config')

async function generate(prompt, options = {}) {
  const apiKey = options.apiKey || config.runway.apiKey
  if (!apiKey) return { success: false, error: 'RUNWAY_API_KEY non configurato' }

  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight
  const duration = options.duration || config.duration

  try {
    // Crea task di generazione immagine→video
    const createRes = await fetch(`${config.runway.apiUrl}/image_to_video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptImage: options.imageUrl || null,
        promptText: prompt,
        width,
        height,
        duration,
        fps: 24,
        aspectRatio: '1:1',
        model: options.model || 'gen3',
        cfg: options.cfg || 7,
        seed: options.seed || null,
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      return { success: false, error: `Runway API error ${createRes.status}: ${err}` }
    }

    const task = await createRes.json()
    const taskId = task.id

    // Polling fino a completamento
    let status
    let attempts = 0
    const maxAttempts = 120

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000))
      attempts++

      const statusRes = await fetch(`${config.runway.apiUrl}/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      })

      if (!statusRes.ok) continue

      status = await statusRes.json()

      if (status.status === 'succeeded') break
      if (status.status === 'failed') {
        return { success: false, error: `Runway: ${status.error || 'generation failed'}` }
      }
    }

    if (!status || status.status !== 'succeeded') {
      return { success: false, error: 'Runway: timeout waiting for generation' }
    }

    return {
      success: true,
      provider: 'runway',
      videoUrl: status.output?.url || status.output?.[0]?.url,
      taskId,
      duration: status.output?.duration || duration,
      width,
      height,
      metadata: status,
    }
  } catch (e) {
    return { success: false, error: `Runway: ${e.message}` }
  }
}

module.exports = { generate }
