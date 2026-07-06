// ============================================================
// Фронтовый клиент ИИ-агента. Все вызовы деградируют мягко:
// нет деплоя / нет ключа / ошибка сети → возвращаем null,
// и завод продолжает работать на эвристике.
// Ключ берётся либо с сервера (env Netlify), либо из настроек
// завода (хранится в браузере) — тогда он передаётся функции
// с каждым запросом и никуда не сохраняется.
// ============================================================
import { useStore } from '../store'

const FN = '/.netlify/functions/ai-agent'

/** Определить провайдера по виду ключа (как на сервере). */
export function detectProvider(key = '') {
  const k = key.trim()
  if (!k) return null
  if (k.startsWith('sk-ant-')) return { id: 'anthropic', label: 'Claude', model: 'claude-opus-4-8' }
  if (k.startsWith('sk-or-')) return { id: 'openrouter', label: 'OpenRouter (бесплатный)', model: 'gemini-2.0-flash (:free)' }
  if (k.startsWith('AIza')) return { id: 'gemini', label: 'Gemini (бесплатный)', model: 'gemini-2.5-flash' }
  return { id: 'unknown', label: 'неизвестный ключ', model: null }
}

const localKey = () => (useStore.getState().settings?.aiKey || '').trim()

let statusCache = null // { hasKey, model } | { hasKey:false } | null

/** Статус агента: null — функция недоступна (локальный запуск). */
export async function agentStatus(force = false) {
  const key = localKey()
  if (key) {
    const p = detectProvider(key)
    if (p && p.id !== 'unknown')
      return { ok: true, hasKey: true, provider: p.id, providerLabel: p.label + ' · ключ из браузера', model: p.model, local: true }
  }
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
    const key = localKey()
    const r = await fetch(FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, ...(key ? { clientKey: key } : {}), ...payload }),
    })
    if (!r.ok) return null
    const data = await r.json()
    return data.ok ? data.result : null
  } catch {
    return null
  }
}

/**
 * Проверка ключа реальным запросом к провайдеру.
 * keyOverride — проверить ключ ДО сохранения в настройки.
 * Возвращает ответ функции: { ok, pong?, providerLabel?, model?, error? }.
 */
export async function pingAgent(keyOverride) {
  try {
    const key = (keyOverride ?? localKey()).trim()
    const r = await fetch(FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'ping', ...(key ? { clientKey: key } : {}) }),
    })
    if (!r.ok) return { ok: false, error: `HTTP ${r.status}` }
    return await r.json()
  } catch (e) {
    return { ok: false, offline: true, error: 'Функция недоступна (локальный запуск?)' }
  }
}

/** Фото товара → { type, name, brand, fish, details } | null */
export const classifyProduct = (dataUrl) => call('product', { images: [dataUrl] })

/** Изучение товара в интернете → { about, usage, fish[], facts[], season } | null */
export const enrichProduct = (product) => call('enrich', { product })

/** Скрины постов → реальный профиль стиля | null */
export const analyzeStyleAI = (dataUrls) => call('style', { images: dataUrls.slice(0, 6) })

/** URL магазина → живой профиль по HTML | null */
export const analyzeShopAI = (url) => call('shop', { url })
