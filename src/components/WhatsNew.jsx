import { useEffect, useState } from 'react'
import { APP_VERSION, VERSION_HISTORY } from '../version'
import Icon from './Icons'

const LS_KEY = 'lure-factory-last-version'
const SHOW_MS = 15000 // юзер успевает прочитать
const OUT_MS = 600

// Анонс новой версии: появляется один раз после обновления,
// висит 15 секунд с полосой-таймером и плавно уходит.
export default function WhatsNew() {
  const [state, setState] = useState('hidden') // hidden | in | out

  useEffect(() => {
    const last = localStorage.getItem(LS_KEY)
    if (!last) {
      // первый запуск: версию запоминаем, анонс не показываем — юзера встречает онбординг
      localStorage.setItem(LS_KEY, APP_VERSION)
      return
    }
    if (last === APP_VERSION) return
    setState('in')
    const t1 = setTimeout(() => setState('out'), SHOW_MS)
    const t2 = setTimeout(() => dismiss(), SHOW_MS + OUT_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const dismiss = () => {
    localStorage.setItem(LS_KEY, APP_VERSION)
    setState('hidden')
  }
  const closeNow = () => {
    setState('out')
    setTimeout(dismiss, OUT_MS)
  }

  if (state === 'hidden') return null
  const rel = VERSION_HISTORY[0]

  return (
    <div className={'whatsnew' + (state === 'out' ? ' wn-leaving' : '')} role="status">
      <div className="wn-ray" />
      <div className="wn-head">
        <span className="wn-badge"><Icon name="diamond" size={12} /> Обновление</span>
        <span className="wn-ver">v{rel.v}</span>
        <span className="spacer" />
        <button className="wn-close" onClick={closeNow} title="Закрыть">✕</button>
      </div>
      <div className="wn-title">{rel.title}</div>
      <ul className="wn-list">
        {rel.items.map((it, i) => (
          <li key={it} style={{ animationDelay: `${0.35 + i * 0.22}s` }}>
            <Icon name="check" size={13} className="icon-teal" /> {it}
          </li>
        ))}
      </ul>
      <div className="wn-progress"><span /></div>
    </div>
  )
}
