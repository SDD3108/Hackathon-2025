import { jwtDecode } from 'jwt-decode'

const tokenDecoder = (token)=>{
    const decode = jwtDecode(token)
    const userId = decode.user_id
    return userId
}

export { tokenDecoder }