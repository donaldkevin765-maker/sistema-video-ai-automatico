const { execSync, exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const config = require('../../config')

async function generate(prompt, options = {}) {
  const width = options.width || config.outputWidth
  const height = options.height || config.outputHeight

  // Verifica se Python + diffusers è installato
  try {
    execSync('python3 -c "import torch, diffusers"', { stdio: 'pipe' })
  } catch {
    return {
      success: false,
      error: 'Python/diffusers non installato. Per usare generazione locale gratis:\n' +
        '  pip install torch diffusers transformers accelerate',
      fix: 'pip install torch diffusers transformers accelerate',
    }
  }

  const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'generate_local.py')
  if (!fs.existsSync(scriptPath)) {
    return { success: false, error: 'Script Python mancante: scripts/generate_local.py' }
  }

  return new Promise((resolve) => {
    const outputPath = path.join(config.outputDir, `video-${Date.now()}.mp4`)
    fs.mkdirSync(config.outputDir, { recursive: true })

    const proc = exec(
      `python3 "${scriptPath}" "${prompt}" "${outputPath}" ${width} ${height} ${options.duration || config.duration}`,
      { 
        timeout: 300000, // 5 min timeout
        env: { ...process.env, MODEL_NAME: options.model || config.local.model }
      }
    )

    let stderr = ''
    proc.stderr.on('data', (d) => { stderr += d.toString() })

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({
          success: true,
          provider: 'local',
          localPath: outputPath,
          width,
          height,
          duration: options.duration || config.duration,
          note: 'Generato localmente con GPU Mac (MPS) - 100% gratuito',
        })
      } else {
        resolve({
          success: false,
          error: `Script fallito (code ${code}): ${stderr.slice(-500)}`,
        })
      }
    })

    proc.on('error', (e) => {
      resolve({ success: false, error: `Errore esecuzione: ${e.message}` })
    })
  })
}

module.exports = { generate }
