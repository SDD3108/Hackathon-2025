"use client";
import React, { useState } from "react"
import { Button } from "@/src/ui/button"
import { Input } from "@/src/ui/input"
import { Label } from "@/src/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/ui/card"
// import { Eye, EyeOff } from 'lucide-react'
import useAuthenticationStore from "@/src/store/AuthenticationStore/AuthenticationStore"
import { useForm } from "react-hook-form"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/src/ui/form"
import { useRouter } from "next/navigation"

const AuthenticationFormComponent = () => {
  const router = useRouter()
  const { loading, error, signIn } = useAuthenticationStore()
  console.log(error);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = async(data)=>{
    const success = await signIn({
      email: data.email,
      password: data.password,
    })
    if(success){
      router.push("/");
      // заменить на toast
      console.log("Login successful!");
    }
  }

  return (
    <div className="w-screen h-screen bg-bgColor">
      <div className="max-w-2xl h-screen flex flex-col justify-center items-center bg-white shadow-lg pl-[4.5rem] pr-[4rem]">
        <div className="flex flex-col space-y-15 w-full">
          <div className="absolute top-4 left-4 flex items-center font-medium text-blue-500 text-lg cursor-pointer" onClick={()=>{router.push('/')}}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M17.77 3.77L16 2L6 12L16 22L17.77 20.23L9.54 12L17.77 3.77Z" fill="currentColor" />
            </svg>
            <Label className="text-lg">back</Label>
          </div>
          <div className="flex flex-col space-y-9">
            <h1 className="text-[5.5rem] font-semibold text-gray-800">Sign in</h1>
            <Label className="text-3xl text-gray-500 font-medium">Join the virtual group</Label>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-11.5">
              <FormField control={form.control} name="email"
                rules={{
                  required:"Email is required",
                  pattern:{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message:"Invalid email address",
                  },
                }}
                render={({field})=>(
                  <FormItem className="space-y-6">
                    <FormLabel className="text-xl text-gray-500 font-normal">
                      Please write your email
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="bg-secondGray rounded-sm w-full h-13 !text-lg text-mainColor" disabled={loading}/>
                    </FormControl>
                    <FormMessage className="text-red-500 mb-4" />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({field})=>(
                  <FormItem>
                    <FormLabel className="text-xl text-gray-500 font-normal">Please write your password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••••" className="bg-secondGray rounded-sm w-full h-13 !text-lg text-mainColor" disabled={loading}/>
                    </FormControl>
                    <FormMessage className="text-red-500 mb-4" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="rounded-full w-41 h-13 bg-accentColor text-xl hover:bg-blue-500" disabled={loading}>
                {loading ? "Processing..." : "Sign in"}
              </Button>
              {error && (
                <div className="text-red-500 text-center py-2">
                  {error}
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationFormComponent;
