import { useState } from 'react'
import { useStore } from '../store'
import { FRAMEWORKS } from '../engine/generator'
import { LURE_TYPES } from '../engine/lureTypes'
import { useImage } from '../components/useImage'
import Icon from '../components/Icons'
import { useShopItems } from '../components/useShopData'

function HistoryItem({ post, onCopy }) {
  const src = useImage(post.imgKey)
  const { removePost, setView } = useStore()
  const [open, setOpen] = useState(false)
  const date = new Date(post.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="history-item">
      {src ? <img src={src} alt="" /> : <div className="hi-ph" style={{ color: 'var(--acc)' }}><Icon name="quill" size={30} /></div>}
      <div style={{ minWidth: 0 }}>
        <div className="hi-title">{post.title}</div>
        <div className="hi-text" style={open ? { WebkitLineClamp: 'unset', whiteSpace: 'pre-wrap' } : {}}>
          {post.text}
        </div>
        <div className="post-meta-bar">
          <span className="tag t-acc">{FRAMEWORKS[post.meta?.framework]?.name}</span>
          <span className="tag">{date}</span>
          <span className="tag">{post.meta?.chars} симв.</span>
          {post.published?.map((ch) => <span key={ch} className="tag t-amber">↗ {ch}</span>)}
        </div>
      </div>
      <div className="hi-actions">
        <button className="btn sm" title="Копировать" onClick={() => onCopy(post)}><Icon name="copy" size={15} /></button>
        <button className="btn sm ghost" title="Развернуть" onClick={() => setOpen(!open)}><Icon name={open ? 'collapse' : 'expand'} size={15} /></button>
        <button className="btn sm ghost" title="К дистрибуции" onClick={() => { useStore.setState({ distPostId: post.id }); setView('distribution') }}><Icon name="tower" size={15} /></button>
        <button className="btn sm danger" title="Удалить" onClick={() => removePost(post.id)}><Icon name="trash" size={15} /></button>
      </div>
    </div>
  )
}

export default function HistoryView() {
  const { showToast } = useStore()
  const posts = useShopItems('posts')
  const [fw, setFw] = useState('all')

  const filtered = fw === 'all' ? posts : posts.filter((p) => p.meta?.framework === fw)
  const onCopy = (p) => { navigator.clipboard.writeText(p.text); showToast('Скопировано', '📋') }

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `посты-завода-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <div className="view-head">
        <h1 className="view-title">Склад <span className="glow">готовой продукции</span></h1>
        <p className="view-sub">Вся история выпусков завода. Посты хранятся локально и переживают перезагрузку.</p>
      </div>
      <div className="view-body">
        <div className="row mb-16">
          <div className="chips">
            <button className={'chip' + (fw === 'all' ? ' on' : '')} onClick={() => setFw('all')}>Все ({posts.length})</button>
            {Object.values(FRAMEWORKS).map((f) => {
              const n = posts.filter((p) => p.meta?.framework === f.id).length
              return n > 0 && (
                <button key={f.id} className={'chip' + (fw === f.id ? ' on' : '')} onClick={() => setFw(f.id)}>
                  {f.name} ({n})
                </button>
              )
            })}
          </div>
          <div className="spacer" />
          {posts.length > 0 && <button className="btn ghost sm" onClick={exportAll}><Icon name="download" size={15} /> Экспорт JSON</button>}
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state panel">
            <span className="es-icon" style={{ color: 'var(--acc)' }}><Icon name="archive" size={44} style={{ margin: '0 auto' }} /></span>
            <div className="es-text">Здесь появятся выпущенные посты.</div>
          </div>
        ) : (
          filtered.map((p) => <HistoryItem key={p.id} post={p} onCopy={onCopy} />)
        )}
      </div>
    </>
  )
}
