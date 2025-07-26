"use client"
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/src/ui/label'

const LecturesPageBuilder = () => {
  const [recordingState, setRecordingState] = useState('idle') // idle, recording, finishing
  const [stream, setStream] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  
  // Мок данных предмета (в реальном приложении будет из пропсов или хранилища)
  const subject = { title: "Математика" }

  // Получение доступа к камере
  useEffect(() => {
    const initCamera = async () => {
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
        console.error("Ошибка доступа к камере:", error)
      }
    }
    initCamera()

    return ()=>{
      if(stream){
        stream.getTracks().forEach(track => track.stop())
      }
    }
  },[])

  // начать запись
  const startRecording = ()=>{
    if(!stream){
      return
    }
    
    setRecordedChunks([])
    const mediaRecorder = new MediaRecorder(stream,{
      mimeType: 'video/webm;codecs=vp9,opus'
    })
    
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.start()
    setRecordingState('recording')
  }

  const handleDataAvailable = (e)=>{
    if(e.data.size > 0){
      setRecordedChunks((prev) => [...prev, e.data])
    }
  }

  // Остановить запись (без финализации)
  const stopRecording = ()=>{
    if(mediaRecorderRef.current && recordingState == 'recording'){
      mediaRecorderRef.current.stop()
      setRecordingState('idle')
    }
  }

  // Завершить запись (перейти к финализации)
  const finishRecording = ()=>{
    if(mediaRecorderRef.current && recordingState == 'recording'){
      mediaRecorderRef.current.stop()
      setRecordingState('finishing')
    }
  }

  // Отправить запись
  const sendRecording = ()=>{
    if(recordedChunks.length == 0){
      return
    }
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    // here будет логика отправки видео на сервер
    console.log("Видео готово к отправке", blob)
    
    // sbross состояния
    setRecordingState('idle')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-13">
          <h1 className="text-2xl font-bold text-gray-800">
            {subject.title}
          </h1>
          <Label>11:30</Label>
        </div>
        <div className="relative bg-textDark overflow-hidden shadow-xl mb-8 w-[52.5rem] max-w-full max-h-[31.5rem]">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"/>
          {/* {recordingState == 'recording' && (
            <div className="absolute top-4 right-4 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-red-500 font-medium">Идет запись</span>
            </div>
          )} */}
          
        </div>
        <div className="h-16 flex justify-center items-center">
          <AnimatePresence mode="wait">
            {recordingState == 'idle' && (
              <motion.button key="start" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg" onClick={startRecording}>
                Начать запись
              </motion.button>
            )}
            {recordingState == 'recording' && (
              <div className="flex w-full max-w-md justify-between">
                <motion.button key="finish" initial={{x:0,opacity:0}} animate={{x:'-50%',opacity:1}} exit={{x: 0,opacity: 0}} transition={{type:'spring',stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg" onClick={finishRecording}>
                  Завершить
                </motion.button>
                <motion.button key="stop" initial={{x: 0,opacity: 0}} animate={{x:'50%',opacity: 1}} exit={{x: 0,opacity: 0}} transition={{type:'spring',stiffness: 300}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg" onClick={stopRecording}>
                  Остановить
                </motion.button>
              </div>
            )}
            {recordingState == 'finishing' && (
              <motion.button key="send" initial={{opacity: 0,scale: 0.8}} animate={{opacity: 1,scale: 1}} exit={{opacity: 0,scale: 0.8}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg" onClick={sendRecording}>
                Отправить лекцию
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default LecturesPageBuilder