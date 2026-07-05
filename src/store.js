// Глобальное состояние завода: zustand + persist (localStorage).
// Крупные бинарники (картинки) храним как dataURL в IndexedDB (idb-keyval),
// в сторе — только ключи.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { set as idbSet, get as idbGet, del as idbDel } from 'idb-keyval'

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export async function saveImage(dataUrl) {
  const key = 'img_' + uid()
  await idbSet(key, dataUrl)
  return key
}
export const loadImage = (key) => idbGet(key)
export const deleteImage = (key) => idbDel(key)

export const useStore = create(
  persist(
    (set, get) => ({
      // --- навигация / UI ---
      view: 'dashboard',
      setView: (view) => set({ view }),
      toast: null,
      showToast: (msg, icon = '✅') => {
        set({ toast: { msg, icon, id: uid() } })
        setTimeout(() => set({ toast: null }), 3200)
      },

      // --- демо-наполнение (один раз) ---
      seeded: false,

      // --- приманки ---
      lures: [], // {id, name, type, imgKey, createdAt}
      addLure: (lure) => set((s) => ({ lures: [{ id: uid(), createdAt: Date.now(), ...lure }, ...s.lures] })),
      updateLure: (id, patch) =>
        set((s) => ({ lures: s.lures.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      removeLure: (id) => {
        const l = get().lures.find((x) => x.id === id)
        if (l?.imgKey) deleteImage(l.imgKey)
        set((s) => ({ lures: s.lures.filter((x) => x.id !== id) }))
      },

      // --- скрины стиля ---
      shots: [], // {id, imgKey, features, createdAt}
      addShot: (shot) => set((s) => ({ shots: [{ id: uid(), createdAt: Date.now(), ...shot }, ...s.shots] })),
      removeShot: (id) => {
        const sh = get().shots.find((x) => x.id === id)
        if (sh?.imgKey) deleteImage(sh.imgKey)
        set((s) => ({ shots: s.shots.filter((x) => x.id !== id) }))
      },
      styleProfile: null,
      setStyleProfile: (styleProfile) => set({ styleProfile }),

      // --- история постов ---
      posts: [], // {id, title, text, meta, lureId, imgKey, createdAt, published:[]}
      addPost: (post) => set((s) => ({ posts: [{ id: uid(), createdAt: Date.now(), published: [], ...post }, ...s.posts] })),
      removePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
      markPublished: (id, channel) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, published: [...new Set([...(p.published || []), channel])] } : p
          ),
        })),

      // --- каналы дистрибуции (заглушка API) ---
      channels: {
        telegram: false,
        vk: false,
        dzen: false,
        instagram: false,
        ok: false,
      },
      toggleChannel: (ch) => set((s) => ({ channels: { ...s.channels, [ch]: !s.channels[ch] } })),

      // --- настройки ---
      settings: {
        siteUrl: 'https://моймагазин-приманок.рф',
        utm: true,
        utmSource: 'content_factory',
        defaultTone: 'friendly',
        defaultFramework: 'aida',
        defaultLength: 'medium',
        defaultLang: 'ru',
        brandName: 'Мой магазин приманок',
        // дистрибуция
        tgToken: '',
        tgChatId: '',
        webhookUrl: '',
        webhookService: 'n8n',
        webhookSendPhoto: true,
      },
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: 'lure-factory-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        seeded: s.seeded,
        lures: s.lures,
        shots: s.shots,
        posts: s.posts,
        channels: s.channels,
        settings: s.settings,
        styleProfile: s.styleProfile,
      }),
    }
  )
)
