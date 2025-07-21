import React from 'react'
import SignInPageBuilder from '@/src/pageBuilders/SignInPageBuilder/SignInPageBuilder'

const SignInPage = () => {
  return (
    <div>
      <SignInPageBuilder/>
    </div>
  )
}

export const dynamic = "force-dynamic";
export default SignInPage
