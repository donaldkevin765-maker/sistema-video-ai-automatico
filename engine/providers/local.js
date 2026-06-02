const config = require('../../config')

async function generate(prompt, options = {}) {
  const endpoint = options.endpoint || config.local.endpoint
  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight

  try {
    const res = await fetch(`${endpoint}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        width,
        height,
        num_frames: options.numFrames || (config.duration * 24),
        fps: options.fps || 24,
        model: options.model || config.local.model,
        guidance_scale: options.cfg || 7,
        seed: options.seed || null,
        negative_prompt: options.negativePrompt || '',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { success: false, error: `Local API error ${res.status}: ${err}` }
    }

    const result = await res.json()

    return {
      success: true,
      provider: 'local',
      videoUrl: result.output?.url || result.video,
      localPath: result.output?.path || null,
      duration: config.duration,
      width,
      height,
      metadata: result,
    }
  } catch (e) {
    return { success: false, error: `Local: ${e.message}` }
  }
}

module.exports = { generate }
