<template>
  <div>
    <v-container>
      <transition name="fade">
        <v-card min-height="320" v-if="showUi" outlined>
          <v-subheader >Terms and Conditions</v-subheader>
          <v-card-text>
            {{currElection.terms}}
          </v-card-text>
          
        </v-card>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    currElection: {},
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
    ...mapState([
      
    ]),
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async initialize(){
      
      // let voters = []
      this.$gun.get('elections')
        .get(this.electionId)
        .once(el => {
          this.currElection = el

          this.showUi = true
        })
      
      
    },
  },
  mounted(){
    this.initialize()
    
  },
  destroyed(){
    // this.votersRef.off()
  }
}

import { mapGetters, mapState } from "vuex";
</script>

