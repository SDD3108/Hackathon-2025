"use client"
import React, { useEffect } from 'react'
import { Label } from '@/src/ui/label'
import { User } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="flex justify-between min-h-16 text-white p-8 border-b bg-white shadow-xl mb-18">
        <div className='flex space-x-3'>
          <Label className='text-mainBlue text-3xl font-semibold flex gap-0'>Lec<span className='text-black'>Sure</span></Label>
        </div>        
        <Link className='w-16 h-16 bg-newWhite rounded-full cursor-pointer flex justify-center items-center' href='/signin'>
          <User width={40} color='#000000' className='h-[2.5rem]' strokeWidth='1' />
        </Link>
      </header>
  )
}

export default Header;