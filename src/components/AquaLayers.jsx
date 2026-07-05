// ============================================================
// Многослойный подводный фон: полупрозрачные силуэты настоящих
// хищников (щука, судак, окунь, жерех) плывут в 3 параллакс-слоях
// с разными скоростями, масштабами и глубиной резкости; на каждом
// слое — плавно покачивающиеся водоросли.
// ============================================================

// Силуэты рисованы вручную по анатомии видов (голова вправо).
const FISH = {
  pike: ( // щука — стрела: вытянутое тело, «утиный» нос, плавники у хвоста
    <g>
      <path d="M214 45 C200 37 180 33 150 31 C110 28 70 30 40 36 L17 29 L26 45 L17 61 L40 54 C70 60 110 62 150 59 C180 57 200 53 214 45 Z" />
      <path d="M62 33 C56 23 46 21 38 25 L50 35 Z" />
      <path d="M62 57 C56 67 46 69 38 65 L50 55 Z" />
      <path d="M112 59 L104 69 L120 62 Z" />
    </g>
  ),
  zander: ( // судак — прогонистый, колючий первый спинной плавник
    <g>
      <path d="M212 46 C198 36 176 30 146 28 C108 26 72 30 44 38 L20 30 L28 46 L20 62 L44 54 C72 62 108 65 146 62 C176 59 198 55 212 46 Z" />
      <path d="M162 30 L156 15 L149 27 L142 14 L135 26 L128 15 L123 28 Z" />
      <path d="M116 28 C108 19 96 19 90 23 L100 30 Z" />
      <path d="M100 60 L92 71 L110 64 Z" />
    </g>
  ),
  perch: ( // окунь — горбатый, высокое тело, гребень-колючка
    <g>
      <path d="M204 48 C192 33 168 22 138 20 C104 17 74 26 52 40 L26 32 L34 48 L26 64 L52 56 C74 69 104 75 138 72 C168 69 192 61 204 48 Z" />
      <path d="M152 22 L146 4 L138 18 L130 5 L122 17 L114 6 L108 19 L100 8 L96 21 Z" />
      <path d="M112 71 L102 83 L124 75 Z" />
      <path d="M160 66 L154 78 L172 70 Z" />
    </g>
  ),
  asp: ( // жерех — торпеда: малая голова, мощный вильчатый хвост
    <g>
      <path d="M208 44 C196 35 176 28 146 26 C110 23 76 28 48 38 L17 25 L30 44 L17 63 L48 50 C76 60 110 65 146 62 C176 60 196 52 208 44 Z" />
      <path d="M132 27 C126 16 113 15 106 19 L116 29 Z" />
      <path d="M104 61 L96 73 L114 66 Z" />
    </g>
  ),
}

function Fish({ kind, top, dur, delay, scale, dir, drift }) {
  return (
    <div
      className={'swimmer ' + (dir === 'rtl' ? 'swim-rtl' : 'swim-ltr')}
      style={{
        '--top': top,
        '--dur': dur,
        '--delay': delay,
        '--s': scale,
        '--bobDur': drift,
      }}
    >
      <div className="swimmer-bob">
        <svg viewBox="0 0 220 90" width="220" height="90" fill="currentColor" aria-hidden="true">
          {FISH[kind]}
        </svg>
      </div>
    </div>
  )
}

// Три формы листа водоросли
const WEED_BLADES = [
  'M0 0 C-7 -26 -15 -46 -5 -76 C-3 -83 4 -83 5 -75 C11 -46 7 -25 8 0 Z',
  'M0 0 C8 -20 2 -44 12 -64 C15 -70 21 -68 20 -61 C18 -40 14 -18 10 0 Z',
  'M0 0 C-6 -18 -2 -36 -10 -52 C-13 -58 -7 -62 -3 -56 C5 -38 4 -16 6 0 Z',
]

function WeedCluster({ left, h, sway, delay, blades = 3 }) {
  return (
    <div className="weed" style={{ left, '--swayDur': sway, '--swayDelay': delay }}>
      <svg viewBox="-24 -90 52 92" width={h * 0.55} height={h} preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
        {WEED_BLADES.slice(0, blades).map((d, i) => (
          <path key={i} d={d} transform={`translate(${i * 8 - 8} 0) rotate(${i * 6 - 6})`} opacity={0.85 - i * 0.18} />
        ))}
      </svg>
    </div>
  )
}

// Конфигурация слоёв: дальний → ближний
const LAYERS = [
  {
    z: 'far', blur: 6, opacity: 0.10, color: '#7fd4d4',
    fish: [
      { kind: 'perch', top: '16%', dur: '95s', delay: '-30s', scale: 0.45, dir: 'ltr', drift: '9s' },
      { kind: 'zander', top: '38%', dur: '110s', delay: '-70s', scale: 0.55, dir: 'ltr', drift: '11s' },
      { kind: 'asp', top: '8%', dur: '120s', delay: '-15s', scale: 0.4, dir: 'rtl', drift: '10s' },
    ],
    weeds: [
      { left: '6%', h: 90, sway: '9s', delay: '0s' },
      { left: '38%', h: 70, sway: '11s', delay: '-3s', blades: 2 },
      { left: '72%', h: 100, sway: '10s', delay: '-6s' },
    ],
  },
  {
    z: 'mid', blur: 3, opacity: 0.14, color: '#6bc4c9',
    fish: [
      { kind: 'zander', top: '26%', dur: '62s', delay: '-20s', scale: 0.85, dir: 'rtl', drift: '8s' },
      { kind: 'asp', top: '58%', dur: '74s', delay: '-48s', scale: 0.75, dir: 'rtl', drift: '7s' },
      { kind: 'perch', top: '70%', dur: '58s', delay: '-10s', scale: 0.65, dir: 'ltr', drift: '9s' },
    ],
    weeds: [
      { left: '16%', h: 140, sway: '8s', delay: '-2s' },
      { left: '55%', h: 110, sway: '10s', delay: '-5s', blades: 2 },
      { left: '88%', h: 150, sway: '9s', delay: '-1s' },
    ],
  },
  {
    z: 'near', blur: 1.2, opacity: 0.18, color: '#59b8c2',
    fish: [
      { kind: 'pike', top: '44%', dur: '38s', delay: '-12s', scale: 1.45, dir: 'ltr', drift: '6s' },
      { kind: 'perch', top: '78%', dur: '46s', delay: '-30s', scale: 1.1, dir: 'rtl', drift: '7s' },
    ],
    weeds: [
      { left: '-2%', h: 220, sway: '7s', delay: '0s' },
      { left: '30%', h: 170, sway: '9s', delay: '-4s', blades: 2 },
      { left: '64%', h: 200, sway: '8s', delay: '-2s' },
      { left: '93%', h: 240, sway: '7.5s', delay: '-5s' },
    ],
  },
]

export default function AquaLayers() {
  return (
    <div className="aqua" aria-hidden="true">
      {LAYERS.map((L) => (
        <div
          key={L.z}
          className="aqua-layer"
          style={{ color: L.color, opacity: L.opacity, filter: `blur(${L.blur}px)` }}
        >
          {L.fish.map((f, i) => <Fish key={i} {...f} />)}
          {L.weeds.map((w, i) => <WeedCluster key={i} {...w} />)}
        </div>
      ))}
    </div>
  )
}
