import { useStore } from '../store'

// Сущности, отфильтрованные по активному магазину (воркспейсу).
// Записи без shopId считаются принадлежащими воркспейсу 'default'.
export function useShopItems(key) {
  const items = useStore((s) => s[key])
  const shopId = useStore((s) => s.activeShopId) || 'default'
  return items.filter((it) => (it.shopId || 'default') === shopId)
}

export function useActiveShop() {
  const shops = useStore((s) => s.shops)
  const activeShopId = useStore((s) => s.activeShopId)
  return shops.find((x) => x.id === activeShopId) || null
}
