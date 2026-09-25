import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = crypto.randomUUID()
    const entry = { id, type: 'info', duration: 3500, ...toast }
    setToasts((list) => [...list, entry])
    if (entry.duration > 0) setTimeout(() => remove(id), entry.duration)
  }, [remove])

  const api = useMemo(() => ({
    push,
    success: (msg, opts) => push({ type: 'success', message: msg, ...opts }),
    error:   (msg, opts) => push({ type: 'error',   message: msg, ...opts }),
    info:    (msg, opts) => push({ type: 'info',    message: msg, ...opts }),
    dismiss: remove,
  }), [push, remove])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-label="Notifications">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <div key={t.id} className={`toast toast-${t.type}`} role="status">
              <Icon size={16} />
              <div className="toast-body">
                {t.title && <strong>{t.title}</strong>}
                <span>{t.message}</span>
              </div>
              <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
