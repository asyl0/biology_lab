'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { 
  Menu, 
  X, 
  Home, 
  FlaskConical, 
  Atom, 
  GraduationCap, 
  Users,
  Settings, 
  LogOut,
  User,
  ChevronDown
} from 'lucide-react'

export function Navigation() {
  const { user, role, signOut } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Отладочная информация
  useEffect(() => {
    console.log('Navigation: User state changed:', { 
      user: user?.email, 
      role, 
      hasUser: !!user 
    })
  }, [user, role])

  const getNavigationItems = () => {
    // Если пользователь не авторизован, не показываем никаких разделов
    if (!user) {
      return []
    }
    
    const items = [
      { href: '/labs', label: 'Зертхана', icon: FlaskConical, roles: ['student', 'teacher', 'admin'] },
      { href: '/steam', label: 'STEAM', icon: Atom, roles: ['student', 'teacher', 'admin'] },
      { href: '/teachers', label: 'Мұғалімдерге', icon: GraduationCap, roles: ['teacher', 'admin'] },
      { href: '/students', label: 'Оқушыларға', icon: Users, roles: ['student', 'admin'] },
    ]
    
    return items.filter(item => role && item.roles.includes(role))
  }

  const adminItems = [
    { href: '/admin', label: 'Админ', icon: Settings },
  ]

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      console.log('Navigation: Starting sign out...')
      await signOut()
      console.log('Navigation: Sign out completed')
      setIsOpen(false)
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Navigation: Error signing out:', error)
      // Даже если произошла ошибка, закрываем меню
      setIsOpen(false)
      setIsUserMenuOpen(false)
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <FlaskConical className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">BioLab</span>
            </Link>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavigationItems().map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-6 py-3 rounded-2xl text-foreground hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 group hover:shadow-xl"
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )
            })}
            
            {role === 'admin' && (
              <div className="flex items-center space-x-4 pl-4">
                {adminItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 group bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 hover:shadow-lg"
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Пользователь и мобильное меню */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Dropdown Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-foreground hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 px-6 py-3 rounded-2xl transition-all duration-300 hover:shadow-xl"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden sm:block font-semibold text-sm">{user.email}</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 z-50 animate-fade-in">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-4 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-card-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {role === 'admin' ? t('common.admin') : role === 'teacher' ? t('common.teacher') : t('common.student')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-left text-sm text-card-foreground hover:bg-destructive/10 hover:text-destructive flex items-center space-x-3 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">{t('common.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild className="px-6 py-3 rounded-2xl border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl">
                  <Link href="/auth/login">{t('common.login')}</Link>
                </Button>
                <Button size="sm" asChild className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white hover:shadow-2xl transition-all duration-300">
                  <Link href="/auth/register">{t('common.register')}</Link>
                </Button>
              </div>
            )}

            {/* Мобильное меню */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isOpen && (
          <div className="md:hidden animate-slide-in">
            <Card className="mt-4 p-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border-0">
              <div className="space-y-4">
                {getNavigationItems().map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-foreground hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 group shadow-lg hover:shadow-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-semibold text-lg">{item.label}</span>
                    </Link>
                  )
                })}
                
                {role === 'admin' && (
                  <>
                    <div className="border-t border-emerald-200 pt-6">
                      <h3 className="text-lg font-bold text-emerald-600 mb-4 px-2">Админ панель</h3>
                      {adminItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-foreground hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 group ml-2 shadow-lg hover:shadow-xl"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-semibold text-lg">{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </>
                )}

                {user && (
                  <div className="border-t border-emerald-200 pt-6">
                    <div className="flex items-center space-x-4 px-2 mb-6">
                      <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800">{user.email}</p>
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 rounded-full text-sm font-semibold">
                          {role === 'admin' ? 'Админ' : role === 'teacher' ? 'Учитель' : 'Ученик'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      {t('common.logout')}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </nav>
  )
}

