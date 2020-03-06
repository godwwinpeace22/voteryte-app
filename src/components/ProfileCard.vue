<template>
  <div>
    <v-dialog
      v-model="show_profile"
      :close-on-content-click="false"
      max-width="300"
      >
      <v-card height="" width="" tile >
        <v-card-text class="">
          <v-row class="pt-2" justify="center">
            <v-col class="pa-0 pt-1" cols="6" style="position: relative;">

              <v-avatar
                size="137"
                color="white"
                class="elevation-1 pt-1 ml-1 d-inline-block"
              >
                <v-avatar
                  size="130" class=""
                  color="grey lighten-3"
                >
                  <img :src="selectedProfile.photoURL || require('@/assets/profile.jpg')" 
                    alt="profile_pic" v-if="selectedProfile.photoURL">
                  <span v-else class="display-2">{{selectedProfile.name ? selectedProfile.name.charAt(0) : ''}}</span>
                </v-avatar>
              </v-avatar>

              <span :class="{online: selectedProfile.is_online, offline: !selectedProfile.is_online, online_badge: true}" 
                style="width: 20px;height:20px;position: absolute;bottom:8%;right:7px;">
              </span>
            </v-col>
            <v-col class="py-0 text-center" cols="12">
              <div>
                
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title 
                        style="cursor: pointer;"
                        class="title text-capitalize" 
                        @click="show_profile = false; $router.push('/users/' + selectedProfile.username)">
                        {{selectedProfile ? selectedProfile.name : ""}}
                        
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="selectedProfile && selectedProfile.title">
                        {{selectedProfile ? selectedProfile.title : ''}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <!-- <v-btn text small>{{ selectedProfile.followings_count || 0}} Following</v-btn> -->
                <v-btn text small class="mr-2">@{{selectedProfile.username}}</v-btn>
                <v-btn depressed color="primary" small v-if="selectedProfile.username == getUser.username">
                  {{ selectedProfile.followers_count || 0}} Followers
                </v-btn>

              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pl-0">
              <v-card-actions class="pl-0">
                <v-btn color="info" depressed
                  v-if="selectedProfile.username != getUser.username"
                  class="mx-auto text-capitalize"
                  :disabled="disabled"
                  @click="follow">
                  {{is_following ? 'Unfollow' : 'Follow'}}
                  {{selectedProfile.followers_count || 0}}
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    show_profile: false,
    disabled: false,
    is_following: '',
  }),
  watch: {
    'selectedProfile': function(to, from){
      
      this.show_profile = !!to.name
    },
    show_profile: function(to,from){
      
      setTimeout(() => {
        
        if(to == false){
          this.$store.dispatch('openProfile', {})
        }
      }, 300);
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'selectedProfile'
    ]),
    center(){
      return {
        x: document.body.clientWidth/2,
        y: document.body.clientHeight/2
      }
    },
    followers(){
      let arr = []
      this.$gun.get('users')
        .get(this.selectedProfile.username)
        .get('followers')
        .map()
        .on((f,key)=> {
          
          f ? arr.push(f) : ''
          // console.log({f,key})
        })
      return uniqBy(arr, 'username')
    },
    isFollowing(){
      let is_following = !!this.followers
      .find(f => f.username == this.getUser.username)
      // console.log(is_following)
      return is_following
    },

  },
  methods: {
    async follow(){
      this.disabled = true
      try {
        
        await this.$helpers.followUser(this.getUser, this.selectedProfile)
        
        this.disabled = false

      } catch (error) {
        this.disabled = false
        console.log(error)
      }
      
    },

    initialize(){

      this.$gun.get('users').get(this.selectedProfile.username)
        .get('followers')
        .get(this.getUser.username)
        .on(d => {
          console.log({d})
          this.is_following = d ? !!d : false
        })
    }
  },
  mounted(){
    this.initialize()
  }
}
import { mapState, mapGetters } from 'vuex';
import { uniqBy } from "lodash";
</script>