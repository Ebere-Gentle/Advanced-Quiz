import { Bell, Search } from 'lucide-react'
import Brand from './Brand'
import HeaderNav from './HeaderNav'
import UserMenu from './UserMenu'

export default function Topbar({
  staff, view, isMaster, go, onSignOut, theme, onToggleTheme,
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">
          <Brand onClick={() => go('home')} />
        </div>

        <div className="topbar-center">
          <HeaderNav view={view} isMaster={isMaster} go={go} />
        </div>

        <div className="topbar-actions">
          <button className="command-trigger" title="Search (⌘K)" disabled>
            <Search size={15} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>

          <button className="icon-button" title="Notifications" disabled>
            <Bell size={16} />
          </button>

          <UserMenu
            staff={staff}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  )
}
