import axios from 'axios'

const USERS_API = process.env.VITE_NEXT_PUBLIC_USERS_API
const FAVORITES_API = process.env.VITE_NEXT_PUBLIC_FAVORITES_API

const getCurrentUser = async(userId) => {
  try{
    const response = await axios.get(`${USERS_API}${userId}`)
    return response.data
  }
  catch(error){
    console.error("Error fetching current user:",error)
    return null
  }
}
const getGroupMembers = async(groupId)=>{
  try{
    const response = await axios.get(USERS_API)
    return response.data.filter((user) => user.classId == groupId)
  }
  catch(error){
    console.error("Error fetching group members:", error)
    return []
  }
} 
const getFavoriteLectures = async(userId)=>{
  try{
    const response = await axios.get(`${FAVORITES_API}?userId=${userId}`)
    return response.data.map((item) => item.lectureId)
  }
  catch(error){
    console.error("Error fetching favorite lectures:", error)
    return []
  }
}

export { getCurrentUser,getGroupMembers,getFavoriteLectures }