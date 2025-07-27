import axios from 'axios'


const GetDatasApi = async(API) => {
    const resp = await axios.get(API,{
        mode:"no-cors",
      })
    console.log('datas', resp.data);
    return resp.data
}

export { GetDatasApi }