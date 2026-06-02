// Template per diversi tipi di video
// Usati solo quando strictMode=false o per arricchimento opzionale

const templates = {
  product: {
    style: 'professional product showcase',
    lighting: 'studio lighting, soft shadows, clean background',
    camera: 'slow orbit around product, 360 view',
    mood: 'luxury, premium, elegant',
  },

  landscape: {
    style: 'cinematic nature documentary',
    lighting: 'golden hour, natural sunlight',
    camera: 'slow pan, dolly shot, smooth',
    mood: 'serene, majestic, breathtaking',
  },

  portrait: {
    style: 'editorial fashion photography',
    lighting: 'soft natural window light, rim light',
    camera: 'medium shot, shallow depth of field',
    mood: 'natural, authentic, candid',
  },

  action: {
    style: 'dynamic action sequence',
    lighting: 'dramatic, high contrast',
    camera: 'fast cuts, handheld energy',
    mood: 'energetic, intense, thrilling',
  },

  abstract: {
    style: 'artistic visual exploration',
    lighting: 'neon, volumetric, atmospheric',
    camera: 'fluid morphing, continuous zoom',
    mood: 'surreal, dreamlike, hypnotic',
  },
}

function applyTemplate(templateName, userPrompt) {
  const tmpl = templates[templateName]
  if (!tmpl) return userPrompt

  return `${userPrompt}. Style: ${tmpl.style}. Lighting: ${tmpl.lighting}. Camera: ${tmpl.camera}. Mood: ${tmpl.mood}.`
}

function detectTemplate(prompt) {
  const lower = prompt.toLowerCase()
  if (/(product|item|oggetto|prodotto|merce)/i.test(lower)) return 'product'
  if (/(paesaggio|landscape|natura|nature|mountain|montagna|oceano|ocean)/i.test(lower)) return 'landscape'
  if (/(persona|uomo|donna|girl|boy|portrait|ritratto)/i.test(lower)) return 'portrait'
  if (/(azione|action|sport|corsa|run|fight|lotta)/i.test(lower)) return 'action'
  return null
}

module.exports = { templates, applyTemplate, detectTemplate }
