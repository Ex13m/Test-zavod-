// ============================================================
// Фронтовый клиент ИИ-агента. Все вызовы деградируют мягко:
// нет деплоя / нет ключа / ошибка сети → возвращаем null,
// и завод продолжает работать на эвристике.
// Ключи: серверные env Netlify ИЛИ до трёх ключей из настроек
// (хранятся только в браузере). Если сохранено несколько —
// используется первый рабочий в порядке Claude → Gemini →
// OpenRouter, при ошибке/лимите берётся следующий.
// ============================================================
import { useStore } from '../store'

const FN = '/.netlify/functions/ai-agent'

export const PROVIDERS = [
  { id: 'anthropic', label: 'Claude', model: 'claude-opus-4-8', prefix: 'sk-ant-' },
  { id: 'gemini', label: 'Gemini (бесплатный)', model: 'gemini-2.5-flash', prefix: 'AIza' },
  { id: 'openrouter', label: 'OpenRouter (бесплатный)', model: 'gemini-2.0-flash (:free)', prefix: 'sk-or-' },
]

/** Определить провайдера по виду ключа (как на сервере). */
export function detectProvider(key = '') {
  const k = key.trim()
  if (!k) return null
  return PROVIDERS.find((p) => k.startsWith(p.prefix)) || { id: 'unknown', label: 'неизвестный ключ', model: null }
}

/** Ключи из настроек + миграция старого одиночного settings.aiKey. */
export function storedKeys() {
  const s = useStore.getState().settings || {}
  const keys = { anthropic: '', gemini: '', openrouter: '', ...(s.aiKeys || {}) }
  const legacy = (s.aiKey || '').trim()
  if (legacy) {
    const p = detectProvider(legacy)
    if (p && p.id !== 'unknown' && !keys[p.id]) keys[p.id] = legacy
  }
  return keys
}

// порядок использования: качество → бесплатные
const ORDER = ['anthropic', 'gemini', 'openrouter']

/** Непустые ключи в порядке приоритета: [{ id, key }] */
export function keyChain() {
  const keys = storedKeys()
  return ORDER.filter((id) => keys[id].trim()).map((id) => ({ id, key: keys[id].trim() }))
}

let statusCache = null // { hasKey, model } | { hasKey:false } | null

/** Статус агента: null — функция недоступна (локальный запуск). */
export async function agentStatus(force = false) {
  const chain = keyChain()
  if (chain.length) {
    const p = PROVIDERS.find((x) => x.id === chain[0].id)
    return {
      ok: true, hasKey: true, local: true,
      provider: p.id,
      providerLabel: p.label + ' · ключ из браузера',
      model: p.model,
      reserves: chain.length - 1,
    }
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
  const chain = keyChain()
  // без локальных ключей — одна попытка на серверных env
  const attempts = chain.length ? chain.map((c) => c.key) : [null]
  for (const key of attempts) {
    try {
      const r = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, ...(key ? { clientKey: key } : {}), ...payload }),
      })
      if (!r.ok) continue
      const data = await r.json()
      if (data.ok) return data.result
      if (data.reason === 'no_key') return null // ключей нет нигде — эвристика
      // ошибка провайдера (исчерпан лимит?) — пробуем следующий ключ
    } catch { /* сеть/функция — пробуем следующий */ }
  }
  return null
}

/**
 * Проверка ключа реальным запросом к провайдеру.
 * keyOverride — проверить конкретный ключ ДО сохранения в настройки.
 * Возвращает ответ функции: { ok, pong?, providerLabel?, model?, error? }.
 */
export async function pingAgent(keyOverride) {
  try {
    const key = (keyOverride ?? keyChain()[0]?.key ?? '').trim()
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
