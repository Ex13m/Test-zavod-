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
  // светящаяся приманка — декор (GPT Image 2)
  lure: [
    '/art/lure-glow.png',
    CDN + 'hf_20260705_225028_e9cb55e4-58a7-4b6c-b3bc-a58b9487c505.png',
  ],
  // монолитные силуэты рыб (Recraft V4.1 vector, SVG; фон файла = фон темы)
  silhouettes: {
    pike: ['/art/sil-pike.svg', CDN + 'hf_20260705_225253_fbf5ac6f-67dc-495a-87f8-560fffca11b4.svg'],
    perch: ['/art/sil-perch.svg', CDN + 'hf_20260705_225305_16a52127-1413-423f-975a-88b23e1df057.svg'],
    zander: ['/art/sil-trout.svg', CDN + 'hf_20260705_225235_f6854783-18aa-4222-9243-7cd4e544fe02.svg'],
    asp: ['/art/sil-leap.svg', CDN + 'hf_20260705_225313_894ae626-ccc4-4f4c-85db-ea517f595cf5.svg'],
  },
}
