// Первичное наполнение завода: демо-приманка Keitech Easy Shiner 4"
// и пробный пост, чтобы новый пользователь сразу видел продукт в работе.
import { useStore, saveImage } from '../store'
import { generatePost } from './generator'

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(blob)
  })

export async function seedDemoIfNeeded() {
  const s = useStore.getState()
  if (s.seeded || s.lures.length > 0 || s.posts.length > 0) return
  try {
    const res = await fetch('/demo/keitech-easy-shiner-4.jpg')
    if (!res.ok) return
    const dataUrl = await blobToDataUrl(await res.blob())

    useStore.setState({ seeded: true })
    s.addLure({ name: 'Keitech Easy Shiner 4"', type: 'soft', imgKey: await saveImage(dataUrl) })
    const lure = useStore.getState().lures[0]

    const post = generatePost({
      lure,
      framework: 'aida',
      tone: 'friendly',
      length: 'medium',
      lang: 'ru',
      styleProfile: null,
      settings: s.settings,
      seed: 20260705,
    })
    s.addPost({ ...post, lureId: lure.id, imgKey: await saveImage(dataUrl) })
    s.showToast('Демо: Keitech Easy Shiner 4" и пробный пост уже на складе', '🎁')
  } catch {
    // демо не критично — молча пропускаем
  }
}
