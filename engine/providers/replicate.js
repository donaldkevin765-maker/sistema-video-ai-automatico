const fs = require('fs')
const path = require('path')
const config = require('../../config')

async function generate(prompt, options = {}) {
  const token = options.token || config.replicate.token
  if (!token) {
    return {
      success: false,
      error: 'REPLICATE_API_TOKEN non configurato. Gratuito registrandosi su replicate.com (credits iniziali $5)',
    }
  }

  const model = options.model || config.replicate.model
  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight
  const duration = options.duration || config.duration

  try {
    // Avvia generazione
    const createRes = await fetch(`${config.replicate.apiUrl}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.includes(':') ? model.split(':')[1] : undefined,
        input: {
          prompt,
          width,
          height,
          num_frames: duration * 8,
          guidance_scale: 7,
          num_inference_steps: 50,
          fps: 8,
          model: model.includes(':') ? undefined : model,
        },
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      if (createRes.status === 402) {
        return { success: false, error: 'Credits Replicate esauriti. Crea nuovo account per free credits.' }
      }
      return { success: false, error: `Replicate error ${createRes.status}: ${err.slice(200)}` }
    }

    const prediction = await createRes.json()
    const getUrl = prediction.urls?.get || `${config.replicate.apiUrl}/predictions/${prediction.id}`

    // Polling
    let status
    let attempts = 0
    const maxAttempts = 120

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000))
      attempts++

      const statusRes = await fetch(getUrl, {
        headers: { 'Authorization': `Token ${token}` },
      })
      if (!statusRes.ok) continue

      status = await statusRes.json()
      if (status.status === 'succeeded') break
      if (status.status === 'failed') {
        return { success: false, error: `Replicate: ${status.error || 'generation failed'}` }
      }
    }

    if (!status || status.status !== 'succeeded') {
      return { success: false, error: 'Replicate: timeout' }
    }

    const videoUrl = status.output?.video || status.output?.[0] || status.output
    if (!videoUrl) {
      return { success: false, error: 'Replicate: no video in output' }
    }

    return {
      success: true,
      provider: 'replicate',
      videoUrl: typeof videoUrl === 'string' ? videoUrl : null,
      localPath: null,
      width,
      height,
      duration,
      predictionId: prediction.id,
      note: 'Generato via Replicate (free credits iniziali)',
      metadata: { predictionId: prediction.id },
    }
  } catch (e) {
    return { success: false, error: `Replicate: ${e.message}` }
  }
}

module.exports = { generate }
