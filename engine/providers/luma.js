const config = require('../../config')

async function generate(prompt, options = {}) {
  const apiKey = options.apiKey || config.luma.apiKey
  if (!apiKey) return { success: false, error: 'LUMA_API_KEY non configurato' }

  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight

  try {
    const createRes = await fetch(`${config.luma.apiUrl}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: '1:1',
        width,
        height,
        model: options.model || 'ray-v2',
        user_prompt: prompt,
        callback_url: options.callbackUrl || null,
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      return { success: false, error: `Luma API error ${createRes.status}: ${err}` }
    }

    const gen = await createRes.json()
    const genId = gen.id

    // Polling
    let status
    let attempts = 0
    const maxAttempts = 120

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000))
      attempts++

      const statusRes = await fetch(`${config.luma.apiUrl}/generations/${genId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      })

      if (!statusRes.ok) continue
      status = await statusRes.json()

      if (status.state === 'completed') break
      if (status.state === 'failed') {
        return { success: false, error: `Luma: ${status.failure_reason || 'generation failed'}` }
      }
    }

    if (!status || status.state !== 'completed') {
      return { success: false, error: 'Luma: timeout waiting for generation' }
    }

    return {
      success: true,
      provider: 'luma',
      videoUrl: status.assets?.video || status.output?.url,
      genId,
      duration: status.video_length || config.duration,
      width,
      height,
      metadata: status,
    }
  } catch (e) {
    return { success: false, error: `Luma: ${e.message}` }
  }
}

module.exports = { generate }
