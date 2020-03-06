import api from '@/services/api'
export default {
    Login(credentials){
        return api().post('users/login', credentials)
    },
    Register(credentials){
        return api().post('users/register',credentials)
    }
}