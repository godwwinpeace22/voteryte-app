import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';
// import createMutationsSharer from 'vuex-shared-mutations'
// import {gun} from '../plugins/gun';
import { vm } from '@/main'
import { uniq } from "lodash";

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
//     //isAuthenticated:state.isAuthenticated,
//     curRoomId: state.curRoomId,
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
    // createMutationsSharer({ predicate: 
    //   ['logout', 'setUser', 
    //   'switchTheme','saveFeedFilter', 
    //   'session_expired', 'setUserInfo', 
    //   'curRoom',
    //   'saveChatMessages'] 
    // })
  ],
  state: {
    userInfo: null, // additional info for logged in user
    isAuthenticated: false,
    isSuperUser: false,
    is_verified: false,
    theme: 'light',
    timestamp: null,
    curRoom: null,
    curProfile: null,
    selectedProfile: {},
    curRoomId: null, // current room id
    loading_rooms: false, // tells other components that rooms are still being loaded
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

      state.isAuthenticated = data
      state.userInfo = data
      // state.userInfo = null
    },
    async logout(state){
      // eslint-disable-next-line
        vm.$router.push('/login')
        vm.$gun.user().leave()
        
        // Sign-out successful.
        state.userInfo = null
        state.isAuthenticated = false
        state.isSuperUser = false
        state.is_verified = false
        state.curRoom = null
        state.myEnrolled = []
        state.broadcasts = []
        state.chat_messages = []
        state.pUnreadMsgs = []
        
        // window.location.reload()
    },
    switchTheme(state){
      state.theme == 'dark' ? state.theme = 'light' : state.theme = 'dark'
    },
    saveFeedFilter(state,data){
      state.feedFilter = data
    },
    curRoom(state,data){
      state.curRoom = data
      state.curRoomId = data.electionId
      state.loading_rooms = false
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
    showRightNav(state,data){
      state.show_right_nav = data[0]
      state.show_right_nav_btn = data[1]
    },
    setCurrRightSidebar(state, data){
      state.curr_right_sidebar = data
    },
    setSchools(state,data){
      state.schools = data
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
    setVotes(state,data){
      state.votes = data
    },
    uploadProgress(state, data){
      state.uploadProgress = data
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
    sessionExpired(state){
      state.session_expired = true
    }
  },
  actions:{
    setUser({commit}, data){
      commit('setUser', data)
    },
    setUserInfo({commit}, data){
      commit('setUserInfo', data)
    },
    setLoggedInUser({commit}, data){
      commit('setLoggedInUser', data)
    },
    logout({commit}){
      commit('logout')
    },
    saveFeedFilter({commit},data){
      commit('saveFeedFilter',data)
    },
    switchTheme({commit},data){
      commit('switchTheme', data)
    },

    curRoom({commit}, data){
      commit('curRoom', data)
    },
    openProfile({commit}, data){
      commit('openProfile', data)
    },
    uploadProgress({commit}, data){
      commit('uploadProgress', data)
    },
    setBroadcasts({commit}, data){
      commit('setBroadcasts', data)
    },
    // pUnreadMsgs({commit},data){
    //   commit('pUnreadMsgs',data)
    // },
    saveChatMessage({commit}, data){
      commit('saveChatMessage', data)
    },
    private_conversations({commit}, data){
      commit('private_conversations', data)
    },
    updateFromDb({commit},data){
      commit('updateFromDb',data)
    },
    showRightNav({commit},data){
      commit('showRightNav', data)
    },
    setCurrRightSidebar({commit}, data){
      commit('setCurrRightSidebar', data)
    },
    setSchools({commit},data){
      commit('setSchools', data)
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
    sessionExpired({commit}, data){
      commit('sessionExpired', data)
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
      
      let read_msgs = []

      // get user list of read
      // gun.get('users').get(state.isAuthenticated.username)
      //   .get('read_broadcasts')
      //   .map()
      //   .once((read)=> {
      //     // console.log({read,key})
          
      //     read_msgs.push(read)
      //   })
      
      
      return state.broadcasts
        .filter(msg => 
          msg.author.username != state.isAuthenticated.username && 
          !read_msgs.includes(msg.docId)
        )
        .length
       
    },
    
    getUser: (state) => {
      return state.isAuthenticated
    },
    getChatMessages: (state)=>{
     let sorted = state.chat_messages.sort((a,b) => a.tstamp - b.tstamp)
     .filter(msg => msg.elecRef == state.curRoom.electionId)

     // remove duplicates caused by push
     return sorted.reduce((acc, cur) => [
        ...acc.filter((msg) => msg.docId !== cur.docId), cur
      ], []);
    },
    getSchools: state => state.schools,
    getContestants: state => state.curElectionContestants,
    getCurElectionResults: state => state.curElectionResults,
    getCurElectionActivities: state => state.curElectionActivities,
    getMyEnrolled: state => uniq(state.myEnrolled),
    getMyCreated: state => state.myCreated,
    getMyContested: state => state.myContested,
    getVotes: state => state.votes,
    getChatMedia: state => {
      let arr = []
      state.chat_messages.forEach(item=>{
        if(item.images){
          arr.push(...item.images)
        }
        
      })
      return arr
    },
  }
})

// gun.on('auth', function(v){
//   // console.log({v})
// })