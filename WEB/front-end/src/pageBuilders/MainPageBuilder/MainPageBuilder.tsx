"use client"
import React,{ useState,useEffect} from 'react'
import axios from 'axios'
import { Button } from '@/src/ui/button'
import MainScheduleComponent from '@/src/components/MainScheduleComponent/MainScheduleComponent'
import { tokenDecoder } from '@/src/utils/tokenDecoder/tokenDecoder'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      console.error("Токен не найден")
    }
    const userId = tokenDecoder(token)
    console.log(userId)
  },[user])
  

  return (
    <div className='w-full h-screen flex justify-between'>
      <div>
        MainPageBuilder
      </div>
      <MainScheduleComponent/>
    </div>
  )
}

export default MainPageBuilder
