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
        console.log('AuthContext: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        console.log('AuthContext: Initial session:', session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthContext: User found, fetching role...')
          await fetchUserRole(session.user.id)
        } else {
          console.log('AuthContext: No user in session')
        }
      } catch (error) {
        console.error('Error in getSession:', error)
      } finally {
        setLoading(false)
      }
    }

    // Добавляем таймаут для предотвращения бесконечной загрузки
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Timeout reached, setting loading to false')
      setLoading(false)
    }, 10000) // 10 секунд таймаут

    getSession()

    return () => clearTimeout(timeoutId)

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== ИЗМЕНЕНИЕ СОСТОЯНИЯ АУТЕНТИФИКАЦИИ ===')
        console.log('Событие:', event)
        console.log('Сессия:', session?.user?.id)
        console.log('Email пользователя:', session?.user?.email)
        
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            console.log('Пользователь аутентифицирован, получаем роль...')
            await fetchUserRole(session.user.id)
          } else {
            console.log('Нет пользователя, очищаем роль')
            setRole(null)
          }
        } catch (error) {
          console.error('Ошибка при изменении состояния аутентификации:', error)
        } finally {
          setLoading(false)
        }
        
        // При выходе принудительно обновляем страницу
        if (event === 'SIGNED_OUT') {
          console.log('Пользователь вышел, перенаправляем...')
          window.location.href = '/'
        }
        
        // При регистрации также обновляем состояние
        if (event === 'SIGNED_IN') {
          console.log('Пользователь вошел, обновляем состояние...')
          // Дополнительная проверка через небольшую задержку
          setTimeout(checkAuthState, 1000)
        }
      }
    )

    // Дополнительная проверка для случаев, когда onAuthStateChange не срабатывает
    const checkAuthState = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession && !session) {
          console.log('Обнаружена активная сессия, обновляем состояние...')
          setSession(currentSession)
          setUser(currentSession.user)
          if (currentSession.user) {
            await fetchUserRole(currentSession.user.id)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Ошибка при проверке состояния аутентификации:', error)
      }
    }

    // Проверяем состояние аутентификации через небольшую задержку
    setTimeout(checkAuthState, 500)
    
    // Дополнительная проверка через 2 секунды для случаев регистрации
    setTimeout(checkAuthState, 2000)

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('=== ПОЛУЧЕНИЕ РОЛИ ПОЛЬЗОВАТЕЛЯ ===')
      console.log('ID пользователя:', userId)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single()

      console.log('Ответ от Supabase:', { profile, error })

      if (error) {
        console.error('Ошибка получения профиля:', error)
        setRole(null)
        return
      }

      if (profile) {
        console.log('Роль пользователя найдена:', profile.role)
        setRole(profile.role as UserRole)
      } else {
        console.log('Профиль не найден, устанавливаем роль в null')
        setRole(null)
      }
    } catch (error) {
      console.error('Ошибка получения роли пользователя:', error)
      setRole(null)
    }
  }

  const signOut = async () => {
    try {
      console.log('=== НАЧАЛО ПРОЦЕССА ВЫХОДА ===')
      console.log('Текущий пользователь:', user?.email)
      console.log('Текущая роль:', role)
      console.log('Текущая сессия:', !!session)
      
      // Сначала очищаем состояние
      console.log('Очищаем локальное состояние...')
      setUser(null)
      setSession(null)
      setRole(null)
      setLoading(true)
      
      console.log('Вызываем signOut от Supabase...')
      // Затем вызываем signOut от Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase signOut error:', error)
        throw error
      }
      
      console.log('Sign out successful')
      console.log('Перенаправляем на главную страницу...')
      
      // Принудительно перенаправляем на главную страницу
      window.location.href = '/'
      
    } catch (error) {
      console.error('=== ОШИБКА ПРИ ВЫХОДЕ ===')
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

