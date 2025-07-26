"use client"
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/src/ui/label'
import Header from '@/src/common/header/Header'
import axios from 'axios'
import { Calendar } from '@/src/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/ui/popover'
import { Button } from '@/src/ui/button'
import { format, set } from 'date-fns'
import { RadioGroup, RadioGroupItem } from '@/src/ui/radio-group'
import { Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,} from '@/src/ui/command'
import LecturesChevronsComponent from '@/src/components/LecturesChevronsComponent/LecturesChevronsComponent'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import { tokenDecoder } from '@/src/utils/tokenDecoder/tokenDecoder'

const LecturesPageBuilder = () => {
  const [recordingState, setRecordingState] = useState('idle')
  const [stream, setStream] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState(null)
  // в date нам приходит дата в формате 2023-10-01T00:00:00.000Z а надо дд.мм.гггг
  const [loading, setLoading] = useState(false)
  const [apiGroups,setApiGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [isDoubleLecture, setIsDoubleLecture] = useState(false)
  const [groups, setGroups] = useState([])
  const [openGroupCombo, setOpenGroupCombo] = useState(false)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const timerRef = useRef(null)
  const subject = { title: "Mathematics" }

  // Mock user data (in real app this would come from context or auth)
  const { user:token } = useAuthenticationStore()
  const [user,setUser] = useState({})

  useEffect(()=>{

    const initCamera = async()=>{
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(mediaStream)
        if(videoRef.current){
          videoRef.current.srcObject = mediaStream
        }
      }
      catch(error){
        console.error("Camera access error:", error)
      }
    }
    initCamera()
    const getGroups = async()=>{
      try {
        const URL_API = process.env.NEXT_PUBLIC_API_URL
        const resp = await axios.get(`${URL_API}/api/groups`)
        setApiGroups(resp.data)
      }
      catch(error){
        console.error('Error fetching groups:', error)
      }
    }
    const getUser = async()=>{
      const userToken = token == null ? localStorage.getItem('token') : token
      const userId = tokenDecoder(userToken)
      setUser(userId)
      console.log(userId);
    }
    getUser()
    getGroups()
    return ()=>{
      if(stream){
        stream.getTracks().forEach(track => track.stop())
      }
      if(timerRef.current){
        clearInterval(timerRef.current)
      }
    }
  }, [])
  const startTimer = ()=>{
    if(timerRef.current){
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }
  const stopTimer = ()=>{
    if(timerRef.current){
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  const resetTimer = ()=>{
    stopTimer()
    setRecordingTime(0)
  }
  const startRecording = ()=>{
    if(!stream) return
    
    setRecordedChunks([])
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus'
    })
    
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.start()
    setRecordingState('recording')
    startTimer()
  }
  const handleDataAvailable =(e)=>{
    if(e.data.size > 0){
      setRecordedChunks((prev) => [...prev, e.data])
    }
  }
  const pauseRecording = ()=>{
    if(mediaRecorderRef.current && recordingState == 'recording'){
      mediaRecorderRef.current.stop()
      setRecordingState('paused')
      stopTimer()
    }
  }
  const resumeRecording = ()=>{
    if(mediaRecorderRef.current && recordingState == 'paused'){
      mediaRecorderRef.current.start()
      setRecordingState('recording')
      startTimer()
    }
  }
  const finishRecording = ()=>{
    if(mediaRecorderRef.current && (recordingState == 'recording' || recordingState == 'paused')){
      mediaRecorderRef.current.stop()
      setRecordingState('finishing')
      stopTimer()
      setIsModalOpen(true)
    }
  }
  console.log(user);
  // const handleSendLecture = async()=>{
  //   if(!date || !selectedGroup || recordedChunks.length == 0){
  //     return
  //   }
  //   try {
  //     setLoading(true)
  //     const URL_API = process.env.NEXT_PUBLIC_API_URL
  //     const blob = new Blob(recordedChunks, { type: 'video/webm' })
  //     const fileUrl = blob

  //     const sendFile = async(file)=>{

  //     }
  //     const groupId = async()=>{
  //       const group = apiGroups.find((g)=> g.title == selectedGroup)
  //       return group.id 
  //     }
  //     const formatDate = (date) => {
  //       return format(new Date(date), 'dd.MM.yyyy')
  //     }
  //     console.log(formatDate(date));
  //     await axios.post(`${URL_API}/api/lectures/create`,{
  //       videoUrl: fileUrl,
  //       date: formatDate(date),
  //       teacherId: user.id,
  //       groupId: await groupId(),
  //       isDouble: isDoubleLecture,
  //     })

  //     // Reset state
  //     setLoading(false)
  //     resetTimer()
  //     setRecordingState('idle')
  //     setRecordedChunks([])
  //     setIsModalOpen(false)
      
  //   } catch (error) {
  //     console.error('Error sending lecture:', error)
  //   }
  // }   
  const handleSendLecture = async()=>{
    if(!date || !selectedGroup || recordedChunks.length == 0){
      return
    }
    
    try{
      setLoading(true)
      const URL_API = process.env.NEXT_PUBLIC_API_URL
      console.log(URL_API);
      const group = apiGroups.find((g) => g.name == selectedGroup)
      console.log(group);
      if(!group){
        return console.error('Selected group not found')
      }
      const formatDate = ()=>{
        const isoDate = new Date(date).toISOString()
        const yyyyMMdd = isoDate.split('T')[0]    
        return yyyyMMdd
        // const day = new Date().getDate()
        // const month = new Date().getMonth()
        // const year = new Date().getFullYear()
        // return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2,'0')}`
      }
      console.log(formatDate());
      // Создаем FormData для отправки видео
      const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' })
      console.log(videoBlob);
      const formData = new FormData()
      console.log(formData);
      formData.append('user_id', user)
      formData.append('video', videoBlob,'lecture_video.mp4')
      formData.append('date', formatDate())
      formData.append('group_id', group.id)
      formData.append('is_double', isDoubleLecture.toString())
      console.log(formData,'7');
      // const response = await axios.post(`${URL_API}/api/lectures/create/`,formData)
      const response = await fetch(`${URL_API}/api/lectures/create/`, {
        method: 'POST',
        body: formData,
      })
      console.log('Lecture created:', response)
      setLoading(false)
      resetTimer()
      setRecordingState('idle')
      setRecordedChunks([])
      setIsModalOpen(false)
    }
    catch(error){
      console.error('Error sending lecture', error)
      setLoading(false)
    }
  }

  const formatTime = (seconds)=>{
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-mainBlue">
      <Header/>
      <div className="max-w-[63.5rem] h-screen mx-auto bg-white px-21.5 py-[3rem] space-y-13">
        <div className="flex justify-center items-center space-x-13">
          <h1 className="text-5xl font-semibold text-black">
            {subject.title}
          </h1>
          <Label className='text-5xl'>11:30</Label>
        </div>
        <div className="relative overflow-hidden shadow-xl w-[52.5rem] max-w-full max-h-[32rem]">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover bg-textDark"/>
          
          {(recordingState == 'recording' || recordingState == 'paused') && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>
        <div className="h-16 flex justify-center items-center">
          <AnimatePresence mode="wait">
            {recordingState == 'idle' && (
              <motion.button key="start" initial={{opacity: 0,scale: 0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-red-500 hover:bg-red-600 text-white font-bold text-2xl h-13 px-12 rounded-full shadow-lg" onClick={startRecording}>
                Start Recording
              </motion.button>
            )}
            {recordingState == 'recording' && (
              <div className="flex w-full max-w-md justify-between">
                <motion.button key="finish" initial={{x:0, opacity:0}} animate={{x:'-50%', opacity:1}} exit={{x: 0, opacity: 0}} transition={{type:'spring', stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-12 rounded-full shadow-lg" onClick={finishRecording}>
                  Finish
                </motion.button>
                <motion.button key="pause" initial={{x: 0, opacity: 0}} animate={{x:'50%', opacity: 1}} exit={{x: 0, opacity: 0}} transition={{type:'spring', stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-12 rounded-full shadow-lg" onClick={pauseRecording}>
                  Pause
                </motion.button>
              </div>
            )}
            {recordingState == 'paused' && (
              <div className="flex w-full max-w-md justify-between">
                <motion.button key="finish-paused" initial={{x:0, opacity:0}} animate={{x:'-50%', opacity:1}} exit={{x: 0, opacity: 0}} transition={{type:'spring', stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-12 rounded-full shadow-lg" onClick={finishRecording}>
                  Finish
                </motion.button>
                <motion.button key="resume" initial={{x: 0, opacity: 0}} animate={{x:'50%', opacity: 1}} exit={{x: 0, opacity: 0}} transition={{type:'spring', stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-12 rounded-full shadow-lg" onClick={resumeRecording}>
                  Resume
                </motion.button>
              </div>
            )}       
            {recordingState == 'finishing' && (
              <motion.button key="send" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-full shadow-lg" onClick={() => setIsModalOpen(true)}>
                Send Lecture
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-fifthGray/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl flex flex-col space-y-4">
            <div className='flex space-x-8 w-full '>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border w-1/2"/>
              <div className="flex flex-col w-1/2 space-y-4">
                <div className='flex flex-col space-y-3'>
                  <Label>Select Group</Label>
                  <Popover open={openGroupCombo} onOpenChange={setOpenGroupCombo}>
                  <PopoverTrigger asChild>
                    <Button variant="outline"role="combobox"aria-expanded={openGroupCombo} className="w-full justify-between">
                      {selectedGroup ? apiGroups.find((group) => group.title == selectedGroup) : "Select group..."}
                      <LecturesChevronsComponent className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search group..." />
                      <CommandEmpty>No group found.</CommandEmpty>
                      <CommandGroup>
                        {apiGroups.map((group) => (
                          <CommandItem key={group.id}value={group.id} onSelect={(currentValue)=>{
                            setSelectedGroup(currentValue == selectedGroup ? "" : currentValue)
                            setOpenGroupCombo(false)
                            }}
                          >
                            {group.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                  </Popover>
                </div>
                <div className='flex flex-col space-y-3'>
                  <Label>Is this a double lecture?</Label>
                  <RadioGroup value={isDoubleLecture ? "yes" : "no"} onValueChange={(value) => setIsDoubleLecture(value == "yes")}className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button className='mt-auto text-lg font-semibold' onClick={handleSendLecture}>{loading ? 'Analyzing' : 'Analyze'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LecturesPageBuilder