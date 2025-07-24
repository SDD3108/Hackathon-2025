"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore()
  const router = useRouter()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Дни недели для отображения
  const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
  
  // Временные слоты (с 8:00 до 17:00)
  const timeSlots = Array.from({length: 9},(_, i)=> `${8 + i}:00`)

  useEffect(()=>{
    // Мок данных для расписания
    const mockSchedule = [
      {
        day: 'Monday',
        lessons: [
          { 
            id: '101', 
            title: 'Математика', 
            startTime: '9:00', 
            subject: { typeOfSubject: 2 } // Пара (80 минут)
          },
          { 
            id: '102', 
            title: 'Физика', 
            startTime: '11:00', 
            subject: { typeOfSubject: 1 } // Одиночный (40 минут)
          },
        ]
      },
      {
        day: 'ВТ',
        lessons: [
          { 
            id: '201', 
            title: 'Программирование', 
            startTime: '10:00', 
            subject: { typeOfSubject: 2 }
          },
        ]
      },
      // ... другие дни
    ]
    setSchedule(mockSchedule)
    setLoading(false)
  }, [user])

  // Определение длительности занятия
  const getLessonDuration =(type)=>{
    return type == 1 ? 40 : 80
  }

  // Расчет времени окончания занятия
  const calculateEndTime =(startTime,duration)=>{
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`
  }

  // Поиск занятия в определенный день и время
  const findLesson = (day,timeSlot)=>{
    const daySchedule = schedule.find((d) => d.day == day)
    if(!daySchedule){
      return null
    }
    return daySchedule.lessons.find((lesson)=>{
      const lessonHour = parseInt(lesson.startTime.split(':')[0])
      const slotHour = parseInt(timeSlot.split(':')[0])
      return lessonHour == slotHour
    })
  }
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="h-16 bg-gray-800 text-white p-4">
        {/* Шапка сайта */}
      </header>

      <div className="flex-1 flex justify-center items-start pt-10 px-4">
        <div className="w-full max-w-6xl">
          {loading ? (
            <div className="text-center py-10">Загрузка расписания...</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Расписание занятий</h2>
              
              {/* Сетка расписания */}
              <div className="grid grid-cols-8 gap-1">
                <div className="col-span-1"></div>
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="col-span-1 text-center font-semibold py-2 bg-gray-100" >
                    {day}
                  </div>
                ))}
                
                {/* Строки с занятиями */}
                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeIndex}>
                    {/* Временной слот */}
                    <div className="col-span-1 text-right pr-2 py-3 text-sm text-gray-500">
                      {timeSlot}
                    </div>
                    
                    {/* Занятия для каждого дня */}
                    {daysOfWeek.map((day, dayIndex)=>{
                      const lesson = findLesson(day,timeSlot)
                      // Пропускаем ячейки, если занятие длинное и уже отображено в предыдущей строке
                      if(lesson && timeIndex > 0){
                        const prevTimeSlot = timeSlots[timeIndex - 1]
                        const prevLesson = findLesson(day, prevTimeSlot)
                        if(prevLesson && prevLesson.id == lesson.id){
                          return null
                        }
                      }
                      
                      const duration = lesson ? getLessonDuration(lesson.subject.typeOfSubject) : 0
                      const heightClass = duration == 80 ? 'h-24' : 'h-16'
                      const bgClass = lesson ? (duration == 80 ? 'bg-blue-100' : 'bg-blue-50') : 'bg-gray-50'
                      
                      return (
                        <div key={dayIndex} className={`col-span-1 p-2 ${bgClass} ${heightClass} border rounded-md`}>
                          {lesson && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="h-full flex flex-col">
                              <Button variant="ghost" className="h-full text-left flex flex-col justify-center" onClick={() => router.push(`/lecture/${lesson.id}`)}>
                                <span className="font-medium">{lesson.title}</span>
                                <span className="text-xs text-gray-500 mt-1">
                                  {lesson.startTime} - {calculateEndTime(lesson.startTime, duration)}
                                </span>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainPageBuilder