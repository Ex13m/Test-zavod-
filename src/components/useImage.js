import { useEffect, useState } from 'react'
import { loadImage } from '../store'

export function useImage(key) {
  const [src, setSrc] = useState(null)
  useEffect(() => {
    let on = true
    if (key) loadImage(key).then((d) => on && setSrc(d || null))
    else setSrc(null)
    return () => { on = false }
  }, [key])
  return src
}
