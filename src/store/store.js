import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';
import createMutationsSharer from 'vuex-shared-mutations'
import {gun} from '../plugins/gun';
import { vm } from '@/main'
import { uniqBy } from "lodash";

Vue.use(Vuex)

// include states to be persisted in local storage
// const vuexLocalStorage = new VuexPersist({
//   key:'vuex',
//   storage:window.localStorage,
//   reducer: state =>({
//     //user:state.user,
//     theme: state.theme,
//     last_read_time: state.last_read_time,
//     no_of_unread_msgs: state.no_of_unread_msgs,
//     schools: state.schools,
//     //chat_messages:state.chat_messages,
//     //those_online:state.those_online,
//     curr_right_sidebar: state.curr_right_sidebar,
//     show_right_bar: state.show_right_bar,
//     // private_chat_window: state.private_chat_window,
//   })
// })
export default new Vuex.Store({
  plugins:[
    // vuexLocalStorage.plugin,
    createMutationsSharer({ predicate: 
      ['logout', 'setUser', 
      'switchTheme','saveFeedFilter', 
      'session_expired', 'setUserInfo', 
      'curRoom',
      'saveChatMessages'] 
    })
  ],
  state: {
    userInfo: null, // additional info for logged in user
    isSuperUser: false,
    is_verified: false,
    theme: 'light',
    timestamp: null,
    curRoom: null,
    curProfile: null,
    selectedProfile: {},
    myEnrolled: [],
    uploadProgress: {},
    broadcasts: [],
    last_read_time: {}, // record of last msg read time, for each user in broadcasts
    chat_messages: [],
    pUnreadMsgs: [],
    curr_right_sidebar: null,
    show_right_sidebar: false,
    private_chat_window: {},
    no_of_unread_msgs: '',
    show_right_nav: true,
    show_right_nav_btn: false,
    feedFilter: null,
    session_expired: null
  },
  mutations: {
    setUserInfo(state,data){
      // data.user_id ? data['uid'] = data.user_id : ''
      state.userInfo = data
    },
    setUser(state,data){
      // console.log({data})
      // data.user_id ? data['uid'] = data.user_id : ''

      state.userInfo = data
      // state.userInfo = null
    },
    async logout(state){
      // eslint-disable-next-line
        vm.$router.push('/login')
        gun.get('users').get(state.userInfo.username)
          .get('is_online').put(false)
        gun.user().leave()
        
        // Sign-out successful.
        state.userInfo = null
        state.isSuperUser = false
        state.is_verified = false
        state.curRoom = null
        state.myEnrolled = []
        state.broadcasts = []
        state.chat_messages = []
        state.pUnreadMsgs = []
        
        // window.location.reload()
    },
    curRoom(state,data){
      state.curRoom = data
    },
    openProfile(state, data){
      state.curProfile = data
      state.selectedProfile = data
    },
    curProfile(state, data){
      state.curProfile = data
    },
    setBroadcasts(state,data){
      state.broadcasts = data
    },
    setChatMsgs(state, data){
      state.chat_messages = data
    },
    pUnreadMsgs(state,data){
      state.pUnreadMsgs = data
    },
    setMyEnrolled(state,data){
      if(data.merge){
        // e.g new election created or new enrolled
        state.myEnrolled ? 
        state.myEnrolled.unshift(data.election) :
        state.myEnrolled = [data.election]
      }else{
        state.myEnrolled = data
      }
      
    },
    subscriberState(state, data){
      state.isSuperUser = data
    },
    verifiedState(state, data){
      state.is_verified = data
    },
    setLastReadTime(state, data){
      // console.log(data,state.last_read_time)
      state.last_read_time[data] = Date.now()
    },
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    setUserInfo({commit}, data){
      commit('setUserInfo', data)
    },
    logout({commit}){
      commit('logout')
    },
    curRoom({commit}, data){
      commit('curRoom', data)
    },
    openProfile({commit}, data){
      commit('openProfile', data)
    },
    setBroadcasts({commit}, data){
      commit('setBroadcasts', data)
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
    },
    setMyEnrolled({commit}, data){
      commit('setMyEnrolled', data)
    },
    subscriberState({commit}, data){
      commit('subscriberState', data)
    },
    verifiedState({commit}, data){
      commit('verifiedState', data)
    },
    setLastReadTime({commit}, data){
      commit('setLastReadTime', data)
    },
    curProfile({commit}, data){
      commit('curProfile', data)
    },
    generalAction({commit}, data){
      commit(data.mutation, data)
    }
  },
  getters:{
    getUnreadLength: state => {
      // let ids = []
      let read_msgs = []

      // get user list of read
      gun.get('users').get(state.userInfo.username)
        .get('read_broadcasts')
        .map()
        .once((read)=> {
          // console.log({read,key})
          
          read_msgs.push(read)
        })
      
      
      return state.broadcasts
        .filter(msg => 
          msg.author.username != state.userInfo.username && 
          !read_msgs.includes(msg.docId)
        )
        .length
       
    },
    isAuthenticated: () => vm.$gUser.is,
    getUser: (state) => {
      return state.userInfo
    },
    getChatMessages: (state)=>{
     let sorted = state.chat_messages.sort((a,b) => a.tstamp - b.tstamp)
     .filter(msg => msg.elecRef == state.curRoom.electionId)

     // remove duplicates caused by push
     return sorted.reduce((acc, cur) => [
        ...acc.filter((msg) => msg.docId !== cur.docId), cur
      ], []);
    },
    getMyEnrolled: state => { 
      // console.log(state.myEnrolled) 
      let f = state.myEnrolled.filter(e => e.electionId)
      return uniqBy(f, 'electionId')
    }
  }
})

// gun.on('auth', function(v){
//   // console.log({v})
// })