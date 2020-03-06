/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      // console.log(
      //   'App is being served from cache by a service worker.\n' +
      //   'For more details, visit https://goo.gl/AFskqB'
      // )
      
    },
    cached () {
      // console.log('Content has been cached for offline use.')
      
    },
    updated () {
      console.log('New content is available; please refresh.')
      window.appUpdateAvailable = true
      // var refresh = confirm('New content is available; please refresh.')
      // if(refresh) {
      //   window.location.reload(true)
      // }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
      // window.isOffline = true
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
