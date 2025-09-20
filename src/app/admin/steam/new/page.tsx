'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSteam } from '@/hooks/useSteam'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUploadComponent } from '@/components/ui/file-upload'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { SteamMaterial, FileUpload } from '@/types'

export default function NewSteamPage() {
  const { role, user } = useAuth()
  const { addMaterial } = useSteam()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<FileUpload[]>([]) // Обычные файлы
  const [cardImages, setCardImages] = useState<FileUpload[]>([]) // Изображения для карточки
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theory: '',
    process: '',
    class_level: '',
    video_url: '',
    external_links: [] as string[]
  })

  const [externalLink, setExternalLink] = useState('')

  // Проверка прав доступа
  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/labs')
    }
  }, [role, router])

  if (role && role !== 'admin') {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddExternalLink = () => {
    console.log('Adding external link:', externalLink)
    if (externalLink.trim()) {
      const newLink = externalLink.trim()
      console.log('Link to add:', newLink)
      
      setFormData(prev => {
        const newLinks = [...prev.external_links, newLink]
        console.log('Updated external_links:', newLinks)
        return {
          ...prev,
          external_links: newLinks
        }
      })
      setExternalLink('')
    } else {
      console.log('Empty link, not adding')
    }
  }

  const handleRemoveExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('=== НАЧАЛО СОЗДАНИЯ STEAM МАТЕРИАЛА ===')
      console.log('Время начала:', new Date().toISOString())
      console.log('Данные формы:', formData)
      console.log('Файлы:', files.map(f => ({ name: f.file.name, status: f.status, url: f.url })))
      console.log('Изображения карточки:', cardImages.map(f => ({ name: f.file.name, status: f.status, url: f.url })))
      console.log('Пользователь:', user?.email, 'ID:', user?.id)
      console.log('Роль:', role)
      
      // Обрабатываем обычные файлы
      console.log('Files status:', files.map(f => ({ fileName: f.file.name, status: f.status, url: f.url })))
      const uploadedFiles: string[] = files
        .filter(f => f.status === 'completed' && f.url)
        .map(f => f.url!)

      // Обрабатываем изображения для карточки
      console.log('Card images status:', cardImages.map(f => ({ fileName: f.file.name, status: f.status, url: f.url })))
      console.log('Total card images:', cardImages.length)
      console.log('Completed card images:', cardImages.filter(f => f.status === 'completed').length)
      
      const cardImageUrls: string[] = cardImages
        .filter(f => f.status === 'completed' && f.url)
        .map(f => f.url!)
      
      console.log('Final card image URLs:', cardImageUrls)

      // Обрабатываем URL поля с валидацией
      const videoUrl = formData.video_url?.trim() || undefined
      
      // Обрабатываем внешние ссылки - без ограничений
      console.log('Raw external_links from formData:', formData.external_links)
      console.log('Total external links:', formData.external_links.length)
      
      const externalLinksArray = (formData.external_links || [])
        .filter(link => link && typeof link === 'string' && link.trim() !== '')
        .map(link => link.trim())
      
      console.log('Processed external links:', externalLinksArray)
      console.log('Final external links count:', externalLinksArray.length)

      console.log('Processed data:', { 
        videoUrl, 
        externalLinksArray, 
        cardImageUrls, 
        uploadedFiles 
      })
      console.log('External links array:', externalLinksArray)
      console.log('Card image URLs:', cardImageUrls)

      const steamData = {
        title: formData.title?.substring(0, 1000) || '', // Увеличиваем лимит заголовка
        description: formData.description?.substring(0, 5000) || '', // Увеличиваем лимит описания
        theory: formData.theory?.substring(0, 50000) || '', // Увеличиваем лимит теории
        process: formData.process?.substring(0, 50000) || '', // Увеличиваем лимит процесса
        class_level: parseInt(formData.class_level),
        image_url: cardImageUrls.length > 0 ? cardImageUrls[0] : undefined, // Первое изображение карточки (может быть undefined)
        video_url: videoUrl,
        external_links: externalLinksArray,
        files: uploadedFiles, // Обычные файлы для скачивания
        created_by: user?.id || '' // Добавляем ID создателя
      }

      console.log('Steam data to save:', steamData)
      console.log('Image URL being saved:', steamData.image_url)
      
      // Детальная валидация данных
      console.log('=== ВАЛИДАЦИЯ ДАННЫХ ===')
      const validationErrors: string[] = []
      
      if (!steamData.title || steamData.title.trim().length === 0) {
        validationErrors.push('Заголовок обязателен')
      }
      
      if (!steamData.description || steamData.description.trim().length === 0) {
        validationErrors.push('Описание обязательно')
      }
      
      if (!steamData.class_level || isNaN(steamData.class_level) || steamData.class_level < 7 || steamData.class_level > 11) {
        validationErrors.push('Выберите корректный класс (7-11)')
      }
      
      if (validationErrors.length > 0) {
        console.error('Ошибки валидации:', validationErrors)
        throw new Error('Ошибки валидации: ' + validationErrors.join(', '))
      }
      
      console.log('Валидация прошла успешно')
      console.log('Отправляем данные в addMaterial...')
      
      const result = await addMaterial(steamData)
      console.log('=== УСПЕШНО СОЗДАНО ===')
      console.log('Результат:', result)
      console.log('Время завершения:', new Date().toISOString())
      
      // Показываем уведомление об успехе
      alert('STEAM материал сәтті жасалды!')
      
      router.push('/admin/steam')
    } catch (error) {
      console.error('=== ОШИБКА ПРИ СОЗДАНИИ STEAM МАТЕРИАЛА ===')
      console.error('Время ошибки:', new Date().toISOString())
      console.error('Тип ошибки:', typeof error)
      console.error('Ошибка:', error)
      
      if (error instanceof Error) {
        console.error('Сообщение:', error.message)
        console.error('Стек:', error.stack)
        console.error('Имя:', error.name)
      }
      
      // Детальная диагностика
      console.error('Состояние формы на момент ошибки:', {
        formData,
        files: files.map(f => ({ name: f.file.name, status: f.status, url: f.url })),
        cardImages: cardImages.map(f => ({ name: f.file.name, status: f.status, url: f.url })),
        user: user?.email,
        role
      })
      
      // Показываем пользователю понятное сообщение об ошибке
      const errorMessage = error instanceof Error ? error.message : 'Белгісіз қате орын алды'
      alert('Қате орын алды: ' + errorMessage + '\n\nКонсольде толық ақпаратты қараңыз.')
    } finally {
      console.log('=== ЗАВЕРШЕНИЕ ОБРАБОТКИ ===')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/admin/steam">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </a>
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            STEAM материал жасау
          </h1>
          <p className="text-xl text-gray-600">
            Жаңа STEAM материал жасау үшін форманы толтырыңыз
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Негізгі ақпарат</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                STEAM материал үшін атау, сипаттама және сынып
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-700">Атау</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="STEAM жобасының атауы"
                    className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl h-12 text-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_level" className="text-lg font-semibold text-gray-700">Сынып</Label>
                  <Select
                    value={formData.class_level}
                    onValueChange={(value) => handleInputChange('class_level', value)}
                  >
                    <SelectTrigger className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl h-12">
                      <SelectValue placeholder="Сыныпты таңдаңыз" />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10, 11].map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>
                          {grade} сынып
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold text-gray-700">Сипаттама</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="STEAM материалдың қысқаша сипаттамасы"
                  rows={3}
                  className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl text-lg"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Двухколоночная сетка для контента */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Теория */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Теориялық бөлім (міндетті емес)</CardTitle>
                <CardDescription className="text-gray-600">
                  Оқушыларға арналған теориялық негіздер
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="theory" className="text-lg font-semibold text-gray-700">Теория</Label>
                <Textarea
                  id="theory"
                  value={formData.theory}
                  onChange={(e) => handleInputChange('theory', e.target.value)}
                  placeholder="Толық теориялық сипаттама... (міндетті емес)"
                  rows={8}
                  maxLength={50000}
                  className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl text-lg"
                />
                <p className="text-sm text-gray-500">
                  {formData.theory.length}/50000 символов
                </p>
                </div>
              </CardContent>
            </Card>

            {/* Процесс выполнения */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Орындау процесі (міндетті емес)</CardTitle>
                <CardDescription className="text-gray-600">
                  Жұмысты орындау үшін қадамдық нұсқаулар
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="process" className="text-lg font-semibold text-gray-700">Процесс</Label>
                <Textarea
                  id="process"
                  value={formData.process}
                  onChange={(e) => handleInputChange('process', e.target.value)}
                  placeholder="1. Жабдықтарды дайындаңыз... (міндетті емес)"
                  rows={8}
                  maxLength={50000}
                  className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl text-lg"
                />
                <p className="text-sm text-gray-500">
                  {formData.process.length}/50000 символов
                </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Двухколоночная сетка для файлов */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Изображения для карточки */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Карточка суреті (міндетті емес)</CardTitle>
                <CardDescription className="text-gray-600">
                  Карточкада көрсетілетін суреттерді жүктеңіз. Бұл өріс міндетті емес.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploadComponent
                  files={cardImages}
                  onFilesChange={setCardImages}
                  maxFiles={3}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Бірінші сурет карточкада негізгі ретінде пайдаланылады
                </p>
              </CardContent>
            </Card>

            {/* Внешние ссылки */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Сыртқы сілтемелер (міндетті емес)</CardTitle>
                <CardDescription className="text-gray-600">
                  Қосымша ресурстарға сілтемелер қосыңыз. Бұл өріс міндетті емес.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://example.com"
                    className="border-2 border-emerald-200 focus:border-emerald-500 rounded-xl h-12 text-lg"
                  />
                  <Button type="button" onClick={handleAddExternalLink} className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl">
                    Қосу
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Ссылок: {formData.external_links.length} (можно не добавлять)
                </p>
                
                {formData.external_links.length > 0 && (
                  <div className="space-y-2">
                    {formData.external_links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 rounded-xl border border-emerald-200">
                        <span className="text-sm truncate">{link}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExternalLink(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Жою
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Файлы для скачивания - полная ширина */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Жүктеп алу файлдары</CardTitle>
              <CardDescription className="text-gray-600">
                Оқушылар жүктей алатын құжаттар мен материалдар
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadComponent
                files={files}
                onFilesChange={setFiles}
                maxFiles={10}
                maxSize={30 * 1024 * 1024} // 30MB
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-emerald-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/steam')}
              className="px-8 py-3 rounded-xl border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 text-lg font-semibold"
            >
              Болдырмау
            </Button>
            <Button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Сақталуда...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Сақтау
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}