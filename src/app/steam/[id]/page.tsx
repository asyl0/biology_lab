'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSteam } from '@/hooks/useSteam'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Play, 
  FileText,
  Calendar,
  User,
  Atom
} from 'lucide-react'
import { SteamMaterial } from '@/types'

export default function SteamDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { materials, loading: materialsLoading } = useSteam()
  const [material, setMaterial] = useState<SteamMaterial | null>(null)

  useEffect(() => {
    if (!materialsLoading && materials.length > 0) {
      const foundMaterial = materials.find(m => m.id === params.id)
      setMaterial(foundMaterial || null)
    }
  }, [params.id, materials, materialsLoading])

  if (materialsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">STEAM материал жүктелуде...</p>
        </div>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Atom className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            STEAM материал табылмады
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Сіз іздеген материал жоқ немесе ол жойылған болуы мүмкін
          </p>
          <Button asChild className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <a href="/steam">
              <ArrowLeft className="h-5 w-5 mr-2" />
              STEAM материалдарына оралу
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 custom-scrollbar">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white transition-all duration-300">
            <a href="/steam">
              <ArrowLeft className="h-4 w-4 mr-2" />
              STEAM материалдарына оралу
            </a>
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-4 py-2 rounded-full text-sm font-semibold">
                  {material.class_level}-сынып
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 text-emerald-500" />
                  {new Date(material.created_at).toLocaleDateString('kk-KZ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-1 text-cyan-500" />
                  {material.files?.length || 0} файл
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4 break-words">
                {material.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 break-words leading-relaxed">
                {material.description}
              </p>
            </div>
            
          </div>
        </div>

        {/* Main Image */}
        {material.image_url && (
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={material.image_url}
                alt={material.title}
                className="w-full h-64 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Theory */}
          {material.theory && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Atom className="h-6 w-6 mr-3" />
                  Теориялық бөлім
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="prose prose-lg max-w-none break-words text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: material.theory.replace(/\n/g, '<br>').replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-gray-800 mb-4">$1</h1>').replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-800 mb-3">$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-700">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic text-cyan-600">$1</em>')
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Process */}
          {material.process && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Play className="h-6 w-6 mr-3" />
                  Орындау процесі
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="prose prose-lg max-w-none break-words text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: material.process.replace(/\n/g, '<br>').replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-gray-800 mb-4">$1</h1>').replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-800 mb-3">$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-cyan-700">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic text-emerald-600">$1</em>')
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Video */}
          {material.video_url && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Play className="h-6 w-6 mr-3" />
                  Видеоматериал
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-lg">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold">
                    <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                      <Play className="h-6 w-6 mr-3" />
                      Видеоны көру
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Files and External Links - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Files */}
          {(material.files?.length || 0) > 0 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-t-2xl">
                <CardTitle className="flex items-center text-xl font-bold">
                  <FileText className="h-6 w-6 mr-3" />
                  Жүктеп алу файлдары
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {material.files?.map((file, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 text-gray-700 hover:text-emerald-700 transition-all duration-300 rounded-xl py-4"
                      asChild
                    >
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        <Download className="h-5 w-5 mr-3 text-emerald-500" />
                        <span className="truncate font-medium">{file.split('/').pop()}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Links */}
          {material.external_links && material.external_links.length > 0 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-t-2xl">
                <CardTitle className="flex items-center text-xl font-bold">
                  <ExternalLink className="h-6 w-6 mr-3" />
                  Сыртқы ресурстар
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {material.external_links.map((link, index) => {
                    // Извлекаем домен из URL для отображения
                    const domain = link.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start border-2 border-cyan-200 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-emerald-50 text-gray-700 hover:text-cyan-700 transition-all duration-300 rounded-xl py-4"
                        asChild
                      >
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5 mr-3 text-cyan-500" />
                          <span className="truncate font-medium">{domain}</span>
                        </a>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  )
}