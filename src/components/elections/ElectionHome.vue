<template>
  <div v-if="showUi">
    <navigation color="primary">
			<template v-slot:title>
        <span>{{currElection.title}}</span>
      </template>

      <template v-slot:extension>
        
        <v-slide-group show-arrows>
          <v-slide-item
            v-for="item in menu_items"
            :key="item.text"
            v-slot:default="{ active, toggle }"
          >
            <v-btn 
              v-if="!item.hidden"
              class="mr-1 text-capitalize" tile
              :input-value="active" color=""
              active-class="white--text"
              text exact :class="item.class"
              :to="item.link"
              @click="toggle"
            >
              {{ item.text }}
            </v-btn>
          </v-slide-item>
        </v-slide-group>

      </template>
    </navigation>
    
    <vue-headful
      :title="title"
    />

    <router-view></router-view>
    <!-- <v-fab-transition>
      <v-btn v-if="isAdmin && $vuetify.breakpoint.smAndDown"
        key="activefab"
        color="success"
        fab large dark
        @click="$router.push(`/elections/${electionId}/manager`)"
        bottom right
        class="mt-" fixed
      >
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-fab-transition> -->
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    currElection: {},
    elecRef: '',
  }),
  props:['electionId'],
  watch: {
    electionId: function(to){
      to ? this.setup() : ''
    }
  },
  computed: {
    title(){
      return `${this.currElection ? this.currElection.title : 'Vote '} | ${this.$appName}`
    },
    description(){return ''},
    menu_items(){
      
      let baseUrl = `/elections/${this.electionId}`
      return [
        {text: 'About', link: `${baseUrl}`},
        {text: 'Contestants', link: `${baseUrl}/contestants`,},
        // {text: 'Voters', link: `${baseUrl}/voters`, class: ['hidden-xs-only'], hidden: this.currElection.type == 'Others'},
        // {text: 'Manifestos', link: `${baseUrl}/manifestos`, class: ['hidden-xs-only'], hidden: !this.currElection.allow_manifestos},
        {text: 'Results', link: `${baseUrl}/results`, class: ['hidden-xs-only'], hidden: !this.isAdmin && !this.currElection.results_visible_to_all},
        {text: 'Terms', link: `${baseUrl}/terms`},
        {text: 'Settings', link: `${baseUrl}/manager`, hidden: !this.isAdmin}
      ]
    },
    isAdmin(){
      // console.log(this.k)
      return this.currElection.admin &&
      this.currElection.admin == this.getUser.username
    },
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    setup(){
      if(this.electionId){
        
        this.$gun.get('elections')
        .get(this.electionId)
        .on(election => {
          
          if(election){
            
            this.currElection = election
            this.showUi = true
            
          }
          
        })
      }
    }
  },
  mounted(){
    
    this.setup()

  },
  destroyed(){
    // this.elecRef.off()
  },
  components: {
    Navigation
  }
}

import Navigation from '@/components/Navigation'
import { mapGetters } from 'vuex'
</script>
