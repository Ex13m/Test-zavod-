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
  // Higgsfield: настоящий прозрачный стикер, blend-костыли не нужны
  captain: [
    '/art/captain.png',
    CDN + 'hf_20260706_000826_61e8fef8-63dd-4a12-9b97-a10af1ed188a.png',
  ],
  // светящаяся приманка — декор (GPT Image 2)
  lure: [
    '/art/lure-glow.png',
    CDN + 'hf_20260705_225028_e9cb55e4-58a7-4b6c-b3bc-a58b9487c505.png',
  ],
  // монолитные силуэты рыб (Recraft V4.1 vector → background remover):
  // прозрачные PNG-стикеры, у каждого из 5 видов — свой силуэт
  silhouettes: {
    pike: [
      '/art/sil-pike.png',
      CDN + 'hf_20260706_000830_4d75919f-b17f-4777-8b9a-07d736384c9f.png',
    ],
    perch: [
      '/art/sil-perch.png',
      CDN + 'hf_20260706_000830_1ae698de-5efe-4d4a-a8f6-c9b853f4035d.png',
    ],
    zander: [
      '/art/sil-zander.png',
      CDN + 'hf_20260706_000902_37ce2beb-1451-43be-a072-96e3f435e601.png',
    ],
    asp: [
      '/art/sil-asp.png',
      CDN + 'hf_20260706_000902_154fcd5b-745c-452e-bd2b-f0359fef89b1.png',
    ],
    trout: [
      '/art/sil-trout.png',
      CDN + 'hf_20260706_000831_7cc451a6-3994-4915-ab0d-8dbac1dbf37b.png',
    ],
  },
}
