// ============================================================
// Слой дистрибуции. Реальные выходы:
//  1) Telegram — через serverless-прокси Netlify (api.telegram.org
//     не отдаёт CORS, напрямую из браузера нельзя).
//  2) Универсальный вебхук автопостинга (n8n / Make / Zapier / Albato).
// Остальные каналы — заглушки под будущие API.
// ============================================================

export const CHANNELS = [
  { id: 'telegram', name: 'Telegram', icon: '✈️', real: true, note: 'Bot API через Netlify Function' },
  { id: 'webhook', name: 'Автопостинг (вебхук)', icon: '🔗', real: true, note: 'n8n · Make · Zapier · Albato' },
  { id: 'vk', name: 'ВКонтакте', icon: '🔵', real: false, note: 'API-интеграция — в дорожной карте' },
  { id: 'dzen', name: 'Дзен', icon: '🟠', real: false, note: 'API-интеграция — в дорожной карте' },
  { id: 'instagram', name: 'Instagram*', icon: '📸', real: false, note: 'через Graph API — в дорожной карте' },
  { id: 'ok', name: 'Одноклассники', icon: '🟧', real: false, note: 'API-интеграция — в дорожной карте' },
]

export const WEBHOOK_PRESETS = [
  { id: 'n8n', name: 'n8n', hint: 'https://ваш-n8n.app/webhook/...' },
  { id: 'make', name: 'Make', hint: 'https://hook.eu2.make.com/...' },
  { id: 'zapier', name: 'Zapier', hint: 'https://hooks.zapier.com/hooks/catch/...' },
  { id: 'albato', name: 'Albato', hint: 'https://h.albato.ru/wh/...' },
  { id: 'custom', name: 'Свой URL', hint: 'https://...' },
]

/** Публикация в Telegram через прокси-функцию (работает на деплое Netlify). */
export async function publishToTelegram(post, photoDataUrl, cfg) {
  if (!cfg.tgToken || !cfg.tgChatId) {
    return { ok: false, error: 'Укажите токен бота и ID канала в настройках дистрибуции' }
  }
  try {
    const res = await fetch('/.netlify/functions/telegram-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: cfg.tgToken,
        chatId: cfg.tgChatId,
        text: post.text,
        photo: photoDataUrl || null,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.ok === false) {
      return { ok: false, error: data.error || `Прокси ответил ${res.status}. Функция доступна только на деплое Netlify.` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: 'Сеть недоступна или функция не задеплоена: ' + e.message }
  }
}

/** Отправка поста в систему автопостинга по вебхуку. */
export async function publishToWebhook(post, photoDataUrl, cfg) {
  if (!cfg.webhookUrl) return { ok: false, error: 'Укажите URL вебхука в настройках дистрибуции' }
  const payload = {
    source: 'lure-content-factory',
    version: 1,
    title: post.title,
    text: post.text,
    meta: post.meta,
    photoDataUrl: cfg.webhookSendPhoto ? photoDataUrl : undefined,
    createdAt: new Date().toISOString(),
  }
  try {
    const res = await fetch(cfg.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return { ok: false, error: `Вебхук ответил ${res.status}` }
    return { ok: true }
  } catch {
    // CORS-ответ может быть закрыт — шлём вслепую (запрос доходит, ответ не читаем)
    try {
      await fetch(cfg.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })
      return { ok: true, blind: true }
    } catch (e2) {
      return { ok: false, error: 'Вебхук недоступен: ' + e2.message }
    }
  }
}
