"use client"
import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/ui/button'
import { motion } from 'framer-motion'

const LecturePageBuilder = () => {
  const [lecture, setLecture] = useState({
    id:"1",
    title:"",
    keywordsId:'5',
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus odio diam, nec vestibulum nunc fringilla commodo. Nam vitae mi luctus, rhoncus turpis vitae, bibendum est. Cras cursus scelerisque quam, mattis tincidunt elit ullamcorper vitae. Donec facilisis, diam sit amet consequat fringilla, lectus orci rhoncus leo, sit amet pellentesque orci dolor non nisl. Phasellus non felis metus. Nulla molestie diam erat, a pharetra neque venenatis eu. Etiam est libero, dapibus in urna vitae, porttitor elementum arcu. Sed nec nisl ac est dignissim laoreet. Duis blandit tortor vel dui fringilla, in faucibus leo auctor. Donec neque leo, interdum sed odio sit amet, blandit faucibus ex. Proin aliquet viverra lacus non elementum. Donec placerat vel neque in accumsan. Donec pretium pharetra dictum. Nunc vel lacus quis libero gravida vulputate. Sed pellentesque eget odio vel hendrerit. Suspendisse in est lacus. Aenean feugiat erat porttitor augue placerat posuere eget pretium tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse in orci vel felis vestibulum ultricies quis sollicitudin nisi. Morbi tristique tortor at felis vestibulum, non tristique lorem lacinia. In hac habitasse platea dictumst. In ut neque orci. Nullam ligula ligula, fermentum ac elit eu, aliquet ultrices ipsum. Mauris eget felis ut sapien cursus dapibus ac vestibulum est. Fusce feugiat, mi vitae tempus dapibus, justo metus molestie erat, id posuere magna turpis ac ex. Morbi fringilla lacus ante, sit amet suscipit arcu mattis vel.Duis tincidunt dignissim turpis, sit amet dignissim odio ultricies nec. Aenean tortor velit, accumsan non metus eget, rhoncus consequat urna. Etiam sed hendrerit lorem. Nunc feugiat sem velit, at eleifend risus pretium sit amet. Nullam tempus convallis neque, id ultricies sapien aliquet vitae. Nulla viverra leo eu dolor tempor dapibus. Curabitur at justo quis magna elementum posuere et id est. Aenean id eleifend justo. Morbi ut hendrerit sapien. Nulla nec libero at nisl porttitor accumsan. Curabitur ornare non lacus eget venenatis. Sed a pellentesque massa. Pellentesque iaculis enim quis nulla viverra, id dignissim massa condimentum. Cras suscipit mollis faucibus. Curabitur vestibulum rutrum justo non commodo. Maecenas ex felis, cursus id dignissim varius, lacinia non urna. Aliquam purus ligula, feugiat dapibus neque at, bibendum lacinia arcu. Donec rutrum dapibus porta. Sed augue nisl, euismod vel erat eget, semper convallis erat. Maecenas dictum risus quis elit dignissim, in hendrerit tellus sollicitudin. Donec molestie ligula id lobortis luctus. Sed non lorem aliquet, dignissim dui sed, bibendum sem. Integer eu rutrum augue. Sed nec congue elit. Suspendisse efficitur lacus leo, vel lacinia erat feugiat hendrerit. Praesent sit amet elit ex. Nunc eu sollicitudin turpis, quis accumsan lacus. In elementum lorem nec mauris dapibus tristique. Suspendisse auctor dolor in placerat imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus iaculis urna id purus euismod pulvinar. Curabitur fermentum, velit eget auctor volutpat, est mauris semper mauris, ut fringilla dolor ante quis nisl. Fusce at diam in dui euismod luctus. Duis et sagittis odio, vitae faucibus ipsum. Nam nulla ex, venenatis at enim tempor, maximus accumsan urna. Aenean et magna faucibus, gravida enim vel, tristique sapien. ",
    video:"https://www.w3schools.com/html/mov_bbb.mp4",
    date:"01.07.2025",
    teacherId:"4",
  })
  const [subject,setSubject] = useState({
    id:"2",
    title:"Math",
    classroom:"304",
    leactureId:"1",
    typeOfSubject:"1",
  })
  const [group,setGroup] = useState({
    id:"3",
    title:"301.1",
    curatorId:"4",
  })
  const [user,setUser] = useState({
    id:'4',
    name:"damir",
    surname:"satimov",
    email:"random@gmail.com",
    password:"1234Test.",
    // еще так же надо сделать если будешь показывать аватарку учителя то надо сделать если аватрки нету то должны быть инициалы,первая буква имени и фамилли,используя shadcn
    avatar:"",
    is_student:false,
    is_teacher:true,
    is_admin:false,
    classId:'3',

  })
  const [keywords,setKeywords] = useState({
    id:"5",
    main:["Lorem","Nullam"],
  })

  return (
    <div></div>
  )
}

export default LecturePageBuilder