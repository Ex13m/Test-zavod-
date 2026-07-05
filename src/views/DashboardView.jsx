import { useStore } from '../store'
import { FRAMEWORKS } from '../engine/generator'
import { LURE_TYPES } from '../engine/lureTypes'
import Icon from '../components/Icons'
import { useShopItems } from '../components/useShopData'

export default function DashboardView() {
  const { styleProfile, setView, settings } = useStore()
  const lures = useShopItems('lures')
  const posts = useShopItems('posts')
  const shots = useShopItems('shots')
  const published = posts.filter((p) => p.published?.length).length

  const stats = [
    { icon: 'hook', c: 'var(--acc)', val: lures.length, label: 'Приманок на складе', glow: 'rgba(45,212,191,0.16)' },
    { icon: 'quill', c: 'var(--acc-2)', val: posts.length, label: 'Постов произведено', glow: 'rgba(251,191,36,0.14)' },
    { icon: 'send', c: 'var(--acc-3)', val: published, label: 'Отправлено в каналы', glow: 'rgba(244,114,182,0.14)' },
    { icon: 'fan', c: 'var(--acc-4)', val: shots.length, label: 'Скринов стиля изучено', glow: 'rgba(129,140,248,0.16)' },
  ]

  const steps = [
    { icon: 'camera', t: 'Загрузите фото приманок', d: 'Завод определит тип и заведёт карточку', v: 'lures' },
    { icon: 'image', t: 'Скормите скрины постов', d: 'Эвристика скопирует стиль повествования', v: 'style' },
    { icon: 'factory', t: 'Запустите конвейер', d: 'Воронка: крючок → выгоды → доказательство → CTA', v: 'factory' },
    { icon: 'tower', t: 'Разошлите по каналам', d: 'Telegram + автопостинг по вебхуку', v: 'distribution' },
  ]

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Пульт управления <span className="glow">заводом</span></h1>
        <p className="view-sub">
          Фабрика продающих постов для «{settings.brandName}». Трафик ведём на{' '}
          <b style={{ color: 'var(--acc)' }}>{settings.siteUrl}</b>
        </p>
      </div>
      <div className="view-body">
        <div className="stat-row">
          {stats.map((s) => (
            <div key={s.label} className="stat-tile" style={{ '--tile-glow': s.glow }}>
              <span className="stat-icon" style={{ color: s.c }}><Icon name={s.icon} size={22} /></span>
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="panel">
            <div className="panel-title"><Icon name="factory" size={14} className="icon-gold" /> Технологическая цепочка</div>
            {steps.map((s, i) => (
              <div
                key={s.t}
                className="history-item"
                style={{ gridTemplateColumns: '52px 1fr auto', cursor: 'pointer' }}
                onClick={() => setView(s.v)}
              >
                <div className="hi-ph" style={{ width: 52, height: 52, color: 'var(--acc)' }}><Icon name={s.icon} size={24} /></div>
                <div>
                  <div className="hi-title">{i + 1}. {s.t}</div>
                  <div className="hi-text">{s.d}</div>
                </div>
                <div style={{ alignSelf: 'center', color: 'var(--acc)', fontSize: 18 }}>→</div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-title"><Icon name="archive" size={14} className="icon-gold" /> Последние выпуски</div>
            {posts.length === 0 ? (
              <div className="empty-state">
                <span className="es-icon" style={{ color: 'var(--acc)' }}><Icon name="bubble" size={44} style={{ margin: '0 auto' }} /></span>
                <div className="es-text">
                  Цеха простаивают — ни одного поста ещё не выпущено.<br />
                  Загрузите приманку и запустите конвейер.
                </div>
                <button className="btn primary mt-20" onClick={() => setView('lures')}>
                  <Icon name="hook" size={16} /> Загрузить первую приманку
                </button>
              </div>
            ) : (
              posts.slice(0, 4).map((p) => (
                <div key={p.id} className="history-item" style={{ gridTemplateColumns: '1fr auto' }}>
                  <div>
                    <div className="hi-title">{p.title}</div>
                    <div className="hi-text">{p.text}</div>
                    <div className="post-meta-bar">
                      <span className="tag t-acc">{FRAMEWORKS[p.meta?.framework]?.name || p.meta?.framework}</span>
                      <span className="tag">{LURE_TYPES[p.meta?.lureType]?.name}</span>
                      {p.published?.length > 0 && <span className="tag t-amber">↗ {p.published.join(', ')}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
            {posts.length > 0 && (
              <button className="btn ghost sm mt-16" onClick={() => setView('history')}>Вся история →</button>
            )}
          </div>
        </div>

        {styleProfile?.samples > 0 && (
          <div className="panel mt-20">
            <div className="panel-title"><Icon name="fan" size={14} className="icon-gold" /> Профиль стиля активен</div>
            <div className="row">
              <span className="pill-note"><Icon name="fan" size={14} /> Завод пишет с оглядкой на {styleProfile.samples} эталонных скринов</span>
              <button className="btn ghost sm" onClick={() => setView('style')}>Настроить стиль</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
