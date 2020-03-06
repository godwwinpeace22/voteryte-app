<template>
  <div>

    <navigation/>
    
    <v-container>

      <v-row>
        <v-col cols="12" sm="3" v-for="stat in stats" :key="stat.title">
          <v-card class="text-center" flat style="border: 1px solid #eee;" height="90">
            
            <v-list>
              <v-list-item>
                
                <v-list-item-content>
                  <v-list-item-subtitle class="font-weight-bold">{{stat.title}}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold">{{stat.value}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar >
                  <v-icon large :color="stat.iconColor">{{stat.icon}}</v-icon>
                </v-list-item-avatar>
              </v-list-item>
              
            </v-list>
          </v-card>
          
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <profile-viewers></profile-viewers>

        </v-col>

        <v-col cols="12">
          <!-- <contestants-insight></contestants-insight> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    user_contests: [],
    user_created: [],
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
    async user(){
      return await this.$gun.get('users').get(this.username)
        .then()
    },
    isSameUser(){
      return this.getUser.username == this.username
    },
    stats(){
      return [
        {title:'Posts', value: this.user.posts ? this.user.posts.toLocaleString() : 0, icon: 'mdi-equalizer', iconColor: 'cyan'},
        {title:'Followers', value: this.user.followers_count ? this.user.followers_count.toLocaleString() : 0, icon: 'mdi-account-group',iconColor:'secondary'},
        {title:'Following', value: this.user.followings_count ? this.user.followings_count.toLocaleString() : 0, icon: 'mdi-account-group',iconColor:'secondary'},
        {title:'Contests', value: this.user_contests.length.toLocaleString(), icon:'mdi-trophy', iconColor:'orange'},
        // {title:'Elections', value: this.user_created.length.toLocaleString(), icon: 'mdi-vote', iconColor:'success'},
      ]
    },
  },
  methods: {

  },
  mounted(){

  },
  components: {
    ProfileViewers,
    ContestantsInsight,
  }
}

import { mapState, mapGetters } from "vuex"
import ProfileViewers from '@/components/elections/ProfileViewers'
import ContestantsInsight from '@/components/elections/ContestantsInsight.vue';
</script>
