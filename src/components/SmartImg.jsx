import { useState } from 'react'

// Картинка с цепочкой источников: local → CDN → SVG-фолбэк.
// Арт на CDN — прозрачные стикеры (фон вырезан ремувером
// Higgsfield), поэтому никакие blend-режимы не нужны.
export default function SmartImg({ srcs = [], fallback = null, alt = '', className = '', style }) {
  const [idx, setIdx] = useState(0)
  if (idx >= srcs.length) return fallback
  return (
    <img
      src={srcs[idx]}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      onError={() => setIdx(idx + 1)}
    />
  )
}
