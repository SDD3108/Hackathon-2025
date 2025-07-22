"use client"
import React,{useState} from 'react'
import axios from 'axios'
import { Button } from '@/src/ui/button'
import MainScheduleComponent from '@/src/components/MainScheduleComponent/MainScheduleComponent'

const MainPageBuilder = () => {
  const getDatas = async()=>{
    try {
      const student = {
        email: "test@gmail.com",
        password: "1234PasswordTest.",
        name: "damir",
        surname: "satimov",
        avatar: null,
        is_teacher: false,
        is_student: false,
        is_admin: false,
        group: null,
        username: "dama"
      }
      const resp = await axios.get('https://anothergenback.onrender.com/auth/users/')
      console.log(resp);
      console.log(resp.data)
    }
    catch(error){
      if(axios.isAxiosError(error)){
        console.log(error);
        
        console.error(error.response?.data || error.message)
      }
      else{
        console.error(error)
      }
    }
  }
  return (
    <div className='w-full h-screen flex justify-between'>
      <div>
        MainPageBuilder
        <Button onClick={getDatas}>post</Button>
      </div>
      <MainScheduleComponent/>
    </div>
  )
}

export default MainPageBuilder
