'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FlaskConical, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState('admin@biolab.kz')
  const [password, setPassword] = useState('admin123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Редирект если уже авторизован
  useEffect(() => {
    if (user) {
      router.push('/labs')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Перенаправление...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting to sign in with:', { email })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      console.log('Sign in response:', { data, error })

      if (error) {
        console.error('Sign in error:', error)
        setError(error.message)
        return
      }

      if (data?.user) {
        console.log('Sign in successful, user:', data.user.email)
        console.log('Redirecting to labs immediately...')
        
        // Принудительно обновляем страницу для корректной работы AuthContext
        window.location.href = '/labs'
      } else {
        setError('Не удалось войти в систему')
      }
    } catch (err) {
      console.error('Sign in exception:', err)
      setError('Произошла ошибка при входе в систему')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 custom-scrollbar">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl mb-6 animate-bounce-in">
            <FlaskConical className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Жүйеге кіру
          </h2>
          <p className="text-gray-600 text-lg">
            Материалдарға қол жеткізу үшін тіркелгіңізге кіріңіз
          </p>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Авторизация</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Жүйеге кіру үшін деректеріңізді енгізіңіз
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-semibold text-gray-700">Құпия сөз</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Құпия сөзді енгізіңіз"
                    autoComplete="current-password"
                    required
                    className="h-12 text-base pr-12 border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-emerald-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold" disabled={loading}>
                {loading ? 'Кіруде...' : 'Кіру'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Тіркелгі жоқ па?{' '}
                <a
                  href="/auth/register"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  Тіркелу
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


