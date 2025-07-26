import axios from 'axios'


const GetDatasApi = async(API) => {
    const resp = await axios.get(API)
    console.log('datas', resp.data);
    return resp.data
}

export { GetDatasApi }