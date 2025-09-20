'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { 
  FlaskConical, 
  Atom, 
  GraduationCap, 
  ArrowRight, 
  Calendar, 
  Users, 
  Download, 
  ExternalLink,
  Microscope,
  Leaf,
  Dna,
  Beaker,
  BookOpen,
  Target,
  Shield,
  Zap,
  Globe,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  Star
} from 'lucide-react'
import { useLabs } from '@/hooks/useLabs'
import Image from 'next/image'
// import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const { labs, loading: labsLoading } = useLabs()

  useEffect(() => {
    if (!loading && user) {
      console.log('Home: User authenticated, redirecting to labs...')
      // Принудительно перенаправляем на labs
      window.location.href = '/labs'
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingPage timeout={10000} />
  }

  // Если пользователь не авторизован, показываем лендинг
  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        {/* Hero Section with Background Image */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/photo_num1.jpeg"
              alt="BioLab Laboratory"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Logo Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <Microscope className="h-12 w-12 text-white" />
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight animate-slide-in hero-text-shadow">
              BioLab
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto leading-relaxed mb-12 animate-fade-in font-light hero-text-shadow">
              Заманауи биология зертханасы үшін арналған оқу ортасы
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold hero-button-glow"
                onClick={() => window.location.href = '/auth/login'}
              >
                <Play className="h-6 w-6 mr-3" />
                Бастау
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/80 text-white hover:bg-white/10 hover:border-white px-10 py-5 text-xl rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
                onClick={() => window.location.href = '/auth/register'}
              >
                <BookOpen className="h-6 w-6 mr-3" />
                Тіркелу
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Features Section */}
          <div className="py-20 animate-fade-in">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                Платформаның мүмкіндіктері
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Биология пәнін оқытуды жеңілдететін және оқушылардың қызығушылығын арттыратын заманауи білім беру платформасы
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 - Laboratory Works */}
              <div className="animate-fade-in">
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-cyan-50">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                      <FlaskConical className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                      Зертханалық жұмыстар
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      Интерактивті зертханалық жұмыстар, эксперименттер мен практикалық тапсырмалар
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Виртуалды эксперименттер</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Микроскоптық зерттеулер</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Химиялық реакциялар</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 2 - STEAM Education */}
              <div className="animate-fade-in">
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-emerald-50">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-3">
                      <Atom className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                      STEAM білім беру
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      Ғылым, технология, инженерия, өнер және математика салаларын біріктіретін жобалар
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                        <span>Көпсалалық жобалар</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                        <span>Инновациялық ойлау</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                        <span>Практикалық шешімдер</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3 - Teacher Resources */}
              <div className="animate-fade-in">
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-cyan-50">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                      Мұғалімдерге арналған ресурстар
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      Сабақ жоспарлары, оқу материалдары және бағалау жүйесі
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Сабақ жоспарлары</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Бағалау критерийлері</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Оқушыларды бақылау</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Why Choose BioLab Section */}
          <div className="py-20 bg-gradient-to-r from-emerald-50 via-cyan-50 to-emerald-50 rounded-3xl animate-fade-in">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                Неліктен BioLab таңдау керек?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Біздің платформа биология пәнін оқытуды жеңілдететін және оқушылардың қызығушылығын арттыратын заманауи шешімдер ұсынады
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Қазақ тілінде толық қолдау",
                  description: "Барлық материалдар қазақ тілінде дайындалған және отандық білім беру стандарттарына сәйкес келеді",
                  color: "emerald"
                },
                {
                  icon: Zap,
                  title: "Интерактивті оқыту",
                  description: "Оқушылар белсенді түрде қатысады, эксперименттер орындайды және нақты нәтижелерді көреді",
                  color: "cyan"
                },
                {
                  icon: Shield,
                  title: "Қауіпсіз орта",
                  description: "Зертханалық жұмыстарды қауіпсіз түрде орындауға мүмкіндік беретін виртуалды орта",
                  color: "emerald"
                },
                {
                  icon: Target,
                  title: "Жеке дараланған оқыту",
                  description: "Әр оқушының деңгейіне сәйкес материалдар мен тапсырмалар ұсынылады",
                  color: "cyan"
                },
                {
                  icon: Award,
                  title: "Нақты нәтижелерді бақылау",
                  description: "Мұғалімдер оқушылардың жетістіктерін нақты уақытта бақылай алады",
                  color: "emerald"
                },
                {
                  icon: BookOpen,
                  title: "Қолжетімділік",
                  description: "Кез келген уақытта, кез келген жерде оқуға мүмкіндік беретін онлайн платформа",
                  color: "cyan"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full p-6 hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                    <div className="flex items-start space-x-4">
                      <div 
                        className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color === 'emerald' ? 'cyan' : 'emerald'}-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-3`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-emerald-600 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Author Portfolio Section */}
          <div className="py-20 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Box - About Author */}
                <div className="p-12 text-white relative">
                  <div className="relative z-10 animate-slide-in">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                      Автор жайлы
                    </h2>
                    <p className="text-emerald-100 mb-8 leading-relaxed text-lg">
                      Бұл жобаның авторы - <strong>Омарова Ұлжалғас Тағабайқызы</strong> - биология пәні мұғалімі. 
                      Ол биологияны оқушыларға қызықты және қолжетімді ету үшін 
                      бұл заманауи веб-платформаны дайындады. Жоба білім беру процесін жеңілдетуге 
                      және оқушылардың қызығушылығын арттыруға бағытталған.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                      <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 px-4 py-2">
                        <Dna className="h-4 w-4 mr-2" />
                        Биология мұғалімі
                      </Badge>
                      <Badge className="bg-cyan-500/20 text-cyan-100 border-cyan-400/30 px-4 py-2">
                        <Award className="h-4 w-4 mr-2" />
                        Педагог-модератор
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                        <Star className="h-4 w-4 mr-2" />
                        Инновациялық оқыту
                      </Badge>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-white to-emerald-100 text-emerald-700 hover:from-emerald-50 hover:to-white shadow-xl hover:shadow-2xl transition-all duration-300"
                      onClick={() => window.open('/portfolio.pdf', '_blank')}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Портфолио жүктеу
                    </Button>
                  </div>
                </div>

                {/* Right Box - Portfolio Section */}
                <div className="p-12 text-white relative bg-gradient-to-br from-emerald-700/50 to-cyan-700/50">
                  <div className="relative z-10 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute top-6 right-6 text-sm font-bold text-emerald-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      ПОРТФОЛИО
                    </div>
                    
                    <div className="mt-12">
                      <h3 className="text-4xl font-bold mb-8 leading-tight">
                        Омарова Ұлжалғас<br />
                        <span className="text-emerald-200 text-2xl">Тағабайқызы</span>
                      </h3>
                      
                      <div className="relative mb-8 group hover:scale-105 transition-transform duration-300">
                        <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                          <Image
                            src="/skrin.png"
                            alt="Омарова Ұлжалғас"
                            width={192}
                            height={192}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg animate-spin" style={{ animationDuration: '20s' }}>
                          <Leaf className="h-8 w-8 text-white m-2" />
                        </div>
                        
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-lg animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                          <Microscope className="h-8 w-8 text-white m-2" />
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="text-sm text-emerald-100 font-semibold text-center mb-2">
                          ПЕДАГОГ-МОДЕРАТОР
                        </p>
                        <p className="text-lg text-white font-bold text-center">
                          БИОЛОГИЯ ПӘНІ МҰҒАЛІМІ
                        </p>
                        <div className="flex justify-center mt-4">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-300 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Если пользователь авторизован, показываем лабораторные работы
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Зертханалық жұмыстар</h1>
          <p className="text-gray-600">Зертханалық жұмыстар мен білім беру материалдарын оқыңыз</p>
        </div>

        {/* Labs Grid */}
        {labsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Зертханалық жұмыстар жоқ</h3>
            <p className="text-gray-500">Әзірше ешқандай зертханалық жұмыс қосылмаған</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <Card 
                key={lab.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => router.push(`/labs/${lab.id}`)}
              >
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {lab.image_url ? (
                    <img 
                      src={lab.image_url} 
                      alt={lab.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FlaskConical className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{lab.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{lab.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{lab.class_level}-сынып</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(lab.created_at).toLocaleDateString('kk-KZ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
