'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingPage } from '@/components/ui/loading-spinner'
import { useStudentsMaterials } from '@/hooks/useStudentsMaterials'
import { useLanguage } from '@/contexts/LanguageContext'
import { Navigation } from '@/components/Navigation'
import { Search, SlidersHorizontal, BookOpen, Calendar, GraduationCap, Download, FileText } from 'lucide-react'

export default function StudentsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { materials, loading, updateMaterial } = useStudentsMaterials()
  const [filteredMaterials, setFilteredMaterials] = useState(materials)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')

  // Функция для скачивания файлов
  const handleDownloadClick = (fileName: string, fileUrl: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Фильтрация материалов
  useEffect(() => {
    let filtered = materials

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(material => material.class_level === parseInt(selectedClass))
    }

    setFilteredMaterials(filtered)
  }, [materials, searchTerm, selectedClass])

  if (loading) {
    return <LoadingPage timeout={15000} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 custom-scrollbar">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Оқушыларға арналған материалдар
          </h1>
          <p className="text-xl text-gray-600">
            Оқу материалдары мен қосымша ресурстар
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
                      placeholder="Материал іздеу..."
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
                <BookOpen className="h-8 w-8 text-white" />
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

        {/* Список материалов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card 
              key={material.id} 
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:scale-105"
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
                    <BookOpen className="h-12 w-12 text-emerald-500" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg line-clamp-2 text-gray-800">{material.title}</h3>
                  {material.class_level && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-3 py-1 rounded-full">
                      {material.class_level}-сынып
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {material.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>{new Date(material.created_at).toLocaleDateString('kk-KZ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-cyan-500" />
                    <span>{material.files?.length || 0} файл</span>
                  </div>
                </div>

                {/* Список файлов */}
                {material.files && material.files.length > 0 && (
                  <div className="space-y-2">
                    {material.files.map((file, index) => {
                      // Извлекаем имя файла из URL
                      const fileName = file.split('/').pop() || `Файл ${index + 1}`
                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-between text-xs bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
                          onClick={() => handleDownloadClick(fileName, file)}
                        >
                          <div className="flex items-center flex-1 mr-2">
                            <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                            <span className="truncate font-medium">{fileName}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 text-cyan-500" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Материалдар табылмады
              </h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || selectedClass !== 'all' 
                  ? 'Іздеу критерийлеріне сәйкес материалдар жоқ'
                  : 'Әзірше материалдар қосылмаған'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>

    </div>
  )
}
