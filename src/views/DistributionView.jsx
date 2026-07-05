import { useState } from 'react'
import { useStore, loadImage } from '../store'
import { CHANNELS, WEBHOOK_PRESETS, publishToTelegram, publishToWebhook } from '../engine/distribution'
import Icon from '../components/Icons'

export default function DistributionView() {
  const { posts, channels, toggleChannel, settings, setSettings, markPublished, showToast } = useStore()
  const distPostId = useStore((s) => s.distPostId)
  const [postId, setPostId] = useState(distPostId || posts[0]?.id || '')
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState([])

  const post = posts.find((p) => p.id === postId)
  const preset = WEBHOOK_PRESETS.find((w) => w.id === settings.webhookService)

  const pushLog = (line) => setLog((l) => [line, ...l].slice(0, 12))

  const publish = async () => {
    if (!post) return showToast('Выберите пост со склада продукции', '⚠️')
    setBusy(true)
    const photo = post.imgKey ? await loadImage(post.imgKey) : null

    if (channels.telegram) {
      pushLog('✈️ Telegram: отправка…')
      const r = await publishToTelegram(post, photo, settings)
      pushLog(r.ok ? '✈️ Telegram: ✅ опубликовано' : `✈️ Telegram: ❌ ${r.error}`)
      if (r.ok) markPublished(post.id, 'Telegram')
    }
    if (channels.webhook) {
      pushLog('🔗 Вебхук: отправка…')
      const r = await publishToWebhook(post, photo, settings)
      pushLog(r.ok ? `🔗 Вебхук: ✅ отправлено${r.blind ? ' (без чтения ответа — CORS)' : ''}` : `🔗 Вебхук: ❌ ${r.error}`)
      if (r.ok) markPublished(post.id, preset?.name || 'Вебхук')
    }
    for (const ch of CHANNELS.filter((c) => !c.real)) {
      if (channels[ch.id]) {
        pushLog(`🧪 ${ch.name}: заглушка — пост поставлен в очередь (API в дорожной карте)`)
        markPublished(post.id, ch.name)
      }
    }
    if (!Object.values(channels).some(Boolean)) pushLog('⚠️ Ни один канал не включён')
    setBusy(false)
    showToast('Раздача завершена — смотрите журнал', '📡')
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Цех <span className="glow">дистрибуции</span></h1>
        <p className="view-sub">
          Настраиваемый выход завода: Telegram через Bot API (нужен деплой на Netlify — прокси-функция уже в комплекте)
          и любая система автопостинга по вебхуку. Остальные каналы — заглушки под будущие интеграции.
        </p>
      </div>
      <div className="view-body grid-main">
        <div>
          <div className="panel">
            <div className="panel-title"><Icon name="tower" size={14} className="icon-gold" /> Каналы</div>
            {CHANNELS.map((ch) => (
              <div key={ch.id} className="channel-card" style={{ marginBottom: 10 }}>
                <div className="ch-icon" style={{ color: ch.real ? 'var(--acc)' : 'var(--ink-dim)' }}><Icon name={ch.icon} size={22} /></div>
                <div>
                  <div className="ch-name">{ch.name} {!ch.real && <span className="tag" style={{ marginLeft: 6 }}>скоро</span>}</div>
                  <div className="ch-status">{ch.note}</div>
                </div>
                <div className={'switch' + (channels[ch.id] ? ' on' : '')} onClick={() => toggleChannel(ch.id)} />
              </div>
            ))}
            <div className="hint" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 8 }}>
              *Instagram принадлежит Meta, признанной экстремистской организацией в РФ.
            </div>
          </div>
        </div>

        <div>
          <div className="grid-2">
            <div className="panel">
              <div className="panel-title"><Icon name="plane" size={14} className="icon-gold" /> Telegram</div>
              <div className="field">
                <label>Токен бота</label>
                <input
                  type="text" placeholder="1234567:AA..." value={settings.tgToken}
                  onChange={(e) => setSettings({ tgToken: e.target.value.trim() })}
                />
                <div className="hint">Получите у @BotFather, добавьте бота админом в канал</div>
              </div>
              <div className="field">
                <label>ID канала / чата</label>
                <input
                  type="text" placeholder="@my_channel или -100123456789" value={settings.tgChatId}
                  onChange={(e) => setSettings({ tgChatId: e.target.value.trim() })}
                />
                <div className="hint">Токен хранится только в вашем браузере (localStorage)</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title"><Icon name="link" size={14} className="icon-gold" /> Автопостинг</div>
              <div className="field">
                <label>Сервис</label>
                <div className="chips">
                  {WEBHOOK_PRESETS.map((w) => (
                    <button key={w.id} className={'chip' + (settings.webhookService === w.id ? ' on' : '')}
                      onClick={() => setSettings({ webhookService: w.id })}>
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>URL вебхука</label>
                <input
                  type="url" placeholder={preset?.hint} value={settings.webhookUrl}
                  onChange={(e) => setSettings({ webhookUrl: e.target.value.trim() })}
                />
                <div className="hint">Завод шлёт JSON: title, text, meta, photoDataUrl — дальше сценарий {preset?.name} раскидает по сетям</div>
              </div>
              <div className="row">
                <span style={{ fontSize: 12.5, color: 'var(--ink-dim)', fontWeight: 600 }}>Прикладывать фото</span>
                <div className={'switch' + (settings.webhookSendPhoto ? ' on' : '')} onClick={() => setSettings({ webhookSendPhoto: !settings.webhookSendPhoto })} />
              </div>
            </div>
          </div>

          <div className="panel mt-20">
            <div className="panel-title"><Icon name="send" size={14} className="icon-gold" /> Отправка</div>
            <div className="field">
              <label>Пост со склада</label>
              <select value={postId} onChange={(e) => setPostId(e.target.value)}>
                <option value="">— выбрать пост —</option>
                {posts.map((p) => <option key={p.id} value={p.id}>{p.title} · {new Date(p.createdAt).toLocaleDateString('ru-RU')}</option>)}
              </select>
            </div>
            {post && (
              <div className="post-preview" style={{ minHeight: 0, maxHeight: 160, overflowY: 'auto', fontSize: 13 }}>
                {post.text}
              </div>
            )}
            <div className="row mt-16">
              <button className="btn primary" onClick={publish} disabled={busy || !post}>
                {busy ? '⚙️ Раздаём…' : '📡 Разослать по включённым каналам'}
              </button>
            </div>
            {log.length > 0 && (
              <div className="mt-16" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.9, color: 'var(--ink-dim)' }}>
                {log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
