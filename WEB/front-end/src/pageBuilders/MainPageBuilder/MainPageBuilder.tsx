"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'
import { tokenDecoder } from '@/src/utils/tokenDecoder/tokenDecoder'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore()
  const router = useRouter()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      console.error("Токен не найден")
      return
    }
    
    const userId = tokenDecoder(token)
    console.log(userId)

    const fetchSchedule = async () => {
      try {
        // Мок данных - заменить на реальный API
        const mockSchedule = [
          {
            id: '1',
            name: 'Понедельник',
            lessons: [
              { id: '101', title: 'Математика', startTime: '9:00', duration: 80, type: 'pair' },
              { id: '102', title: 'Физика', startTime: '11:00', duration: 40, type: 'single' },
            ]
          }
        ]
        // setSchedule(mockSchedule)
      }
      catch(error){
        console.error('Ошибка загрузки расписания:', error)
      }
      finally{
        setLoading(false)
      }
    }

    fetchSchedule()
  },[user])

  const calculateEndTime = (startTime:any,duration:any) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`
  }

  return (
    <div>MainPageBuilder</div>
  )
}

export default MainPageBuilder