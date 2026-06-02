const config = require('../config')
const prompt = require('./prompt')
const pipeline = require('./pipeline')
const providers = require('./providers')

async function generate(userInput, options = {}) {
  return await pipeline.run(userInput, options)
}

function getConfig() {
  return {
    outputWidth: config.outputWidth,
    outputHeight: config.outputHeight,
    duration: config.duration,
    strictMode: config.strictMode,
    providers: config.providers,
  }
}

function getProviders() {
  return providers.listProviders()
}

module.exports = { generate, getConfig, getProviders }
