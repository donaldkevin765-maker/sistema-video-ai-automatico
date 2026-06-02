const config = require('../config')

function buildPrompt(userInput, strictMode) {
  strictMode = strictMode !== undefined ? strictMode : config.strictMode

  if (strictMode) {
    return {
      prompt: userInput,
      strict: true,
      note: 'Strict mode: prompt utente usato VERBATIM, nessuna modifica applicata.',
      width: config.outputWidth,
      height: config.outputHeight,
    }
  }

  // Enhanced mode: solo se strictMode=false
  const enhanced = enhancePrompt(userInput)
  return {
    prompt: enhanced,
    strict: false,
    original: userInput,
    width: config.outputWidth,
    height: config.outputHeight,
  }
}

function enhancePrompt(userInput) {
  const hasResolution = /[×x]\s*\d{3,4}/i.test(userInput) || /\d{3,4}\s*[×x]/i.test(userInput)
  const hasQuality = /realistic|photorealistic|8k|4k|high quality|sharp/i.test(userInput)

  let enhanced = userInput.trim()

  if (!hasResolution) {
    enhanced += `, ${config.outputWidth}x${config.outputHeight}`
  }

  if (!hasQuality) {
    enhanced += ', cinematic quality, realistic, sharp focus, natural lighting, photorealistic'
  }

  if (!/square|1:1|1000x1000/i.test(enhanced)) {
    enhanced += ', square aspect ratio 1:1'
  }

  return enhanced
}

function buildNegativePrompt(userInput) {
  const base = 'blurry, low quality, distorted faces, deformed, ugly, bad anatomy, worst quality, low resolution, grainy, overly saturated, cartoonish, anime, stylized, painterly, illustration, 3d render, cgi, artificial looking'
  return base
}

function validatePrompt(userInput) {
  const errors = []
  if (!userInput || typeof userInput !== 'string') {
    errors.push('Prompt richiesto (stringa)')
  } else {
    if (userInput.length < 3) errors.push('Prompt troppo corto (min 3 caratteri)')
    if (userInput.length > 5000) errors.push('Prompt troppo lungo (max 5000 caratteri)')
  }
  return { valid: errors.length === 0, errors }
}

module.exports = { buildPrompt, buildNegativePrompt, validatePrompt }
