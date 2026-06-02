const path = require('path')

try { require('dotenv').config({ path: path.join(__dirname, '.env') }) } catch (e) {}

const config = {
  // Dimensioni forzate: 1000x1000
  outputWidth: parseInt(process.env.VIDEO_WIDTH) || 1000,
  outputHeight: parseInt(process.env.VIDEO_HEIGHT) || 1000,
  duration: parseInt(process.env.VIDEO_DURATION) || 5,

  // Provider chain (ordine di tentativo)
  providers: (process.env.VIDEO_PROVIDERS || 'runway,luma,local').split(','),

  // Runway Gen-3/4
  runway: {
    apiKey: process.env.RUNWAY_API_KEY || '',
    apiUrl: 'https://api.runwayml.com/v1',
  },

  // Luma Dream Machine
  luma: {
    apiKey: process.env.LUMA_API_KEY || '',
    apiUrl: 'https://api.lumalabs.ai/dream-machine/v1',
  },

  // Locale (CogVideoX / SVD via HTTP)
  local: {
    endpoint: process.env.LOCAL_ENDPOINT || 'http://localhost:8000',
    model: process.env.LOCAL_MODEL || 'cogvideox-5b',
  },

  // Output
  outputDir: process.env.OUTPUT_DIR || path.join(__dirname, 'output'),
  tempDir: process.env.TEMP_DIR || path.join(__dirname, 'tmp'),

  // Strict mode: se true, il sistema NON modifica mai il prompt utente
  strictMode: process.env.STRICT_MODE !== 'false',
}

module.exports = config
