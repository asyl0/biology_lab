'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FlaskConical, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'student' as 'student' | 'teacher',
    class: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Редирект если уже авторизован
  useEffect(() => {
    if (user) {
      router.push('/labs')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    if (formData.role === 'student' && !formData.class) {
      setError('Выберите класс для ученика')
      setLoading(false)
      return
    }

    try {
      // Регистрация пользователя
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            class: formData.role === 'student' ? parseInt(formData.class) : null
          }
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Профиль создается автоматически через триггер в базе данных
        // Успешная регистрация - показываем сообщение и перенаправляем
        console.log('Registration successful, redirecting to labs...')
        setError('') // Очищаем ошибки
        setSuccess(true) // Показываем успех
        setLoading(true) // Показываем загрузку
        
        // Ждем немного для обновления AuthContext и перенаправляем
        setTimeout(() => {
          window.location.href = '/labs'
        }, 1500) // Увеличиваем время до 1.5 секунд
      }
    } catch (err) {
      setError('Произошла ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Показываем загрузку если пользователь уже авторизован
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Перенаправление...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl mb-6 animate-bounce-in">
            <FlaskConical className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Тіркелу
          </h2>
          <p className="text-gray-600 text-lg">
            Білім беру материалдарына қол жеткізу үшін тіркелгі жасаңыз
          </p>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Тіркелгі жасау</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Жүйеге тіркелу үшін форманы толтырыңыз
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
                  Тіркелу сәтті! Перенаправляем...
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-base font-semibold text-gray-700">Толық аты</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Атыңызды енгізіңіз"
                  required
                  className="h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="role" className="text-base font-semibold text-gray-700">Рөл</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger className="h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl">
                    <SelectValue placeholder="Рөлді таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Оқушы</SelectItem>
                    <SelectItem value="teacher">Мұғалім</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'student' && (
                <div className="space-y-3">
                  <Label htmlFor="class" className="text-base font-semibold text-gray-700">Сынып</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => handleInputChange('class', value)}
                  >
                    <SelectTrigger className="h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl">
                      <SelectValue placeholder="Сыныпты таңдаңыз" />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10, 11].map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>
                          {grade}-сынып
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-semibold text-gray-700">Құпия сөз</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Кемінде 6 таңба"
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

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700">Құпия сөзді растау</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Құпия сөзді қайталаңыз"
                    required
                    className="h-12 text-base pr-12 border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-emerald-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold" disabled={loading}>
                {loading ? (success ? 'Перенаправляем...' : 'Тіркелуде...') : 'Тіркелу'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Тіркелгі бар ма?{' '}
                <a
                  href="/auth/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  Кіру
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

