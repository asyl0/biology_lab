'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSteam } from '@/hooks/useSteam'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2, 
  Eye, 
  Atom,
  Calendar
} from 'lucide-react'
import { SteamMaterial } from '@/types'

export default function AdminSteamPage() {
  const { user, role } = useAuth()
  const { t } = useLanguage()
  const { materials, loading, deleteMaterial } = useSteam()
  const router = useRouter()

  // Проверка прав доступа
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/labs')
      return
    }
  }, [role, router])

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.steam.delete_confirm'))) {
      try {
        await deleteMaterial(id)
      } catch (error) {
        console.error('Error deleting steam material:', error)
      }
    }
  }

  if (role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 custom-scrollbar">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                STEAM материалдарын басқару
              </h1>
              <p className="text-gray-600">
                STEAM материалдарын жасаңыз, өңдеңіз және басқарыңыз
              </p>
            </div>
            <Button size="lg" asChild>
              <a href="/admin/steam/new">
                <Plus className="h-5 w-5 mr-2" />
                Жаңасын жасау
              </a>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Atom className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-emerald-100">Барлық материалдар</p>
                  <p className="text-2xl font-bold text-white">{materials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">7</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-cyan-100">7 сынып</p>
                  <p className="text-2xl font-bold text-white">
                    {materials.filter(material => material.class_level === 7).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">8</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-emerald-100">8 сынып</p>
                  <p className="text-2xl font-bold text-white">
                    {materials.filter(material => material.class_level === 8).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">9</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-cyan-100">9 сынып</p>
                  <p className="text-2xl font-bold text-white">
                    {materials.filter(material => material.class_level === 9).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Materials List */}
        <div className="space-y-6">
          {materials.map((material) => (
            <Card key={material.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {material.title}
                      </h3>
                      <Badge variant="secondary">{material.class_level} сынып</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(material.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`/steam/${material.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Көру
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Жою
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {materials.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Atom className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                STEAM материалдары жоқ
              </h3>
              <p className="text-gray-500 mb-6">
                Жұмысты бастау үшін алғашқы STEAM материалды жасаңыз
              </p>
              <Button asChild>
                <a href="/admin/steam/new">
                  <Plus className="h-5 w-5 mr-2" />
                  STEAM материал жасау
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}