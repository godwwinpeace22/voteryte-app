<template>
  <!-- <v-app>

    <v-navigation-drawer 
      right v-model="drawer_right" 
      app width="350" color="bgd"
      v-if="$vuetify.breakpoint.mdAndUp">
      <v-card outlined class="transparent mx-auto mt-3" width="85%">
        <forum-layout v-if="$route.name == 'forum'"/>
        <default-left-layout v-else/>
      </v-card>
    </v-navigation-drawer>

    <template v-if="$vuetify.breakpoint.smAndDown">
      <v-app-bar app flat tile class="bgd__card">
        <v-btn 
          icon class="mr-3"
          v-for="item in list" 
          :key="item.title"
          :class="[item.hidden]"
          :to="item.link">
          <v-icon color="grey darken-2">{{item.icon}}</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn icon @click.native="drawer_left = true">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

      </v-app-bar>
      
    </template>

    <v-navigation-drawer 
      v-model="drawer_left" app 
      :width="breakpoint.smAndDown ? 300 : 380" 
      color="bgd"
      disable-resize-watcher
      disable-route-watcher
    >
      <navigation-list/>
      
    </v-navigation-drawer>


    <v-content class="bgd">
      <transition name="fade" mode="out-in">

        <v-overlay v-if="!showUi"
          :opacity=".7"
          :value="true"
        >
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <div v-else class="bgd">
          
          <vue-headful :title="title"/>

          <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" bottom right>
            {{snackbar.message}}
            <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <v-row>
            <v-col md="8">
              <v-card outlined class="bgd__card">
                <router-view ></router-view>
              </v-card>
            </v-col>
          </v-row>
  
          <gallery :images="images" :index="index" @close="index = null"></gallery>

        </div>

      </transition>

      <v-overlay v-if="overlay.show"
        :opacity="overlay.opacity || .3"
        :value="overlay.show"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <input 
        type="file" name="file" 
        class="d-none" id="file_img" 
        style="visibility:hidden;position:absolute;" 
        @change="onFileSelect($event)" 
        accept="image/jpeg,image/png/gif" 
        multiple
      >

    </v-content>
  </v-app> -->

  <v-app id="app">
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
      :bottom="$vuetify.breakpoint.smAndDown"
      width="410"
      color="bgd"
    >
      <v-card outlined class="transparent mx-auto mt-3" width="85%">
        <!-- <forum-layout v-if="$route.name == 'forum'"/> -->
        <default-left-layout />
      </v-card>
    </v-navigation-drawer>

    <navigation @toggle-drawer-left="drawer = !drawer"/>

    <v-navigation-drawer
      v-model="drawer"
      app
      class="bgd__card"
      :mini-variant="mini"
    >
      <navigation-list :mini="mini"/>
    </v-navigation-drawer>

    <!-- New Interactive Session -->
    <!-- <v-navigation-drawer temporary v-if="showUi"
      :stateless="drawer_right_persist"
      v-model="drawerRightTemp" fixed right width="800">

      <new-event 
        @persist-drawer="drawer_right_persist = true" 
        @close-event-drawer="drawerRightTemp = false">
      </new-event>

    </v-navigation-drawer> -->

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" bottom right>
      {{snackbar.message}}
      <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-overlay v-if="overlay.show"
      :opacity="overlay.opacity || .3"
      :value="overlay.show"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-content class="bgd">
      <v-container fluid class="pt-0 bgd__card">
        <v-row
          class="pt-0"
          justify-center
          align-center
        >
          <v-col>
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <gallery :images="images" :index="index" @close="index = null"></gallery>

    <input type="file" name="file" class="d-none" id="file_img" style="visibility:hidden;position:absolute;" 
      @change="onFileSelect($event)" accept="image/jpeg,image/png,image/gif" multiple>

  </v-app>
</template>

<script>
export default {
  data: () =>({
    showUi: false,
    index: null, // for image gallery viewer
    images: [], // for image gallery viewer
    broadcasts: '',
    broadcastsRef: '', // for clearing watcher
    snackbar: {},
    mini: false,
    appUpdateAvailable: window.appUpdateAvailable,
    overlay: {
      show: false,
      opacity: .3,
    },
    myElections: [],
    drawer: null,
    drawerRight: null,
    drawerRightTemp: false,
    drawer_right_persist: false,
  }),
  components:{
    Gallery,
    NavigationList,
    DefaultLeftLayout,
    // ForumLayout,
    // NewEvent,
  },

  watch: {
    'isAuthenticated': {
      immediate: true,
      handler(to){

        if(to){
          this.initialize()
        }
      }
    },
    'curRoom': function(to){
      
      this.overlay = {
        show: true,
        opacity: .8
      }

      if(to){

        setTimeout( ()=>{
          this.overlay = {show: false}
  
          this.snackbar = {
            show: true,
            message: 'Switch to ' + to.title,
            color: 'success'
          }
  
        }, 500)
      }
      
    },
    'myElections': function(to){
      
      to ? 
      this.$store.dispatch('setMyEnrolled', {
        merge: true,
        election: to[to.length -1]
      }) : ''
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled',
      'getUnreadLength',
      'isAuthenticated'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'is_verified',
    ]),
    title(){
      return `Home | ${this.$appName}`
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    show_left_drawer(){
      if(this.breakpoint.mdAndUp){
        return true
      }
      else if(this.breakpoint.smAndDown && this.drawer_left){
        return true
      }
      else return false
    },
    list(){
      return [
        {text: 'Home', link: '/home', icon: 'mdi-home-variant'},
        {text: 'Forum', link:  `/forum/${this.curRoom ? this.curRoom.electionId : 'd'}`, icon: 'mdi-forum'},
        {text: 'Messages', link: '/messages', icon: 'mdi-bullhorn'},
        {text: 'Elections', link: `/elections/${this.curRoom ? this.curRoom.electionId : 'd'}`, icon: 'mdi-poll-box'},
        // {text: 'New', action: 'createNew', icon: 'mdi-plus-box'},
        {text: 'Discover', link: '/discover', icon: 'mdi-pound-box'},
        {text: 'Profile', link: `/users/${this.getUser.username}`, icon: 'mdi-account-box', hidden: 'hidden-xs-only'},
        {text: 'Settings', link: '/settings', icon: 'mdi-settings', hidden: 'hidden-xs-only'}
      ]
    },
    filteredList(){
      return this.list.filter(item => item.hidden)
    }
  },
  
  methods:{
    async initialize () {
      
      // get enrolled
      let userRef = this.$gun.get('users')
        .get(this.getUser.username)

        userRef.get('enrolled')
        .map()
        .on(data => {
          let d = Object.assign({}, data)
          d.cat = 'myEnrolled'
          this.myElections.push(d)
        })

      //get created
        // userRef.get('created')
        // .map()
        // .on(data => {
        //   // console.log(data)
        //   let d = Object.assign({}, data)
        //   d.cat = 'myContests'
        //   this.myElections.push(d)
        // })

      
      // this.getBroadcasts()

      let cr = await userRef.get('cr').then() 
      
      if(cr){
        this.$store.dispatch('curRoom', cr)
      }
      else if(this.getMyEnrolled && this.getMyEnrolled.length > 0){
        this.$store.dispatch('curRoom', this.getMyEnrolled[0])
      }

      


      // let epriv = this.$gUser['_'].sea.epriv

      // this.$gUser.get('subs').on(async sub => {
      //   let dec = await this.$SEA.decrypt(sub, epriv)
      //   // let thirty_days = 30 * 24 * 60 * 60 * 1000

      //   if(dec.premium_expires_in && Date.now() < dec.premium_expires_in){

      //     this.$store.dispatch('subscriberState', true)
      //   }
      //   else {
      //     this.$store.dispatch('subscriberState', false)
      //   }
        
      // })

      this.$gUser.get('is_verified').on(d => {
        
        d ? this.$store.dispatch('verifiedState', true) : ''
      })

      this.showUi = true;

    },
    getBroadcasts(){
      
      try {

        let arr = []
        this.$gun.get('users')
          .get(this.getUser.username)
          .get('enrolled')
          .map()
          .get('broadcasts')
          .map().on((broadcast) => {

            // console.log({broadcast})
            let b = Object.assign({}, broadcast)

            this.$gun.get('users').get(broadcast.author['#'])
            .once(a => {
              b.author = a
            })

            arr.push(b)

          })
          
          // console.log('broadcasts: ==>', {arr})
          this.$store.dispatch('setBroadcasts', arr)
          
      } catch (error) {
        // console.log(error)
      }
        
    },
    updateApp(){
      window.location.reload(true)
    },
    onFileSelect(e){
      // handle file selecting for all components
      let two_mb = 2000000
      let blob_urls = []
      // Allow only images
      let stop = true
      let file_sizes = 0
      for(let file of e.target.files){
        if(file.type == 'image/jpeg' || 
          file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif'){
            stop = false
          
        }
        else{
          stop = true
          break
        }
        file_sizes += file.size
      }

			if(!stop){
					
				// limit file upload to 1mb
				if(file_sizes < two_mb){
          
          for(let file of e.target.files){
            //console.log(file)
            blob_urls.push(URL.createObjectURL(file))
          }
          this.$eventBus.$emit('Selected_Files', {
            imgSrc: blob_urls,
            selected_files: e.target.files
          })
          
				}
				else{
          e.target.value = ''
          this.snackbar = {
            show: true,
            message: 'Please select an image that is less than 1mb',
            color: 'error'
          }
				}
			}
			else{
        this.snackbar = {
          show: true,
          message: 'Only images are allowed!',
          color: 'error'
        }
			}
    },
  },
  async mounted(){
    
      this.$eventBus.$on('Toggle_Left_Drawer', ()=>{
        // this.drawer = !this.drawer
        if(this.$vuetify.breakpoint.xsOnly){
          this.mini = false;
          this.drawer = !this.drawer
        }
        else {
          this.mini = !this.mini
        }
        
      })
      

      this.$eventBus.$on('Hide_Left_Drawer', ()=>{
        this.mini = true
      })

      this.$eventBus.$on('Open_Image_Gallery', data=>{
        this.images = data.images
        this.index = data.index
      })
      
      this.$eventBus.$on('Snackbar', data =>{
        this.snackbar = data
      })

    this.$vuetify.breakpoint.smAndDown ? 
      this.drawer = false : this.drawer = true

    // this.$eventBus.$on('EventDrawer', data => {
      
    //   this.drawerRightTemp = data
    // })

  },
  async created(){
    
  },
  beforeDestroy(){
    this.broadcastsRef ? this.broadcastsRef() : ''
  }
}

import { mapGetters, mapState } from 'vuex'
  import Gallery from 'vue-gallery'
  import NavigationList from '@/components/NavigationList'
  import DefaultLeftLayout from '@/views/DefaultLeftLayout'
  // import ForumLayout from "@/views/ForumLayout"
  // import NewEvent from '@/components/events/NewEvent'
</script>

<style lang='scss' >

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
$secondary: #1867c0;
$pink: rgb(238, 68, 170);

// .theme--dark.v-card {
//   background-color: rgb(38, 57, 80) !important;
//   border-color: rgb(48, 62, 78) !important;
// }

a {
    text-decoration: none;
  }

.v-btn {
  text-transform: capitalize !important;
}

.home-list {
  .v-list-item .v-icon {
    font-size: 22px;
    color: #adabab
  }
  
  .v-list-item__action {
    margin: 0;
  }

  .v-list-group__header.v-list-item--active {
    color: $pink;
  }
}

pre {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: 0.0071428571em;
  width: 100%;
  font-family: inherit;
  white-space: pre-line;
}

@mixin borderTopRadius($radius) {
  border-top-right-radius: $radius;
  -webkit-border-top-right-radius:$radius;
  -moz-border-top-right-radius:$radius;
  -o-border--top-right-radius:$radius;
  border-top-left-radius: $radius;
  -webkit-border-top-left-radius:$radius;
  -moz-border-top-left-radius:$radius;
  -o-border--top-left-radius:$radius;
}

@mixin borderTopRightRadius($radius){
  border-top-right-radius: $radius;
  -webkit-border-top-right-radius:$radius;
  -moz-border-top-right-radius:$radius;
  -o-border--top-right-radius:$radius;
}
@mixin borderTopLeftRadius($radius){
  border-top-left-radius: $radius;
  -webkit-border-top-left-radius:$radius;
  -moz-border-top-left-radius:$radius;
  -o-border--top-left-radius:$radius;
}
@mixin borderBottomRightRadius($radius){
  border-bottom-right-radius: $radius;
  -webkit-border-bottom-right-radius:$radius;
  -moz-border-bottom-right-radius:$radius;
  -o-border--bottom-right-radius:$radius;
}
@mixin borderBottomLeftRadius($radius){
  border-bottom-left-radius: $radius;
  -webkit-border-bottom-left-radius:$radius;
  -moz-border-bottom-left-radius:$radius;
  -o-border--bottom-left-radius:$radius;
}
.round_top{
  @include borderTopRadius(7px);
}
.round {
  @include borderRadius(7px);
}

.round-top-right {
  @include borderTopRightRadius(7px)
}
.round-top-left {
  @include borderTopLeftRadius(7px)
}
.round-bottom-right {
  @include borderBottomRightRadius(7px)
}
.round-bottom-left {
  @include borderBottomLeftRadius(7px)
}

.round-1 {
  @include borderRadius(3px)
}

.round-2 {
  @include borderRadius(5px)
}
.round-3 {
  @include borderRadius(7px)
}

.magnify {
  cursor: zoom-in;
}

.dragify {
  cursor: grab;
}

.linkify {
  cursor: pointer;
}
.linkified{
  color: $secondary;
  text-decoration: none;
  cursor: pointer;
}
.text-lowercase {
  text-transform: lowercase;
}
.text-normal {
  text-transform: initial !important;
}

.v-application .bgd__card {
  border-color: #c0cdd9 !important;
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

#pay_card {
  background: url('../assets/abstract.png');
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.online_badge{
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 5px;
  border: 1px solid #fff;
}
.online {
  background: #4caf50;
  
}
.offline {
  background: #ff9800;
}

</style>
