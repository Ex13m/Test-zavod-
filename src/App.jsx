import { useEffect } from 'react'
import { useStore } from './store'
import FishCanvas from './components/FishCanvas'
import AquaLayers from './components/AquaLayers'
import Icon, { BrandFish } from './components/Icons'
import Onboarding from './components/Onboarding'
import Assistant from './components/Assistant'
import { APP_VERSION } from './version'
import DashboardView from './views/DashboardView'
import LuresView from './views/LuresView'
import FactoryView from './views/FactoryView'
import StyleView from './views/StyleView'
import HistoryView from './views/HistoryView'
import DistributionView from './views/DistributionView'
import SettingsView from './views/SettingsView'

const NAV = [
  { id: 'dashboard', icon: 'gauge', name: 'Пульт' },
  { id: 'lures', icon: 'hook', name: 'Приманки' },
  { id: 'factory', icon: 'factory', name: 'Конвейер' },
  { id: 'style', icon: 'fan', name: 'Стиль' },
  { id: 'history', icon: 'archive', name: 'История' },
  { id: 'distribution', icon: 'tower', name: 'Дистрибуция' },
  { id: 'settings', icon: 'gear', name: 'Настройки' },
]

const VIEWS = {
  dashboard: DashboardView,
  lures: LuresView,
  factory: FactoryView,
  style: StyleView,
  history: HistoryView,
  distribution: DistributionView,
  settings: SettingsView,
}

export default function App() {
  const { view, setView, toast, lures, posts, shops, activeShopId, setActiveShop, setShowOnboarding, onboarded, seeded, showOnboarding } = useStore()
  const View = VIEWS[view] || DashboardView
  const badges = { lures: lures.length || null, history: posts.length || null }

  // миграция со старых версий: данные уже есть — мастер не навязываем
  useEffect(() => {
    if (seeded && !onboarded) useStore.setState({ onboarded: true })
  }, [seeded, onboarded])

  const wizardVisible = (!onboarded && !seeded) || showOnboarding

  return (
    <>
      <AquaLayers />
      <FishCanvas />
      <div className="aurora" />
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><BrandFish /></div>
            <div>
              <div className="brand-name">КОНТЕНТ‑ЗАВОД</div>
              <div className="brand-sub">lure factory</div>
            </div>
          </div>
          {shops.length > 0 && (
            <div className="shop-switch">
              <select value={activeShopId} onChange={(e) => setActiveShop(e.target.value)} title="Воркспейс магазина">
                <option value="default">Общий воркспейс</option>
                {shops.map((sh) => <option key={sh.id} value={sh.id}>{sh.name}</option>)}
              </select>
              <button onClick={() => setShowOnboarding(true)} title="Добавить магазин">+</button>
            </div>
          )}
          {shops.length === 0 && (
            <div className="shop-switch">
              <button style={{ flex: 1 }} onClick={() => setShowOnboarding(true)} title="Настроить магазин по адресу сайта">
                + Магазин по сайту
              </button>
            </div>
          )}
          {NAV.map((n) => (
            <button key={n.id} className={'nav-item' + (view === n.id ? ' active' : '')} onClick={() => setView(n.id)}>
              <span className="nav-icon"><Icon name={n.icon} /></span>
              <span className="nav-text">{n.name}</span>
              {badges[n.id] && <span className="nav-badge">{badges[n.id]}</span>}
            </button>
          ))}
          <div className="sidebar-foot">
            <b>v{APP_VERSION}</b> · посты и фото хранятся локально в вашем браузере
          </div>
        </aside>
        <main className="main" key={view}>
          <View />
        </main>
      </div>
      {toast && (
        <div className="toast" key={toast.id}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
      <Assistant />
      {wizardVisible && <Onboarding />}
    </>
  )
}
