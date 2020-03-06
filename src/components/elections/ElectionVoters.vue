<template>
  <div>
    <v-container class="my-2 pt-1">
      <transition name="fade">
        <div style="height:320px;overflow-y:auto;" v-if="showUi">
          <v-subheader v-if="allVoters.length == 0">No voters yet</v-subheader>

          <template v-for="voter in allVoters">
            <span :key="voter.username" :id="voter.username + 'voter'">
              <v-avatar @mouseover="$helpers.openProfile($event, voter)"
                @click="$router.push('/users/'+voter.username)"
                :color="$helpers.colorMinder(voter.name.charAt(0))" 
                size="35" tile
                class="ma-1 linkify" 
                >

                <img :src="voter.photoURL" v-if="voter.photoURL">
                <span v-else class="white--text headline text-capitalize">{{voter.name.charAt(0)}}</span>
              </v-avatar>
            </span>
          </template>

          <v-btn color="secondary" text small @click="moreVoters" v-if="regVoters.length >= 25 && !isLastVoter"
            :loading="loading_more_voters" style="text-transform: initial">
            See more
          </v-btn>

        </div>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    regVoters: [],
    votersRef: ''
  }),
  watch: {
    electionId: function(to){
      this.regVoters = []
      to ? this.initialize() : ''
    }
  },
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    allVoters(){
      return uniqBy(this.regVoters, 'username')
    },
    ...mapState([
      
    ]),
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async initialize(){
      // get enrolled voters
      let voters = []
      this.$gun.get('elections')
        .get(this.electionId)
        .get('voters').map()
        .on((v) => {
          voters.push(v)
        })
      this.regVoters = voters
      
    },
  },
  async mounted(){
    await this.initialize()
    this.showUi = true
  },
  destroyed(){
    // this.votersRef.off()
  }
}

import { mapGetters, mapState } from "vuex";
import { uniqBy } from "lodash";
</script>

