import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Moon, Settings2, Sun, User } from 'lucide-react'
import { initials } from '../../lib/utils'

export default function UserMenu({ staff, theme, onToggleTheme, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="user-chip"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="avatar">{initials(staff.full_name)}</span>
        <span className="user-chip-text">
          <strong>{staff.full_name}</strong>
          <small>{staff.role === 'teacher' ? 'Teacher' : 'Quiz Master'}</small>
        </span>
        <ChevronDown size={14} className={open ? 'rot' : ''} />
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-head">
            <span className="avatar lg">{initials(staff.full_name)}</span>
            <div>
              <strong>{staff.full_name}</strong>
              <small>{staff.email}</small>
            </div>
          </div>

          <button role="menuitem" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button role="menuitem" disabled>
            <User size={15} /> Profile
          </button>

          <button role="menuitem" disabled>
            <Settings2 size={15} /> Preferences
          </button>

          <hr />

          <button role="menuitem" className="danger" onClick={onSignOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
