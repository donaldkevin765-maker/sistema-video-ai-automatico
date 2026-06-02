# Sistema Video AI Automatico

Generazione video AI realistici 1000x1000 da prompt testuali.

## Filosofia

- **Strict Mode (default)**: il prompt utente viene usato **VERBATIM**. Nessuna modifica, nessuna interpretazione, nessun arricchimento. Quello che scrivi = quello che viene generato.
- **Enhanced Mode**: se disabiliti strict mode, il sistema arricchisce automaticamente il prompt con qualità, risoluzione, e parametri ottimali.
- **1000x1000 forzato**: tutti i video sono quadrati, formato perfetto per social.
- **Multi-provider con fallback chain**: se un provider fallisce, passa automaticamente al successivo.

## Provider Supportati

| Provider | API Key | Qualità | Costo |
|----------|---------|---------|-------|
| Runway Gen-3/4 | `RUNWAY_API_KEY` | Alta | A consumo |
| Luma Dream Machine | `LUMA_API_KEY` | Alta | A consumo |
| Locale (CogVideoX/SVD) | `LOCAL_ENDPOINT` | Media | Gratuito |

## Installazione

```bash
git clone https://github.com/donaldkevin765-maker/sistema-video-ai-automatico.git
cd sistema-video-ai-automatico
cp .env.example .env
npm install
```

Configura almeno un API key in `.env`.

## Utilizzo

### CLI

```bash
node cli.js "Una borsa in pelle su sfondo bianco, luce naturale, qualità professionale"
```

### API (integrazione con AI Content Studio)

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Una borsa in pelle su sfondo bianco"}'
```

### Come modulo Node.js

```js
const engine = require('./engine')
const result = await engine.generate("Una borsa in pelle su sfondo bianco")
console.log(result.videoUrl)
```

## Configurazione

Tramite `.env`:

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `VIDEO_WIDTH` | 1000 | Larghezza output |
| `VIDEO_HEIGHT` | 1000 | Altezza output |
| `VIDEO_DURATION` | 5 | Durata in secondi |
| `VIDEO_PROVIDERS` | runway,luma,local | Ordine fallback chain |
| `STRICT_MODE` | true | Usa prompt utente verbatim |
| `RUNWAY_API_KEY` | - | API key Runway |
| `LUMA_API_KEY` | - | API key Luma |

## Architettura

```
engine/
├── index.js          # Entry point
├── prompt.js         # Prompt engineering (strict/enhanced)
├── pipeline.js       # Pipeline generazione
└── providers/
    ├── index.js      # Registry + fallback chain
    ├── runway.js     # Runway Gen-3/4
    ├── luma.js       # Luma Dream Machine
    ├── local.js      # CogVideoX / SVD locale
    └── templates.js  # Template per tipi video
api/
├── generate.js       # Endpoint POST /generate
└── status.js         # Endpoint GET /status
cli.js                # CLI per test
test/basic.js         # Test base
```
