import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Lab } from '@/types'

export function useLabs() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLabs()
  }, [])

  const fetchLabs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching labs:', error)
        setError(error.message)
        setLabs([])
        return
      }
      
      setLabs(data || [])
    } catch (err) {
      console.error('Error in fetchLabs:', err)
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      setLabs([])
    } finally {
      setLoading(false)
    }
  }

  const createLab = async (labData: Omit<Lab, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('=== НАЧАЛО СОЗДАНИЯ ЛАБОРАТОРНОЙ РАБОТЫ В ХУКЕ ===')
      console.log('Время начала:', new Date().toISOString())
      console.log('Данные для создания:', labData)
      console.log('Тип данных:', typeof labData)
      console.log('JSON строка:', JSON.stringify(labData, null, 2))
      
      // Проверяем подключение к Supabase
      console.log('Проверка подключения к Supabase...')
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase client:', !!supabase)
      
      const startTime = Date.now()
      console.log('Начинаем вставку в базу данных в:', new Date().toISOString())
      
            // Добавляем таймаут для отладки
            const insertPromise = supabase
              .from('labs')
              .insert([labData])
              .select()
              .single()

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout after 30 seconds')), 30000)
            )

      try {
        console.log('Выполняем запрос к Supabase...')
        const result = await Promise.race([insertPromise, timeoutPromise]) as { data: any; error: any }
        const { data, error } = result

        const endTime = Date.now()
        console.log('=== ОТВЕТ ОТ SUPABASE ===')
        console.log('Время выполнения:', endTime - startTime, 'мс')
        console.log('Время завершения:', new Date().toISOString())
        console.log('Данные:', data)
        console.log('Ошибка:', error)

        if (error) {
          console.error('=== ОШИБКА SUPABASE ===')
          console.error('Код ошибки:', error.code)
          console.error('Сообщение:', error.message)
          console.error('Детали:', error.details)
          console.error('Подсказка:', error.hint)
          console.error('Статус:', error.status)
          console.error('Статус текст:', error.statusText)
          console.error('Полная ошибка:', error)
          throw error
        }

        if (!data) {
          console.error('=== ОШИБКА: НЕТ ДАННЫХ ===')
          console.error('Supabase вернул пустой ответ')
          throw new Error('Supabase вернул пустой ответ')
        }

        console.log('=== УСПЕШНОЕ СОЗДАНИЕ ===')
        console.log('Созданная лабораторная работа:', data)
        console.log('Обновляем локальное состояние...')
        
        setLabs(prev => {
          const newLabs = [data, ...prev]
          console.log('Новое состояние labs:', newLabs.length, 'элементов')
          return newLabs
        })
        
        console.log('Лабораторная работа успешно создана и добавлена в состояние')
        return data
            } catch (raceError) {
              console.error('=== ОШИБКА RACE (ТАЙМАУТ ИЛИ ДРУГАЯ) ===')
              console.error('Время ошибки:', new Date().toISOString())
              console.error('Тип ошибки:', typeof raceError)
              console.error('Ошибка:', raceError)
              
              if (raceError instanceof Error) {
                console.error('Сообщение:', raceError.message)
                console.error('Стек:', raceError.stack)
                console.error('Имя:', raceError.name)
              }
              
              throw raceError
            }
          } catch (err) {
            console.error('=== ОШИБКА В CREATE LAB ===')
            console.error('Время ошибки:', new Date().toISOString())
            console.error('Тип ошибки:', typeof err)
            console.error('Ошибка:', err)
            
            if (err instanceof Error) {
              console.error('Сообщение:', err.message)
              console.error('Стек:', err.stack)
              console.error('Имя:', err.name)
            }
            
            const errorMessage = err instanceof Error ? err.message : 'Ошибка создания'
            console.error('Устанавливаем ошибку в состояние:', errorMessage)
            setError(errorMessage)
            throw err
          }
  }

  const addLab = createLab

  const updateLab = async (id: string, labData: Partial<Lab>) => {
    try {
      const { data, error } = await supabase
        .from('labs')
        .update({ ...labData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setLabs(prev => prev.map(lab => lab.id === id ? data : lab))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления')
      throw err
    }
  }

  const deleteLab = async (id: string) => {
    try {
      const { error } = await supabase
        .from('labs')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setLabs(prev => prev.filter(lab => lab.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
      throw err
    }
  }

  const getLabById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      throw err
    }
  }

  return {
    labs,
    loading,
    error,
    fetchLabs,
    createLab,
    addLab,
    updateLab,
    deleteLab,
    getLabById,
    refetch: fetchLabs
  }
}
