import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { FRAMEWORKS, TONES } from '../engine/generator'
import { LANGS } from '../engine/i18n'
import { agentStatus } from '../engine/agent'
import Icon from '../components/Icons'

function AgentPanel() {
  const { settings, setSettings } = useStore()
  const [st, setSt] = useState(null)
  useEffect(() => { agentStatus(true).then(setSt) }, [settings.aiKey])
  const state = !st ? 'probe' : st.hasKey ? 'on' : st.offline ? 'offline' : 'nokey'
  const badKey = Boolean((settings.aiKey || '').trim()) && !(st && st.hasKey && st.local)
  return (
    <div className="panel mt-20">
      <div className="panel-title"><Icon name="lens" size={14} className="icon-gold" /> ИИ-агент (распознавание по фото)</div>
      {state === 'probe' && <div className="hint">Проверяем доступность агента…</div>}
      {state === 'on' && (
        <div className="pill-note" style={{ borderColor: 'rgba(74,222,128,0.4)', color: 'var(--ok)', background: 'rgba(74,222,128,0.07)' }}>
          Агент активен · {st.providerLabel || 'Claude'}{st.model ? ` · ${st.model}` : ''} — распознавание товаров по фото, чтение постов, анализ сайтов
        </div>
      )}
      {state === 'nokey' && (
        <div className="pill-note">Ключ не задан — работает резервная эвристика (тип угадывается по имени файла)</div>
      )}
      {state === 'offline' && (
        <div className="hint">Локальный запуск — serverless-функции недоступны. Вставьте ключ и откройте деплой на Netlify.</div>
      )}
      <div className="field" style={{ marginTop: 12 }}>
        <label>API-ключ (хранится только в этом браузере)</label>
        <input
          type="password"
          placeholder="AIza… (Gemini) · sk-or-… (OpenRouter) · sk-ant-… (Claude)"
          value={settings.aiKey || ''}
          onChange={(e) => setSettings({ aiKey: e.target.value.trim() })}
          autoComplete="off"
        />
        {badKey && (
          <div className="hint" style={{ color: 'var(--danger)' }}>
            Ключ не похож ни на один провайдер: должен начинаться с AIza (Gemini), sk-or- (OpenRouter) или sk-ant- (Claude).
          </div>
        )}
        <div className="hint" style={{ lineHeight: 1.7 }}>
          Бесплатный ключ: aistudio.google.com («Get API key», начинается с <b style={{ color: 'var(--acc)' }}>AIza</b>) или openrouter.ai
          (<b style={{ color: 'var(--acc)' }}>sk-or-</b>). Платный Claude: console.anthropic.com (<b style={{ color: 'var(--acc)' }}>sk-ant-</b>).
          Вставили — агент включается сразу, никаких настроек Netlify не нужно. Ключ живёт в вашем браузере
          и передаётся только вашей функции на Netlify. Альтернатива для команды — переменные окружения
          на Netlify (docs/AI-AGENT.md).
        </div>
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
