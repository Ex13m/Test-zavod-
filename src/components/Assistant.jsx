import { useState } from 'react'
import { useStore } from '../store'
import { useShopItems } from './useShopData'
import { APP_VERSION, APP_DATE, VERSION_HISTORY, PDF_GUIDES } from '../version'
import Icon from './Icons'

// Капитан Окунь — фирменный персонаж в стиле «Зигфелд»:
// горбатая спина, колючий веер-гребень, капитанская фуражка.
export function Captain({ size = 84 }) {
  return (
    <svg viewBox="0 0 120 110" width={size} height={size} className="captain" aria-hidden="true">
      <defs>
        <linearGradient id="cap-g" x1="0" y1="0" x2="120" y2="110">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <g stroke="url(#cap-g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* тело окуня */}
        <path fill="rgba(45,212,191,0.10)" d="M100 62 C92 42 74 30 54 30 C36 30 20 42 12 56 L12 64 C20 80 36 92 54 92 C74 92 92 82 100 62 Z" />
        {/* хвост-веер */}
        <path fill="rgba(45,212,191,0.10)" d="M12 56 L-2 46 Q-8 60 -2 76 L12 64 Z" transform="translate(14 0)" />
        {/* полосы */}
        <path opacity="0.6" d="M66 34 Q60 60 66 88 M48 34 Q42 60 48 88" />
        {/* колючий гребень */}
        <path fill="rgba(251,191,36,0.12)" d="M74 32 Q70 20 62 30 Q58 18 50 29 Q46 20 40 31 Z" />
        {/* глаз */}
        <circle cx="82" cy="56" r="5" className="cap-eye" />
        <circle cx="82" cy="56" r="2" fill="#e8f4f4" stroke="none" />
        {/* рот-улыбка */}
        <path d="M96 66 Q90 70 84 68" />
        {/* грудной плавник-весло */}
        <path fill="rgba(45,212,191,0.10)" d="M60 66 Q52 78 40 76 L52 62 Z" className="cap-fin" />
        {/* фуражка капитана */}
        <path fill="rgba(251,191,36,0.15)" d="M68 30 Q80 18 94 24 L96 32 Q82 28 70 34 Z" />
        <path d="M94 24 Q99 26 100 31 L96 32" />
        <circle cx="84" cy="26" r="1.6" fill="#fbbf24" stroke="none" />
      </g>
      {/* пузырьки */}
      <g className="cap-bubbles" stroke="rgba(160,225,235,0.7)" fill="none" strokeWidth="1.3">
        <circle className="b1" cx="104" cy="40" r="3" />
        <circle className="b2" cx="110" cy="28" r="2" />
        <circle className="b3" cx="106" cy="16" r="2.6" />
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
