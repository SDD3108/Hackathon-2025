"use client"
import React, { useState } from 'react'
import { Button } from "@/src/ui/button"
import { Input } from "@/src/ui/input"
import { Label } from "@/src/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/ui/card"
import { Eye, EyeOff } from 'lucide-react'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/ui/form'
import { useRouter } from 'next/navigation'

const AuthenticationFormComponent = ()=>{
  const router = useRouter()
  const { loading, error, signIn } = useAuthenticationStore()
 
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async(data)=>{
    const success = await signIn({
      email: data.email,
      password: data.password
    })
    if(success){
      router.push('/')
      // заменить на toast 
      console.log("Login successful!")
    }
  }

  return (
    <div className="min-h-screen bg-[url('/SignIn/blurry-gradient-haikei-1.svg')] bg-no-repeat flex justify-center items-center">
      <Card className="px-7 py-10 min-w-[32rem] border-glassBg !bg-transparent rounded-4xl relative">
        <CardHeader className='gap-[1rem] text-newWhite sticky z-2'>
          <CardTitle className="text-4xl font-medium">Login</CardTitle>
          <CardDescription className='text-base text-newWhite'>
            The truth comes in discussions
          </CardDescription>
        </CardHeader>
        
        <CardContent className='sticky z-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2rem]">
              <div className='relative'>
                <FormField control={form.control} name="email"
                  rules={{
                    required:"Email is required",
                    pattern:{value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message: "Invalid email address"},
                  }}
                  render={({field})=>(
                    <FormItem>
                      <div className='flex flex-col relative'>
                        <div className='flex'>
                          <div className='min-w-[5rem] pl-4 flex items-center text-newWhite rounded-t-3xl rounded-r-none bg-firstBlue'>
                            <FormLabel>Email</FormLabel>
                          </div>
                          <FormControl>
                            <Input {...field} id="login-email" className="rounded-t-3xl text-3xl !text-firstGray rounded-l-none border-none bg-firstBlue rounded-b-none focus-visible:!ring-0 focus-visible:!border-none focus-visible:!ring-transparent" placeholder="student@gmail.com" disabled={loading}/>
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className="text-red-400 mt-1" />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="password"
                  rules={{ 
                    required:"Password is required",
                    minLength:{
                      value:6,
                      message:"Password must be at least 6 characters",
                    }
                  }}
                  render={({field})=>(
                    <FormItem>
                      <div className='flex flex-col relative'>
                        <div className='flex'>
                          <div className='min-w-[5rem] pl-4 flex items-center text-newWhite rounded-b-3xl !rounded-r-none bg-firstBlue'>
                            <FormLabel>Password</FormLabel>
                          </div>
                          <FormControl>
                            <Input {...field} id="login-password" type='text' className="rounded-b-3xl text-3xl !text-firstGray relative !rounded-l-none !rounded-t-none border-none bg-firstBlue focus-visible:!ring-0 focus-visible:!border-none focus-visible:!ring-transparent" placeholder="••••••••" disabled={loading}/>
                          </FormControl> 
                        </div>
                      </div>
                      <FormMessage className="text-red-400 mt-1" />
                    </FormItem>
                )}/>
                <div className='absolute top-1/2 w-[90%] h-px bg-secondBlue left-1/20'></div>
              </div>
              <div className="">
                <Button type="submit" className="w-full py-6 text-base bg-thirdBlue rounded-full hover:bg-blue-800"disabled={loading}>{loading ? "Processing..." : "Log In"}</Button>
              </div>
              {error && (
                <div className="text-red-400 text-center py-2">
                  {error}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <div className='absolute top-0 left-0 z-1 bg-glassBg w-full h-full shadow-custom rounded-4xl'></div>
      </Card>
    </div>
  )
}

export default AuthenticationFormComponent