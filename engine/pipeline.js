const path = require('path')
const fs = require('fs')
const config = require('../config')
const prompt = require('./prompt')
const providers = require('./providers')

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }) } catch (e) {}
}

async function run(userInput, options = {}) {
  // 1. Validazione input
  const validation = prompt.validatePrompt(userInput)
  if (!validation.valid) {
    return { success: false, error: validation.errors.join('; ') }
  }

  // 2. Costruzione prompt
  const strictMode = options.strictMode !== undefined ? options.strictMode : config.strictMode
  const promptResult = prompt.buildPrompt(userInput, strictMode)

  // 3. Negative prompt
  const negativePrompt = options.negativePrompt || prompt.buildNegativePrompt(userInput)

  // 4. Forza 1000x1000
  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight

  // 5. Esecuzione generazione con fallback chain
  const result = await providers.generate(promptResult.prompt, {
    ...options,
    width,
    height,
    negativePrompt,
    strictMode,
  })

  if (!result.success) return result

  // 6. Download video
  let localPath = null
  if (result.videoUrl && options.download !== false) {
    try {
      ensureDir(config.outputDir)
      const fileName = `video-${Date.now()}.mp4`
      localPath = path.join(config.outputDir, fileName)

      const resp = await fetch(result.videoUrl)
      if (resp.ok) {
        const buffer = Buffer.from(await resp.arrayBuffer())
        fs.writeFileSync(localPath, buffer)
      }
    } catch (e) {
      console.warn('[pipeline] Download fallito:', e.message)
    }
  }

  return {
    success: true,
    prompt: promptResult.prompt,
    strictMode: promptResult.strict,
    width,
    height,
    videoUrl: result.videoUrl,
    localPath,
    provider: result.provider,
    chainAttempted: result.chainAttempted,
    duration: result.duration || config.duration,
    metadata: result.metadata || {},
    generatedAt: new Date().toISOString(),
  }
}

module.exports = { run }
