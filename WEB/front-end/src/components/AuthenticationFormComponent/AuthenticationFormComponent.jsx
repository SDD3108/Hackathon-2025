"use client"
import React, { useState } from 'react';
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";
import { Label } from "@/src/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/ui/tabs";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Github,
  Chrome
} from 'lucide-react';

const AuthModule = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = (e)=>{
    e.preventDefault()
    console.log('Login submitted:', loginData)
  };

  const handleRegisterSubmit = (e)=>{
    e.preventDefault();
    console.log('Register submitted:', registerData);
  };

  return (
    <div className="min-h-screen bg-[url('/SignIn/blurry-gradient-haikei-1.svg')] flex justify-center items-center">
      <Card className="px-7 py-10 min-w-[32rem] border-glassBg !bg-transparent rounded-4xl relative">
        <CardHeader className='gap-[1rem] text-newWhite sticky z-2'>
          <CardTitle className="text-4xl font-medium">Login</CardTitle>
          <CardDescription className='text-base text-newWhite'>The truth comes in discussions</CardDescription>
        </CardHeader>
        <CardContent className='sticky z-2'>
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className='flex flex-col relative'>
              <div className='flex'>
                <div className='min-w-[5rem] pl-4 flex items-center text-newWhite rounded-t-3xl rounded-r-none bg-firstBlue'>Email</div>
                <Input id="login-email" className="rounded-t-3xl rounded-l-none border-none bg-firstBlue rounded-b-none" name="email" type="email" placeholder="student@example.com" value={loginData.email} onChange={handleLoginChange} required/>
              </div>
              <div className='flex'>
                <div className='min-w-[5rem] pl-4 flex items-center text-newWhite rounded-b-3xl !rounded-r-none bg-firstBlue'>Password</div>
                <Input id="login-password" className="rounded-b-3xl !rounded-l-none !rounded-t-none border-none bg-firstBlue" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginData.password} onChange={handleLoginChange} required/>      
              </div>
              <div className='absolute top-1/2 w-[90%] h-px bg-secondBlue left-1/20'></div>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full py-6 text-base bg-thirdBlue rounded-full hover:bg-blue-800">
                Log In
              </Button>
            </div>
          </form>
        </CardContent>
        <div className='absolute top-0 left-0 z-1 bg-glassBg w-full h-full shadow-custom rounded-4xl'></div>
      </Card>
    </div>
  );
};

export default AuthModule;