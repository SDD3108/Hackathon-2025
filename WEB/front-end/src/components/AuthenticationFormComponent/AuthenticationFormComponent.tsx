"use client"
import React from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// maybe confirm password

const signupschema = z.object({
  name: z.string().min(4,'Name must be at least 4 characters long'),
  surname:z.string().min(4,'Surname must be at least 4 characters long'),
  age: z.number().min(18,'You must be at least 18 years old').max(50,'You must be under 50 years of age'),
  grade: z.string().min(1,'Grade is required').max(4,'Your grade cannot be higher than 4'),
  email: z.email('Invalid email address'),
  password: z.string().min(8,'Password must be at least 8 characters long'),
})

const signinschema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8,'Password must be at least 8 characters long'),
})

const AuthenticationFormComponent = () => {
  return (
    <div>
      
    </div>
  )
}

export default AuthenticationFormComponent
