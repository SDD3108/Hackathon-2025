'use client'
import React, { useState, useEffect } from "react"
import { Label } from "@/src/ui/label"
import { Input } from "@/src/ui/input"
import { Separator } from "@/src/ui/separator"
import { ScrollArea } from "@/src/ui/scroll-area"
import { Button } from "@/src/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/ui/dialog"
import axios from "axios"
import useAuthenticationStore from "@/src/store/AuthenticationStore/AuthenticationStore"
import { Skeleton } from "@/src/ui/skeleton"
import Image from "next/image"
import { tokenDecoder } from "@/src/utils/tokenDecoder/tokenDecoder"
import Link from "next/link"
import { toast } from "sonner"

const ProfilePageBuilder = () => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [lectures, setLectures] = useState([])
  
  const authUser = useAuthenticationStore(state => state.user)
  const token = authUser || localStorage.getItem('token')
  const userId = token ? tokenDecoder(token) : null

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const USERS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/users/`
        const LECTURES_API = `${process.env.NEXT_PUBLIC_API_URL}/api/lectures/`
        
        // Получаем данные пользователя
        const userResponse = await axios.get(USERS_API)
        const currentUser = userResponse.data.find(u => u.id === userId)
        
        if (currentUser) {
          setUser(currentUser)
          setName(currentUser.name || "")
          setSurname(currentUser.surname || "")
          setEmail(currentUser.email || "")
          setAvatar(currentUser.avatar || "")
          
          // Получаем данные группы пользователя
          if (currentUser.classId) {
            const groupMembersResponse = await axios.get(USERS_API)
            const members = groupMembersResponse.data.filter(u => 
              u.classId === currentUser.classId && u.id !== userId
            )
            setGroupMembers(members)
          }
        }
        
        // Получаем лекции
        const lecturesResponse = await axios.get(LECTURES_API)
        setLectures(lecturesResponse.data)
        
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadUserData()
    }
  }, [userId])

  const handleSaveChanges = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      
      // Формируем обновленные данные
      const updatedData = {
        ...user,
        name,
        surname,
        email,
        avatar
      }
      
      // Если введен новый пароль, добавляем его
      if (newPassword) {
        updatedData.password = newPassword
      }
      
      // Отправляем обновленные данные на сервер
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, 
        updatedData
      )
      
      // Обновляем состояние
      setUser(response.data)
      
      // Обновляем данные в хранилище аутентификации
      if (authUser && authUser.id === user.id) {
        useAuthenticationStore.getState().setUser(response.data)
      }
      
      toast.success("Profile updated successfully!")
      
      // Сбрасываем поле нового пароля
      setNewPassword('')
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-mainBlue">
        <div className="flex justify-center items-center w-full max-w-[90rem]">
          <div className="absolute w-screen h-1/2 bg-bgSecondary bottom-0"></div>
          <div className="w-1/3 min-h-[49rem] bg-white flex flex-col justify-center items-center space-y-8 py-8 px-10 pt-11 z-10">
            <Skeleton className="w-full h-[21.5rem] bg-placeholder"/>
            <div className="w-full space-y-4">
              <Skeleton className="h-8 w-1/3 bg-placeholder"/>
              <Skeleton className="w-full h-12 bg-placeholder"/>
            </div>
            <div className="w-full space-y-4">
              <Skeleton className="h-8 w-1/3 bg-placeholder"/>
              <Skeleton className="w-full h-12 bg-placeholder"/>
            </div>
            <div className="w-full space-y-4">
              <Skeleton className="h-8 w-1/3 bg-placeholder"/>
              <Skeleton className="w-full h-12 bg-placeholder"/>
            </div>
          </div>
          <div className="w-2/4 max-h-[49rem] bg-white flex flex-col justify-center items-center pb-13 px-12.5 pt-11 z-10 ml-12">
            <Skeleton className="w-full h-12 bg-placeholder mb-8"/>
            <div className="w-full space-y-4 mb-8">
              <Skeleton className="h-8 w-1/3 bg-placeholder"/>
              <Skeleton className="w-full h-44 bg-placeholder"/>
            </div>
            <div className="w-full space-y-4">
              <Skeleton className="h-8 w-1/3 bg-placeholder"/>
              <Skeleton className="w-full h-44 bg-placeholder"/>
            </div>
            <Skeleton className="w-1/4 h-12 bg-buttonColor mt-14"/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center bg-mainBlue relative py-5 md:py-20">
      <div 
        className="absolute top-5 left-5 flex items-center space-x-2 cursor-pointer z-20"
        onClick={() => window.history.back()}
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.0592 7.22587L30.6667 3.83337L11.5 23L30.6667 42.1667L34.0592 38.7742L18.285 23L34.0592 7.22587Z" fill="white"/>
        </svg>
        <Label className="font-medium text-xl md:text-3xl text-white">back</Label>
      </div>

      <div className="absolute w-full h-1/2 bg-bgSecondary bottom-0"></div>

      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-[90rem] px-4 mt-16 md:mt-0">
        {/* Левая колонка - профиль пользователя */}
        <div className="w-full md:w-1/2 lg:w-1/3 max-h-[49rem] h-auto bg-white flex flex-col justify-center items-center space-y-6 py-5.5 px-4 md:px-8 lg:pr-10 z-10 mb-8 md:mb-0">
          <div className="relative w-full max-w-[20rem] h-[13rem] md:h-[21.5rem] bg-placeholder cursor-pointer hover:bg-placeholder/90">
            {avatar ? (
              <Image 
                src={avatar} 
                alt="User Avatar" 
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl font-bold text-gray-600">
                {name?.[0]}{surname?.[0]}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white/80 rounded-full p-1 md:p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
          
          <div className="w-full flex flex-col space-y-3">
            <Label className="text-xl md:text-2xl text-textDark block">Your name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              type="text" 
              placeholder="Enter your name" 
              className="w-full h-10 md:h-13 bg-placeholder rounded-sm text-sm md:text-base"
            />
          </div>
          
          <div className="w-full flex flex-col space-y-3">
            <Label className="text-xl md:text-2xl text-textDark block">Your surname</Label>
            <Input 
              value={surname} 
              onChange={(e) => setSurname(e.target.value)} 
              type="text" 
              placeholder="Enter your surname" 
              className="w-full h-10 md:h-13 bg-placeholder rounded-sm text-sm md:text-base"
            />
          </div>
          
          <div className="w-full flex flex-col space-y-3">
            <Label className="text-xl md:text-2xl text-textDark block">Your email</Label>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="Enter your email" 
              className="w-full h-10 md:h-13 bg-placeholder rounded-sm text-sm md:text-base"
            />
          </div>
          
          <div className="w-full flex flex-col space-y-3">
            <Label className="text-xl md:text-2xl text-textDark mb-3 md:mb-4 block">Change Password</Label>
            <Input 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              type="password" 
              placeholder="Enter new password" 
              className="w-full h-10 md:h-13 bg-placeholder rounded-sm text-sm md:text-base"
            />
          </div>
        </div>
        
        {/* Правая колонка - дополнительная информация */}
        <div className="w-full md:w-1/2 lg:w-2/3 max-h-[49rem] h-auto bg-white flex flex-col justify-center items-center py-4 px-4 md:px-10 lg:px-12.5 z-10 md:ml-6 lg:ml-12">
          <Dialog>
            <DialogTrigger className="w-full h-10 md:h-13 cursor-pointer bg-placeholder rounded-sm text-start text-sm md:text-base text-textGray font-medium px-3 md:px-4 mb-6 md:mb-7.5">
              Agreement & Policy
            </DialogTrigger>
            <DialogContent className="w-full md:!w-3/4 lg:!w-1/2 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agreement & Policy</DialogTitle>
                <DialogDescription className="text-textLightgray text-sm md:text-base">
                  {/* Содержимое соглашения */}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          <div className="w-full flex flex-col space-y-4 md:space-y-9.5">
            <Label className="text-xl md:text-2xl font-medium text-textDark block">My group members</Label>
            <ScrollArea className="w-full h-32 md:h-44 bg-placeholder rounded-sm p-3 md:p-4 text-textGray">
              <div className="space-y-2">
                {groupMembers.length > 0 ? (
                  groupMembers.map((member, index) => (
                    <div key={index}>
                      <Label>{member.name} {member.surname}</Label>
                      <Separator/>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">No group members found</div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <div className="w-full flex flex-col space-y-4 md:space-y-9.5 mt-6 md:mt-9.5">
            <Label className="text-xl md:text-2xl font-medium text-textDark block">Saved lectures</Label>
            <ScrollArea className="w-full h-32 md:h-44 rounded-sm bg-placeholder p-3 md:p-4">
              <div className="space-y-2 text-textGray text-sm md:text-base">
                {lectures.length > 0 ? (
                  lectures.slice(0, 5).map((lecture, index) => (
                    <Link key={index} href={`/lecture/${lecture.id}`}>
                      <Label>{lecture.title}</Label>
                      <Separator/>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4">No saved lectures</div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <div className="w-full flex justify-end mt-8 md:mt-14">
            <Button 
              className="rounded-full w-full md:w-1/2 lg:w-1/4 h-10 md:h-13 bg-buttonColor text-base md:text-xl hover:bg-buttonColor/90 text-white"
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageBuilder;