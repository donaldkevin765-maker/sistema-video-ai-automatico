const engine = require('../engine')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    const { prompt, ...options } = body

    if (!prompt) {
      return res.status(400).json({ error: 'prompt richiesto' })
    }

    const result = await engine.generate(prompt, options)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json(result)
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
