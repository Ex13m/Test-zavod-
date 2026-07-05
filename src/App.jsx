import { useStore } from './store'
import FishCanvas from './components/FishCanvas'
import DashboardView from './views/DashboardView'
import LuresView from './views/LuresView'
import FactoryView from './views/FactoryView'
import StyleView from './views/StyleView'
import HistoryView from './views/HistoryView'
import DistributionView from './views/DistributionView'
import SettingsView from './views/SettingsView'

const NAV = [
  { id: 'dashboard', icon: '🌊', name: 'Пульт' },
  { id: 'lures', icon: '🎣', name: 'Приманки' },
  { id: 'factory', icon: '🏭', name: 'Конвейер' },
  { id: 'style', icon: '🧬', name: 'Стиль' },
  { id: 'history', icon: '📦', name: 'История' },
  { id: 'distribution', icon: '📡', name: 'Дистрибуция' },
  { id: 'settings', icon: '⚙️', name: 'Настройки' },
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
  const { view, setView, toast, lures, posts } = useStore()
  const View = VIEWS[view] || DashboardView
  const badges = { lures: lures.length || null, history: posts.length || null }

  return (
    <>
      <FishCanvas />
      <div className="aurora" />
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">🎣</div>
            <div>
              <div className="brand-name">КОНТЕНТ‑ЗАВОД</div>
              <div className="brand-sub">lure factory</div>
            </div>
          </div>
          {NAV.map((n) => (
            <button key={n.id} className={'nav-item' + (view === n.id ? ' active' : '')} onClick={() => setView(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-text">{n.name}</span>
              {badges[n.id] && <span className="nav-badge">{badges[n.id]}</span>}
            </button>
          ))}
          <div className="sidebar-foot">
            <b>v0.1.0</b> · посты и фото хранятся локально в вашем браузере
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
    </>
  )
}
