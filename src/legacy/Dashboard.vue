<template>
  <v-app>
    <v-content>
      <transition name="fade" mode="out-in">

        <v-overlay v-if="!showUi"
          :opacity=".7"
          :value="true"
        >
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <div v-else>
          
          <vue-headful :title="title"/>

          <v-navigation-drawer fixed v-model="drawer" 
            app width="230" :mini-variant="mini"
            dark color="#1c1f35"
            class="navdrawr">
            <v-toolbar flat tile id="step1" dense
              style="background-color: rgba(51, 54, 78, 0.9); color:bfbbbb; z-index:20">
              <v-avatar
                size="40"
                color="transparent"
              >
                <img src="@/assets/logo-50x50.png" alt="logo">
              </v-avatar>

              <v-toolbar-title class="ml-4" v-show="!mini">{{$appName}}</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>

            <v-list class="py-0" dense style="background-color: rgba(51, 54, 78, 0.9);">
              
              <v-list-item>
                <v-list-item-content>

                  <v-list-item-title>
                    {{curRoom ? curRoom.title : ''}}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>

                    <template v-slot:activator="{on}">
                      <v-btn icon dark v-on="on">
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense class="pt-0">
                      <v-toolbar dense flat color="grey lighten-3">
                        Switch Dashboard context
                      </v-toolbar>
                      <v-divider></v-divider>
                      <v-list-item 
                        @click="$store.dispatch('curRoom', election)"
                        class=""
                        v-for="election in getMyEnrolled" 
                        :key="election.electionId">
                        <v-list-item-title>
                          {{election.title}}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-list dense nav class="home-list">
        
              <v-list-item to="/home" exact >
                <v-list-item-action>
                  <v-icon color="grey lighten-1">mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <!-- FORUM -->
              <v-list-item :to="curRoom ? '/forum/' + curRoom.electionId : '/forum/d'">
                <v-list-item-action>
                  <v-icon color="grey lighten-1">mdi-forum</v-icon>
                </v-list-item-action>
                <v-list-item-title>Forum</v-list-item-title>
              </v-list-item>

              <!-- Messages -->
              <v-list-group prepend-icon="mdi-message-text" no-action :value="true">
                <v-list-item slot="activator">
                  <v-list-item-title>Messages</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openBroadcastDialog">
                  <v-list-item-action>
                    <v-icon color="success">mdi-inbox</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Inbox</v-list-item-title>
                  <v-list-item-action v-show="getUnreadLength > 0">
                    <v-badge right color="red">
                      <span class="caption" slot="badge">{{getUnreadLength}}</span>
                    </v-badge>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item 
                  @click="isSuperUser ? new_broadcast = true : $router.push('/upgrade')" 
                >
                  <v-list-item-action>
                    <v-icon color="">mdi-bullhorn</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>New Broadcast </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <!-- ELECTIONS -->
              <v-list-group prepend-icon="mdi-poll-box" no-action :value="false">
                <v-list-item slot="activator">
                  <v-list-item-title>Elections</v-list-item-title>
                </v-list-item>
                <v-list-item  to="/elections/create">
                  <v-list-item-action>
                    <v-icon color="success">mdi-plus-box</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Create</v-list-item-title>
                </v-list-item>

                <v-list-item :to=" curRoom ? '/elections/' + curRoom.electionId : '#'">
                  <v-list-item-action>
                    <v-icon color="info">mdi-vote-outline</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Vote</v-list-item-title>
                </v-list-item>
                <v-list-item  to="/contest">
                  <v-list-item-action>
                    <v-icon color="">mdi-trophy</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Contest</v-list-item-title>
                </v-list-item>

              </v-list-group>
              
              <v-list-item to="/discover" exact >
                <v-list-item-action>
                  <v-icon color="teal">mdi-pound-box</v-icon>
                </v-list-item-action>
                <v-list-item-title>Discover</v-list-item-title>
              </v-list-item>

              <v-list-item :to="curRoom ? '/campaigns' : '#campaigns'" exact >
                <v-list-item-action>
                  <v-icon color="teal">mdi-atom-variant</v-icon>
                </v-list-item-action>
                <v-list-item-title>Campaigns</v-list-item-title>
              </v-list-item>

              <!-- HELP -->
              <v-list-item href="https://support.voteryte.com" target="blank">
                <v-list-item-action>
                  <v-icon color="">mdi-help-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Help</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-icon small>mdi-open-in-new</v-icon>
                </v-list-item-avatar>
              </v-list-item>

              <v-divider></v-divider>

              <!-- NOT SUPERUSER -->
              <v-list-item v-if="!isSuperUser">
                <v-list-item-content>
                  <v-btn color="success" block @click="$router.push('/upgrade')">
                    <v-icon color="secondary" class="mr-2">mdi-star</v-icon>
                    Upgrade</v-btn>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="isSuperUser" 
                style="background: rgb(47, 50, 74);"
                to="/settings#subscriptions">
                <v-list-item-action>
                  <v-icon color="orange">mdi-flash-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Premium User</v-list-item-title>
                  <v-list-item-subtitle>Manage plan</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              
              <!-- Update available -->
              <v-list-item v-if="appUpdateAvailable" class="elevation-2 black" @click="updateApp">
                <v-list-item-action>
                  <v-icon color="orange">mdi-update</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="orange--text">Update Available</v-list-item-title>
                  <small>Click to refresh</small>
                </v-list-item-content>
              </v-list-item>
            
                <footr/>
            </v-list>
            <!-- <template v-slot:append>
              <div class="pa-2">
              </div>
            </template> -->
            
          </v-navigation-drawer>
          
          

          <!-- SNACKBAR -->
          <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" bottom right>
            {{snackbar.message}}
            <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <router-view ></router-view>
              
        

          <!-- GALLERY VIEWER -->
          <gallery :images="images" :index="index" @close="index = null"></gallery>
          
          <!-- Broadcast Dialog -->
          <v-dialog v-model="broadcast_dialog" max-width="1000"
            :fullscreen="$vuetify.breakpoint.smAndDown" hide-overlay scrollable>
            <v-card flat class="pa-0">
              <v-card-text class="pa-0">
                <broadcast v-if="broadcast_dialog" style="min-height:300px;background:#fff;"></broadcast>
              </v-card-text>
            </v-card>
            
          </v-dialog>
          
          <!-- NEW BROADCASTs -->
          <new-broadcast v-if="new_broadcast" ></new-broadcast>

          
          <!-- PROFILE CARD -->
          <profile-card></profile-card>

          <input type="file" name="file" class="d-none" id="file_img" style="visibility:hidden;position:absolute;" 
            @change="onFileSelect($event)" accept="image/jpeg,image/png/gif" multiple>

        </div>


      </transition>

      <v-overlay v-if="overlay.show"
        :opacity="overlay.opacity || .3"
        :value="overlay.show"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () =>({
    showUi: false,
    index: null, // for image gallery viewer
    images: [], // for image gallery viewer
    new_broadcast: false,
    broadcasts: '',
    broadcastsRef: '', // for clearing watcher
    broadcast_dialog: false,
    snackbar: {},
    new_manifesto_dialog: false,
    drawer: true,
    mini: false,
    drawer_right: false,
    drawer_right_persist: false,
    appUpdateAvailable: window.appUpdateAvailable,
    overlay: {
      show: false,
      opacity: .3,
    },
  }),
  components:{
    ProfileCard,
    Broadcast,
    Gallery,
    NewBroadcast,
    footr: Footer
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
  
        }, 1500)
      }
      
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled',
      'getUnreadLength'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'is_verified',
      'isAuthenticated'
    ]),
    title(){
      return `Dashboard | ${this.$appName}`
    },
  },
  
  methods:{
    async initialize () {
      

      let elections = []

      this.$gun.get('users')
        .get(this.getUser.username)
        .get('enrolled')
        .map()
        .on(data => {
          console.log(data)
          elections.push(data)
        })

      
      this.getBroadcasts()

      let sorted = elections.sort((a,b) => b.dateCreated - a.dateCreated)
      console.log(sorted)

      setTimeout(() => this.$store.dispatch('curRoom', sorted[0] || []), 1000)
      console.log(this.$store.state.curRoom)
      
      this.$store.dispatch('setMyEnrolled', sorted)

      // remove the authResponse query string
      this.$route.query.authResponse ?
      this.$router.replace('/home') : ''



      // let epriv = this.$gUser['_'].sea.epriv

      // this.$gUser.get('subs').on(async sub => {
      //   let dec = await this.$SEA.decrypt(sub, epriv)
      //   let thirty_days = 30 * 24 * 60 * 60 * 1000

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
    openBroadcastDialog(){
      this.$vuetify.breakpoint.smAndDown ? 
      this.dialog = false : ''

      this.broadcast_dialog = true
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
    isMobile() {
      return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
    },
    updateApp(){
      window.location.reload(true)
    }
  },
  async mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
      document.querySelector('body').style.backgroundColor = '#fff'

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

      this.$eventBus.$on('Toggle_New_Broadcast', data=>{
        this.new_broadcast = data
      })
      

      this.$eventBus.$on('ToggleInboxDialog', data =>{
        this.broadcast_dialog = data
      })
      
      this.$eventBus.$on('OpenNewManifestoDialog', ()=>{
        this.new_manifesto_dialog = true
      })
      this.$eventBus.$on('CloseNewManifestoDialog', ()=>{
        this.new_manifesto_dialog = false
      })
      

      this.$eventBus.$on('Open_Image_Gallery', data=>{
        this.images = data.images
        this.index = data.index
      })

      this.$eventBus.$on('bdialog', ()=> this.new_broadcast = false)
      
      this.$eventBus.$on('Snackbar', data =>{
        this.snackbar = data
      })

      this.$eventBus.$on('Overlay', data =>{
        this.overlay = data
      })

    this.$vuetify.breakpoint.smAndDown ? 
      this.drawer = false : this.drawer = true
    
    this.$eventBus.$on('Change_Title', (data)=>{
      //console.log('changing the title')
      this.title = data
    })

  },
  async created(){
    
  },
  beforeDestroy(){
    this.broadcastsRef ? this.broadcastsRef() : ''
  }
}

import { mapGetters, mapState } from 'vuex'
  import Broadcast from '@/components/Broadcast'
  import Gallery from 'vue-gallery';
  import NewBroadcast from '@/components/dialogs/NewBroadcast'
  import ProfileCard from '@/components/ProfileCard'
  import Footer from '@/components/Footer'
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
.round_top{
  @include borderTopRadius(10px);
}

.round {
  @include borderRadius(10px);
}

.round-1 {
  @include borderRadius(5px)
}

.round-2 {
  @include borderRadius(7px)
}

.magnify {
  cursor: zoom-in;
}

.dragify {
  cursor: grab;
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
  text-transform: initial;
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
