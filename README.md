# Sistema Video AI Automatico

Generazione video AI realistici **1000x1000** da prompt testuali — **100% gratuito**.

## Strategia Gratuita

| Provider | Costo | Come attivarlo |
|----------|-------|----------------|
| **Locale (diffusers + MPS)** | Zero | GPU Mac Apple Silicon, `pip install diffusers torch` |
| **Hugging Face API** | Gratuito | Token gratis su huggingface.co/settings/tokens |
| **Replicate** | Credits gratis | $5 nuovi utenti, poi rigenera account |
| **Google Colab** | GPU gratis | Apri notebook → Runtime → Esegui tutto |

**Fallback chain automatica**: se un provider fallisce, passa al successivo.

## Filosofia

- **Strict Mode (default)**: il prompt viene usato **VERBATIM**. Quello che scrivi = quello che viene generato.
- **1000x1000 forzato**: tutti i video quadrati, formato social.
- **Nessuna API a pagamento**: tutto open source o free tier.

## Installazione

```bash
git clone https://github.com/donaldkevin765-maker/sistema-video-ai-automatico.git
cd sistema-video-ai-automatico
cp .env.example .env
npm install
```

### Per generazione locale su Mac (Apple Silicon)

```bash
pip install torch diffusers transformers accelerate
```

Il sistema userà autoaticamente la GPU MPS del Mac.

### Per Hugging Face (free tier)

1. Registrati su https://huggingface.co/join
2. Token: https://huggingface.co/settings/tokens
3. Metti `HF_API_TOKEN` in `.env`

### Per Replicate (free credits)

1. Registrati su https://replicate.com
2. Token: https://replicate.com/account/api-tokens
3. Metti `REPLICATE_API_TOKEN` in `.env`

## Utilizzo

### CLI

```bash
# Genera video (usa primo provider disponibile nella chain)
node cli.js "Una borsa in pelle su sfondo bianco, luce naturale"

# Forza provider specifico
VIDEO_PROVIDERS=huggingface node cli.js "Gatto che cammina sul tetto"

# Strict mode (default): prompt usato VERBATIM
STRICT_MODE=true node cli.js "il mio prompt esatto"
```

### Google Colab (GPU cloud gratis)

1. Vai su https://colab.research.google.com
2. Carica `notebooks/Genera_Video_AI_Gratis_Colab.ipynb`
3. Runtime → Esegui tutto
4. Scarica il video generato

## Architettura

```
engine/
├── index.js              # Entry point
├── prompt.js             # Strict mode prompt engineering
├── pipeline.js           # Pipeline generazione + fallback
└── providers/
    ├── index.js          # Registry + fallback chain
    ├── local.js          # diffusers + MPS (Mac GPU locale)
    ├── huggingface.js    # Hugging Face Inference API (free)
    ├── replicate.js      # Replicate (free credits)
    └── templates.js      # Template opzionali
scripts/
└── generate_local.py     # Script Python per generazione locale
notebooks/
└── Genera_Video_AI_Gratis_Colab.ipynb  # Colab notebook
api/
├── generate.js           # Endpoint POST /api/generate
└── status.js             # Endpoint GET /api/status
```
