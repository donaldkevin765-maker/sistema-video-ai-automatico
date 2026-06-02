const engine = require('./engine')

async function main() {
  const args = process.argv.slice(2)
  const prompt = args.join(' ')

  if (!prompt) {
    console.log('Usage: node cli.js <prompt>')
    console.log('Example: node cli.js "Una persona cammina in un parco in autunno, luce naturale"')
    process.exit(1)
  }

  console.log('Generating video...')
  console.log(`Prompt: ${prompt}`)
  console.log()

  const result = await engine.generate(prompt)

  if (result.success) {
    console.log('=== SUCCESS ===')
    console.log(`Provider: ${result.provider}`)
    console.log(`Width: ${result.width}x${result.height}`)
    console.log(`Duration: ${result.duration}s`)
    console.log(`Video URL: ${result.videoUrl}`)
    if (result.localPath) console.log(`Local path: ${result.localPath}`)
    console.log(`Strict mode: ${result.strictMode}`)
    console.log(`Prompt used: ${result.prompt}`)
  } else {
    console.log('=== FAILED ===')
    console.log(`Error: ${result.error}`)
    if (result.errors) {
      console.log('Errors:', JSON.stringify(result.errors, null, 2))
    }
  }
}

main().catch(console.error)
