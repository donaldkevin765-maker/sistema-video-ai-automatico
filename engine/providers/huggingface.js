const fs = require('fs')
const path = require('path')
const config = require('../../config')

async function generate(prompt, options = {}) {
  const token = options.token || config.huggingface.token
  if (!token) {
    return { success: false, error: 'HF_API_TOKEN non configurato. Gratuito su huggingface.co/settings/tokens' }
  }

  const model = options.model || config.huggingface.model
  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight

  try {
    const url = `${config.huggingface.apiUrl}/${model}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          num_frames: (options.duration || config.duration) * 8,
          guidance_scale: 7,
          num_inference_steps: 50,
        },
      }),
    })

    if (res.status === 503) {
      return { success: false, error: 'Modello in caricamento su HF, riprova tra 30s', loading: true }
    }

    if (res.status === 403) {
      return { success: false, error: 'Token HF non valido o modello non accessibile. Verifica su huggingface.co/settings/tokens' }
    }

    if (!res.ok) {
      const err = await res.text()
      return { success: false, error: `HF API error ${res.status}: ${err.slice(200)}` }
    }

    // Response potrebbe essere video binario o JSON
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const result = await res.json()
      if (result.video || result.url) {
        return {
          success: true,
          provider: 'huggingface',
          videoUrl: result.video || result.url,
          width,
          height,
          note: 'Generato via Hugging Face Inference API (free tier)',
        }
      }
      return { success: false, error: `Risposta inaspettata: ${JSON.stringify(result).slice(200)}` }
    }

    // Salva video binario
    fs.mkdirSync(config.outputDir, { recursive: true })
    const videoPath = path.join(config.outputDir, `video-hf-${Date.now()}.mp4`)
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(videoPath, buffer)

    return {
      success: true,
      provider: 'huggingface',
      localPath: videoPath,
      videoUrl: null,
      width,
      height,
      note: 'Generato via Hugging Face Inference API (free tier)',
    }
  } catch (e) {
    return { success: false, error: `HuggingFace: ${e.message}` }
  }
}

module.exports = { generate }
