import axios from 'axios'
// import $Nprogress from 'nprogress'

const instance = axios.create({
    baseURL: "https://us-central1-facevote-eb748.cloudfunctions.net"
})

// Start nprogress before request is made
instance.interceptors.request.use(config => {
    // $Nprogress.start()
    return config
})

    // Stop nprogress before response is returned
instance.interceptors.response.use(response => {
    // $Nprogress.done()
    return response
})
export default ()=>{
    return instance

}