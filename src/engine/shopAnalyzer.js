// ============================================================
// Эвристический анализатор магазина по адресу сайта.
// v1: база знаний по известным магазинам + вывод из домена
// (TLD → язык, имя домена → бренд, нишевые дефолты).
// Точка расширения v2: серверный краулер + LLM-разбор каталога.
// ============================================================

const KNOWN_SHOPS = {
  'bosset.cz': {
    name: 'Bosset Fishing',
    lang: 'cs',
    country: 'Чехия',
    niche: 'Рыболовный e-shop: приманки и оснастка для спиннинга',
    brands: ['Select Tackles', 'Bosset', 'Stonic'],
    audience: 'Спиннингисты и стритфишеры Чехии: щука, сом, судак, окунь',
    fish: ['štika', 'sumec', 'candát', 'okoun'],
    tags: ['#Bosset', '#Select', '#plandavky', '#stika', '#sumec', '#streetfishing', '#gumy'],
    tone: 'friendly',
    confidence: 0.96,
  },
}

const TLD_LANG = { cz: 'cs', sk: 'cs', ru: 'ru', 'рф': 'ru', by: 'ru', kz: 'ru', com: 'en', eu: 'en', uk: 'en', de: 'en', pl: 'en' }

export function normalizeDomain(url) {
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : 'https://' + url)
    return u.hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return null
  }
}

/** Стадии «сканирования» для анимации онбординга. */
export const SCAN_STAGES = [
  { icon: 'lens', label: 'Подключаемся к сайту' },
  { icon: 'cube', label: 'Читаем каталог товаров' },
  { icon: 'diamond', label: 'Определяем бренды' },
  { icon: 'fan', label: 'Профилируем аудиторию' },
  { icon: 'quill', label: 'Формируем теги и тон' },
]

export function analyzeShop(url) {
  const domain = normalizeDomain(url)
  if (!domain) return null

  if (KNOWN_SHOPS[domain]) {
    return { domain, url: 'https://' + domain + '/', ...KNOWN_SHOPS[domain] }
  }

  // generic-эвристика по домену
  const base = domain.split('.')[0].replace(/[-_]/g, ' ')
  const tld = domain.split('.').pop()
  const lang = TLD_LANG[tld] || 'ru'
  const name = base.charAt(0).toUpperCase() + base.slice(1)
  const slug = base.replace(/\s+/g, '')
  return {
    domain,
    url: 'https://' + domain + '/',
    name,
    lang,
    country: { cs: 'Чехия', en: 'Международный', ru: 'Россия' }[lang],
    niche: 'Рыболовный магазин (профиль уточните после первого поста)',
    brands: [name],
    audience: 'Рыболовы-любители и спортсмены',
    fish: lang === 'cs' ? ['štika', 'candát', 'okoun'] : lang === 'en' ? ['pike', 'zander', 'perch'] : ['щука', 'судак', 'окунь'],
    tags: lang === 'cs'
      ? [`#${slug}`, '#rybareni', '#nastrahy', '#stika']
      : lang === 'en'
        ? [`#${slug}`, '#fishing', '#lures', '#pikefishing']
        : [`#${slug}`, '#рыбалка', '#приманки', '#щука'],
    tone: 'friendly',
    confidence: 0.62,
  }
}
