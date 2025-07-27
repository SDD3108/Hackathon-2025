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
      <Header />
      <div className="max-w-[90rem] lg:max-w-[60rem] sm:max-w-[44rem] xs:max-w-[28rem] w-full h-screen mx-auto bg-white px-4 py-8 md:py-12 space-y-8 md:space-y-13">
        <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:shadow-xl w-full aspect-video max-h-[80vh]">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover bg-textDark"/>
          {(recordingState == 'recording' || recordingState == 'paused') && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-lg md:text-xl font-mono">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>
        <div className="h-auto min-h-[6rem] flex justify-center items-center p-4 rounded-2xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {recordingState == 'idle' && (
              <motion.button key="start" initial={{opacity: 0,scale: 0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg md:text-2xl py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap" onClick={startRecording}>
                Start Recording
              </motion.button>
            )} 
            {recordingState == 'recording' && (
              <div className="flex flex-col md:flex-row w-full max-w-md justify-center gap-4 md:gap-0 md:justify-between">
                <motion.button key="finish" initial={{x:0, opacity:0}} animate={{x:0, opacity:1}} exit={{x: 0, opacity: 0}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap text-lg md:text-xl" onClick={finishRecording}>
                  Finish
                </motion.button>
                <motion.button key="pause" initial={{x: 0, opacity: 0}} animate={{x:0, opacity: 1}} exit={{x: 0, opacity: 0}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap text-lg md:text-xl" onClick={pauseRecording}>
                  Pause
                </motion.button>
              </div>
            )}     
            {recordingState == 'paused' && (
              <div className="flex flex-col md:flex-row w-full max-w-md justify-center gap-4 md:gap-0 md:justify-between">
                <motion.button key="finish-paused" initial={{x:0, opacity:0}} animate={{x:0, opacity:1}} exit={{x: 0, opacity: 0}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap text-lg md:text-xl" onClick={finishRecording}>
                  Finish
                </motion.button>
                <motion.button key="resume" initial={{x: 0, opacity: 0}} animate={{x:0, opacity: 1}} exit={{x: 0, opacity: 0}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap text-lg md:text-xl" onClick={resumeRecording}>
                  Resume
                </motion.button>
              </div>
            )}
            {recordingState == 'finishing' && (
              <motion.button key="send" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 md:px-12 rounded-full shadow-lg text-nowrap text-lg md:text-xl" onClick={() => setIsModalOpen(true)}>
                Send Lecture
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-2xl flex flex-col space-y-4 shadow-2xl border border-gray-200">
            <div className='flex flex-col md:flex-row gap-6 md:gap-8 w-full'>
              <div className="w-full md:w-1/2">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border w-full"/>
              </div>
              <div className="flex flex-col w-full md:w-1/2 space-y-4">
                <div className='flex flex-col space-y-3'>
                  <Label className="text-lg font-medium">Select Group</Label>
                  <Popover open={openGroupCombo} onOpenChange={setOpenGroupCombo}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openGroupCombo} className="w-full justify-between py-5 text-base">
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
                            <CommandItem key={group.id} value={group.id}
                              onSelect={(currentValue) => {
                                setSelectedGroup(currentValue == selectedGroup ? "" : currentValue)
                                setOpenGroupCombo(false)
                              }}
                              className="text-base py-3"
                            >
                              {group.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>  
                <div className='flex flex-col space-y-3'>
                  <Label className="text-lg font-medium">Is this a double lecture?</Label>
                  <RadioGroup value={isDoubleLecture ? "yes" : "no"} onValueChange={(value) => setIsDoubleLecture(value == "yes")} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1" className="text-base">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2" className="text-base">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button className='mt-2 md:mt-auto py-5 text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-all' onClick={handleSendLecture}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Lecture'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LecturesPageBuilder