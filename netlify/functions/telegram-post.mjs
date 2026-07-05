// Serverless-прокси к Telegram Bot API.
// Нужен потому, что api.telegram.org не отдаёт CORS-заголовки
// и напрямую из браузера бота дёрнуть нельзя.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: CORS })
  if (req.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Некорректный JSON' }, 400)
  }

  const { token, chatId, text, photo } = body
  if (!token || !chatId || !text) {
    return json({ ok: false, error: 'Нужны token, chatId и text' }, 400)
  }
  if (!/^\d+:[\w-]{30,}$/.test(token)) {
    return json({ ok: false, error: 'Токен бота выглядит некорректно' }, 400)
  }

  const api = (method) => `https://api.telegram.org/bot${token}/${method}`
  try {
    if (photo) {
      const b64 = photo.split(',')[1]
      const bin = Buffer.from(b64, 'base64')
      const form = new FormData()
      form.append('chat_id', String(chatId))
      form.append('photo', new Blob([bin], { type: 'image/jpeg' }), 'lure.jpg')
      // лимит подписи к фото — 1024 символа
      if (text.length <= 1024) form.append('caption', text)
      const r1 = await fetch(api('sendPhoto'), { method: 'POST', body: form })
      const d1 = await r1.json()
      if (!d1.ok) return json({ ok: false, error: d1.description || 'sendPhoto failed' }, 502)
      if (text.length > 1024) {
        const r2 = await fetch(api('sendMessage'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        })
        const d2 = await r2.json()
        if (!d2.ok) return json({ ok: false, error: d2.description || 'sendMessage failed' }, 502)
      }
    } else {
      const r = await fetch(api('sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      })
      const d = await r.json()
      if (!d.ok) return json({ ok: false, error: d.description || 'sendMessage failed' }, 502)
    }
    return json({ ok: true })
  } catch (e) {
    return json({ ok: false, error: 'Telegram API недоступен: ' + e.message }, 502)
  }
}
