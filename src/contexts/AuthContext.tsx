'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  role: UserRole | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получаем текущую сессию
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
      } finally {
        setLoading(false)
      }
    }

    // Добавляем таймаут для предотвращения бесконечной загрузки
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 10000) // 10 секунд таймаут

    getSession()

    return () => clearTimeout(timeoutId)

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            console.log('User authenticated, fetching role...')
            await fetchUserRole(session.user.id)
          } else {
            console.log('No user, clearing role')
            setRole(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        } finally {
          setLoading(false)
        }
        
        // При выходе принудительно обновляем страницу
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting...')
          window.location.href = '/'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setRole(null)
        return
      }

      if (profile) {
        console.log('User role found:', profile.role)
        setRole(profile.role as UserRole)
      } else {
        console.log('No profile found, setting role to null')
        setRole(null)
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      setRole(null)
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      
      // Сначала очищаем состояние
      setUser(null)
      setSession(null)
      setRole(null)
      setLoading(true)
      
      // Затем вызываем signOut от Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase signOut error:', error)
        throw error
      }
      
      console.log('Sign out successful')
      
      // Принудительно перенаправляем на главную страницу
      window.location.href = '/'
      
    } catch (error) {
      console.error('Error signing out:', error)
      // Даже если произошла ошибка, очищаем локальное состояние
      setUser(null)
      setSession(null)
      setRole(null)
      setLoading(false)
      window.location.href = '/'
      throw error
    }
  }

  const value = {
    user,
    session,
    role,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

