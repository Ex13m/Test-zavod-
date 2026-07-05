import { useState } from 'react'
import { useStore } from '../store'
import { useShopItems } from './useShopData'
import { APP_VERSION, APP_DATE, VERSION_HISTORY, PDF_GUIDES } from '../version'
import Icon from './Icons'
import { ART } from '../art'
import SmartImg from './SmartImg'

// Капитан Окунь: растровый маскот из Higgsfield (Nano Banana),
// тёмный фон растворяется через mix-blend-mode; при недоступности
// арта — рисованный SVG-фолбэк ниже.
export function Captain({ size = 84 }) {
  return (
    <SmartImg
      srcs={ART.captain}
      alt="Капитан Окунь"
      className="captain art-blend"
      style={{ width: size, height: size, objectFit: 'contain' }}
      fallback={<CaptainSvg size={size} />}
    />
  )
}

function CaptainSvg({ size = 84 }) {
  return (
    <svg viewBox="0 0 148 126" width={size} height={size} className="captain" aria-hidden="true">
      <defs>
        <linearGradient id="cpt-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f95ad" />
          <stop offset="0.55" stopColor="#39607a" />
          <stop offset="1" stopColor="#1b3345" />
        </linearGradient>
        <linearGradient id="cpt-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(232,244,244,0)" />
          <stop offset="1" stopColor="rgba(232,244,244,0.35)" />
        </linearGradient>
        <linearGradient id="cpt-fin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc36e" />
          <stop offset="1" stopColor="#e08a2e" />
        </linearGradient>
        <linearGradient id="cpt-spine" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="rgba(246,196,83,0.25)" />
          <stop offset="1" stopColor="rgba(246,196,83,0.7)" />
        </linearGradient>
        <radialGradient id="cpt-iris" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.6" stopColor="#e9a53c" />
          <stop offset="1" stopColor="#7c4a12" />
        </radialGradient>
        <linearGradient id="cpt-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfdfd" />
          <stop offset="1" stopColor="#c8d9dd" />
        </linearGradient>
        <filter id="cpt-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#14262f" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#cpt-glow)">
        {/* хвост-веер с лучами */}
        <path fill="url(#cpt-fin)" opacity="0.9" d="M24 62 L6 44 Q-2 66 6 88 L24 74 Z" />
        <path stroke="#0a3346" strokeOpacity="0.5" strokeWidth="1.4" fill="none" d="M22 66 L8 52 M22 68 L4 66 M22 70 L8 82" strokeLinecap="round" />

        {/* колючий спинной гребень с перепонкой */}
        <path fill="url(#cpt-spine)" stroke="#c43e0d" strokeOpacity="0.7" strokeWidth="1.4" strokeLinejoin="round"
          d="M52 36 L57 12 L64 31 L72 9 L79 29 L87 12 L92 31 L99 18 L101 34 Z" />

        {/* тело окуня */}
        <path fill="url(#cpt-body)" stroke="#0a3346" strokeOpacity="0.55" strokeWidth="1.6"
          d="M126 70 C120 44 99 30 72 30 C48 30 28 44 20 62 L20 76 C28 94 48 104 72 104 C99 104 120 94 126 70 Z" />
        {/* блик брюха */}
        <path fill="url(#cpt-belly)" d="M120 76 C112 92 94 102 72 102 C50 102 32 92 24 78 L24 74 C34 90 52 98 72 98 C94 98 110 90 120 72 Z" />

        {/* полосы окуня */}
        <g fill="#0a3346" opacity="0.35">
          <path d="M84 31 Q76 66 84 102 L92 100 Q84 66 92 33 Z" />
          <path d="M62 31 Q54 66 62 102 L70 101 Q62 66 70 31 Z" />
          <path d="M42 38 Q36 66 42 96 L49 93 Q43 66 49 41 Z" />
        </g>

        {/* жаберная дуга и щека */}
        <path stroke="#0a3346" strokeOpacity="0.5" strokeWidth="1.6" fill="none" d="M104 44 Q96 66 104 90" />
        <circle cx="112" cy="78" r="4.5" fill="#f08a5d" opacity="0.35" />

        {/* грудной плавник-весло (машет) */}
        <path className="cap-fin" fill="url(#cpt-fin)" stroke="#0a3346" strokeOpacity="0.4" strokeWidth="1.2"
          d="M74 76 Q62 94 44 90 Q56 78 60 66 Z" />
        <path className="cap-fin" stroke="#0a3346" strokeOpacity="0.4" strokeWidth="1.1" fill="none" d="M70 78 Q60 88 50 88 M72 80 Q66 88 58 90" strokeLinecap="round" />

        {/* брюшной плавничок */}
        <path fill="url(#cpt-fin)" opacity="0.85" d="M92 100 L86 112 L102 104 Z" />

        {/* рот-улыбка */}
        <path stroke="#072633" strokeWidth="2.2" strokeLinecap="round" fill="none" d="M124 78 Q114 86 102 82" />

        {/* глаз */}
        <g className="cap-eye">
          <circle cx="106" cy="58" r="9.5" fill="#eef7f7" stroke="#0a3346" strokeOpacity="0.45" strokeWidth="1.4" />
          <circle cx="107.5" cy="59" r="6" fill="url(#cpt-iris)" />
          <circle cx="108" cy="59.5" r="2.6" fill="#131a20" />
          <circle cx="105" cy="55.5" r="1.9" fill="#ffffff" opacity="0.9" />
        </g>
        {/* бровь-козырёк над глазом */}
        <path stroke="#0a3346" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" fill="none" d="M96 47 Q106 43 116 48" />

        {/* капитанская фуражка */}
        <g>
          {/* тулья */}
          <path fill="url(#cpt-cap)" stroke="#5f7d86" strokeWidth="1.3"
            d="M88 34 Q100 12 124 16 Q132 18 133 26 L132 32 Q112 24 90 40 Z" />
          {/* околыш */}
          <path fill="#123a4c" stroke="#0a2836" strokeWidth="1.2"
            d="M90 40 Q112 24 132 32 L133 39 Q112 32 93 47 Z" />
          {/* козырёк */}
          <path fill="#0d2c3b" stroke="#0a2836" strokeWidth="1.2"
            d="M128 34 Q141 36 144 46 Q136 48 129 44 Q126 38 124 37 Z" />
          {/* золотой кант и якорь */}
          <path stroke="#f5a623" strokeWidth="1.6" fill="none" d="M91 41 Q112 26 132 33" strokeLinecap="round" />
          <g stroke="#f5a623" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <circle cx="113" cy="30" r="2" />
            <path d="M113 32 V39 M109 36 Q113 41 117 36 M110 33.5 H116" />
          </g>
        </g>
      </g>

      {/* пузырьки */}
      <g className="cap-bubbles" stroke="rgba(180,235,240,0.85)" fill="rgba(220,245,248,0.12)" strokeWidth="1.4">
        <circle className="b1" cx="132" cy="52" r="3.4" />
        <circle className="b2" cx="139" cy="38" r="2.2" />
        <circle className="b3" cx="134" cy="22" r="3" />
      </g>
    </svg>
  )
}

// Контекстные подсказки по разделам
function useTip() {
  const view = useStore((s) => s.view)
  const lures = useShopItems('lures')
  const posts = useShopItems('posts')
  const shots = useShopItems('shots')
  const settings = useStore((s) => s.settings)

  if (view === 'lures') return lures.length === 0
    ? 'Перетащите фото приманок в приёмник — я определю их тип по имени файла.'
    : 'Клик по карточке отправляет приманку прямиком на конвейер.'
  if (view === 'factory') return lures.length === 0
    ? 'Конвейер простаивает: сначала загрузите приманку на склад.'
    : 'Выберите формулу воронки и язык — и жмите «Запустить конвейер». «Пересобрать» даёт новый вариант.'
  if (view === 'style') return shots.length === 0
    ? 'Скормите мне скрины постов, чей стиль нравится, — завод переймёт манеру.'
    : 'Профиль стиля активен и применяется ко всем новым постам автоматически.'
  if (view === 'history') return posts.length === 0
    ? 'Здесь появится всё, что выпустит завод. Пока пусто.'
    : 'Кнопка с антенной у поста отправляет его в цех дистрибуции.'
  if (view === 'distribution') return (!settings.tgToken && !settings.webhookUrl)
    ? 'Подключите Telegram или вебхук автопостинга. Пошаговые PDF — в моей инструкции.'
    : 'Каналы настроены. Выбирайте пост и жмите «Разослать».'
  if (view === 'settings') return 'Здесь меняются сайт воронки, UTM и рецептура по умолчанию.'
  return posts.length === 0
    ? 'Начните с загрузки приманки — дальше я подскажу на каждом шаге.'
    : `Линия работает штатно: выпущено постов — ${posts.length}. Что дальше — смотрите в техцепочке.`
}

export default function Assistant() {
  const [open, setOpen] = useState(true)
  const [modal, setModal] = useState(false)
  const tip = useTip()
  const onboarded = useStore((s) => s.onboarded)

  if (!onboarded) return null

  return (
    <>
      {/* бейдж версии — на видном месте */}
      <button className="version-badge" onClick={() => setModal(true)} title="О версии и инструкция">
        <Icon name="diamond" size={11} /> v{APP_VERSION} · {APP_DATE}
      </button>

      {/* персонаж-помощник */}
      <div className="assistant">
        {open && (
          <div className="assistant-bubble">
            <div className="ab-head">Капитан Окунь <span className="tag t-acc">штурман</span></div>
            <div className="ab-tip">{tip}</div>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn sm" onClick={() => setModal(true)}><Icon name="archive" size={13} /> Инструкция и PDF</button>
              <button className="btn sm ghost" onClick={() => setOpen(false)}>Свернуть</button>
            </div>
          </div>
        )}
        <button className="assistant-toggle" onClick={() => setOpen(!open)} title="Капитан Окунь">
          <Captain size={78} />
        </button>
      </div>

      {/* информационное окно: инструкция, PDF, версии */}
      {modal && (
        <div className="onb-overlay" onClick={() => setModal(false)}>
          <div className="onb-card panel info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-title"><Icon name="archive" size={14} className="icon-gold" /> Судовой журнал завода</div>

            <h3 className="im-h">Быстрый старт</h3>
            <ol className="im-list">
              <li><b>Приманки</b> — загрузите фото, тип определится сам.</li>
              <li><b>Стиль</b> — скрины чужих постов задают манеру письма.</li>
              <li><b>Конвейер</b> — формула × тон × длина × язык → готовый пост-воронка.</li>
              <li><b>Дистрибуция</b> — Telegram и автопостинг по вебхуку (n8n / Make / Zapier / Albato).</li>
            </ol>

            <h3 className="im-h">Скачать PDF-инструкции</h3>
            <div className="im-pdfs">
              {PDF_GUIDES.map((g) => (
                <a key={g.file} className="btn sm amber" href={g.file} download>
                  <Icon name="download" size={14} /> {g.name}
                </a>
              ))}
            </div>
            <div className="hint" style={{ marginTop: 6 }}>Файлы также лежат в репозитории: docs/pdf/</div>

            <h3 className="im-h">Контроль версий</h3>
            <div className="im-versions">
              {VERSION_HISTORY.map((v) => (
                <div key={v.v} className="im-ver">
                  <div className="imv-head"><span className="tag t-amber">v{v.v}</span> <b>{v.title}</b></div>
                  <ul>{v.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>

            <div className="row mt-16">
              <button className="btn primary sm" onClick={() => setModal(false)}>Понятно, за работу</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
