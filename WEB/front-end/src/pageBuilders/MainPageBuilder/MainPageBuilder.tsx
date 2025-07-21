"use client"
import React,{useState} from 'react'
import axios from 'axios'
import { Button } from '@/src/ui/button'

const MainPageBuilder = () => {
  const getDatas = async()=>{
    try {
      const student = {
        "email": '1test@gmail.com',
        "password": '12345',
        "name": 'damirr',
        "surname": 'satimovv',
        "is_teacher": true,
      }
      const resp = await axios.post('https://anothergenback.onrender.com/auth/users',student)
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
    <div>
      MainPageBuilder
      <Button onClick={getDatas}>post</Button>
    </div>
  )
}

export default MainPageBuilder
