import React,{ useState } from 'react'
import { Card,CardContent,CardFooter } from '@/src/ui/card'
import { Label } from '@/src/ui/label'

const MainScheduleComponent = () => {
    const [dailyLessons,setDailyLessons] = useState([
        {
            id:"1",
            title:"Physics",
            classroom:"304",
            leactureId:"10",
        },
        {
            id:"2",
            title:"Math",
            classroom:"303",
            leactureId:"11",
        },
        {
            id:"3",
            title:"English",
            classroom:"201",
            leactureId:"12",
        },
        {
            id:"4",
            title:"Russian and Leture",
            classroom:"202",
            leactureId:"13",
        },
        {
            id:"5",
            title:"Chemistry",
            classroom:"305",
            leactureId:"14",
        },
        {
            id:"6",
            title:"Physics",
            classroom:"304",
            leactureId:"15",
        },
    ])
  return (
    <div className='w-1/5 h-screen bg-black py-[1rem]'>
        <div className='flex flex-col space-y-[1rem] overflow-y-scroll'>
            {dailyLessons.map((lesson,index)=>(
                <div className='px-3' key={index}>
                    <Card className='h-[7rem] flex-row gap-0 p-0 border-none bg-newWhite'>
                        <CardContent className='w-full flex justify-center items-center'>
                            <Label className='text-2xl'>{lesson.title}</Label>
                        </CardContent>
                        <CardFooter className='w-1/3 h-full flex-col justify-center bg-mainColor rounded-r-xl shadow-xl py-2 px-0'>
                            <Label className='text-newWhite rotate-90 text-3xl'>{lesson.classroom}</Label>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
        
    </div>
  )
}

export default MainScheduleComponent
