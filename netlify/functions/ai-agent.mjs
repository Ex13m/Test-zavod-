// ============================================================
// ИИ-агент завода: единый прокси к нескольким нейросетям.
// Задачи:
//   product — распознать товар по фото (тип, бренд, название)
//   style   — прочитать скрины постов и снять реальный профиль стиля
//   shop    — проанализировать сайт магазина по живому HTML
//
// Провайдеры (по приоритету, берётся первый с ключом):
//   1. Anthropic Claude — ANTHROPIC_API_KEY (платный, лучшее качество,
//      минимум Opus 4.8; переопределить: AI_MODEL)
//   2. Google Gemini — GEMINI_API_KEY (БЕСПЛАТНЫЙ ключ на
//      aistudio.google.com; переопределить: GEMINI_MODEL)
//   3. OpenRouter — OPENROUTER_API_KEY (бесплатные :free-модели на
//      openrouter.ai; переопределить: OPENROUTER_MODEL)
// Ключи задаются в Netlify → Site configuration → Environment variables,
// ЛИБО вводятся в настройках завода и приходят с каждым запросом как
// clientKey (хранятся только в браузере пользователя; провайдер
// определяется по виду ключа: sk-ant-… / AIza… / sk-or-…).
// Без единого ключа функция отвечает { ok:false, reason:'no_key' } —
// фронт мягко уходит в эвристику.
// ============================================================

const CLAUDE_MODEL = process.env.AI_MODEL || 'claude-opus-4-8'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS } })

const PRODUCT_TYPES = 'wobbler, spinner, spoon, soft, jig, popper, balancer, spinnerbait, hooks, rod, reel, line, apparel, knife'

const PROMPTS = {
  product: `Ты — эксперт-товаровед рыболовного магазина. Посмотри на фото товара и верни СТРОГО JSON без пояснений:
{
 "type": "один из: ${PRODUCT_TYPES}",
 "name": "короткое торговое название с брендом и размером, как в каталоге (напр. 'Keitech Easy Shiner 4\\"' или 'Крючки Select Stonic #7')",
 "brand": "бренд или null",
 "fish": "если по фото/упаковке/надписям понятно, под какую рыбу товар (trout/форелевая серия, карповые крючки и т.п.) — название рыбы по-русски в винительном падеже, как в фразе «ловить …» (напр. 'форель', 'судака', 'карпа'); если не видно — null",
 "details": "1 фраза: что видно на фото — расцветка, размер, особенности"
}
Внимательно читай текст на упаковке — серия и назначение чаще всего написаны там.
Если товар не рыболовный — подбери ближайший тип по смыслу.`,

  style: `Ты — аналитик соцсетей. Перед тобой скриншоты постов магазина. Прочитай тексты на них и верни СТРОГО JSON без пояснений:
{
 "language": "ru|cs|en|other",
 "tone": "1 короткая фраза, описывающая тон повествования",
 "emojiDensity": 0.0-1.0,
 "length": "short|medium|long",
 "punch": 0.0-1.0 (рубленость фраз),
 "formality": 0.0-1.0,
 "hashtags": ["реальные хэштеги из постов, до 8"],
 "catchphrases": ["2-4 характерных оборота/фразы из постов, дословно"],
 "ctaStyle": "1 фраза: как посты зовут к действию",
 "brands": ["бренды, упомянутые в постах"]
}`,

  enrich: `Ты — эксперт-рыболов и товаровед. Изучи товар (по поиску в интернете, если он доступен, иначе по своим знаниям) и верни СТРОГО JSON без пояснений:
{
 "about": "1 фраза: что это за товар и чем известна серия",
 "usage": "1-2 фразы: как и когда его применять на рыбалке (проводка, оснастка, условия)",
 "fish": ["целевые рыбы, до 3, по-русски в винительном падеже, как в фразе «ловить …» (напр. 'форель', 'судака')"],
 "facts": ["3-5 КОНКРЕТНЫХ фактов о товаре/серии: рабочие проводки, глубины, условия, сильные стороны — без воды и общих слов"],
 "season": "когда товар работает лучше всего, 1 короткая фраза"
}
Пиши только то, что реально относится к этому товару/серии; не выдумывай характеристики.`,

  shop: `Ты — маркетинговый аналитик. Ниже — текст главной страницы интернет-магазина. Верни СТРОГО JSON без пояснений:
{
 "name": "название магазина",
 "lang": "основной язык магазина: ru|cs|en",
 "niche": "1 фраза: ниша (по-русски)",
 "brands": ["бренды из каталога, до 6"],
 "audience": "1 фраза: целевая аудитория (по-русски)",
 "fish": ["виды рыб, на которые ориентирован ассортимент, до 4, на языке магазина"],
 "tags": ["#хэштеги для постов магазина, до 7, на языке магазина"],
 "tone": "friendly|expert|aggressive|calm",
 "confidence": 0.0-1.0
}`,
}

// content — унифицированный: [{img: {mime, b64}} | {text: '...'}]
const parseJSON = (text) => {
  const m = String(text || '').match(/\{[\s\S]*\}/)
  if (!m) throw new Error('Модель не вернула JSON')
  return JSON.parse(m[0])
}

// opts.search — разрешить модели веб-поиск (Claude: server-tool
// web_search, Gemini: grounding через google_search). OpenRouter
// поиска не имеет — отвечает на знаниях модели.
async function callClaude(apiKey, system, content, maxTokens = 700, opts = {}) {
  const blocks = content.map((c) =>
    c.img
      ? { type: 'image', source: { type: 'base64', media_type: c.img.mime, data: c.img.b64 } }
      : { type: 'text', text: c.text }
  )
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: blocks }],
      ...(opts.search ? { tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }] } : {}),
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `Claude API ${res.status}`)
  return parseJSON((data.content || []).map((b) => b.text || '').join(''))
}

async function callGemini(apiKey, system, content, maxTokens = 700, opts = {}) {
  const parts = content.map((c) =>
    c.img ? { inline_data: { mime_type: c.img.mime, data: c.img.b64 } } : { text: c.text }
  )
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        // с grounding-поиском JSON-режим недоступен — parseJSON вытащит объект из текста
        ...(opts.search
          ? { tools: [{ google_search: {} }], generationConfig: { maxOutputTokens: maxTokens } }
          : { generationConfig: { maxOutputTokens: maxTokens, responseMimeType: 'application/json' } }),
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `Gemini API ${res.status}`)
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('')
  return parseJSON(text)
}

async function callOpenRouter(apiKey, system, content, maxTokens = 700) {
  const parts = content.map((c) =>
    c.img
      ? { type: 'image_url', image_url: { url: `data:${c.img.mime};base64,${c.img.b64}` } }
      : { type: 'text', text: c.text }
  )
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: parts },
      ],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `OpenRouter ${res.status}`)
  return parseJSON(data.choices?.[0]?.message?.content)
}

function pickProvider(clientKey = '') {
  if (process.env.ANTHROPIC_API_KEY)
    return { id: 'anthropic', label: 'Claude', model: CLAUDE_MODEL, key: process.env.ANTHROPIC_API_KEY, call: callClaude }
  if (process.env.GEMINI_API_KEY)
    return { id: 'gemini', label: 'Gemini (бесплатный)', model: GEMINI_MODEL, key: process.env.GEMINI_API_KEY, call: callGemini }
  if (process.env.OPENROUTER_API_KEY)
    return { id: 'openrouter', label: 'OpenRouter (бесплатный)', model: OPENROUTER_MODEL, key: process.env.OPENROUTER_API_KEY, call: callOpenRouter }
  // ключ из настроек завода (браузер пользователя) — тип по префиксу
  const k = String(clientKey || '').trim()
  if (k.startsWith('sk-ant-'))
    return { id: 'anthropic', label: 'Claude (ключ из браузера)', model: CLAUDE_MODEL, key: k, call: callClaude }
  if (k.startsWith('AIza'))
    return { id: 'gemini', label: 'Gemini (ключ из браузера)', model: GEMINI_MODEL, key: k, call: callGemini }
  if (k.startsWith('sk-or-'))
    return { id: 'openrouter', label: 'OpenRouter (ключ из браузера)', model: OPENROUTER_MODEL, key: k, call: callOpenRouter }
  return null
}

const dataUrlToImg = (dataUrl) => {
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(dataUrl)
  if (!m) return null
  return { img: { mime: m[1], b64: m[2] } }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: CORS })

  // GET — проба статуса агента (только серверные ключи;
  // ключ из браузера фронт учитывает сам, без запроса)
  if (req.method === 'GET') {
    const provider = pickProvider()
    return json({
      ok: true,
      hasKey: Boolean(provider),
      provider: provider?.id || null,
      providerLabel: provider?.label || null,
      model: provider?.model || null,
    })
  }
  if (req.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405)

  let body
  try { body = await req.json() } catch { return json({ ok: false, error: 'Некорректный JSON' }, 400) }
  const { task, images = [], url, clientKey, product } = body
  const provider = pickProvider(clientKey)
  if (!provider)
    return json(
      { ok: false, reason: 'no_key', error: 'Нет ключа: задайте в Netlify (ANTHROPIC_API_KEY / GEMINI_API_KEY / OPENROUTER_API_KEY) или вставьте ключ в Настройках завода' },
      200
    )

  // ping — реальная проверка ключа: минимальный запрос к провайдеру
  if (task === 'ping') {
    try {
      const r = await provider.call(provider.key, 'Ты — проверка связи.', [{ text: 'Верни СТРОГО JSON: {"pong":true}' }], 60)
      return json({ ok: true, pong: Boolean(r?.pong), provider: provider.id, providerLabel: provider.label, model: provider.model })
    } catch (e) {
      return json({ ok: false, reason: 'bad_key', provider: provider.id, error: String(e.message || e) }, 200)
    }
  }

  if (!PROMPTS[task]) return json({ ok: false, error: 'task должен быть product | style | shop | enrich | ping' }, 400)

  try {
    let content = []
    let opts = {}
    if (task === 'enrich') {
      const name = String(product?.name || '').slice(0, 120)
      if (!name) return json({ ok: false, error: 'Нужен product.name' }, 400)
      const brand = String(product?.brand || '').slice(0, 60)
      const ptype = String(product?.type || '').slice(0, 30)
      content = [{ text: `Товар: ${name}${brand ? `\nБренд: ${brand}` : ''}${ptype ? `\nКатегория: ${ptype}` : ''}\n\nИзучи этот товар и верни JSON по инструкции.` }]
      opts = { search: true }
    } else if (task === 'shop') {
      if (!url) return json({ ok: false, error: 'Нужен url магазина' }, 400)
      const target = /^https?:\/\//.test(url) ? url : 'https://' + url
      const page = await fetch(target, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LureFactoryBot/1.0)' },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
      }).then((r) => r.text()).catch(() => '')
      const text = page
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 14000)
      if (text.length < 200) {
        return json({ ok: false, reason: 'fetch_failed', error: 'Сайт не отдал контент (бот-защита?) — используем эвристику' })
      }
      content = [{ text: `URL: ${target}\n\nТекст страницы:\n${text}` }]
    } else {
      const blocks = images.map(dataUrlToImg).filter(Boolean).slice(0, task === 'style' ? 6 : 2)
      if (!blocks.length) return json({ ok: false, error: 'Нужны изображения (dataURL)' }, 400)
      content = [...blocks, { text: 'Проанализируй по инструкции и верни JSON.' }]
    }

    let result
    try {
      result = await provider.call(provider.key, PROMPTS[task], content, task === 'enrich' ? 900 : 700, opts)
    } catch (e) {
      // веб-поиск может быть недоступен для ключа/модели — пробуем без него
      if (!opts.search) throw e
      result = await provider.call(provider.key, PROMPTS[task], content, 900)
    }
    return json({ ok: true, task, result, provider: provider.id, model: provider.model })
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200)
  }
}
