// ============================================================
// Фронтовый клиент ИИ-агента. Все вызовы деградируют мягко:
// нет деплоя / нет ключа / ошибка сети → возвращаем null,
// и завод продолжает работать на эвристике.
// ============================================================

const FN = '/.netlify/functions/ai-agent'

let statusCache = null // { hasKey, model } | { hasKey:false } | null

/** Статус агента: null — функция недоступна (локальный запуск). */
export async function agentStatus(force = false) {
  if (statusCache && !force) return statusCache
  try {
    const r = await fetch(FN, { method: 'GET' })
    if (!r.ok) throw new Error()
    statusCache = await r.json()
  } catch {
    statusCache = { ok: false, hasKey: false, offline: true }
  }
  return statusCache
}

async function call(task, payload) {
  try {
    const r = await fetch(FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, ...payload }),
    })
    if (!r.ok) return null
    const data = await r.json()
    return data.ok ? data.result : null
  } catch {
    return null
  }
}

/** Фото товара → { type, name, brand, details } | null */
export const classifyProduct = (dataUrl) => call('product', { images: [dataUrl] })

/** Скрины постов → реальный профиль стиля | null */
export const analyzeStyleAI = (dataUrls) => call('style', { images: dataUrls.slice(0, 6) })

/** URL магазина → живой профиль по HTML | null */
export const analyzeShopAI = (url) => call('shop', { url })
