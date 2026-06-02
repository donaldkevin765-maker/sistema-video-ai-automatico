const config = require('../../config')

const providers = {
  local: require('./local'),
  huggingface: require('./huggingface'),
  replicate: require('./replicate'),
}

async function generate(prompt, options = {}) {
  const providerChain = options.providers || config.providers
  const errors = []

  for (const name of providerChain) {
    const provider = providers[name]
    if (!provider) {
      errors.push({ provider: name, error: 'Provider sconosciuto' })
      continue
    }

    try {
      const result = await provider.generate(prompt, options)
      if (result.success) {
        return {
          ...result,
          chainAttempted: providerChain.slice(0, providerChain.indexOf(name) + 1),
          providerChain,
        }
      }
      errors.push({ provider: name, error: result.error })
    } catch (e) {
      errors.push({ provider: name, error: e.message })
    }
  }

  return {
    success: false,
    error: 'Tutti i provider gratuiti hanno fallito',
    chainAttempted: providerChain,
    errors,
  }
}

function listProviders() {
  return Object.keys(providers).sort().map(name => ({
    name,
    configured: isConfigured(name),
    free: true,
    description: getDescription(name),
  }))
}

function isConfigured(name) {
  switch (name) {
    case 'local': return true
    case 'huggingface': return !!config.huggingface.token
    case 'replicate': return !!config.replicate.token
    default: return false
  }
}

function getDescription(name) {
  switch (name) {
    case 'local': return 'GPU Mac locale (diffusers + MPS) - zero cost, richiede installazione Python'
    case 'huggingface': return 'Hugging Face Inference API - free tier, rate limited, basta token gratuito'
    case 'replicate': return 'Replicate cloud - free credits iniziali $5 per nuovi account'
    default: return ''
  }
}

module.exports = { generate, listProviders, providers }
