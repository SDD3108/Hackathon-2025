"use client"
import React, { useState, useEffect } from 'react'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(()=>{
    const handleScroll = ()=>{
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll',handleScroll)
    return () => window.removeEventListener('scroll',handleScroll)
  },[])

  return (
    <header>
      
    </header>
  )
}

export default Header;