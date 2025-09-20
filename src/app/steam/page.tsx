'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSteam } from '@/hooks/useSteam'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Atom, 
  Search, 
  Filter,
  Calendar,
  Eye
} from 'lucide-react'
import { SteamMaterial } from '@/types'
import { useRouter } from 'next/navigation'

export default function SteamPage() {
  const { user, role } = useAuth()
  const { materials, loading } = useSteam()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const router = useRouter()

  // Фильтрация STEAM материалов
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === 'all' || material.class_level.toString() === selectedClass
    return matchesSearch && matchesClass
  })

  // Функция для перехода к детальной странице
  const handleMaterialClick = (material: SteamMaterial) => {
    router.push(`/steam/${material.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            STEAM материалдары
          </h1>
          <p className="text-xl text-gray-600">
            Ғылым, технология, инженерия, өнер және математика материалдары
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5" />
                    <Input
                      placeholder="STEAM материалдарын іздеу..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 border-2 border-emerald-200 focus:border-emerald-500 rounded-xl h-12 text-lg"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl h-12">
                      <SelectValue placeholder="Сыныпты таңдаңыз" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Барлық сыныптар</SelectItem>
                      <SelectItem value="7">7-сынып</SelectItem>
                      <SelectItem value="8">8-сынып</SelectItem>
                      <SelectItem value="9">9-сынып</SelectItem>
                      <SelectItem value="10">10-сынып</SelectItem>
                      <SelectItem value="11">11-сынып</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Atom className="h-8 w-8 text-white" />
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
                  <p className="text-sm font-medium text-cyan-100">7-сынып</p>
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
                  <p className="text-sm font-medium text-emerald-100">8-сынып</p>
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
                  <p className="text-sm font-medium text-cyan-100">9-сынып</p>
                  <p className="text-2xl font-bold text-white">
                    {materials.filter(material => material.class_level === 9).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список STEAM материалов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card 
              key={material.id} 
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:scale-105 cursor-pointer"
              onClick={() => handleMaterialClick(material)}
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-t-xl overflow-hidden">
                {material.image_url ? (
                  <img 
                    src={material.image_url} 
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100">
                    <Atom className="h-12 w-12 text-emerald-500" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg line-clamp-2 text-gray-800">{material.title}</h3>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-3 py-1 rounded-full">
                    {material.class_level}-сынып
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {material.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>{new Date(material.created_at).toLocaleDateString('kk-KZ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-cyan-500" />
                    <span>Көру</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-12 text-center">
              <Atom className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                STEAM материалдары табылмады
              </h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || selectedClass !== 'all' 
                  ? 'Іздеу критерийлеріне сәйкес материалдар жоқ'
                  : 'Әзірше STEAM материалдары қосылмаған'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
