import React from 'react'
import AuthenticationFormComponent from '@/src/components/AuthenticationFormComponent/AuthenticationFormComponent'

const SignInPageBuilder = () => {
  return (
    <div>
      <AuthenticationFormComponent type='signin'/>
    </div>
  )
}

export default SignInPageBuilder
