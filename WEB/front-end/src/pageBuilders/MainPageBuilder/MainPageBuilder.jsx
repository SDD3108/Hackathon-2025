"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import { Skeleton } from '@/src/ui/skeleton'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import axios from 'axios'
import Header from '@/src/common/header/Header'

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore()
  const router = useRouter()
  const [schedules, setSchedules] = useState([])
  const [subjects, setSubjects] = useState([])
  const [lectures, setLectures] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeSlots = Array.from({length: 9}, (_, i) => `${8 + i}:00`)
  
  // Проверка аутентификации
  const isAuthenticated = ()=>{
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') && user
    }
    return false
  }

  // Функция для получения данных с API
  const fetchData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL
      
      // Создаем экземпляр Axios с базовым URL и заголовками
      const api = axios.create({
        baseURL: API_URL,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      // Параллельная загрузка данных
      const [
        { data: schedulesData },
        { data: subjectsData },
        { data: lecturesData },
        { data: groupsData }
      ] = await Promise.all([
        api.get('/api/schedules'),
        api.get('/api/subjects'),
        api.get('/api/lectures'),
        api.get('/api/groups')
      ])

      // Сохранение данных в состояние
      setSchedules(schedulesData)
      setSubjects(subjectsData)
      setLectures(lecturesData)
      setGroups(groupsData)
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(isAuthenticated()){
      router.push('/signin')
      return
    }
    
    fetchData()
  }, [user])

  // Получение продолжительности занятия
  const getLessonDuration = (isDouble) => {
    return isDouble ? 80 : 40
  }

  // Расчет времени окончания занятия
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`
  }

  // Поиск занятия для конкретного дня и времени
  const findScheduleItem = (day, timeSlot) => {
    return schedules.find(item => 
      item.dayOfWeek === day && 
      item.startTime === timeSlot
    )
  }

  // Получение информации о предмете
  const getSubjectInfo = (scheduleItem) => {
    if (!scheduleItem) return null
    return subjects.find(subject => subject.id === scheduleItem.subjectId)
  }

  // Получение информации о лекции
  const getLectureInfo = (scheduleItem) => {
    if (!scheduleItem) return null
    return lectures.find(lecture => lecture.id === scheduleItem.lectureId)
  }

  // Получение информации о группе
  const getGroupInfo = (scheduleItem) => {
    if (!scheduleItem) return null
    return groups.find(group => group.id === scheduleItem.classId)
  }

  // Рендер скелетона загрузки
  const renderSkeleton = () => (
    <div className="w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
        </h2>
        
        <div className="grid grid-cols-8 gap-1">
          <div className="col-span-1"></div>
          {daysOfWeek.map((_, index) => (
            <div key={index} className="col-span-1 text-center py-2">
              <Skeleton className="h-6 w-full mx-1" />
            </div>
          ))}
          
          {timeSlots.map((_, timeIndex) => (
            <React.Fragment key={timeIndex}>
              <div className="col-span-1 text-right pr-2 py-3">
                <Skeleton className="h-4 w-12 float-right" />
              </div>
              
              {daysOfWeek.map((_, dayIndex) => {
                const heightClass = timeIndex % 3 === 0 ? 'h-24' : 'h-16';
                return (
                  <div key={dayIndex} className={`col-span-1 p-2 ${heightClass}`}>
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  )

  // Если не аутентифицирован
  if(!isAuthenticated() && !loading){
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-mainBlue">
      <Header/>
      <div className="flex-1 flex justify-center items-start px-4 py-8">
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Расписание занятий</h2>
              
              <div className="grid grid-cols-8 gap-1">
                <div className="col-span-1"></div>
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="col-span-1 text-center font-semibold py-2 bg-gray-100">
                    {day}
                  </div>
                ))}
                
                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeIndex}>
                    <div className="col-span-1 text-right pr-2 py-3 text-sm text-gray-500">
                      {timeSlot}
                    </div>
                    
                    {daysOfWeek.map((day, dayIndex) => {
                      const scheduleItem = findScheduleItem(day, timeSlot)
                      const subject = scheduleItem ? getSubjectInfo(scheduleItem) : null
                      const lecture = scheduleItem ? getLectureInfo(scheduleItem) : null
                      const group = scheduleItem ? getGroupInfo(scheduleItem) : null
                      
                      // Пропускаем ячейки, если занятие длинное и уже отображено
                      if (scheduleItem && timeIndex > 0) {
                        const prevTimeSlot = timeSlots[timeIndex - 1]
                        const prevScheduleItem = findScheduleItem(day, prevTimeSlot)
                        if (prevScheduleItem && prevScheduleItem.id === scheduleItem.id) return null
                      }
                      
                      const duration = scheduleItem ? getLessonDuration(scheduleItem.isDouble) : 0
                      const heightClass = duration === 80 ? 'h-24' : 'h-16'
                      const bgClass = scheduleItem ? (duration === 80 ? 'bg-blue-100' : 'bg-blue-50') : 'bg-gray-50'
                      
                      return (
                        <div 
                          key={dayIndex} 
                          className={`col-span-1 p-2 ${bgClass} ${heightClass} border rounded-md transition-all hover:shadow-sm`}
                        >
                          {scheduleItem && lecture && group && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="h-full flex flex-col"
                            >
                              <Button 
                                variant="ghost" 
                                className="h-full text-left flex flex-col justify-between p-2 hover:bg-transparent"
                                onClick={() => router.push(`/lecture/${lecture.id}`)}
                              >
                                <div>
                                  <span className="font-medium text-sm block mb-1 text-gray-800">
                                    {lecture.title}
                                  </span>
                                  <span className="text-xs text-gray-500 block">
                                    {timeSlot} - {calculateEndTime(timeSlot, duration)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-end">
                                  <span className="text-[0.65rem] text-gray-400 mt-1">
                                    Ауд. {scheduleItem.classroom}
                                  </span>
                                  <span className="text-[0.65rem] text-gray-400">
                                    {group.title}
                                  </span>
                                </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPageBuilder;