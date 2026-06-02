async function sendTelegram(text, videoUrl) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { success: false, reason: 'TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID non configurati' }

  try {
    if (videoUrl) {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          video: videoUrl,
          caption: text ? text.substring(0, 1000) : undefined,
          parse_mode: 'Markdown',
          width: 1000,
          height: 1000,
        }),
      })
      const result = await res.json()
      return { success: result.ok, response: result.description || 'ok' }
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.substring(0, 4000),
        parse_mode: 'Markdown',
      }),
    })
    const result = await res.json()
    return { success: result.ok, response: result.description || 'ok' }
  } catch (e) {
    return { success: false, reason: e.message }
  }
}

module.exports = { sendTelegram }
