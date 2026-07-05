// ============================================================
// Арт из Higgsfield. Каждый список — цепочка источников:
// локальный файл в public/art/ → CDN Higgsfield → SVG-фолбэк
// (для рыб) или градиенты (для фона). Чтобы закрепить арт
// локально, скачайте файлы по CDN-ссылкам под этими именами.
// ============================================================
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_2vVGC2DWe2MM7XDhdxjTNwWTi4E/'

export const ART = {
  // кинематографичный подводный фон (Soul Location)
  bg: [
    '/art/bg.jpg',
    CDN + 'hf_20260705_225018_0c6de9c3-4357-4898-8bd3-27590069e07b.png', // Blackwater Lake
    CDN + 'hf_20260705_225018_39442f91-828d-4e9e-8e77-48b3aee06aeb.png', // Old Mill Pond
  ],
  // Капитан Окунь — премиальный рендер (Nano Banana); тёмный фон
  // растворяется на тёмной теме через mix-blend-mode: lighten
  // прозрачный стикер (появится в public/art — подхватится сам);
  // до тех пор — рисованный SVG-капитан без фона
  captain: ['/art/captain.png'],
  // светящаяся приманка — декор (GPT Image 2)
  lure: [
    '/art/lure-glow.png',
    CDN + 'hf_20260705_225028_e9cb55e4-58a7-4b6c-b3bc-a58b9487c505.png',
  ],
  // монолитные силуэты рыб (Recraft V4.1 vector, SVG; фон файла = фон темы)
  // прозрачные стикеры силуэтов (PNG без фона) — положим в public/art;
  // до тех пор работают встроенные векторные силуэты (прозрачные по природе)
  silhouettes: {
    pike: ['/art/sil-pike.png'],
    perch: ['/art/sil-perch.png'],
    zander: ['/art/sil-zander.png'],
    asp: ['/art/sil-asp.png'],
    trout: ['/art/sil-trout.png'],
  },
}
