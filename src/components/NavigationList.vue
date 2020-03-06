<template>
  <v-card outlined class="" tile
  >
    
    <template>
      <v-list dense class="bgd__card" v-show="!mini">
        <v-list-item>
          <v-list-item-avatar>
            <img :src="require('@/assets/firebase.png')" alt="logo">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="text-uppercase font-weight-bold"
            >
              {{$appName}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item >
          <v-list-item-avatar 
            tile color="grey lighten-2" 
            class="round-1">
            <v-img
              :src="curRoom.logo"
              v-if="curRoom && curRoom.logo">
            </v-img>
            <span v-else>{{curRoom ? curRoom.title.charAt(0) : ''}}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title 
              class="linkify"
              @click="$router.push(`/elections/${curRoom.electionId}`)">
              {{curRoom ? curRoom.title : ''}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{curRoom ? curRoom.electionId : ''}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu offset-y>

              <template v-slot:activator="{on}">
                <v-btn icon v-on="on">
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

      <v-list nav class="bgd__card" flat dense>
        <v-list-item-group v-model="item" color="primary">
          <template v-for="item in list">
            
            <v-list-item
              :to="item.link"
              exact
              :key="item.text">

              <v-list-item-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-action>
              <v-list-item-title 
                class="text-capitalize">
                {{item.text}}
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="item.text == 'Discover'" :key="item.text + 'div'"></v-divider>
          </template>
        </v-list-item-group>

        <v-divider></v-divider>

        <!-- NOT SUPERUSER -->
        <!-- <v-list-item v-if="!isSuperUser">
          <v-list-item-content>
            <v-btn color="success" depressed to="/upgrade">
              <v-icon color="secondary" class="mr-2">mdi-flash-circle</v-icon>
              Get Premium</v-btn>
          </v-list-item-content>
        </v-list-item> -->

        <!-- <v-list-item v-else
          to="/settings#subscriptions" >
          <v-list-item-action>
            <v-icon color="orange">mdi-flash-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="success--text">Premium User</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        
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
      </v-list>

      <div class=" mt-4 px-2 text-right" v-show="!mini">

        <v-btn class="px-1" x-small href="https://help.voteryte.com" target="_blank" text>Help</v-btn>
        <v-btn class="px-1" x-small text href="https://voteryte.com/terms" target="_blank">Terms</v-btn>
        <v-btn class="px-1" x-small text href="https://voteryte.com/privacy-policy" target="_blank">Privacy policy</v-btn>
        <v-btn class="px-1" x-small text @click="$store.dispatch('logout')">Logout</v-btn>
        <br>
        <v-btn class="px-3" x-small text> &copy; 2020 Voteryte </v-btn>
      </div>
    </template>
  </v-card>

  
</template>
<script>

export default {
  data: () => ({
    item: 1,
    appUpdateAvailable: window.appUpdateAvailable,
  }),
  props: ['mini'],
  computed: {
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    ...mapGetters([
      'getMyEnrolled',
      'getUser'
    ]),
    list(){
      return [
        {text: 'Home', link: '/home', icon: 'mdi-home-variant'},
        // {text: 'Forum', link:  this.curRoom && this.curRoom.electionId ? `/forum/${this.curRoom}` : '#', icon: 'mdi-forum'},
        // {text: 'Messages', link: '/messages/received', icon: 'mdi-bullhorn'},
        {text: 'Elections', link: this.curRoom && this.curRoom.electionId ? `/elections/${this.curRoom.electionId}` : '#', icon: 'mdi-poll-box'},
        // {text: 'Campaigns', link: '/campaigns', icon: 'mdi-calendar'},
        {text: 'Discover', link: '/discover', icon: 'mdi-pound-box'},
        {text: 'Profile', link: `/users/${this.getUser.username}`, icon: 'mdi-account-box', hidden: 'hidden-xs-only'},
        {text: 'Settings', link: '/settings', icon: 'mdi-settings', hidden: 'hidden-xs-only'}
      ]
    },
    filteredList(){
      return this.list.filter(item => item.hidden)
    },
    navStyle(){
      return this.$vuetify.breakpoint.mdAndUp ? {marginLeft: '17%'} :
      {marginLeft: '2%'}
    }
  },
  methods: {
    updateApp(){
      window.location.reload(true)
    }
  }
}


import { mapState, mapGetters } from 'vuex'
</script>
<style lang="scss" scoped>
  .nav_list {
    margin-left: 17%;
  }
</style>