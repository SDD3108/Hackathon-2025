'use client'
import React, { useState, useEffect } from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/src/ui/button"
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/src/ui/form"
import { Input } from "@/src/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/src/ui/card"
import { Switch } from "@/src/ui/switch"
import { Loader2 } from "lucide-react"
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import Link from 'next/link'
import { Popover,PopoverContent,PopoverTrigger } from "@/src/ui/popover"
import { Calendar } from "@/src/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { format } from "date-fns"

// валидация для регистрации
export const signupSchema = z.object({
  name:z.string().min(4,'Name must be at least 4 characters long'),
  surname:z.string().min(4,'Surname must be at least 4 characters long'),
  birthdate:z.date({required_error:'Birthdate is required',invalid_type_error:'Invalid date'}),
  grade:z.string().min(1,'Grade is required').max(4,'Your grade cannot be higher than 4'),
  email:z.email('Invalid email address'),
  password:z.string().min(8,'Password must be at least 8 characters long'),
  terms:z.boolean().refine((val) => val,"You must accept the terms and conditions")
})

// валидация для логина
export const signinSchema = z.object({
  email:z.email('Invalid email address'),
  password:z.string().min(8,'Password must be at least 8 characters long'),
  remember:z.boolean(),
})

const AuthenticationFormComponent = ({type})=>{
  const { signUp,signIn,loading,error } = useAuthenticationStore()
  const [flipped,setFlipped] = useState(false)
  const [mousePosition,setMousePosition] = useState({x:0, y:0})
  const [activeIndex,setActiveIndex] = useState(0)
  const backgrounds = [
    "radial-gradient(circle at center, rgba(0,151,169,0.05) 0%, rgba(255,255,255,0) 70%)",
    "linear-gradient(135deg, rgba(0,151,169,0.03) 0%, rgba(255,255,255,0) 50%)",
    "conic-gradient(from 90deg at 50% 50%, rgba(0,151,169,0.02) 0%, rgba(255,255,255,0) 50%)"
  ]

  useEffect(()=>{
    const interval = setInterval(()=>{
      setActiveIndex((prev)=> (prev + 1) % backgrounds.length)
    },8000)
    return ()=> clearInterval(interval)
  },[])

  const handleMouseMove = (e)=>{
    setMousePosition({x: e.clientX,y: e.clientY})
  }

  const form = useForm({
    resolver: zodResolver(type == 'signup' ? signupSchema : signinSchema),
    defaultValues: type == 'signup' ? {
      name: '',
      surname: '',
      birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      grade: '',
      email: '',
      password: '',
      terms: false
    } : {
      email: '',
      password: '',
      remember: false
    }
  })

  const onSubmit = async(data)=>{
    const success = type == 'signup' ? await signUp(data) : await signIn(data)
    if(success){
      setFlipped(true)
      setTimeout(()=> setFlipped(false),2000)
    }
  }

  const parallaxX = (mousePosition.x / window.innerWidth) * 30 - 15
  const parallaxY = (mousePosition.y / window.innerHeight) * 30 - 15

  // нужны для создания 5 элементов для анимации
  const animationEmptyArray = [{},{},{},{},{}]
  const animationVectorArray = [{},{},{}]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4 relative overflow-hidden" onMouseMove={handleMouseMove}>
      <motion.div className="absolute inset-0 z-0 transition-all duration-1000 ease-out" animate={{background: backgrounds[activeIndex]}} style={{background: backgrounds[0],transform:`translate(${parallaxX}px,${parallaxY}px)`}}/>
      {animationEmptyArray.map((_, index) => (
        <motion.div key={index} className="absolute rounded-full opacity-10" style={{
          background:"radial-gradient(circle, #0097A9 0%, transparent 70%)",
          width:`${100 + index * 80}px`,
          height:`${100 + index * 80}px`,
          top:`${10 + index * 15}%`,
          left:`${index * 20}%`,
        }}
        animate={{
          y:[0, 20, 0],
          x:[0, index % 2 == 0 ? 15 : -15, 0],
          scale:[1, 1.05, 1]
        }}
        transition={{
          duration:5 + index,
          repeat: Infinity,
          ease:"easeInOut"
        }}/>
      ))}
      <AnimatePresence>
        {flipped ? (
          <motion.div initial={{rotateY:90,opacity: 0}} 
            animate={{ 
              rotateY: 0, 
              opacity: 1,
              scale: [0.95, 1.05, 1]
            }} 
            exit={{rotateY: -90,opacity: 0}} transition={{duration: 0.5,ease:"easeInOut"}}
            className="w-full max-w-md z-10">
            <Card className="bg-white/90 backdrop-blur-sm border border-cyan-100 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 z-0" />
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-cyan-700">Success</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <motion.div animate={{scale:[1,1.2,1],rotate:[0,5, -5,0],y:[0, -10,0]}} transition={{duration: 1.5,repeat: Infinity}} className="text-5xl mb-4 text-cyan-600">
                  ✨
                </motion.div>
                <p className="text-gray-700">{type == 'signup' ? 'Your account has been created!' : 'You are now logged in!'}</p>
              </CardContent>
              <CardFooter className="flex justify-center relative z-10">
                <motion.div animate={{scale:[0.8,1,0.8]}} transition={{repeat: Infinity,duration:2}} className="w-4 h-4 rounded-full bg-cyan-500"/>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{scale: 0.95,opacity:0, y:20}} animate={{scale:1,opacity:1, y:0}} transition={{duration:0.5,type:"spring",damping: 10}}className="w-full max-w-md z-10">
            <Card className="bg-white/90 backdrop-blur-sm border border-cyan-100 rounded-2xl overflow-hidden shadow-2xl relative" whileHover={{y: -5}} transition={{duration:0.3}}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 z-0"></div>
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 transform rotate-45 origin-top-right" />
              </div>
              <CardHeader className="border-b border-cyan-100 relative z-10">
                <CardTitle className="text-center text-2xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">{type == 'signup' ? 'CREATE ACCOUNT' : 'ACCESS PORTAL'}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 relative z-10">
                {error && (
                  <motion.div initial={{opacity:0,y: -10}} animate={{opacity:1, y:0}}className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-center">{error}</motion.div>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {type == 'signup' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                              <FormLabel className="text-gray-700">Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nazar" 
                                  {...field} 
                                  className="bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                              </FormControl>
                              <FormMessage className="text-cyan-600" />
                            </FormItem>
                          )}/>
                          <FormField control={form.control} name="surname" render={({field})=>(
                            <FormItem>
                              <FormLabel className="text-gray-700">Surname</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Bekmuratov" 
                                  {...field} 
                                  className="bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                              </FormControl>
                              <FormMessage className="text-cyan-600" />
                            </FormItem>
                          )}/>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField control={form.control} name="birthdate" render={({field})=>(
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-gray-700">Birthdate</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} id='date' className={cn("bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-left font-normal",!field.value && "text-gray-500")}>
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border border-gray-300">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date)=>date > new Date() || date < new Date("1900-01-01")} initialFocus className="bg-white text-gray-800"/>
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="text-cyan-600" />
                            </FormItem>
                          )}/>
                          
                          <FormField control={form.control} name="grade" render={({field})=>(
                            <FormItem>
                              <FormLabel className="text-gray-700">Grade</FormLabel>
                              <FormControl>
                                <Input placeholder="1 course" {...field} className="bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
                              </FormControl>
                              <FormMessage className="text-cyan-600" />
                            </FormItem>
                          )}/>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-4">
                      <FormField control={form.control} name="email" render={({field})=>(
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" className="bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" {...field}/>
                          </FormControl>
                          <FormMessage className="text-cyan-600" />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="password" render={({field})=>(

                        <FormItem>
                          <FormLabel className="text-gray-700">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-white border-gray-300 text-gray-800 hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
                          </FormControl>
                          <FormMessage className="text-cyan-600" />
                        </FormItem>
                      )}/>
                    </div>
                    
                    {type == 'signup' ? (
                      <FormField control={form.control} name="terms" render={({field})=>(
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-cyan-200 p-3 bg-cyan-50/50">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-600"/>
                          </FormControl>
                          <FormDescription className="text-gray-700">I accept the <span className="text-cyan-600 underline">terms and conditions</span></FormDescription>
                        </FormItem>
                      )}/>
                    ) : (
                      <FormField control={form.control} name="remember" render={({field})=>(
                        <FormItem className="flex items-center space-x-3">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-600"/>
                          </FormControl>
                          <FormLabel className="!mt-0 text-gray-700">Remember me</FormLabel>
                        </FormItem>
                      )}/>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 relative overflow-hidden" disabled={loading}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                      {loading ? (
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat: Infinity}} className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {type == 'signup' ? 'Creating Account...' : 'Signing In...'}
                        </motion.div>
                      ) : (
                        <motion.div whileHover={{scale:1.05}} className="flex items-center justify-center">
                          {type == 'signup' ? 'CREATE ACCOUNT' : 'ACCESS SYSTEM'}
                        </motion.div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="border-t border-cyan-100 py-6 relative z-10">
                <p className="text-center text-gray-600 w-full">
                  {type == 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <Link href={type == 'signup' ? '/signin' : '/signup'} className="ml-1 text-cyan-600 hover:text-cyan-700 underline underline-offset-4">{type == 'signup' ? 'Sign In' : 'Sign Up'}</Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {animationVectorArray.map((vector,index)=>(
        <motion.div key={`accent-${index}`} className="absolute rounded-lg opacity-20 z-0" 
          style={{
            background:"linear-gradient(45deg, #0097A9, #00BCD4)",
            width:`${60 + index * 40}px`,
            height:`${60 + index * 40}px`,
            top:`${15 + index * 25}%`,
            right:`${index * 15}%`,
            rotate:`${index * 45}deg`,
          }}
          animate={{y:[0,15,0],rotate:[index * 45, index * 45 + 10, index * 45],borderRadius:['20%','30%','20%']}}
          transition={{
            duration: 4 + index,
            repeat:Infinity,
            ease:"easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default AuthenticationFormComponent

