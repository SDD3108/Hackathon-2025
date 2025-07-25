"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import { Skeleton } from '@/src/ui/skeleton'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import { User } from 'lucide-react'
import { Label } from '@/src/ui/label'

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore()
  const router = useRouter()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeSlots = Array.from({length: 9},(_, i)=> `${8 + i}:00`)
  const isAuthenticated = ()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if(user !== ''){
      return token && user
    }
    return 'Error'
  }
  useEffect(()=>{
    if(!isAuthenticated()){
      setLoading(false)
      return
    }
    const mockSchedule = [
      {
        day: 'Monday',
        lessons: [
          { 
            id: '101', 
            title: 'Математика', 
            startTime: '9:00', 
            subject: { typeOfSubject: 2 }
          },
          { 
            id: '102', 
            title: 'Физика', 
            startTime: '11:00', 
            subject: { typeOfSubject: 1 }
          },
        ]
      },
      {
        day: 'Tuesday',
        lessons: [
          { 
            id: '201', 
            title: 'Программирование', 
            startTime: '10:00', 
            subject: { typeOfSubject: 2 }
          },
        ]
      },
    ]
    const timer = setTimeout(()=>{
      setSchedule(mockSchedule)
      setLoading(false)
    },1000)
    
    return () => clearTimeout(timer)
  },[user])

  const getLessonDuration = (type)=>{
    return type == 1 ? 40 : 80
  }
  // const calculateEndTime = (startTime,duration)=>{
  //   const [hours, minutes] = startTime.split(':').map(Number)
  //   const totalMinutes = hours * 60 + minutes + duration
  //   const endHours = Math.floor(totalMinutes / 60)
  //   const endMinutes = totalMinutes % 60
  //   return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`
  // }
  const findLesson = (day,timeSlot)=>{
    const daySchedule = schedule.find((d)=> d.day == day)
    if(!daySchedule){
      return null
    }
    
    return daySchedule.lessons.find((lesson)=>{
      const lessonHour = parseInt(lesson.startTime.split(':')[0])
      const slotHour = parseInt(timeSlot.split(':')[0])
      return lessonHour == slotHour
    })
  }
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
  // if not authenticated
  if(!isAuthenticated() && !loading){
    return (
      <div className="w-full min-h-screen bg-white">
      
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-mainBlue">
      <header className="flex justify-between min-h-16 text-white p-8 border-b bg-white shadow-xl">
        <div className='flex space-x-3'>
          <div></div>
          <Label className='text-mainBlue text-3xl font-semibold flex gap-0'>Lec<span className='text-black'>Sure</span></Label>
        </div>        
        <div className='w-16 h-16 bg-newWhite rounded-full cursor-pointer flex justify-center items-center' onClick={()=>router.push('/profile')}>
          <User width={40} color='#000000' className='h-[2.5rem]' strokeWidth='1' />
        </div>
      </header>

      <div className="flex-1 flex justify-center items-start pt-18 px-4">
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-t-sm shadow-lg p-6 h-screen"
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
                      {/* тут должно быть написано начало и конец занятия типо во сколько начинается и во сколько заканчивается */}
                      {/* {lesson.startTime} - {calculateEndTime(lesson.startTime, duration)} */}
                    </div>
                    
                    {daysOfWeek.map((day, dayIndex)=>{
                      const lesson = findLesson(day, timeSlot);
                      if (lesson && timeIndex > 0) {
                        const prevTimeSlot = timeSlots[timeIndex - 1];
                        const prevLesson = findLesson(day, prevTimeSlot);
                        if (prevLesson && prevLesson.id == lesson.id) {
                          return null;
                        }
                      }
                      
                      const duration = lesson ? getLessonDuration(lesson.subject.typeOfSubject) : 0;
                      const heightClass = duration == 80 ? 'h-24' : 'h-16';
                      const bgClass = lesson ? (duration == 80 ? 'bg-blue-100' : 'bg-blue-50') : 'bg-gray-50';
                      
                      return (
                        <div key={dayIndex} className={`col-span-1 p-2 ${bgClass} ${heightClass} border rounded-md`}>
                          {lesson && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="h-full flex flex-col">
                              <Button variant="ghost" className="h-full text-left flex flex-col justify-center cursor-pointer" onClick={() => router.push(`/lecture/${lesson.id}`)}>
                                <span className="font-medium">{lesson.title}</span>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      );
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