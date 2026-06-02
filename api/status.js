const engine = require('../engine')

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET required' })
  }

  return res.status(200).json({
    status: 'ready',
    config: engine.getConfig(),
    providers: engine.getProviders(),
    timestamp: new Date().toISOString(),
  })
}
