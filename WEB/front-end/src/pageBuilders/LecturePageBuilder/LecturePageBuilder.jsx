"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/src/ui/avatar'
import { Separator } from '@/src/ui/separator'
import { Skeleton } from '@/src/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/ui/tooltip'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/src/ui/context-menu'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'

const LecturePageBuilder = ({ params }) => {
  const { user: currentUser } = useAuthenticationStore()
  const [lecture, setLecture] = useState(null)
  const [subject, setSubject] = useState(null)
  const [group, setGroup] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [keywords, setKeywords] = useState({ main: [] })
  const [loading, setLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState(null)
  const contentRef = useRef(null)
  const router = useRouter()
  
  const highlightColors = [
    'bg-yellow-400 bg-opacity-40',
    'bg-green-400 bg-opacity-40',
    'bg-blue-400 bg-opacity-40',
    'bg-pink-400 bg-opacity-40',
    'bg-purple-400 bg-opacity-40',
    'bg-red-400 bg-opacity-40',
    'bg-indigo-400 bg-opacity-40',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const mockLecture = {
          id: params.id,
          title: "Дифференциальные уравнения",
          keywordsId: '5',
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus odio diam, nec vestibulum nunc fringilla commodo. Nam vitae mi luctus, rhoncus turpis vitae, bibendum est. Cras cursus scelerisque quam, mattis tincidunt elit ullamcorper vitae. Donec facilisis, diam sit amet consequat fringilla, lectus orci rhoncus leo, sit amet pellentesque orci dolor non nisl. Phasellus non felis metus. Nulla molestie diam erat, a pharetra neque venenatis eu. Etiam est libero, dapibus in urna vitae, porttitor elementum arcu. Sed nec nisl ac est dignissim laoreet. Duis blandit tortor vel dui fringilla, in faucibus leo auctor. Donec neque leo, interdum sed odio sit amet, blandit faucibus ex. Proin aliquet viverra lacus non elementum. Donec placerat vel neque in accumsan. Donec pretium pharetra dictum. Nunc vel lacus quis libero gravida vulputate. Sed pellentesque eget odio vel hendrerit. Suspendisse in est lacus. Aenean feugiat erat porttitor augue placerat posuere eget pretium tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse in orci vel felis vestibulum ultricies quis sollicitudin nisi. Morbi tristique tortor at felis vestibulum, non tristique lorem lacinia. In hac habitasse platea dictumst. In ut neque orci. Nullam ligula ligula, fermentum ac elit eu, aliquet ultrices ipsum. Mauris eget felis ut sapien cursus dapibus ac vestibulum est. Fusce feugiat, mi vitae tempus dapibus, justo metus molestie erat, id posuere magna turpis ac ex. Morbi fringilla lacus ante, sit amet suscipit arcu mattis vel.Duis tincidunt dignissim turpis, sit amet dignissim odio ultricies nec. Aenean tortor velit, accumsan non metus eget, rhoncus consequat urna. Etiam sed hendrerit lorem. Nunc feugiat sem velit, at eleifend risus pretium sit amet. Nullam tempus convallis neque, id ultricies sapien aliquet vitae. Nulla viverra leo eu dolor tempor dapibus. Curabitur at justo quis magna elementum posuere et id est. Aenean id eleifend justo. Morbi ut hendrerit sapien. Nulla nec libero at nisl porttitor accumsan. Curabitur ornare non lacus eget venenatis. Sed a pellentesque massa. Pellentesque iaculis enim quis nulla viverra, id dignissim massa condimentum. Cras suscipit mollis faucibus. Curabitur vestibulum rutrum justo non commodo. Maecenas ex felis, cursus id dignissim varius, lacinia non urna. Aliquam purus ligula, feugiat dapibus neque at, bibendum lacinia arcu. Donec rutrum dapibus porta. Sed augue nisl, euismod vel erat eget, semper convallis erat. Maecenas dictum risus quis elit dignissim, in hendrerit tellus sollicitudin. Donec molestie ligula id lobortis luctus. Sed non lorem aliquet, dignissim dui sed, bibendum sem. Integer eu rutrum augue. Sed nec congue elit. Suspendisse efficitur lacus leo, vel lacinia erat feugiat hendrerit. Praesent sit amet elit ex. Nunc eu sollicitudin turpis, quis accumsan lacus. In elementum lorem nec mauris dapibus tristique. Suspendisse auctor dolor in placerat imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus iaculis urna id purus euismod pulvinar. Curabitur fermentum, velit eget auctor volutpat, est mauris semper mauris, ut fringilla dolor ante quis nisl. Fusce at diam in dui euismod luctus. Duis et sagittis odio, vitae faucibus ipsum. Nam nulla ex, venenatis at enim tempor, maximus accumsan urna. Aenean et magna faucibus, gravida enim vel, tristique sapien.",
          video: "https://www.w3schools.com/html/mov_bbb.mp4",
          date: "01.07.2025",
          teacherId: "4",
        }
        
        const mockSubject = {
          id: "2",
          title: "Высшая математика",
          classroom: "А-305",
          lectureId: mockLecture.id,
          typeOfSubject: "2",
        }
        
        const mockGroup = {
          id: "3",
          title: "МАТ-202",
          curatorId: "4",
        }
        
        const mockTeacher = {
          id: '4',
          name: "Мария",
          surname: "Иванова",
          email: "math_teacher@university.edu",
          password: "securePassword123",
          avatar: "",
          is_student: false,
          is_teacher: true,
          is_admin: false,
          classId: '3',
        }
        
        const mockKeywords = {
          id: "5",
          main: ["Lorem", "Nullam", "lectus", "diam", "fringilla"],
        }
        
        setLecture(mockLecture)
        setSubject(mockSubject)
        setGroup(mockGroup)
        setTeacher(mockTeacher)
        setKeywords(mockKeywords)
      } catch(error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // Генерация инициалов для аватара
  const getInitials = (name, surname) => {
    return `${name ? name[0] : ''}${surname ? surname[0] : ''}`
  }

  // Обработка выделения текста
  const handleTextSelect = () => {
    if (currentUser?.is_student || !contentRef.current) return
    
    const selection = window.getSelection()
    if (!selection.toString().trim()) {
      setIsSelecting(false)
      return
    }
    
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    
    setSelection({
      text: selection.toString().trim(),
      top: rect.top - contentRect.top + contentRef.current.scrollTop,
      left: rect.left - contentRect.left,
      width: rect.width
    })
    setIsSelecting(true)
  }

  // Добавление ключевого слова
  const handleAddKeyword = () => {
    if (!selection || !selection.text) return
    
    // Проверяем, не добавлено ли уже это слово
    if (!keywords.main.includes(selection.text)) {
      const newKeywords = [...keywords.main, selection.text]
      setKeywords({ ...keywords, main: newKeywords })
      
      // Здесь должен быть вызов API для сохранения
      console.log(`Добавлено ключевое слово: ${selection.text}`)
    }
    
    setIsSelecting(false)
    setSelection(null)
    window.getSelection().removeAllRanges()
  }

  // Удаление ключевого слова
  const handleRemoveKeyword = (word) => {
    const newKeywords = keywords.main.filter(w => w !== word)
    setKeywords({ ...keywords, main: newKeywords })
    
    // Здесь должен быть вызов API для удаления
    console.log(`Удалено ключевое слово: ${word}`)
  }

  // Функция для выделения ключевых слов
  const highlightKeywords = (text,keywords)=>{
    if(!keywords || keywords.length == 0){
      return text
    }
    
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length)
    let result = text
    const usedWords = new Map()
    
    sortedKeywords.forEach((word,index)=>{
      const colorClass = highlightColors[index % highlightColors.length]
      const regex = new RegExp(`\\b(${word})\\b`, 'gi')
      
      if(!usedWords.has(word.toLowerCase())){
        usedWords.set(word.toLowerCase(), colorClass)
        
        result = result.replace(regex,(match)=>{
          if(!currentUser?.is_student){
            return `<span class="${colorClass} font-semibold">${match}</span>`
          }
          else{
            return `
            <span class="${colorClass} font-semibold cursor-pointer relative keyword-tooltip" data-word="${word}">
              ${match}
            </span>`
          }
        })
      }
    })
    
    return result
  }

  // Обработка наведения на выделенное слово
  useEffect(()=>{
    if(currentUser?.is_student || !contentRef.current){
      return
    }
    
    const handleMouseOver = (e) => {
      if(e.target.classList.contains('keyword-tooltip')){
        const word = e.target.dataset.word
        e.target.title = `Нажмите для удаления: ${word}`
      }
    }
    
    const handleClick = (e) => {
      if(e.target.classList.contains('keyword-tooltip')){
        const word = e.target.dataset.word
        handleRemoveKeyword(word)
      }
    }
    
    const contentElement = contentRef.current
    contentElement.addEventListener('mouseover', handleMouseOver)
    contentElement.addEventListener('click', handleClick)
    
    return ()=>{
      contentElement.removeEventListener('mouseover', handleMouseOver)
      contentElement.removeEventListener('click', handleClick)
    }
  },[keywords, currentUser])
  // skeletons
  if(loading){
    return (
      <div className="w-full min-h-screen flex flex-col">
        <header className="h-16 bg-gray-800 p-4">
          <Skeleton className="h-full w-full" />
        </header>
        
        <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/2 flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
            </Skeleton>
            <Skeleton className="h-6 w-1/3" />
          </div>
          
          <Separator className="my-8" />
          <div className="text-center mb-12 space-y-6">
            <Skeleton className="h-16 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/3 mx-auto" />
          </div>
          <div className="flex justify-center mb-12">
            <Skeleton className="w-full max-w-[60rem] h-[24rem]" />
          </div>
          <div className="space-y-3">
            {[...Array(15)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (!lecture || !subject || !group || !teacher){
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Данные лекции не найдены</h2>
        <Button onClick={() => router.push('/')}>Вернуться на главную</Button>
      </div>
    )
  }

  const highlightedContent = highlightKeywords(
    lecture.content, 
    keywords?.main || []
  )

  return (
    <div className="w-full min-h-screen flex flex-col">

      <header className="h-16 bg-gray-800 text-white p-4">
        {/* Шапка сайта */}
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">

        <motion.div initial={{opacity: 0,y: -20}} animate={{opacity:1, y:0}}className="mb-8">
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Предмет:</span> {subject.title}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Группа:</span> {group.title}
            </p>
            <p className="text-lg flex items-center">
              <span className="font-semibold mr-2">Преподаватель:</span> 
              <Avatar className="mr-2">
                {teacher.avatar ? (
                  <AvatarImage src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} />
                ) : (
                  <AvatarFallback>
                    {getInitials(teacher.name, teacher.surname)}
                  </AvatarFallback>
                )}
              </Avatar>
              {teacher.name} {teacher.surname}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Кабинет:</span> {subject.classroom}
            </p>
          </div>
        </motion.div>
        <Separator className="my-8" />
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}} className="text-center mb-12">
          <h1 className="text-6xl font-semibold mb-6">{lecture.title}</h1>
          <p className="text-2xl font-semibold text-gray-600">{lecture.date}</p>
        </motion.div>

        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: 0.4}} className="flex justify-center mb-12">
          <div className="w-full max-w-[60rem] h-[24rem] bg-black rounded-xl overflow-hidden">
            <video src={lecture.video} controls className="w-full h-full object-contain"/>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.6}} className="prose prose-lg max-w-none relative" ref={contentRef} onMouseUp={handleTextSelect}>
          {isSelecting && !currentUser?.is_student && selection && (
            <motion.div initial={{opacity: 0, y: 10}} animate={{ opacity: 1, y: 0 }} className="absolute z-10" style={{ top: `${selection.top - 40}px`, left: `${selection.left}px` }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={handleAddKeyword}>
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
          <div dangerouslySetInnerHTML={{__html: highlightedContent}}/>
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