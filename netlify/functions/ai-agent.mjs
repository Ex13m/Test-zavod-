// ============================================================
// ИИ-агент завода: прокси к Claude API (Anthropic).
// Задачи:
//   product — распознать товар по фото (тип, бренд, название)
//   style   — прочитать скрины постов и снять реальный профиль стиля
//   shop    — проанализировать сайт магазина по живому HTML
// Ключ: переменная окружения ANTHROPIC_API_KEY на Netlify
// (Site configuration → Environment variables). Без ключа функция
// отвечает { ok:false, reason:'no_key' } — фронт уходит в эвристику.
// ============================================================

const MODEL = process.env.AI_MODEL || 'claude-haiku-4-5-20251001'

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
 "details": "1 фраза: что видно на фото — расцветка, размер, особенности"
}
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

async function callClaude(apiKey, system, content, maxTokens = 700) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content }],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `Claude API ${res.status}`)
  const text = (data.content || []).map((b) => b.text || '').join('')
  // модель может обернуть JSON в ```-блок
  const m = text.match(/\{[\s\S]*\}/)
  if (!m) throw new Error('Модель не вернула JSON')
  return JSON.parse(m[0])
}

const dataUrlToBlock = (dataUrl) => {
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(dataUrl)
  if (!m) return null
  return { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: CORS })

  const apiKey = process.env.ANTHROPIC_API_KEY
  // GET — проба статуса агента
  if (req.method === 'GET') return json({ ok: true, hasKey: Boolean(apiKey), model: apiKey ? MODEL : null })
  if (req.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405)
  if (!apiKey) return json({ ok: false, reason: 'no_key', error: 'ANTHROPIC_API_KEY не задан в переменных окружения Netlify' }, 200)

  let body
  try { body = await req.json() } catch { return json({ ok: false, error: 'Некорректный JSON' }, 400) }
  const { task, images = [], url } = body
  if (!PROMPTS[task]) return json({ ok: false, error: 'task должен быть product | style | shop' }, 400)

  try {
    let content = []
    if (task === 'shop') {
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
      content = [{ type: 'text', text: `URL: ${target}\n\nТекст страницы:\n${text}` }]
    } else {
      const blocks = images.map(dataUrlToBlock).filter(Boolean).slice(0, task === 'style' ? 6 : 2)
      if (!blocks.length) return json({ ok: false, error: 'Нужны изображения (dataURL)' }, 400)
      content = [...blocks, { type: 'text', text: 'Проанализируй по инструкции и верни JSON.' }]
    }

    const result = await callClaude(apiKey, PROMPTS[task], content)
    return json({ ok: true, task, result, model: MODEL })
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200)
  }
}
