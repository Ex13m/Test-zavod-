import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { FRAMEWORKS, TONES } from '../engine/generator'
import { LANGS } from '../engine/i18n'
import { agentStatus } from '../engine/agent'
import Icon from '../components/Icons'

function AgentPanel() {
  const [st, setSt] = useState(null)
  useEffect(() => { agentStatus().then(setSt) }, [])
  const state = !st ? 'probe' : st.offline ? 'offline' : st.hasKey ? 'on' : 'nokey'
  return (
    <div className="panel mt-20">
      <div className="panel-title"><Icon name="lens" size={14} className="icon-gold" /> ИИ-агент (Claude Vision)</div>
      {state === 'probe' && <div className="hint">Проверяем доступность агента…</div>}
      {state === 'on' && (
        <div className="pill-note" style={{ borderColor: 'rgba(74,222,128,0.4)', color: 'var(--ok)', background: 'rgba(74,222,128,0.07)' }}>
          🤖 Агент активен · {st.model} — распознавание товаров по фото, чтение постов, анализ сайтов
        </div>
      )}
      {state === 'nokey' && (
        <>
          <div className="pill-note">Агент задеплоен, но ключ не задан — работает резервная эвристика</div>
          <div className="hint" style={{ marginTop: 10, lineHeight: 1.7 }}>
            Включение (2 минуты): Netlify → Site configuration → Environment variables →
            добавьте <b style={{ color: 'var(--acc)' }}>ANTHROPIC_API_KEY</b> (ключ с console.anthropic.com) → Redeploy.
            Подробно: docs/AI-AGENT.md в репозитории.
          </div>
        </>
      )}
      {state === 'offline' && (
        <div className="hint">
          Локальный запуск — serverless-функции недоступны. На деплое Netlify агент включится автоматически
          (при заданном ANTHROPIC_API_KEY), без него — эвристика.
        </div>
      )}
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
