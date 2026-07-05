// ============================================================
// Многослойный подводный фон: рыбы (щука, судак, окунь, жерех),
// сгенерированные Higgsfield (Recraft V4.1 vector), плывут в
// 3 параллакс-слоях с разными скоростями/масштабами/blur;
// на каждом слое — плавно покачивающиеся водоросли.
// ============================================================

// Рыбы фона: графика тем же штрихом, что и иконки — хвосты и
// плавники с лучами, дуги чешуи, жаберная линия, кольцо глаза.
// Заливка полупрозрачная, контур читается. (Замещаются растровым
// артом Higgsfield, когда он доступен — см. ART ниже.)
const S = { fill: 'currentColor', fillOpacity: 0.16, stroke: 'currentColor', strokeOpacity: 0.75, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const LINES = { fill: 'none', stroke: 'currentColor', strokeOpacity: 0.55, strokeWidth: 1.3, strokeLinecap: 'round' }

const FISH = {
  pike: ( // щука — стрела с «утиным» носом, плавники смещены к хвосту
    <g>
      <path {...S} d="M228 50 C206 39 176 33 140 31 C102 29 64 33 40 43 L40 57 C64 67 102 71 140 69 C176 67 206 61 228 50 Z" />
      <path {...S} d="M40 43 L13 25 Q4 50 13 75 L40 57 Z" />
      <path {...LINES} d="M38 50 L12 33 M38 50 L9 50 M38 50 L12 67" />
      <path {...S} d="M88 33 Q70 12 54 26 L72 37 Z" />
      <path {...LINES} d="M83 31 L62 20 M77 33 L58 26" />
      <path {...S} d="M88 67 Q70 88 54 74 L72 63 Z" />
      <path {...LINES} d="M186 39 Q179 50 186 61 M158 36 Q151 50 158 64 M128 34 Q121 50 128 66 M100 35 Q94 50 100 65" />
      <circle {...S} fillOpacity="0" cx="204" cy="46" r="4" />
      <circle fill="currentColor" cx="204" cy="46" r="1.6" />
      <path {...LINES} d="M228 50 L206 55" />
    </g>
  ),
  zander: ( // судак — прогонистый, двойной спинной: колючий веер + мягкий
    <g>
      <path {...S} d="M216 52 C198 40 172 33 142 31 C106 29 72 34 48 44 L48 60 C72 70 106 74 142 72 C172 70 198 64 216 52 Z" />
      <path {...S} d="M48 44 L22 28 Q14 52 22 76 L48 60 Z" />
      <path {...LINES} d="M46 52 L21 36 M46 52 L18 52 M46 52 L21 68" />
      <path {...S} d="M168 32 Q160 14 150 30 Q144 12 134 29 Q128 13 120 31 Z" />
      <path {...S} d="M108 31 Q96 18 84 27 L98 34 Z" />
      <path {...S} d="M104 70 L94 82 L114 74 Z" />
      <path {...LINES} d="M182 41 Q175 52 182 63 M152 38 Q145 52 152 66 M122 37 Q116 52 122 67" />
      <circle {...S} fillOpacity="0" cx="194" cy="47" r="4" />
      <circle fill="currentColor" cx="194" cy="47" r="1.6" />
    </g>
  ),
  perch: ( // окунь — горб, колючий веер-гребень, полосы дугами
    <g>
      <path {...S} d="M196 58 C184 34 156 20 124 20 C92 20 62 36 46 54 L46 64 C62 84 92 98 124 98 C156 98 184 82 196 58 Z" />
      <path {...S} d="M46 54 L20 38 Q12 59 20 82 L46 64 Z" />
      <path {...LINES} d="M44 59 L19 44 M44 59 L16 59 M44 59 L19 75" />
      <path {...S} d="M148 22 Q142 4 132 20 Q126 3 116 19 Q110 4 100 21 Q94 8 88 24 Z" />
      <path {...S} d="M116 96 L106 110 L128 100 Z" />
      <path {...S} d="M156 90 L150 102 L168 94 Z" />
      <path {...LINES} d="M150 32 Q142 58 150 86 M124 28 Q116 58 124 92 M98 32 Q92 58 98 88" />
      <circle {...S} fillOpacity="0" cx="172" cy="50" r="4.5" />
      <circle fill="currentColor" cx="172" cy="50" r="1.8" />
    </g>
  ),
  asp: ( // жерех — торпеда с мощным вильчатым веером-хвостом
    <g>
      <path {...S} d="M212 48 C198 38 174 30 144 28 C108 25 74 30 50 41 L50 57 C74 66 108 71 144 68 C174 66 198 58 212 48 Z" />
      <path {...S} d="M50 41 L18 22 Q26 49 18 76 L50 57 Z" />
      <path {...LINES} d="M48 49 L20 30 M48 49 L22 49 M48 49 L20 68" />
      <path {...S} d="M138 29 Q128 14 114 22 L126 32 Z" />
      <path {...S} d="M108 68 L98 80 L118 72 Z" />
      <path {...LINES} d="M180 37 Q173 48 180 59 M150 34 Q143 48 150 62 M120 33 Q114 48 120 63" />
      <circle {...S} fillOpacity="0" cx="192" cy="44" r="3.8" />
      <circle fill="currentColor" cx="192" cy="44" r="1.5" />
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
        <svg viewBox="0 0 240 115" width="240" height="115" fill="none" aria-hidden="true">
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
      { kind: 'perch', top: '70%', dur: '58s', delay: '-10s', scale: 0.65, dir: 'ltr', drift: '9s' },
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
