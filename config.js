const path = require('path')

try { require('dotenv').config({ path: path.join(__dirname, '.env') }) } catch (e) {}

const config = {
  outputWidth: parseInt(process.env.VIDEO_WIDTH) || 1000,
  outputHeight: parseInt(process.env.VIDEO_HEIGHT) || 1000,
  duration: parseInt(process.env.VIDEO_DURATION) || 5,

  // Provider chain (tutti gratuiti)
  providers: (process.env.VIDEO_PROVIDERS || 'local,huggingface,replicate').split(','),

  // 1. Locale (diffusers + Apple Silicon MPS)
  local: {
    model: process.env.LOCAL_MODEL || 'cogvideox-5b',
  },

  // 2. Hugging Face Inference API (free tier)
  huggingface: {
    token: process.env.HF_API_TOKEN || '',
    model: process.env.HF_MODEL || 'THUDM/CogVideoX-5B',
    apiUrl: 'https://api-inference.huggingface.co/models',
  },

  // 3. Replicate (free credits)
  replicate: {
    token: process.env.REPLICATE_API_TOKEN || '',
    model: process.env.REPLICATE_MODEL || 'lucataco/cogvideox-5b:9221c1a7c9e7c2e0e2e8b7e3b6e2c0',
    apiUrl: 'https://api.replicate.com/v1',
  },

  outputDir: process.env.OUTPUT_DIR || path.join(__dirname, 'output'),
  tempDir: process.env.TEMP_DIR || path.join(__dirname, 'tmp'),

  strictMode: process.env.STRICT_MODE !== 'false',
}

module.exports = config
