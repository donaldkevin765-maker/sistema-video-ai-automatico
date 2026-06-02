const engine = require('./engine')
const notify = require('./engine/notify')

async function main() {
  const args = process.argv.slice(2)
  const prompt = args.join(' ')

  if (!prompt) {
    console.log('Usage: node cli.js <prompt>')
    console.log('Example: node cli.js "Una persona cammina in un parco in autunno"')
    console.log()
    console.log('ENV:')
    console.log('  TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...  → ricevi video su Telegram')
    console.log('  VIDEO_PROVIDERS=huggingface                    → forza provider')
    console.log('  HF_API_TOKEN=...                               → token Hugging Face')
    process.exit(1)
  }

  console.log('=== Generazione video ===')
  console.log(`Prompt: ${prompt}`)
  console.log()

  const result = await engine.generate(prompt)

  if (result.success) {
    console.log('✅ SUCCESSO')
    console.log(`Provider: ${result.provider}`)
    console.log(`Dimensioni: ${result.width}x${result.height}`)
    console.log(`Durata: ${result.duration}s`)

    if (result.videoUrl) {
      console.log(`Video URL: ${result.videoUrl}`)
    }
    if (result.localPath) {
      console.log(`File locale: ${result.localPath}`)
    }

    // Invia a Telegram se configurato
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      console.log()
      console.log('Invio a Telegram...')
      const msg = `🎬 *Video generato*\nPrompt: \`${prompt.slice(0, 200)}\`\nProvider: ${result.provider}\nDimensioni: ${result.width}x${result.height}`
      const tgResult = await notify.sendTelegram(msg, result.videoUrl)
      if (tgResult.success) {
        console.log('✅ Inviato su Telegram!')
      } else {
        console.log(`⚠️ Telegram: ${tgResult.reason || tgResult.response}`)
      }
    }
  } else {
    console.log('❌ FALLITO')
    console.log(`Errore: ${result.error}`)
    if (result.errors) {
      console.log('Dettagli:', JSON.stringify(result.errors, null, 2))
    }
    process.exit(1)
  }
}

main().catch(console.error)
