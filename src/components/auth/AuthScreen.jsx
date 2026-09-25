import { useState } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Eyebrow from '../ui/Eyebrow'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setLoading(true); setError(''); setMessage('')

    if (mode === 'signin') {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(), password,
      })
      if (signInError) setError(signInError.message)
      else onAuth(data.session)
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(), password,
      })
      if (signUpError) setError(signUpError.message)
      else {
        setMessage('Account created. An administrator must provision the quiz staff profile before access is granted.')
        setMode('signin')
      }
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
        <div>
          <strong>Advanced Quiz</strong>
          <small>Ebenezer International School</small>
        </div>
      </div>

      <div className="auth-card">
        <Eyebrow>STAFF CONTROL CENTRE</Eyebrow>

        <h1>{mode === 'signin' ? 'Welcome back.' : 'Create an account.'}</h1>

        <p>
          {mode === 'signin'
            ? 'Sign in to manage questions or operate the live competition.'
            : 'Create the authenticated account first. Staff access is still controlled from quiz_staff.'}
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com" required />
          </label>

          <label>
            Password
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" minLength={6} required />
          </label>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <button className="primary-btn wide" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <button className="text-button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(''); setMessage('')
          }}>
          {mode === 'signin'
            ? 'Create a new authenticated account'
            : 'Back to staff sign in'}
        </button>
      </div>
    </div>
  )
}
