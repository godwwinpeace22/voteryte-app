<template>
  <div>

    <div class="text-center pa-3" v-if="followers.length == 0">No followers yet</div>
  
    <v-list v-if="showUi">
      <template v-for="(follower,i) in followers">
        <v-list-item 
          :key="follower.username"
          @click="$router.push('/users/' + follower.username)">
          <v-list-item-avatar :color="$helpers.colorMinder(follower.name.charAt(0))">
            <v-img :src="follower.photoURL" v-if="follower.photoURL"></v-img>
            <span v-else>{{follower.name ? follower.name.charAt(0) : ''}}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{follower.name}}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{follower.username}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <!-- <v-list-item-action>
            <v-btn color="accent" rounded depressed small outlined>Follow</v-btn>
          </v-list-item-action> -->
        </v-list-item>
        <v-divider :key="follower.username + 'c'" v-if="i < 4"></v-divider>
      </template>
    </v-list>
        
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    followers: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
  },
  methods: {
    initialize(){
      this.getFollowers()
    },
    async getFollowers(){
      let followerRef = this.$gun.get('users')
        .get(this.username)
        .get('followers')

        followerRef
        .on(d => {

          // console.log('followers: => ', d)
          if(d){

            let followers = Object.keys(d).filter(f => d[f] == true)
  
            let fol = followers.map(async f => {
              let u = await this.$gun.get('users').get(f).then()
              return u
            })
  
            Promise.all(fol).then(all => {
              this.followers = all
              this.showUi = true
            })
          }
          else {
            this.showUi = true
          }


        })
        
    },
  },
  mounted(){
    this.initialize()
  }
}

import { mapState, mapGetters } from "vuex";
</script>
