import { useStore, saveImage } from '../store'
import { LURE_TYPE_LIST, LURE_TYPES, guessLureType } from '../engine/lureTypes'
import { fileToDataUrl } from '../engine/imageUtil'
import { useImage } from '../components/useImage'
import Dropzone from '../components/Dropzone'
import Icon from '../components/Icons'
import { useShopItems } from '../components/useShopData'

function LureCard({ lure, onOpen }) {
  const src = useImage(lure.imgKey)
  const { removeLure, updateLure } = useStore()
  return (
    <div className="lure-card" onClick={() => onOpen(lure)}>
      {src ? <img src={src} alt={lure.name} /> : <div className="hi-ph" style={{ width: '100%', height: 130, borderRadius: 0, color: 'var(--acc)' }}><Icon name="hook" size={36} /></div>}
      <button
        className="lc-del"
        title="Удалить"
        onClick={(e) => { e.stopPropagation(); removeLure(lure.id) }}
      >✕</button>
      <div className="lc-body">
        <div className="lc-name">{lure.name}</div>
        <div className="lc-type">{LURE_TYPES[lure.type]?.name}</div>
        <select
          className="mt-16"
          style={{
            width: '100%', marginTop: 8, padding: '6px 8px', fontSize: 12,
            background: 'rgba(3,11,20,0.6)', color: 'var(--ink-dim)',
            border: '1px solid var(--stroke)', borderRadius: 8,
          }}
          value={lure.type}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateLure(lure.id, { type: e.target.value })}
        >
          {LURE_TYPE_LIST.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
    </div>
  )
}

export default function LuresView() {
  const { addLure, showToast, setView } = useStore()
  const lures = useShopItems('lures')

  const onFiles = async (files) => {
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f)
      const imgKey = await saveImage(dataUrl)
      const name = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Без имени'
      addLure({ name: name.charAt(0).toUpperCase() + name.slice(1), type: guessLureType(f.name), imgKey })
    }
    showToast(`Принято на склад: ${files.length} шт.`, '🎣')
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Склад <span className="glow">приманок</span></h1>
        <p className="view-sub">
          Закидывайте фото — завод определит тип по имени файла (поправить можно прямо на карточке).
          Клик по карточке отправляет приманку на конвейер.
        </p>
      </div>
      <div className="view-body">
        <Dropzone
          icon={<Icon name="hook" size={40} style={{ margin: '0 auto', color: 'var(--acc)' }} />}
          title="Перетащите фото приманок или кликните"
          sub="JPG · PNG · WEBP — можно пачкой, завод всё переварит"
          onFiles={onFiles}
        />
        <div className="mt-20">
          {lures.length === 0 ? (
            <div className="empty-state">
              <span className="es-icon" style={{ color: 'var(--acc)' }}><Icon name="hook" size={44} style={{ margin: '0 auto' }} /></span>
              <div className="es-text">Склад пуст. Первая партия приманок ждёт загрузки.</div>
            </div>
          ) : (
            <div className="lure-grid">
              {lures.map((l) => (
                <LureCard key={l.id} lure={l} onOpen={() => { useStore.setState({ factoryLureId: l.id }); setView('factory') }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
