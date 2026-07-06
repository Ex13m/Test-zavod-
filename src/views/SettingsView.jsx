import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { FRAMEWORKS, TONES } from '../engine/generator'
import { LANGS } from '../engine/i18n'
import { agentStatus, pingAgent, detectProvider, storedKeys, keyChain } from '../engine/agent'
import Icon from '../components/Icons'

// ---------- Меню ключей ИИ: три провайдера, ссылки, инструкции ----------
const KEY_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    badge: 'бесплатно',
    free: true,
    prefix: 'AIza',
    link: 'https://aistudio.google.com/apikey',
    linkLabel: 'aistudio.google.com',
    placeholder: 'AIza…',
    info: [
      '1. Откройте aistudio.google.com/apikey (хватит обычного Google-аккаунта).',
      '2. Нажмите «Create API key» и скопируйте ключ — он начинается с AIza.',
      '3. Вставьте сюда и нажмите «Сохранить и проверить».',
      'Бесплатно: лимита хватает на сотни распознаваний в день. Модель gemini-2.5-flash видит фото и умеет искать в Google, когда завод изучает товар. Рекомендуем как основной ключ.',
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: 'бесплатные модели',
    free: true,
    prefix: 'sk-or-',
    link: 'https://openrouter.ai/keys',
    linkLabel: 'openrouter.ai',
    placeholder: 'sk-or-…',
    info: [
      '1. Зарегистрируйтесь на openrouter.ai (почта или Google).',
      '2. Меню Keys → «Create Key» — ключ начинается с sk-or-.',
      '3. Вставьте сюда и нажмите «Сохранить и проверить».',
      'Один ключ открывает десятки моделей; бесплатные помечены «:free». Без пополнения — около 50 запросов в день; если пополнить баланс на $10, лимит вырастает до 1000/день.',
      'Заводу нужна модель со «зрением». По умолчанию используется google/gemini-2.0-flash-exp:free — видит фото и быстрая, ничего настраивать не нужно. Если важно точнее читать мелкий текст на упаковках — qwen/qwen2.5-vl-72b-instruct:free (медленнее). Чисто текстовые модели (deepseek и т.п.) для фото не годятся.',
      'Лучшая роль OpenRouter — резерв: когда дневной лимит Gemini исчерпан, завод сам переключится на него.',
    ],
  },
  {
    id: 'anthropic',
    name: 'Claude (Anthropic)',
    badge: 'платно',
    free: false,
    prefix: 'sk-ant-',
    link: 'https://console.anthropic.com/settings/keys',
    linkLabel: 'console.anthropic.com',
    placeholder: 'sk-ant-…',
    info: [
      '1. Зарегистрируйтесь на console.anthropic.com.',
      '2. Settings → API Keys → «Create Key» — ключ начинается с sk-ant-.',
      '3. В разделе Billing привяжите карту и пополните баланс (от $5) — без этого запросы не пройдут.',
      'Платно: распознавание одного фото ≈ $0.02–0.05 (модель Opus 4.8). Зато максимум качества чтения постов, сайтов и фактов о товаре. Берите, когда бесплатных не хватает по качеству; для старта достаточно Gemini.',
    ],
  },
]

function KeyCard({ p }) {
  const { setSettings, showToast } = useStore()
  const keys = storedKeys()
  const saved = (keys[p.id] || '').trim()
  const [draft, setDraft] = useState(saved)
  const [busy, setBusy] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const chain = keyChain()
  const role = saved ? (chain[0]?.id === p.id ? 'основной' : 'резерв') : null

  const writeKeys = (value) =>
    setSettings({ aiKeys: { ...storedKeys(), [p.id]: value }, aiKey: '' })

  const save = async () => {
    const key = draft.trim()
    if (!key) return showToast('Вставьте ключ в поле', '⚠')
    const det = detectProvider(key)
    if (det?.id !== p.id) {
      return showToast(`Это не ключ ${p.name}: он должен начинаться с ${p.prefix}`, '⚠')
    }
    setBusy(true)
    const r = await pingAgent(key) // проверяем ДО сохранения
    setBusy(false)
    if (r?.ok) {
      writeKeys(key)
      showToast(`Ключ ${p.name} работает${r.model ? ` · ${r.model}` : ''}`, '✓')
    } else if (r?.offline) {
      showToast('Функция недоступна (локальный запуск) — проверьте на деплое', '⚠')
    } else {
      showToast(`Ключ не принят: ${String(r?.error || 'ошибка провайдера').slice(0, 120)}`, '⚠')
    }
  }

  const drop = () => {
    if (!confirm(`Удалить ключ ${p.name} из этого браузера?`)) return
    writeKeys('')
    setDraft('')
    showToast(`Ключ ${p.name} удалён`, '✓')
  }

  return (
    <div className="key-card">
      <div className="row" style={{ gap: 8 }}>
        <b style={{ fontSize: 13.5 }}>{p.name}</b>
        <span className={'key-badge' + (p.free ? ' free' : '')}>{p.badge}</span>
        {role && <span className={'key-badge' + (role === 'основной' ? ' main' : '')}>{role}</span>}
        <span className="spacer" />
        <a className="btn sm ghost" href={p.link} target="_blank" rel="noreferrer">
          <Icon name="external" size={13} /> Получить ключ
        </a>
        <button
          className="btn sm ghost"
          title="Как получить и зачем"
          aria-label={`Инструкция ${p.name}`}
          onClick={() => setShowInfo(!showInfo)}
          style={showInfo ? { color: 'var(--acc)' } : undefined}
        >
          <Icon name="info" size={15} />
        </button>
      </div>
      {showInfo && (
        <div className="hint" style={{ lineHeight: 1.7, marginTop: 8 }}>
          {p.info.map((line, i) => <div key={i} style={{ marginTop: i ? 4 : 0 }}>{line}</div>)}
        </div>
      )}
      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="password"
          placeholder={p.placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value.trim())}
          autoComplete="off"
          style={{ flex: 1, minWidth: 160 }}
        />
        <button className="btn sm" onClick={save} disabled={busy}>
          <Icon name="check" size={14} /> {busy ? 'Проверяю…' : 'Сохранить и проверить'}
        </button>
        {saved && (
          <button className="btn sm danger" onClick={drop} disabled={busy} title="Удалить ключ">
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

function AgentPanel() {
  const { settings } = useStore()
  const [st, setSt] = useState(null)
  useEffect(() => { agentStatus(true).then(setSt) }, [JSON.stringify(settings.aiKeys), settings.aiKey])
  const state = !st ? 'probe' : st.hasKey ? 'on' : st.offline ? 'offline' : 'nokey'
  return (
    <div className="panel mt-20">
      <div className="panel-title"><Icon name="lens" size={14} className="icon-gold" /> Ключи ИИ-агента</div>
      {state === 'probe' && <div className="hint">Проверяем доступность агента…</div>}
      {state === 'on' && (
        <div className="pill-note" style={{ borderColor: 'rgba(74,222,128,0.4)', color: 'var(--ok)', background: 'rgba(74,222,128,0.07)' }}>
          Агент активен · {st.providerLabel || 'Claude'}{st.model ? ` · ${st.model}` : ''}
          {st.reserves > 0 ? ` · резервных ключей: ${st.reserves}` : ''}
        </div>
      )}
      {state === 'nokey' && (
        <div className="pill-note">Ключей нет — работает эвристика (тип угадывается по имени файла). Добавьте любой ключ ниже, бесплатного Gemini достаточно.</div>
      )}
      {state === 'offline' && (
        <div className="hint">Локальный запуск — serverless-функции недоступны. Ключи проверяются на деплое Netlify.</div>
      )}
      {KEY_PROVIDERS.map((p) => <KeyCard key={p.id} p={p} />)}
      <div className="hint" style={{ marginTop: 12, lineHeight: 1.7 }}>
        Ключи хранятся только в этом браузере и передаются лишь вашей функции на Netlify. Можно сохранить несколько:
        завод использует первый рабочий в порядке Claude → Gemini → OpenRouter и сам переключается на следующий,
        если провайдер ответил ошибкой или исчерпан дневной лимит. Альтернатива для команды — переменные окружения
        Netlify (docs/AI-AGENT.md), они имеют приоритет.
      </div>
    </div>
  )
}

export default function SettingsView() {
  const { settings, setSettings, showToast } = useStore()

  const clearAll = () => {
    if (!confirm('Стереть ВСЁ: приманки, посты, скрины, настройки? Действие необратимо.')) return
    localStorage.removeItem('lure-factory-v1')
    indexedDB.deleteDatabase('keyval-store')
    location.reload()
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Настройки <span className="glow">завода</span></h1>
        <p className="view-sub">Куда ведём трафик, как размечаем ссылки и что стоит в рецептуре по умолчанию.</p>
      </div>
      <div className="view-body grid-2">
        <div className="panel">
          <div className="panel-title"><Icon name="funnel" size={14} className="icon-gold" /> Воронка и трафик</div>
          <div className="field">
            <label>Название бренда / магазина</label>
            <input type="text" value={settings.brandName} onChange={(e) => setSettings({ brandName: e.target.value })} />
          </div>
          <div className="field">
            <label>Сайт для перехода (CTA)</label>
            <input type="url" value={settings.siteUrl} onChange={(e) => setSettings({ siteUrl: e.target.value.trim() })} />
            <div className="hint">Эта ссылка встаёт в конец каждого поста-воронки</div>
          </div>
          <div className="field">
            <div className="row">
              <label style={{ marginBottom: 0 }}>UTM-разметка ссылок</label>
              <div className={'switch' + (settings.utm ? ' on' : '')} onClick={() => setSettings({ utm: !settings.utm })} />
            </div>
          </div>
          {settings.utm && (
            <div className="field">
              <label>utm_source</label>
              <input type="text" value={settings.utmSource} onChange={(e) => setSettings({ utmSource: e.target.value.trim() })} />
              <div className="hint">utm_medium=social, utm_campaign=формула воронки — ставятся автоматически</div>
            </div>
          )}
        </div>

        <div>
          <div className="panel">
            <div className="panel-title"><Icon name="quill" size={14} className="icon-gold" /> Рецептура по умолчанию</div>
            <div className="field">
              <label>Формула воронки</label>
              <div className="chips">
                {Object.values(FRAMEWORKS).map((f) => (
                  <button key={f.id} className={'chip' + (settings.defaultFramework === f.id ? ' on' : '')}
                    onClick={() => setSettings({ defaultFramework: f.id })}>{f.name}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Тон</label>
              <div className="chips">
                {Object.values(TONES).map((t) => (
                  <button key={t.id} className={'chip' + (settings.defaultTone === t.id ? ' on amber' : '')}
                    onClick={() => setSettings({ defaultTone: t.id })}>{t.name}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Длина</label>
              <div className="chips">
                {[['short', 'Короткий'], ['medium', 'Средний'], ['long', 'Длинный']].map(([id, name]) => (
                  <button key={id} className={'chip' + (settings.defaultLength === id ? ' on' : '')}
                    onClick={() => setSettings({ defaultLength: id })}>{name}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Язык постов по умолчанию</label>
              <div className="chips">
                {LANGS.map((l) => (
                  <button key={l.id} className={'chip' + ((settings.defaultLang || 'ru') === l.id ? ' on' : '')}
                    onClick={() => setSettings({ defaultLang: l.id })}>{l.short} · {l.name}</button>
                ))}
              </div>
            </div>
            <button className="btn sm mt-16" onClick={() => showToast('Настройки сохраняются автоматически', '✓')}>
              <Icon name="check" size={15} /> Всё сохраняется само
            </button>
          </div>

          <AgentPanel />

          <div className="panel mt-20" style={{ borderColor: 'rgba(251,113,133,0.25)' }}>
            <div className="panel-title" style={{ color: 'var(--danger)' }}><Icon name="trash" size={14} /> Опасная зона</div>
            <button className="btn danger sm" onClick={clearAll}><Icon name="trash" size={15} /> Полный сброс завода</button>
          </div>
        </div>
      </div>
    </>
  )
}
