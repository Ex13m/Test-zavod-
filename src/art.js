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
  // Капитан Окунь — рендер Nano Banana, фон вырезан ремувером
  // Higgsfield; стикер закреплён локально в public/art (webp)
  captain: [
    '/art/captain.webp',
    '/art/captain.png',
    CDN + 'hf_20260706_000826_61e8fef8-63dd-4a12-9b97-a10af1ed188a.png',
  ],
  // светящаяся приманка — декор (GPT Image 2)
  lure: [
    '/art/lure-glow.png',
    CDN + 'hf_20260705_225028_e9cb55e4-58a7-4b6c-b3bc-a58b9487c505.png',
  ],
  // монолитные силуэты рыб (Nano Banana → background remover):
  // прозрачные стикеры, закреплены локально в public/art (webp);
  // фолбэки — CDN и встроенный вектор
  silhouettes: {
    pike: [
      '/art/sil-pike.webp',
      CDN + 'hf_20260706_002637_3ca0bdc1-88b6-4f65-92d4-e47badb75880.png',
    ],
    perch: [
      '/art/sil-perch.webp',
      CDN + 'hf_20260706_002638_2eea23b5-657e-41cb-98c9-43c12a7e8d9a.png',
    ],
    zander: [
      '/art/sil-zander.webp',
      CDN + 'hf_20260706_002639_545f62a9-df45-4054-abc5-00e72179b0f6.png',
    ],
    asp: [
      '/art/sil-asp.webp',
      CDN + 'hf_20260706_002640_90f3d169-2501-46f2-b12d-58606e881b17.png',
    ],
    trout: [
      '/art/sil-trout.webp',
      CDN + 'hf_20260706_002641_1362146e-9519-48a8-a8f3-531186d2860e.png',
    ],
  },
}
