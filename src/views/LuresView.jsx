import { useStore, saveImage } from '../store'
import { LURE_TYPE_LIST, ALL_TYPES, guessLureType } from '../engine/lureTypes'
import { fileToDataUrl } from '../engine/imageUtil'
import { useImage } from '../components/useImage'
import Dropzone from '../components/Dropzone'
import Icon from '../components/Icons'
import { useShopItems } from '../components/useShopData'
import { classifyProduct, enrichProduct, agentStatus } from '../engine/agent'
import { useEffect, useState } from 'react'

// Имена с камеры/скриншотов («1000072496», «IMG_20260706») — не названия
const isJunkName = (n) =>
  !n || /^[\d\s_().-]+$/.test(n) || /^(img|dsc|dscn|pxl|photo|image|screenshot|scrn|wa|viber)[\s\d_().-]*$/i.test(n)

// Заметный статус распознавания — чтобы было ясно, ПОЧЕМУ тип определился так
function AgentBanner() {
  const [st, setSt] = useState(null)
  const { setView } = useStore()
  useEffect(() => { agentStatus().then(setSt) }, [])
  if (!st) return null
  if (st.hasKey) {
    return (
      <div className="pill-note mb-16" style={{ borderColor: 'rgba(85,209,135,0.4)', color: 'var(--ok)', background: 'rgba(85,209,135,0.07)' }}>
        <Icon name="lens" size={14} /> ИИ-агент активен: тип, бренд и название определяются по самому фото
      </div>
    )
  }
  return (
    <div className="pill-note mb-16" style={{ cursor: 'pointer' }} onClick={() => setView('settings')}>
      <Icon name="lens" size={14} /> ИИ-агент не подключён — тип угадывается по имени файла.
      Нажмите: инструкция по включению, есть бесплатные варианты (Настройки → ИИ-агент)
    </div>
  )
}

function LureCard({ lure, onOpen }) {
  const src = useImage(lure.imgKey)
  const { removeLure, updateLure } = useStore()
  const [editType, setEditType] = useState(false)
  const pending = !lure.type
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
        {/* тип определяется сам; тап по метке — ручная правка */}
        {pending ? (
          <div className="lc-type" style={{ color: 'var(--acc)' }}>
            <Icon name="lens" size={11} /> распознаётся…
          </div>
        ) : editType ? (
          <select
            autoFocus
            style={{
              width: '100%', marginTop: 4, padding: '6px 8px', fontSize: 12,
              background: 'rgba(3,11,20,0.6)', color: 'var(--ink-dim)',
              border: '1px solid var(--stroke)', borderRadius: 8,
            }}
            value={lure.type}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditType(false)}
            onChange={(e) => { updateLure(lure.id, { type: e.target.value }); setEditType(false) }}
          >
            {LURE_TYPE_LIST.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        ) : (
          <div
            className="lc-type"
            title="Нажмите, чтобы поправить тип"
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setEditType(true) }}
          >
            {ALL_TYPES[lure.type]?.name}{lure.fish ? ` · на ${lure.fish}` : ''} ✎
          </div>
        )}
      </div>
    </div>
  )
}

export default function LuresView() {
  const { addLure, showToast, setView } = useStore()
  const lures = useShopItems('lures')

  const onFiles = async (files) => {
    const hasAgent = Boolean((await agentStatus())?.hasKey)
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f)
      const imgKey = await saveImage(dataUrl)
      const raw = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
      // номера с камеры не годятся в название — ждём ИИ или ставим заглушку
      const name = isJunkName(raw) ? 'Новый товар' : raw.charAt(0).toUpperCase() + raw.slice(1)
      // с агентом тип не угадываем («распознаётся…»), без — эвристика сразу
      addLure({ name, type: hasAgent ? null : guessLureType(f.name), imgKey })
      const added = useStore.getState().lures[0]

      // ИИ-агент: тип/бренд/название/рыба по фото → затем изучение товара в сети
      classifyProduct(dataUrl).then((ai) => {
        const S = useStore.getState()
        if (!ai) {
          // агент не ответил — не оставляем карточку «распознаётся…»
          if (!S.lures.find((l) => l.id === added.id)?.type) S.updateLure(added.id, { type: guessLureType(f.name) })
          return
        }
        const patch = {}
        patch.type = ai.type && ALL_TYPES[ai.type] ? ai.type : guessLureType(f.name)
        if (ai.name) patch.name = ai.name
        if (ai.brand) patch.brand = ai.brand
        if (ai.fish) patch.fish = ai.fish
        S.updateLure(added.id, patch)
        S.showToast(`ИИ распознал: ${ai.name || ALL_TYPES[patch.type]?.name}`, '🤖')

        // изучаем контекст товара (поиск в интернете на стороне провайдера)
        enrichProduct({ name: patch.name || added.name, brand: patch.brand, type: patch.type }).then((info) => {
          if (!info) return
          const S2 = useStore.getState()
          const extra = { info }
          if (!S2.lures.find((l) => l.id === added.id)?.fish && info.fish?.length) extra.fish = info.fish[0]
          S2.updateLure(added.id, extra)
          if (info.facts?.length) S2.showToast(`Изучил товар: ${info.facts.length} фактов пойдут в посты`, '🤖')
        })
      })
    }
    showToast(`Принято на склад: ${files.length} шт.`, '🎣')
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Склад <span className="glow">товаров</span></h1>
        <p className="view-sub">
          Закидывайте фото любых товаров — приманки, крючки, удилища, катушки, шнуры, одежда, ножи. Тип, название и целевую рыбу
          определяет ИИ по самому фото, затем изучает товар в интернете — факты идут в посты. Клик по карточке отправляет товар на конвейер.
        </p>
      </div>
      <div className="view-body">
        <AgentBanner />
        <Dropzone
          icon={<Icon name="hook" size={40} style={{ margin: '0 auto', color: 'var(--acc)' }} />}
          title="Перетащите фото товаров или кликните"
          sub="JPG · PNG · WEBP — можно пачкой, завод всё переварит"
          onFiles={onFiles}
        />
        <div className="mt-20">
          {lures.length === 0 ? (
            <div className="empty-state">
              <span className="es-icon" style={{ color: 'var(--acc)' }}><Icon name="hook" size={44} style={{ margin: '0 auto' }} /></span>
              <div className="es-text">Склад пуст. Первая партия товаров ждёт загрузки.</div>
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
