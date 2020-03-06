import axios from 'axios'
// import $Nprogress from 'nprogress'

const instance = axios.create({
  baseURL: 'https://api.paystack.co/bank/resolve_bvn/',
  headers: {'Authorization': 'Bearer ' + process.env.paystack_skrt}
});

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