// ============================================================
// Многослойный подводный фон: рыбы (щука, судак, окунь, жерех),
// сгенерированные Higgsfield (Recraft V4.1 vector), плывут в
// 3 параллакс-слоях с разными скоростями/масштабами/blur;
// на каждом слое — плавно покачивающиеся водоросли.
// ============================================================
import { ART } from '../art'
import SmartImg from './SmartImg'

// Рыбы фона — монолитные силуэты (как на референсе troutarea):
// один цельный path на вид, сплошная заливка, без контура и деталей.
// Прозрачны по природе — никаких «квадратов». Анатомия выверена по
// видам: щука, судак, окунь, жерех, форель. (Замещаются растровыми
// стикерами Higgsfield из public/art, когда появятся — см. ART.)
const S = { fill: 'currentColor', stroke: 'none' }

const FISH = {
  pike: ( // щука — длинная торпеда, плоская морда, спинной у самого хвоста
    <path {...S} d="M256 57 C246 52.5 232 48.5 214 45.5 C188 41.5 158 40.5 130 43.5 C118 45 106 47 96 49.5 L88 33 L74 51 C66 53.5 59 56 53 58.5 L30 38 C38 54 38 68 30 90 L53 64 C60 66.5 68 69 77 71 L86 88 L95 72.5 C110 75.5 128 77 148 77 C180 77 216 71 238 63.5 C246 60.5 252 59 256 57 Z" />
  ),
  zander: ( // судак — прогонистый, колючий первый спинной + второй мягкий
    <path {...S} d="M252 56 C238 47 216 40.5 192 38.5 L186 23 L177 35.5 L171 21 L163 33.5 L157 21 L150 34 C145 34.8 140 35.8 135 37 L128 26 L119 39.5 C106 42.5 92 46.5 80 51.5 L36 32 C44 50 44 66 36 84 L80 61.5 C95 67 112 71 129 73 L137 87 L145 74 C170 74.5 196 70 216 63 C231 58 245 59 252 56 Z" />
  ),
  perch: ( // окунь — горбатый, колючий гребень-веер на спине
    <path {...S} d="M240 66 C233 54 221 43 205 36 L200 19 L190 31 L185 13 L176 27 L168 9 L160 25 L151 9 L145 25 L137 12 L133 27 C118 30 103 36 91 44 C82 50 74 56 68 60 L38 42 C46 58 46 72 38 88 L68 70 C79 77 92 84 107 88 L114 102 L124 90 C144 93 163 90 179 83 C204 77 230 72 240 66 Z" />
  ),
  trout: ( // форель — обтекаемая, жировой плавничок у хвоста, тупой нос
    <path {...S} d="M247 59 C240 51 224 44.5 204 41.5 C176 37.5 146 39 120 45 L113 31 L100 47 C90 50.5 80 54 71 57 L68 51 L62 57.5 C55 59 48 60 42 60.5 L28 46 C33 57 33 67 28 78 L42 64 C50 65.5 58 67 67 68.5 L74 83 L83 71 C108 75 138 76 166 73.5 C196 71 228 67 243 62.5 C245 61.5 246.5 60.5 247 59 Z" />
  ),
  asp: ( // жерех — мощная торпеда с большим вильчатым хвостом
    <path {...S} d="M246 56 C231 46 208 39.5 182 38 C152 36.5 122 39 100 46 L92 31 L80 45.5 C70 48.5 61 52 53 56 L24 33 C35 52 35 66 24 89 L53 61 C64 65.5 77 69.5 91 72 L100 87 L111 73.5 C138 77 166 75.5 191 70 C215 64.5 236 62 246 56 Z" />
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
        <SmartImg
          srcs={ART.silhouettes[kind] || []}
          style={{ width: 240, height: 'auto', opacity: 0.9 }}
          fallback={
            <svg viewBox="0 0 260 120" width="240" height="111" fill="none" aria-hidden="true">
              {FISH[kind]}
            </svg>
          }
        />
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
    z: 'far', blur: 2, opacity: 0.12, color: '#a8c4dc',
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
    z: 'mid', blur: 0.8, opacity: 0.16, color: '#94b4d0',
    fish: [
      { kind: 'zander', top: '26%', dur: '62s', delay: '-20s', scale: 0.85, dir: 'rtl', drift: '8s' },
      { kind: 'asp', top: '58%', dur: '74s', delay: '-48s', scale: 0.75, dir: 'rtl', drift: '7s' },
      { kind: 'trout', top: '70%', dur: '58s', delay: '-10s', scale: 0.7, dir: 'ltr', drift: '9s' },
    ],
    weeds: [
      { left: '16%', h: 140, sway: '8s', delay: '-2s' },
      { left: '55%', h: 110, sway: '10s', delay: '-5s', blades: 2 },
      { left: '88%', h: 150, sway: '9s', delay: '-1s' },
    ],
  },
  {
    z: 'near', blur: 0, opacity: 0.22, color: '#7fa2c2',
    fish: [
      { kind: 'pike', top: '44%', dur: '38s', delay: '-12s', scale: 1.45, dir: 'ltr', drift: '6s' },
      { kind: 'trout', top: '78%', dur: '46s', delay: '-30s', scale: 1.15, dir: 'rtl', drift: '7s' },
    ],
    weeds: [
      { left: '-2%', h: 220, sway: '7s', delay: '0s' },
      { left: '30%', h: 170, sway: '9s', delay: '-4s', blades: 2 },
      { left: '64%', h: 200, sway: '8s', delay: '-2s' },
      { left: '93%', h: 240, sway: '7.5s', delay: '-5s' },
    ],
  },
]

// Волнообразные цветовые полосы (как на референсе troutarea)
function Waves() {
  const bands = [
    { top: '30%', o: 0.05, dur: '46s', h: 260 },
    { top: '48%', o: 0.07, dur: '38s', h: 280 },
    { top: '64%', o: 0.09, dur: '30s', h: 300 },
    { top: '78%', o: 0.12, dur: '24s', h: 320 },
  ]
  return bands.map((b, i) => (
    <div key={i} className="wave-band" style={{ top: b.top, opacity: b.o, '--waveDur': b.dur, height: b.h }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" width="200%" height="100%">
        <path
          fill="#8fb2d0"
          d="M0 60 C 100 20, 200 20, 300 60 C 400 100, 500 100, 600 60 C 700 20, 800 20, 900 60 C 1000 100, 1100 100, 1200 60 L1200 120 L0 120 Z"
        />
      </svg>
    </div>
  ))
}

export default function AquaLayers() {
  return (
    <div className="aqua" aria-hidden="true">
      <Waves />
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
