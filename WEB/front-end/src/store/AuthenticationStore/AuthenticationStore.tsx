import React from 'react'
import { create } from 'zustand'
import axios from 'axios'

const useAuthenticationStore = create((set)=>({
  user:null,
  loading:false,
  error:null,
  signUp: async(data:any)=>{
    set({loading:true, error:null})
    try {
      await axios.post('')
      set({user:data, loading:false})
      return true
    }
    catch(error){
      set({error:'Registration failed', loading:false})
      return false
    }
  },
  signIn: async(data:any)=>{
    set({loading:true, error:null})
    try{
      await axios.get('')
      set({user:data, loading:false})
      return true
    }
    catch(error){
      set({error:'Login failed', loading:false})
      return false
    }
  },
  signOut:()=>{
    set({user:null})
  }
}))

export default useAuthenticationStore