import {jwtDecode} from 'jwt-decode'


export const tokenDecoder = (token)=>{
    const decode = jwtDecode(token)
    console.log(decode)
    const userId = decode.user_id
    return userId
}

// export tokenDecoder

