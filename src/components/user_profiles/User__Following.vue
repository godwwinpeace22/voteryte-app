<template>
  <div>
    <v-container v-if="showUi">
      <v-row justify="center">
        <v-col sm="12" md="8">
          <div class="text-center" v-if="following.length == 0">No followings yet</div>
          <v-card outlined v-else min-height="300">
            <v-list>
              <template v-for="(follower,i) in following">
                <v-list-item 
                  :key="follower.username" 
                  @click="''">
                  <v-list-item-avatar :color="$helpers.colorMinder(follower.name.charAt(0))">
                    <span>{{follower.name.charAt(0)}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{follower.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      @{{follower.username}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="accent" rounded depressed small outlined>Follow</v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="follower.username + 'c'" v-if="i+1 < following.length"></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    following: [],
    showUi: false,
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
      this.getFollowing()
    },
    async getFollowing(){
      let followingRef = this.$gun
        .get('users')
        .get(this.username)
        .get('following')

        followingRef
        .map()
        .once(d => {
          console.log('following: => ', d)
          this.following.find(f => f.username == d.username) ? '' : 
          this.following.push(d)
        })
      this.showUi = true
        
    },
  },
  mounted(){
    this.initialize()
  }
}

import { mapState, mapGetters } from "vuex";
</script>
