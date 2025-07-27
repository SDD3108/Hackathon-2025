/* eslint-disable react/prop-types */
"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import { Separator } from '@/src/ui/separator'
import { Skeleton } from '@/src/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/ui/tooltip'
import { BookText, Users, User, DoorOpen } from 'lucide-react'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import axios from 'axios'
import { tokenDecoder } from '@/src/utils/tokenDecoder/tokenDecoder'

const LecturePageBuilder = ({ params }) => {
  const { user } = useAuthenticationStore()
  const [currentUser, setCurrentUser] = useState(null)
  const [lecture, setLecture] = useState(null)
  const [subject, setSubject] = useState(null)
  const [group, setGroup] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState(null)
  const [displayTitle, setDisplayTitle] = useState('')
  const [displayContent, setDisplayContent] = useState('')
  const contentRef = useRef(null)
  const router = useRouter()

  const highlightColors = [
    'bg-yellow-400 bg-opacity-10',
    'bg-green-400 bg-opacity-10',
    'bg-blue-400 bg-opacity-10',
    'bg-pink-400 bg-opacity-10',
    'bg-purple-400 bg-opacity-10',
    'bg-red-400 bg-opacity-10',
    'bg-indigo-400 bg-opacity-10',
  ]

  // Получение данных с API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem('token')
        
        const lectureRes = await axios.get(`${baseUrl}/api/lectures/${params.id}`)
        const lectureData = lectureRes.data
        setLecture(lectureData)
        
        const [subjectRes,groupRes,teacherRes] = await Promise.all([
          axios.get(`${baseUrl}/api/subjects/${lectureData.subjectId}`),
          axios.get(`${baseUrl}/api/groups/${lectureData.groupId}`),
          axios.get(`${baseUrl}/api/users/${lectureData.teacherId}`),
        ])
        
        const keywordsRes = await axios.get(`${baseUrl}/api/keywords?lectureId=${params.id}`)
        
        setSubject(subjectRes.data)
        setGroup(groupRes.data)
        setTeacher(teacherRes.data)
        setKeywords(keywordsRes.data)
        
      } catch (error) {
        console.error('Ошибка загрузки данных', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [params.id])

  // Получение текущего пользователя
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = user || localStorage.getItem('token')
        const userId = tokenDecoder(token)
        const usersUrl = process.env.NEXT_PUBLIC_API_URL + '/api/users'
        const currentUserRes = await axios.get(`${usersUrl}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCurrentUser(currentUserRes.data)
      } catch (error) {
        console.error('Ошибка получения пользователя', error)
      }
    }
    
    if (user || localStorage.getItem('token')) {
      getCurrentUser()
    }
  }, [user])

  // Анимация появления заголовка
  useEffect(() => {
    if (!lecture || !lecture.title) return
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= lecture.title.length) {
        setDisplayTitle(lecture.title.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [lecture])

  // Анимация появления контента
  useEffect(() => {
    if (!lecture || !lecture.content) return
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= lecture.content.length) {
        setDisplayContent(lecture.content.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 20)
    
    return () => clearInterval(interval)
  }, [lecture])

  // Обработка выделения текста
  const handleTextSelect = () => {
    if (!currentUser?.is_student || !contentRef.current) return
    
    const selection = window.getSelection()
    if (!selection.toString().trim()) {
      setIsSelecting(false)
      return
    }
    
    const range = selection.getRangeAt(0)
    const contentNode = contentRef.current
    const preSelectionRange = document.createRange()
    
    preSelectionRange.setStart(contentNode, 0)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    
    const startIndex = preSelectionRange.toString().length
    const endIndex = startIndex + selection.toString().length
    
    setSelection({
      text: selection.toString().trim(),
      startIndex,
      endIndex
    })
    setIsSelecting(true)
  }

  // Добавление ключевого слова
  const handleAddKeyword = async () => {
    if (!selection || !selection.text) return
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        `${baseUrl}/api/keywords`,
        {
          lectureId: params.id,
          startIndex: selection.startIndex,
          endIndex: selection.endIndex
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setKeywords(prev => [...prev, response.data])
      
    } catch (error) {
      console.error('Ошибка добавления ключевого слова', error)
    }
    
    setIsSelecting(false)
    setSelection(null)
    window.getSelection().removeAllRanges()
  }

  // Удаление ключевого слова
  const handleRemoveKeyword = async (keywordId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem('token')
      
      await axios.delete(`${baseUrl}/api/keywords/${keywordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setKeywords(prev => prev.filter(kw => kw.id !== keywordId))
      
    } catch (error) {
      console.error('Ошибка удаления ключевого слова', error)
    }
  }

  // Формирование контента с выделениями
  const renderContentWithHighlights = () => {
    if (!lecture || !displayContent) return null
    
    // Создаем копию ключевых слов и сортируем их
    const sortedKeywords = [...keywords]
      .filter(kw => kw.endIndex <= displayContent.length)
      .sort((a, b) => a.startIndex - b.startIndex)
    
    const fragments = []
    let lastIndex = 0
    
    // Формируем фрагменты текста
    sortedKeywords.forEach(keyword => {
      // Текст до выделения
      if (keyword.startIndex > lastIndex) {
        fragments.push({
          text: displayContent.substring(lastIndex, keyword.startIndex),
          isHighlighted: false
        })
      }
      
      // Выделенный текст
      fragments.push({
        text: displayContent.substring(keyword.startIndex, keyword.endIndex),
        isHighlighted: true,
        keywordId: keyword.id,
        colorIndex: keyword.id % highlightColors.length
      })
      
      lastIndex = keyword.endIndex
    })
    
    // Остаток текста
    if (lastIndex < displayContent.length) {
      fragments.push({
        text: displayContent.substring(lastIndex),
        isHighlighted: false
      })
    }
    
    return fragments.map((fragment, index) => {
      if (fragment.isHighlighted) {
        const colorClass = highlightColors[fragment.colorIndex]
        
        return (
          <span
            key={index}
            className={`${colorClass} font-semibold cursor-pointer`}
            onClick={() => !currentUser?.is_student && handleRemoveKeyword(fragment.keywordId)}
            title={!currentUser?.is_student ? `Нажмите для удаления` : ''}
          >
            {fragment.text}
          </span>
        )
      }
      
      return <span key={index}>{fragment.text}</span>
    })
  }

  const skeletonsText = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-mainColor">
        <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          {/* Скелетон загрузки */}
        </div>
      </div>
    )
  }

  if (!lecture || !subject || !group || !teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Данные лекции не найдены</h2>
        <Button onClick={() => router.push('/')}>Вернуться на главную</Button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-mainColor">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Информация о лекции */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-6"
        >
          <div className="space-y-2 text-white md:max-w-1/2 xs:max-w-full">
            {/* Элементы информации */}
          </div>
        </motion.div>
        
        <Separator className="my-8" />
        
        {/* Заголовок и дата */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-center mb-4 flex flex-col space-y-6"
        >
          <h1 className="lg:text-6xl md:text-5xl 2sm:text-3xl 2xs:text-2xl font-semibold text-white">
            {displayTitle}
          </h1>
          <p className="text-2xl font-semibold text-fourthGray">
            {lecture.date}
          </p>
        </motion.div>
        
        {/* Видео */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="w-full max-w-[60rem] h-[24rem] bg-black overflow-hidden">
            <video src={lecture.video} controls className="w-full h-full object-contain"/>
          </div>
        </motion.div>
        
        {/* Контент лекции */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6 }}
          className="prose prose-lg max-w-none relative text-white text-2xl px-6"
          ref={contentRef}
          onMouseUp={handleTextSelect}
        >
          {isSelecting && !currentUser?.is_student && selection && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10"
              style={{ 
                top: `${selection.top}px`, 
                left: `${selection.left}px`
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="default" 
                      className="bg-white hover:bg-newWhite text-black shadow-lg"
                      onClick={handleAddKeyword}
                    >
                      Добавить "{selection.text}"
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Добавить это слово в ключевые</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
          
          {renderContentWithHighlights()}
          
          {currentUser?.is_student && (
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
              <p className="font-medium">
                <span className="font-bold">Информация для преподавателей:</span> 
                Для удаления выделения наведите курсор на выделенное слово и нажмите на него.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default LecturePageBuilder