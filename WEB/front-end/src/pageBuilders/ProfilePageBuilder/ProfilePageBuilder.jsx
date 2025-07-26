'use client'
import React, {useState, useEffect} from "react"
import {Label} from "@/src/ui/label"
import {Input} from "@/src/ui/input"
import {Separator} from "@/src/ui/separator"
import {ScrollArea} from "@/src/ui/scroll-area"
import {Button} from "@/src/ui/button"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/src/ui/dialog"
import axios from "axios"
import useAuthenticationStore from "@/src/store/AuthenticationStore/AuthenticationStore"
import {Skeleton} from "@/src/ui/skeleton"
import Image from "next/image"
import { getCurrentUser,getGroupMembers,getFavoriteLectures } from "@/src/hooks/GetCurrentDatasApiHook/GetCurrentDatasApiHook"

const ProfilePageBuilder = () => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [groupMembers, setGroupMembers] = useState([])
  const [favoriteLectures, setFavoriteLectures] = useState([])
  const { user } = useAuthenticationStore()
  // const [currentUser,setCurrentUser] = useState({id:'1',name:'Damir',surname:"satimov",})

  const resp = axios.get(process.env.NEXT_PUBLIC_USERS_API)
  console.log(resp);
  useEffect(() => {
    const loadUserData = async() => {
      setIsLoading(true)
      try{
        const user = await getCurrentUser()
        if(user){
          setCurrentUser(user)
          setName(user.name)
          setSurname(user.surname)
          setEmail(user.email)
          setAvatar(user.avatar)
          if(user.classId){
            const members = await getGroupMembers(user.classId)
            setGroupMembers(members)
          }
          const lectures = await getFavoriteLectures(user.id)
          setFavoriteLectures(lectures)
        }
      }catch(error){
        console.error("Error loading user data:", error)
      }finally{
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [])

  const handleSaveChanges = async()=>{
    if(!currentUser){
      return
    }
    try{
      setIsLoading(true)
      const updatedUser = {
        ...currentUser,
        name,
        email,
        password: password || currentUser.password,
        avatar
      }
      const api = process.env.NEXT_PUBLIC_USERS_API
      await axios.put(`${api}${currentUser.id}`, updatedUser)
      setCurrentUser(updatedUser)
      if(authUser && authUser.id == currentUser.id){
        useAuthenticationStore.getState().setUser(updatedUser)
      }
      alert("Profile updated successfully!")
    }catch(error){
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }finally{
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if(file){
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if(isLoading){
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
          <div className="w-2/4 min-h-[49rem] bg-white flex flex-col justify-center items-center pb-13 px-12.5 pt-11 z-10 ml-12">
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
    <div className="w-screen h-screen flex justify-center items-center bg-mainBlue">
      <div 
        className="absolute top-7.5 left-5 flex items-center space-x-2 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <svg className="w-10 h-10" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.0592 7.22587L30.6667 3.83337L11.5 23L30.6667 42.1667L34.0592 38.7742L18.285 23L34.0592 7.22587Z" fill="white"/>
        </svg>
        <Label className="font-medium text-3xl text-white">back</Label>
      </div>
      <div className="flex justify-center lg:flex-row 2xs:flex-col items-center w-full max-w-[90rem]">
        <div className="absolute w-screen h-1/2 bg-bgSecondary bottom-0"></div>
        <div className="w-1/3 min-h-[49rem] bg-white flex flex-col justify-center items-center space-y-8 py-8 px-10 pt-11 z-10">
          <div className="relative w-full h-[21.5rem] bg-placeholder cursor-pointer hover:bg-placeholder/90">
            {avatar ? (
              <Image 
                src={avatar} 
                alt="User Avatar" 
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600">
                {name?.[0]}{surname?.[0]}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
          <div className="w-full flex flex-col space-y-4">
            <Label className="text-2xl text-textDark block">Your name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              type="text" 
              placeholder="Enter your name" 
              className="w-full h-13 bg-placeholder rounded-sm text-base"
            />
          </div>
          <div className="w-full flex flex-col space-y-4">
            <Label className="text-2xl text-textDark block">Your email</Label>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="Enter your email" 
              className="w-full h-13 bg-placeholder rounded-sm text-base"
            />
          </div>
          <div className="w-full flex flex-col space-y-4">
            <Label className="text-2xl text-textDark mb-4 block">Your password</Label>
            <Input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-13 bg-placeholder rounded-sm text-base"
            />
          </div>
        </div>
        <div className="w-2/4 min-h-[49rem] bg-white flex flex-col justify-center items-center pb-13 px-12.5 pt-11 z-10 ml-12 lg:ml-12 2xs:ml-0 2xs:mt-12 lg:mt-0">
          <Dialog>
            <DialogTrigger className="w-full h-13 cursor-pointer bg-placeholder rounded-sm text-start text-base text-textGray font-medium px-4 mb-7.5">Agreement & Policy</DialogTrigger>
            <DialogContent className="!w-1/2 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agreement & Policy</DialogTitle>
                <DialogDescription className="text-textLightgray">
                  <p>1. Общие положения<br/>1.1. Настоящее Пользовательское соглашение (далее - Соглашение) регулирует отношения между администрацией сайта [Название платформы] (далее - Администрация) и пользователем (далее - Пользователь) при использовании образовательной платформы.</p>
                  <p>2. Условия использования<br/>2.1. Платформа предоставляет доступ к образовательным материалам, расписанию занятий, лекциям и другим учебным ресурсам.<br/>2.2. Пользователь обязуется использовать платформу только в законных целях.</p>
                  <p>3. Регистрация и учетная запись<br/>3.1. Для доступа к функционалу платформы требуется регистрация.<br/>3.2. Пользователь несет ответственность за сохранность своих учетных данных.</p>
                  <p>4. Конфиденциальность<br/>4.1. Администрация обязуется защищать персональные данные Пользователя в соответствии с нашей Политикой конфиденциальности.</p>
                  <p>5. Интеллектуальная собственность<br/>5.1. Все материалы платформы являются интеллектуальной собственностью Администрации или правообладателей.</p>
                  <p>6. Ограничения ответственности<br/>6.1. Администрация не несет ответственности за любые косвенные убытки, возникшие в результате использования платформы.</p>
                  <div className="text-center italic py-4">
                    <p className="text-sm opacity-70">
                      Обращаем внимание, что наш сайт не предназначен для использования людьми 
                      с нарушениями зрения, так как не имеет поддержки специальных средств 
                      доступности (скринридеров и т.п.). Мы осознаем это ограничение и 
                      приносим извинения за возможные неудобства.
                    </p>
                  </div>
                  <p>7. Заключительные положения<br/>7.1. Администрация оставляет за собой право изменять данное Соглашение.<br/>7.2. Продолжение использования платформы после изменений означает согласие с обновленным Соглашением.</p>
                  <p>Дата вступления в силу: 24 июля 2025 года</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="w-full flex flex-col space-y-9.5">
            <Label className="text-2xl font-medium text-textDark block">My group members</Label>
            <ScrollArea className="w-full h-44 bg-placeholder rounded-sm p-4 text-textGray">
              <div className="space-y-2">
                {groupMembers.length > 0 ? (
                  groupMembers.map((member) => (
                    <React.Fragment key={member.id}>
                      <h3 className="text-base text-thirdGray">
                        {member.name} {member.surname}
                        {member.is_teacher && " (Teacher)"}
                        {member.is_admin && " (Admin)"}
                      </h3>
                      <Separator className="bg-separator"/>
                    </React.Fragment>
                  ))
                ) : (
                  <p className="text-center py-8">No group members found</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full flex flex-col space-y-9.5 mt-9.5">
            <Label className="text-2xl font-medium text-textDark block">Saved lectures</Label>
            <ScrollArea className="w-full h-44 rounded-sm bg-placeholder p-4">
              <div className="space-y-2 text-textGray">
                {favoriteLectures.length > 0 ? (
                  favoriteLectures.map((lectureId) => (
                    <div key={lectureId} className="text-base">Lecture #{lectureId}</div>
                  ))
                ) : (
                  <p className="text-center py-8">No saved lectures</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full flex justify-end mt-14">
            <Button 
              className="rounded-full w-1/4 h-13 bg-buttonColor text-xl hover:bg-buttonColor/90 text-white"
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePageBuilder