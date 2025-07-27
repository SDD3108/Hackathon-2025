import React from 'react'
import LecturePageBuilder from '@/src/pageBuilders/LecturePageBuilder/LecturePageBuilder'

const page = ({params}) => {
  return (
    <div>
      <LecturePageBuilder params={params}/>
    </div>
  )
}

export default page
