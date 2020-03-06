import {gun} from './gun'
import $store from '../store/store'

const user = gun.user()

export default {

  user,
  gun,

  async signup(payload){
    return new Promise( async (resolve, reject) => {

      try {
        
        if( await this.aliasIsTaken(payload.username)){
          reject('Username is taken')
        }
    
        let { name, username, password, acc_type="individual",
          is_student=false, was_once_a_student=false, 
          email=false, phone=false, sch=false, 
          dept=false, 
          fac=false, photoURL=false } = payload
    
        user.create(username, password, async () => {
          // console.log({ack})
    
          gun.get('users').get(username).put({
            name,
            username,
            email,
            acc_type,
            phone,
            photoURL,
            is_student,
            was_once_a_student,
            sch,
            fac,
            dept
          })
    
          // login the user automatically
          let res = await this.login(payload)
    
          resolve(res)
        })
      } catch (error) {
        reject(error)
      }
    })
      
  },

  login(payload){
    try {
      return new Promise((resolve, reject) => {

        let { username, password } = payload
        
        // console.log({payload})
        user.auth(username, password, function(at){
          
          if(at.err){
            console.log(at.err)
            reject(at.err)
          }
          else {

            let user = gun.get('users').get(username)
            user.put({
              is_online: true
            })

            user.once((data)=>{
              // console.log(user, data)
              $store.dispatch('setUser', data)

              resolve(data)
            })
          }
  
          
        })

      })
      
    } catch (error) {
      throw error
    }
  },
  async aliasIsTaken (alias){
    // check that alias does not exist already

    let u = await gun.get('users').get(alias).then()
    // console.log({u}, !!u)
    
    return u ? true : false

  },
  updateUser(payload){
    gun.get('users').get(payload.username)
      .put(payload)

    this.login(payload)
  },
  isLoggedIn(){
    // or gun.user().is
    return  gun.user().is
  }
}


// export {login, signup}