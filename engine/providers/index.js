const config = require('../../config')

const providers = {
  runway: require('./runway'),
  luma: require('./luma'),
  local: require('./local'),
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
    error: 'Tutti i provider hanno fallito',
    chainAttempted: providerChain,
    errors,
  }
}

function listProviders() {
  return Object.keys(providers).map(name => ({
    name,
    configured: isConfigured(name),
  }))
}

function isConfigured(name) {
  switch (name) {
    case 'runway': return !!config.runway.apiKey
    case 'luma': return !!config.luma.apiKey
    case 'local': return true
    default: return false
  }
}

module.exports = { generate, listProviders, providers }
