// ============================================================
// Генератор постов-воронок. Эвристическая сборка: копирайтинговый
// фреймворк × тип приманки × тон × профиль стиля (из скринов).
// ============================================================
import { LURE_TYPES, ALL_TYPES, PRODUCT_TYPES } from './lureTypes'
import { LANG_PACKS } from './i18n'

const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)]

// детерминируемый PRNG, чтобы «Пересобрать» давало новые варианты по seed
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const FRAMEWORKS = {
  aida: { id: 'aida', name: 'AIDA', desc: 'Внимание → Интерес → Желание → Действие' },
  pas: { id: 'pas', name: 'PAS', desc: 'Боль → Усиление → Решение' },
  story: { id: 'story', name: 'Сторителлинг', desc: 'Рыбацкая история с продажей в финале' },
  expert: { id: 'expert', name: 'Экспертный разбор', desc: 'Обзор от гида: факты, техника, вывод' },
  fomo: { id: 'fomo', name: 'FOMO', desc: 'Дефицит + социальное доказательство' },
}

export const TONES = {
  friendly: { id: 'friendly', name: 'Дружеский', emoji: 1.0 },
  expert: { id: 'expert', name: 'Экспертный', emoji: 0.4 },
  aggressive: { id: 'aggressive', name: 'Продающий-дерзкий', emoji: 1.4 },
  calm: { id: 'calm', name: 'Спокойный премиум', emoji: 0.2 },
}

const EMOJI = {
  hook: ['🎣', '🔥', '⚡', '👀', '🐊', '💥'],
  fish: ['🐟', '🎣', '🐠'],
  check: ['✅', '✔️', '▪️', '🔹'],
  cta: ['👉', '🛒', '🎯', '➡️'],
  urgency: ['⏳', '🔥', '⚠️'],
}

const HOOKS = {
  aida: [
    (c) => `Хищник провожает и разворачивается? ${cap(c.dem)} ${c.lname} ${c.closes}.`,
    (c) => `Стоп-лента для тех, кто ловит ${c.fish}.`,
    (c) => `Пока вы читаете этот пост, кто-то уже ставит ${c.lname} «${c.title}» на поводок.`,
  ],
  pas: [
    (c) => `Знакомо: весь день на воде — и ни одной поклёвки?`,
    (c) => `${cap(c.pain)} — самая обидная история на рыбалке.`,
    (c) => `Скажу прямо: дело не в вас. Дело в приманке.`,
  ],
  story: [
    (c) => `Суббота, 4:50 утра. Туман над водой, и первый заброс ${c.season}.`,
    (c) => `${c.demAcc.charAt(0).toUpperCase() + c.demAcc.slice(1)} ${c.lname} мне посоветовал дед на лодочной станции. Я усмехнулся. Зря.`,
    (c) => `Три года я обходил эту приманку стороной. Пока не увидел, как на неё ловит сосед по лодке.`,
  ],
  expert: [
    (c) => `Разбор: ${c.lname} «${c.title}» — кому, когда и зачем.`,
    (c) => `Честный обзор без воды: что умеет ${c.lname} «${c.title}».`,
    (c) => `Техника дня: как я ставлю ${c.lname} под ${c.fish}.`,
  ],
  fomo: [
    (c) => `Осталась последняя партия «${c.title}» — и вот почему её разбирают.`,
    (c) => `Эту приманку спрашивают чаще всего. Объясняю, что за ажиотаж.`,
    (c) => `Пока конкуренты подняли цены, мы придержали склад. Ненадолго.`,
  ],
}

const CTAS = [
  (c) => `Забирайте «${c.title}» на сайте — ссылка ниже:\n${c.url}`,
  (c) => `Полный обзор, расцветки и цена — на сайте:\n${c.url}`,
  (c) => `Проверьте наличие вашей расцветки:\n${c.url}`,
  (c) => `Жмите и выбирайте свою:\n${c.url}`,
]

const URGENCY = [
  'Партия ограничена — ходовые расцветки уходят первыми.',
  'До конца недели действует цена без наценки нового сезона.',
  'На складе меньше 30 штук — следующая поставка через месяц.',
  'Сезон уже идёт: каждый день без правильной приманки — минус рыбалка.',
]

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function em(list, style, rnd) {
  // плотность эмодзи задаётся тоном × профилем стиля
  return rnd() < style.emojiDensity ? pick(list, rnd) + ' ' : ''
}

function hashtags(c, style, rnd, shopTags) {
  if (!style.hashtags) return ''
  // теги магазина (из анализа сайта) приоритетнее общих
  if (shopTags?.length) {
    const n = Math.min(shopTags.length, 3 + Math.floor(rnd() * 3))
    return '\n\n' + [...shopTags].sort(() => rnd() - 0.5).slice(0, n).join(' ')
  }
  const base = ['#рыбалка', `#${c.type.id === 'balancer' ? 'зимняярыбалка' : 'спиннинг'}`, '#приманки']
  const extra = [`#${c.type.name.toLowerCase()}`, '#трофей', '#наловле', '#клюёт']
  const n = 3 + Math.floor(rnd() * 3)
  const set = [...base, ...extra.sort(() => rnd() - 0.5)].slice(0, n)
  return '\n\n' + set.join(' ')
}

// --- сборка тела поста по фреймворку ---
function buildBody(fw, c, style, rnd) {
  const B = []
  const benefit2 = pick(c.type.benefits.filter((b) => b !== c.benefit), rnd)
  const checkEm = () => em(EMOJI.check, style, rnd) || '— '

  switch (fw) {
    case 'aida':
      B.push(`${cap(c.lname)} «${c.title}» — под одну задачу: ${c.fish} ${c.season}.`)
      B.push(`Что внутри:\n${checkEm()}${cap(c.benefit)}\n${checkEm()}${cap(benefit2)}`)
      B.push(`${c.proof}`)
      break
    case 'pas':
      B.push(`${cap(c.pain)}. Проверяешь узлы, меняешь проводку — а дело в том, что приманка не даёт хищнику сигнал «атакуй».`)
      B.push(`${cap(c.lname)} «${c.title}» ${c.solves} это: ${c.benefit}. Плюс ${benefit2}.`)
      B.push(c.proof)
      break
    case 'story':
      if (c.isProduct) {
        B.push(`Беру ${c.lname} «${c.title}» на первую же рыбалку — и уже к обеду понимаю: ${c.benefit}.`)
        B.push(`За день на воде ни одного нарекания. А главное — забываешь, что ${c.pain}.`)
      } else {
        B.push(`Ставлю ${c.lname} «${c.title}», делаю проводку через ${pick(c.type.lexicon, rnd)} — и на второй заброс удар такой, что фрикцион запел.`)
        B.push(`За утро — ${3 + Math.floor(rnd() * 7)} хвостов. Секрет простой: ${c.benefit}.`)
      }
      B.push(`${c.proof}`)
      break
    case 'expert':
      B.push(`Целевая рыба: ${c.fish}.\nУсловия: ${c.season}.\nКлючевая фишка: ${c.benefit}.`)
      B.push(`Рабочая техника — ${pick(c.type.lexicon, rnd)}: ${benefit2}.`)
      B.push(`Вывод: если ${c.pain} — это про ваши рыбалки, «${c.title}» закрывает проблему.`)
      break
    case 'fomo':
      B.push(`Причина простая: ${c.benefit}. Те, кто попробовал, берут вторую и третью — «на подарок» и «про запас».`)
      B.push(c.proof)
      B.push(`${em(EMOJI.urgency, style, rnd)}${pick(URGENCY, rnd)}`)
      break
  }
  return B
}

/**
 * Главная функция завода.
 * @param {object} p — { lure, framework, tone, length, styleProfile, settings, seed }
 * @returns {{ title, text, meta }}
 */
export function generatePost(p) {
  const rnd = mulberry32(p.seed ?? Date.now())
  const type = ALL_TYPES[p.lure.type] || LURE_TYPES.wobbler
  const tone = TONES[p.tone] || TONES.friendly

  // нерусские языки собираются из языковых пакетов
  if (p.lang && p.lang !== 'ru' && LANG_PACKS[p.lang]) {
    return generateFromPack(p, type, tone, rnd)
  }

  const style = {
    emojiDensity: Math.min(1, (p.styleProfile?.emoji ?? 0.5) * tone.emoji),
    hashtags: p.styleProfile?.hashtags ?? true,
    shortSentences: p.styleProfile?.punch ?? 0.5,
  }

  const ctx = {
    type,
    lname: type.name.toLowerCase(),
    dem: type.plural ? 'эти' : type.gender === 'f' ? 'эта' : 'этот',
    demAcc: type.plural ? 'эти' : type.gender === 'f' ? 'эту' : 'этот',
    closes: type.plural ? 'закрывают вопрос' : 'закрывает вопрос',
    solves: type.plural ? 'решают' : 'решает',
    isProduct: Boolean(PRODUCT_TYPES[type.id]),
    title: p.lure.name,
    fish: pick(type.fish, rnd),
    season: pick(type.seasons, rnd),
    benefit: pick(type.benefits, rnd),
    pain: pick(type.pains, rnd),
    proof: pick(type.proofs, rnd),
    url: withUtm(p.settings?.siteUrl || 'https://example.com', p.settings, p.framework),
  }

  const ai = p.styleProfile?.ai
  // фирменные обороты магазина (из ИИ-анализа скринов) иногда становятся крючком
  const hook = ai?.catchphrases?.length && rnd() < 0.35
    ? em(EMOJI.hook, style, rnd) + pick(ai.catchphrases, rnd)
    : em(EMOJI.hook, style, rnd) + pick(HOOKS[p.framework] || HOOKS.aida, rnd)(ctx)
  let body = buildBody(p.framework, ctx, style, rnd)
  if (p.length === 'short') body = body.slice(0, 2)
  if (p.length === 'long' && p.framework !== 'fomo') {
    body.push(`${em(EMOJI.urgency, style, rnd)}${pick(URGENCY, rnd)}`)
  }
  const cta = em(EMOJI.cta, style, rnd) + pick(CTAS, rnd)(ctx)

  // приоритет хэштегов: реальные из постов (ИИ) → теги магазина → общие
  const tagPool = ai?.hashtags?.length ? ai.hashtags : p.settings?.shopTags
  const text = [hook, ...body, cta].join('\n\n') + hashtags(ctx, style, rnd, tagPool)

  return {
    title: `${type.icon} ${type.name} «${p.lure.name}»`,
    text,
    meta: {
      framework: p.framework,
      tone: p.tone,
      length: p.length || 'medium',
      lureType: type.id,
      lang: 'ru',
      chars: text.length,
      seed: p.seed,
    },
  }
}

// --- генерация из языкового пакета (en / cs) ---
function generateFromPack(p, type, tone, rnd) {
  const pack = LANG_PACKS[p.lang]
  const t = pack.types[type.id] || pack.types.wobbler
  const style = {
    emojiDensity: Math.min(1, (p.styleProfile?.emoji ?? 0.5) * tone.emoji),
    hashtags: p.styleProfile?.hashtags ?? true,
  }
  const benefit = pick(t.benefits, rnd)
  const ctx = {
    title: p.lure.name,
    lname: t.lname,
    Lname: cap(t.lname),
    fish: pick(t.fish, rnd),
    season: pick(t.seasons, rnd),
    benefit,
    benefit2: pick(t.benefits.filter((b) => b !== benefit), rnd) || benefit,
    pain: pick(t.pains, rnd),
    proof: pick(t.proofs, rnd),
    lex: pick(t.lexicon, rnd),
    url: withUtm(p.settings?.siteUrl || 'https://example.com', p.settings, p.framework),
  }
  const helpers = {
    cap,
    n: 3 + Math.floor(rnd() * 7),
    check: () => em(EMOJI.check, style, rnd) || '— ',
  }

  const fw = pack.hooks[p.framework] ? p.framework : 'aida'
  const ai = p.styleProfile?.ai
  const hook = ai?.catchphrases?.length && rnd() < 0.35
    ? em(EMOJI.hook, style, rnd) + pick(ai.catchphrases, rnd)
    : em(EMOJI.hook, style, rnd) + pick(pack.hooks[fw], rnd)(ctx)
  let body = pack.bodies[fw](ctx, helpers)
  if (p.length === 'short') body = body.slice(0, 2)
  if (p.length === 'long' || fw === 'fomo') {
    body.push(`${em(EMOJI.urgency, style, rnd)}${pick(pack.urgency, rnd)}`)
  }
  const cta = em(EMOJI.cta, style, rnd) + pick(pack.ctas, rnd)(ctx)

  let text = [hook, ...body, cta].join('\n\n')
  if (style.hashtags) {
    const pool = ai?.hashtags?.length ? ai.hashtags
      : p.settings?.shopTags?.length ? p.settings.shopTags : pack.hashtags
    const n = Math.min(pool.length, 3 + Math.floor(rnd() * 2))
    text += '\n\n' + [...pool].sort(() => rnd() - 0.5).slice(0, n).join(' ')
  }

  return {
    title: `${type.icon} ${cap(t.lname)} ${pack.quotes[0]}${p.lure.name}${pack.quotes[1]}`,
    text,
    meta: {
      framework: p.framework,
      tone: p.tone,
      length: p.length || 'medium',
      lureType: type.id,
      lang: p.lang,
      chars: text.length,
      seed: p.seed,
    },
  }
}

function withUtm(url, settings, framework) {
  if (!settings?.utm) return url
  // склеиваем строкой, а не через new URL(): кириллические домены
  // должны остаться читаемыми, а не превращаться в punycode
  const params = [
    `utm_source=${encodeURIComponent(settings.utmSource || 'content_factory')}`,
    'utm_medium=social',
    `utm_campaign=${encodeURIComponent(framework)}`,
  ].join('&')
  const clean = url.replace(/[?&]$/, '')
  return clean + (clean.includes('?') ? '&' : '?') + params
}
