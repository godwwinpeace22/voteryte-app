<template>
  <div>
    <vue-headful :title="`${user.name} | ${$appName}`"/>

    <navigation>
      <span slot="title">Profile</span>
    </navigation>

      <v-skeleton-loader
        v-if="!showUi"
        class="mb-6"
        type="card-avatar, article, actions"
      ></v-skeleton-loader>

      <v-row justify="center" v-if="showUi">
        
        <v-col cols="12">
          <v-card outlined min-height="300">
            <v-sheet height="200">
              <v-img :src="user.header_img || require('@/assets/profile-background.jpg')" height="100%" width="100%"></v-img>
            </v-sheet>

            <v-card flat tile>
              <div :style="avtStyle" >
                <!-- <v-avatar
                  :size="$breakpoint.smAndDown ? 80 : 105"
                  color="white"
                  class="elevation-1 pt-1 ml-3 d-inline-block"
                > -->
                  <v-avatar
                    class="elevation-1"
                    :size="$breakpoint.smAndDown ? 112 : 101"
                    color="grey lighten-3" 
                  >
                    <img :src="user.photoURL || require('@/assets/profile.jpg')" 
                      alt="profile_pic" v-if="user.photoURL">
                    <span v-else class="display-2">{{user.name ? user.name.charAt(0) : 'u'}}</span>
                  </v-avatar>
                  <!-- <v-badge
                    bordered
                    bottom
                    color="success"
                    
                    offset-x="20"
                    offset-y="18"
                  >
                    <v-avatar size="100">
                      <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
                    </v-avatar>
                  </v-badge> -->
                <!-- </v-avatar> -->
              </div>

              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="info" class="text-capitalize" 
                  depressed
                  v-if="user.username != getUser.username"
                  @click="follow" :disabled="disabled">
                  {{ is_following ? 'Unfollow' : 'Follow' }}
                  <!-- {{user.followers_count}} -->
                </v-btn>

                <v-btn color="info" class="text-capitalize" 
                  depressed v-if="user.username == getUser.username"
                  to="/settings" outlined>
                  Edit Profile
                </v-btn>

              </v-card-actions>
            </v-card>

            <v-sheet color="transparent" class="">

              <v-list color="transparent" class="mt-5 pb-0" dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title >
                      <span class="text-capitalize mr-2 font-weight-bold title">{{user.name}}</span>
                      <v-icon 
                          class=" mt-n2" 
                          color="success"
                          v-if="!is_verified"
                        >
                        mdi-check-decagram
                      </v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle>@{{user.username}}</v-list-item-subtitle>

                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>

              <div>
                <span class="pl-4" text v-if="user.is_student">{{user.title}}</span>
                
                <v-btn 
                  color="info" 
                  class="px-2 ml-2" text 
                >
                  {{user.followers_count || 0}} followers
                </v-btn>
              </div>

            </v-sheet>
            <v-subheader class="font-weight-bold " style="">About</v-subheader>

            <v-card-text class="pt-0">
              {{user.about}}
            </v-card-text>

            <!-- <v-slide-group show-arrows class="ml-3 mb-1">
              <v-slide-item
                v-for="item in menu_items.filter(itm => itm.show != false)"
                :key="item.text"
                
                v-slot:default="{ active, toggle }"
              >
                <v-btn
                  class="mr-1 text-capitalize" text
                  :input-value="active"
                  active-class="primary white--text"
                  depressed exact
                  :to="item.link"
                  @click="toggle"
                >
                  {{ item.text }}
                </v-btn>
              </v-slide-item>
            </v-slide-group> -->
            
          </v-card>
          
          <!-- <v-divider v-show="$route.name != 'user_posts'"></v-divider> -->

          <!-- <v-card flat tile min-height="200">
            
            <router-view></router-view>
          </v-card> -->

        </v-col>
        
      </v-row>

      

  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    posts: [],
    events: [],
    is_following: '',
    disabled: false,
    user: {}
  }),
  watch: {
    username(){
      this.showUi = false
      setTimeout(() => {
        this.initialize()
      }, 500);
    },
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([
      'is_verified'
    ]),
    username(){
      return this.$route.params.username
    },
    $breakpoint(){
      return this.$vuetify.breakpoint
    },
    avtStyle(){
      if(this.$breakpoint.smAndDown){

        return {position: 'absolute',top: '-70px'}
      }
      else {

        return {position: 'absolute', top: '-46px', left: '8px'}
      }
    },
    menu_items(){

      let baseUrl = `/users/${this.username}`
      return [
        {text: 'Posts', link: `${baseUrl}`},
        {text: 'Followers', link: `${baseUrl}/followers`},
        // {text: 'Events', link: `${baseUrl}/events`},
      ]
    },
  },
  methods: {
    initialize(){
      this.getUserPosts()
      // this.getUserEvents()

      this.$gun.get('users').get(this.username)
        .get('followers')
        .get(this.getUser.username)
        .on(d => {
          // console.log({d})
          this.is_following = d ? !!d : false
        })
      
      this.getProfile()
    },
    async getProfile(){
      
      this.user = await this.$gun.get('users')
        .get(this.username)
        .then()
        // console.log(this.user)

      this.showUi = true
    },
    async getUserPosts(){
      
      this.$gun.get('users').get(this.username)
        .get('posts')
        .map()
        .once(async (p, key) => {
          // console.log('posts: => ', p)
          p.key = key
          p.author = this.user
          this.posts.find(item => item.key == p.key) ? '' : 
          this.posts.push(p)
        })
      
    },
    async follow(){
      try {

        this.disabled = true
        await this.followUser(this.getUser, this.user)

        this.disabled = false
      } catch (error) {
        console.log(error)
        this.disabled = false
      }
    },
    followUser(follower, followee){
      return new Promise(async (resolve, reject)=>{
        // helper function to follow a user
        // followee is the one to be followed by follower
        
        try {
          
          let followeeRef = this.$gun.get('users').get(followee.username)
          let followees_count = followee.followers_count || 0

          console.log({followeeRef, followees_count})
          
          let is_following = await followeeRef.get('followers')
          .get(follower.username).then()
          console.log({is_following})
          
          // await this.sleep()
          if(is_following){
            // unfollow
            followeeRef
              .get('followers')
              .get(follower.username)
              .put(null)
    
              followeeRef.get('followers_count')
                .put(followees_count - 1)

              resolve({following: false})
    
          }
    
          else{
            
            // follow a user
    
            followeeRef
              .get('followers')
              .get(follower.username)
              .put(true)
              
            followeeRef.get('followers_count')
              .put(followees_count + 1)
            
            // followerRef.get('followers_count')
            //   .put(followers_count + 1)
            
              resolve({following: true})
          }
        } catch (error) {
          console.log(error)
          reject({success: false})
        }
      })
      
    },
  },
  mounted(){
    this.initialize()

  },

}


import { mapState, mapGetters } from "vuex";
// import PostTemplate from '@/components/feed/PostTemplate'

</script>
