import { useRef, useState } from 'react'

export default function Dropzone({ icon = '📥', title, sub, onFiles, accept = 'image/*' }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handle = (files) => {
    const imgs = [...files].filter((f) => f.type.startsWith('image/'))
    if (imgs.length) onFiles(imgs)
  }

  return (
    <div
      className={'dropzone' + (drag ? ' drag' : '')}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}
    >
      <span className="dz-icon">{icon}</span>
      <div className="dz-title">{title}</div>
      <div className="dz-sub">{sub}</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={(e) => { handle(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}
