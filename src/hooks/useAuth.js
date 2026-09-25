import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  async function loadStaff(userId) {
    const { data, error } = await supabase
      .from('quiz_staff')
      .select(`
        id, user_id, full_name, email, role, is_active, avatar_url,
        quiz_staff_subjects (
          subject_id,
          quiz_subjects ( id, name, is_active )
        )
      `)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      setAuthError(error.message)
      setStaff(null)
      return
    }
    setStaff(data)
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }

    let mounted = true

    async function initialise() {
      const { data: { session: current } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(current)
      if (current?.user) await loadStaff(current.user.id)
      setLoading(false)
    }

    initialise()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, next) => {
        setSession(next)
        if (next?.user) await loadStaff(next.user.id)
        else setStaff(null)
        setLoading(false)
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setStaff(null)
  }

  return { session, staff, loading, authError, signOut, setSession }
}
