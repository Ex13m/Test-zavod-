// ============================================================
// Эвристический анализатор стиля по скринам постов.
// v1: анализирует изображение по пиксельным признакам (яркость,
// насыщенность, плотность «текстовых» контрастных зон) и строит
// профиль повествования. Точка расширения — OCR/LLM-анализ (v2).
// ============================================================

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * Возвращает профиль стиля 0..1 по каждому признаку.
 * Эвристика: скрины с плотным текстом → длинные посты; яркие/пёстрые
 * скрины → выше эмоциональность и плотность эмодзи; тёмные минималистичные
 * → сдержанный премиум-тон.
 */
export async function analyzeScreenshot(dataUrl) {
  const img = await loadImage(dataUrl)
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const g = canvas.getContext('2d', { willReadFrequently: true })
  g.drawImage(img, 0, 0, size, size)
  const { data } = g.getImageData(0, 0, size, size)

  let lum = 0, sat = 0, edges = 0
  const lums = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) {
    const r = data[i * 4], gg = data[i * 4 + 1], b = data[i * 4 + 2]
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b)
    lums[i] = (0.299 * r + 0.587 * gg + 0.114 * b) / 255
    lum += lums[i]
    sat += mx === 0 ? 0 : (mx - mn) / mx
  }
  // контрастные переходы ≈ плотность текста на скрине
  for (let y = 0; y < size; y++) {
    for (let x = 1; x < size; x++) {
      if (Math.abs(lums[y * size + x] - lums[y * size + x - 1]) > 0.25) edges++
    }
  }
  const n = size * size
  return {
    brightness: lum / n,
    saturation: sat / n,
    textDensity: Math.min(1, edges / (n * 0.22)),
  }
}

/** Сводит признаки всех скринов в единый профиль повествования. */
export function buildStyleProfile(features) {
  if (!features.length) {
    return { emoji: 0.5, punch: 0.5, length: 0.5, hashtags: true, formality: 0.4, samples: 0 }
  }
  const avg = (k) => features.reduce((s, f) => s + f[k], 0) / features.length
  const sat = avg('saturation')
  const density = avg('textDensity')
  const bright = avg('brightness')
  return {
    emoji: Math.min(1, 0.25 + sat * 1.4),          // пёстрые посты → больше эмодзи
    punch: Math.min(1, 0.3 + (1 - density) * 0.8),  // мало текста → рубленые фразы
    length: Math.min(1, 0.2 + density * 1.1),       // плотный текст → длинные посты
    hashtags: sat > 0.12,
    formality: Math.min(1, 0.2 + (1 - sat) * 0.7 + (1 - bright) * 0.2),
    samples: features.length,
  }
}

export const TRAIT_LABELS = {
  emoji: 'Плотность эмодзи',
  punch: 'Рубленость фраз',
  length: 'Длина постов',
  formality: 'Формальность тона',
}
