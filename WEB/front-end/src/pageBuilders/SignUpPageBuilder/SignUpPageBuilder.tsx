import React from 'react'
import AuthenticationFormComponent from '@/src/components/AuthenticationFormComponent/AuthenticationFormComponent'

const SignUpPageBuilder = () => {
  // сделать защиту от обычных юзеров (admin only)
  return (
    <div>
      <AuthenticationFormComponent type='signup'/>
    </div>
  )
}

export default SignUpPageBuilder
