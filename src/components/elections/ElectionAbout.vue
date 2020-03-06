<template>
  <div>
    <transition name="fade">
      <v-container class='election_details' v-if="showUi">
        <v-row row wrap>
          <v-col cols="12">
            <v-card outlined min-height="400">

              <v-subheader class="font-weight-bold">About</v-subheader>
              <v-card-text>
                <v-img 
                  width="100%"
                  max-height="600"
                  :src="currElection.contest_banner" 
                  v-if="currElection.contest_banner">

                </v-img>
                <div v-html="currElection.about">
                  
                </div>
              </v-card-text>

              <v-subheader class="font-weight-bold">Organizer</v-subheader>
              <v-list three-line>
                <v-list-item :to="'/users/' +organizer.username">
                  <v-list-item-avatar 
                    size="60" class="white--text" 
                    :color="$helpers.colorMinder(organizer.name.charAt(0))">

                    <v-img :src="organizer.photoURL" v-if="organizer.photoURL"></v-img>
                    <span v-else>{{organizer.name.charAt(0)}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{organizer.name}}
                      <v-icon 
                        class="ml-1"
                        color="success"
                        v-if="!organizer.is_verified"
                      >
                        mdi-check-decagram
                      </v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      @{{organizer.username}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{organizer.about}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-text>
              </v-card-text>

              <v-subheader class="font-weight-bold">Terms and conditions</v-subheader>
              <v-card-text>
                Read the 
                <router-link :to="`/elections/${currElection.electionId}/terms`">
                  terms and conditions
                </router-link>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    currElection: {},
    activities: [],
    elecRef: '',
    organizer: {},
  }),
  watch: {
    electionId: function(to){
      to ? this.initialize() : ''
    }
  },
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
  },
  methods: {
    initialize(){
      this.$gun.get('elections')
        .get(this.electionId)
        .on(async e => {
          this.currElection = e;
          
          this.organizer = await this.getOrganizer()
          this.showUi = true
        })
    },
    async getOrganizer(){
      return await this.$gun.get('users')
        .get(this.currElection.admin)
        .then()
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
        case 'election_created':
          return 'primary'
        case 'election_updated':
          return 'error'
        case 'logo_updated':
          return 'secondary'
        case 'new_contestant':
          return 'teal'
        case 'vote_casted':
          return 'success'
        case 'contestant_suspended':
          return 'black'
        case 'contestant_restored':
          return 'success'
        default:
          return 'white'
      }
    },
  },
  async mounted(){
    this.initialize()
  },
  destroyed(){
    // this.elecRef.off()
  },
  components: {
    
  }
}

</script>


