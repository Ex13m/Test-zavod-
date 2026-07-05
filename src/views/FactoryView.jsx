import { useEffect, useRef, useState } from 'react'
import { useStore, saveImage, loadImage } from '../store'
import { generatePost, FRAMEWORKS, TONES } from '../engine/generator'
import { LANGS } from '../engine/i18n'
import { LURE_TYPES } from '../engine/lureTypes'
import { useImage } from '../components/useImage'
import Icon from '../components/Icons'
import { useShopItems } from '../components/useShopData'

const STAGES = [
  { icon: 'camera', label: 'Приёмка фото' },
  { icon: 'lens', label: 'Анализ приманки' },
  { icon: 'fan', label: 'Профиль стиля' },
  { icon: 'pen', label: 'Копирайт-цех' },
  { icon: 'funnel', label: 'Сборка воронки' },
  { icon: 'cube', label: 'Выпуск' },
]

const LENGTHS = [
  { id: 'short', name: 'Короткий' },
  { id: 'medium', name: 'Средний' },
  { id: 'long', name: 'Длинный' },
]

export default function FactoryView() {
  const { settings, styleProfile, addPost, showToast, setView } = useStore()
  const lures = useShopItems('lures')
  const factoryLureId = useStore((s) => s.factoryLureId)
  const [lureId, setLureId] = useState(factoryLureId || lures[0]?.id || '')
  const [framework, setFramework] = useState(settings.defaultFramework)
  const [tone, setTone] = useState(settings.defaultTone)
  const [length, setLength] = useState(settings.defaultLength)
  const [lang, setLang] = useState(settings.defaultLang || 'ru')
  const [stage, setStage] = useState(-1)          // -1 = простой, иначе индекс конвейера
  const [result, setResult] = useState(null)
  const [typed, setTyped] = useState('')
  const [saved, setSaved] = useState(false)
  const seedRef = useRef(1)
  const timers = useRef([])

  const lure = lures.find((l) => l.id === lureId)
  const lureImg = useImage(lure?.imgKey)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    if (factoryLureId) setLureId(factoryLureId)
  }, [factoryLureId])

  // печатающийся текст
  useEffect(() => {
    if (!result || stage !== STAGES.length) return
    setTyped('')
    let i = 0
    const step = () => {
      i = Math.min(result.text.length, i + 2 + Math.floor(Math.random() * 4))
      setTyped(result.text.slice(0, i))
      if (i < result.text.length) timers.current.push(setTimeout(step, 12))
    }
    step()
  }, [result, stage])

  const run = () => {
    if (!lure) return showToast('Сначала выберите приманку со склада', '⚠️')
    timers.current.forEach(clearTimeout)
    setSaved(false)
    setResult(null)
    setStage(0)
    seedRef.current = (seedRef.current * 16807 + Date.now()) % 2147483647
    STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStage(i + 1), 320 * (i + 1)))
    })
    timers.current.push(
      setTimeout(() => {
        const post = generatePost({
          lure, framework, tone, length, lang,
          styleProfile, settings,
          seed: seedRef.current,
        })
        setResult(post)
      }, 320 * STAGES.length + 120)
    )
  }

  const save = async () => {
    if (!result || saved) return
    let imgKey = null
    if (lure?.imgKey) {
      const src = await loadImage(lure.imgKey)
      if (src) imgKey = await saveImage(src) // отдельная копия — пост живёт независимо от приманки
    }
    addPost({ ...result, lureId: lure?.id, imgKey })
    setSaved(true)
    showToast('Пост принят на склад готовой продукции', '📦')
  }

  const copy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.text)
    showToast('Текст скопирован в буфер', '📋')
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Конвейер <span className="glow">генерации</span></h1>
        <p className="view-sub">
          Выберите приманку и рецептуру — завод соберёт продающий пост-воронку с переходом на {settings.siteUrl}.
        </p>
      </div>
      <div className="view-body grid-main">
        <div>
          <div className="panel">
            <div className="panel-title"><Icon name="quill" size={14} className="icon-gold" /> Рецептура поста</div>

            <div className="field">
              <label>Приманка</label>
              <select value={lureId} onChange={(e) => setLureId(e.target.value)}>
                <option value="">— выбрать со склада —</option>
                {lures.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} · {LURE_TYPES[l.type]?.name}
                  </option>
                ))}
              </select>
              {lures.length === 0 && (
                <div className="hint">
                  Склад пуст — <a style={{ color: 'var(--acc)', cursor: 'pointer' }} onClick={() => setView('lures')}>загрузите фото приманок</a>
                </div>
              )}
            </div>

            {lureImg && (
              <img
                src={lureImg}
                alt=""
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--stroke)', marginBottom: 16 }}
              />
            )}

            <div className="field">
              <label>Формула воронки</label>
              <div className="chips">
                {Object.values(FRAMEWORKS).map((f) => (
                  <button key={f.id} className={'chip' + (framework === f.id ? ' on' : '')} title={f.desc} onClick={() => setFramework(f.id)}>
                    {f.name}
                  </button>
                ))}
              </div>
              <div className="hint">{FRAMEWORKS[framework]?.desc}</div>
            </div>

            <div className="field">
              <label>Тон повествования</label>
              <div className="chips">
                {Object.values(TONES).map((t) => (
                  <button key={t.id} className={'chip' + (tone === t.id ? ' on amber' : '')} onClick={() => setTone(t.id)}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Длина</label>
              <div className="chips">
                {LENGTHS.map((l) => (
                  <button key={l.id} className={'chip' + (length === l.id ? ' on' : '')} onClick={() => setLength(l.id)}>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Язык поста</label>
              <div className="chips">
                {LANGS.map((l) => (
                  <button key={l.id} className={'chip' + (lang === l.id ? ' on' : '')} onClick={() => setLang(l.id)}>
                    {l.short} · {l.name}
                  </button>
                ))}
              </div>
            </div>

            {styleProfile?.samples > 0 && (
              <div className="pill-note" style={{ marginBottom: 14 }}>
                <Icon name="fan" size={14} /> Стиль скопирован с {styleProfile.samples} скринов
              </div>
            )}

            <button className="btn primary" style={{ width: '100%' }} onClick={run} disabled={stage > -1 && stage < STAGES.length}>
              {stage > -1 && stage < STAGES.length ? <><Icon name="gear" size={16} /> Конвейер работает…</> : <><Icon name="factory" size={16} /> Запустить конвейер</>}
            </button>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel-title"><Icon name="factory" size={14} className="icon-gold" /> Линия сборки</div>
            <div className="conveyor">
              {STAGES.map((s, i) => (
                <div key={s.label} style={{ display: 'contents' }}>
                  {i > 0 && <div className={'conv-link' + (stage === i ? ' flow' : '')} />}
                  <div className={'conv-stage' + (stage === i ? ' active' : '') + (stage > i ? ' done' : '')}>
                    <div className="cs-icon" style={{ color: stage > i ? 'var(--ok)' : stage === i ? 'var(--acc)' : 'var(--ink-dim)' }}>
                      <Icon name={stage > i ? 'check' : s.icon} size={22} />
                    </div>
                    <div className="cs-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel mt-20">
            <div className="panel-title"><Icon name="cube" size={14} className="icon-gold" /> Готовый пост</div>
            {!result && stage === -1 && (
              <div className="empty-state">
                <span className="es-icon" style={{ color: 'var(--acc)' }}><Icon name="bubble" size={44} style={{ margin: '0 auto' }} /></span>
                <div className="es-text">Пресс-формы чистые, чернила заправлены.<br />Жмите «Запустить конвейер».</div>
              </div>
            )}
            {!result && stage > -1 && (
              <div className="empty-state">
                <span className="es-icon">⚙️</span>
                <div className="es-text">Цеха шумят — пост собирается…</div>
              </div>
            )}
            {result && (
              <>
                <div className="post-preview">
                  {typed}
                  {typed.length < result.text.length && <span className="caret" />}
                </div>
                <div className="post-meta-bar">
                  <span className="tag t-acc">{FRAMEWORKS[result.meta.framework]?.name}</span>
                  <span className="tag t-amber">{TONES[result.meta.tone]?.name}</span>
                  <span className="tag t-acc">{(result.meta.lang || 'ru').toUpperCase()}</span>
                  <span className="tag">{result.meta.chars} символов</span>
                </div>
                <div className="row mt-16">
                  <button className="btn primary" onClick={save} disabled={saved}>
                    {saved ? <><Icon name="check" size={16} /> В истории</> : <><Icon name="cube" size={16} /> Сохранить в историю</>}
                  </button>
                  <button className="btn" onClick={copy}><Icon name="copy" size={16} /> Копировать</button>
                  <button className="btn amber" onClick={run}><Icon name="gear" size={16} /> Пересобрать</button>
                  {saved && (
                    <button className="btn ghost" onClick={() => setView('distribution')}><Icon name="tower" size={16} /> К дистрибуции →</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
