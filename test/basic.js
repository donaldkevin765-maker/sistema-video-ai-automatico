const engine = require('../engine')

async function main() {
  console.log('=== Test Config ===')
  console.log(JSON.stringify(engine.getConfig(), null, 2))

  console.log()
  console.log('=== Test Providers ===')
  console.log(JSON.stringify(engine.getProviders(), null, 2))

  console.log()
  console.log('=== Test Prompt Validation ===')

  const promptModule = require('../engine/prompt')

  const testCases = [
    '',
    'AB',
    'Una borsa in pelle su sfondo bianco',
    'Un uomo che corre sulla spiaggia al tramonto, qualita cinematografica, 4k',
  ]

  for (const tc of testCases) {
    const v = promptModule.validatePrompt(tc)
    const built = v.valid ? promptModule.buildPrompt(tc, true) : null
    console.log(`"${tc.slice(0, 40)}..."`)
    console.log(`  valid: ${v.valid}${v.errors.length ? ', errors: ' + v.errors.join(', ') : ''}`)
    if (built) {
      console.log(`  strict prompt: "${built.prompt.slice(0, 60)}..."`)
      console.log(`  size: ${built.width}x${built.height}`)
    }
    console.log()
  }

  console.log('=== Test Enhanced Mode (strictMode=false) ===')
  const enhanced = promptModule.buildPrompt('Una borsa in pelle su sfondo bianco', false)
  console.log(`Original: "Una borsa in pelle su sfondo bianco"`)
  console.log(`Enhanced: "${enhanced.prompt}"`)
  console.log()

  console.log('=== Test Negative Prompt ===')
  console.log(promptModule.buildNegativePrompt('any'))
  console.log()

  console.log('All tests passed.')
}

main().catch(e => {
  console.error('Test failed:', e)
  process.exit(1)
})
