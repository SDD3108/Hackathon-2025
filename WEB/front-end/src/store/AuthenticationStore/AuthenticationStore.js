import { create } from 'zustand'
import axios from 'axios'
const USERS_API = process.env.NEXT_PUBLIC_USERS_API
const USER_LOGIN = process.env.NEXT_PUBLIC_USER_LOGIN

const useAuthenticationStore = create((set)=>({
  token: '',
  loading: false,
  error: null,
  user: null,

  signUp: async(userData)=>{
    set({loading:true, error:null})
    try{
      const response = await axios.post(USERS_API,userData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      set({ user: response.data, loading: false })
      return true
    }
    catch(error){
      const errorMessage = error.response?.data?.message || 'Registration failed'
      set({ error: errorMessage, loading: false })
      return false
    }
  },
  signIn:async(userData)=>{
    set({loading:true, error:null})
    // console.log(USERS_API);
    // console.log(USER_LOGIN);
    try {
      const response = await axios.post(USER_LOGIN,userData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const token = response.data.access
      localStorage.setItem('token',JSON.stringify(token))
      set({user:token, loading:false})
      return true
    }
    catch(error){
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed'
      set({error:message,loading:false})
      return false
    }
  },
  signOut:()=>{
    set({user:null})
  },
  setUser:()=>{
    
  },
}))

export default useAuthenticationStore