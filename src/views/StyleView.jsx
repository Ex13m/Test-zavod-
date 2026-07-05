import { useState } from 'react'
import { useStore, saveImage } from '../store'
import { fileToDataUrl } from '../engine/imageUtil'
import { analyzeScreenshot, buildStyleProfile, TRAIT_LABELS } from '../engine/styleAnalyzer'
import { useImage } from '../components/useImage'
import Dropzone from '../components/Dropzone'
import Icon from '../components/Icons'

function Shot({ shot, scanning }) {
  const src = useImage(shot.imgKey)
  const { removeShot } = useStore()
  return (
    <div className={'shot-card' + (scanning ? ' scanning' : '')}>
      {src ? <img src={src} alt="" /> : <div className="hi-ph" style={{ width: '100%', height: 170, color: 'var(--acc)' }}><Icon name="image" size={30} /></div>}
      <div className="sc-scan" />
      <button className="sc-del" onClick={() => removeShot(shot.id)}>✕</button>
    </div>
  )
}

export default function StyleView() {
  const { shots, addShot, styleProfile, setStyleProfile, showToast } = useStore()
  const [scanning, setScanning] = useState(false)

  const onFiles = async (files) => {
    setScanning(true)
    const fresh = []
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f, 900, 0.8)
      const features = await analyzeScreenshot(dataUrl)
      const imgKey = await saveImage(dataUrl)
      fresh.push(features)
      addShot({ imgKey, features })
    }
    // профиль пересобирается по ВСЕМ скринам
    const all = [...useStore.getState().shots.map((s) => s.features).filter(Boolean)]
    setTimeout(() => {
      setStyleProfile(buildStyleProfile(all))
      setScanning(false)
      showToast(`Стиль обновлён по ${all.length} скринам`, '🧬')
    }, 1800)
  }

  const traits = styleProfile
    ? Object.entries(TRAIT_LABELS).map(([k, label]) => ({ label, val: styleProfile[k] ?? 0 }))
    : []

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Копирование <span className="glow">стиля</span></h1>
        <p className="view-sub">
          Загрузите скрины постов, чья подача вам нравится — эвристический анализатор v1 снимет
          «отпечаток» повествования и завод будет писать в этой манере. (v2 в дорожной карте: OCR + LLM.)
        </p>
      </div>
      <div className="view-body grid-main">
        <div>
          <Dropzone
            icon={<Icon name="image" size={40} style={{ margin: '0 auto', color: 'var(--acc)' }} />}
            title="Скрины эталонных постов — сюда"
            sub="Завод изучит подачу: плотность эмодзи, длину, рубленость фраз"
            onFiles={onFiles}
          />
          <div className="panel mt-20">
            <div className="panel-title"><Icon name="fan" size={14} className="icon-gold" /> Профиль повествования</div>
            {!styleProfile || !styleProfile.samples ? (
              <div className="empty-state">
                <span className="es-icon" style={{ color: 'var(--ink-dim)' }}><Icon name="fan" size={44} style={{ margin: '0 auto' }} /></span>
                <div className="es-text">Профиль пока не снят — завод пишет в нейтральной манере.</div>
              </div>
            ) : (
              <>
                {traits.map((t) => (
                  <div key={t.label} className="style-trait">
                    <span className="st-name">{t.label}</span>
                    <div className="st-bar"><div className="st-fill" style={{ width: `${Math.round(t.val * 100)}%` }} /></div>
                    <span className="st-val">{Math.round(t.val * 100)}%</span>
                  </div>
                ))}
                <div className="style-trait">
                  <span className="st-name">Хэштеги</span>
                  <span className="tag t-acc">{styleProfile.hashtags ? 'добавлять' : 'не добавлять'}</span>
                </div>
                <div className="hint" style={{ color: 'var(--ink-faint)', fontSize: 11.5, marginTop: 10 }}>
                  Эталонов в базе: {styleProfile.samples}. Профиль применяется ко всем новым постам автоматически.
                </div>
              </>
            )}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><Icon name="image" size={14} className="icon-gold" /> Эталонные скрины</div>
          {shots.length === 0 ? (
            <div className="empty-state">
              <span className="es-icon" style={{ color: 'var(--ink-dim)' }}><Icon name="image" size={44} style={{ margin: '0 auto' }} /></span>
              <div className="es-text">Библиотека эталонов пуста.</div>
            </div>
          ) : (
            <div className="shot-grid">
              {shots.map((s) => <Shot key={s.id} shot={s} scanning={scanning} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
