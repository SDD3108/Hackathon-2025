import React from 'react'
import AuthModule from '@/src/components/AuthenticationFormComponent/AuthenticationFormComponent'

const SignUpPageBuilder = () => {
  // сделать защиту от обычных юзеров (admin only)
  return (
    <div>
      <AuthModule/>
    </div>
  )
}

export default SignUpPageBuilder
