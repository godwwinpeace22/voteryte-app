<template>
  <v-card style="min-height: 300px;" outlined>
    <v-subheader class="font-weight-bold">Your Contests</v-subheader>
    

    <v-list dense class="bgd__card" >
      <template v-for="(election,i) in elections">
        <v-divider :key="election.title"></v-divider>
        <v-list-item :key="election.electionId">
          <v-list-item-avatar 
            tile color="grey lighten-2" 
            class="round-1">
            <v-img
              :src="election.logo"
              v-if="election && election.logo">
            </v-img>
            <span v-else>{{election ? election.title.charAt(0) : ''}}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title 
              class="linkify"
              @click="$router.push(`/elections/${election.electionId}`)">
              {{election ? election.title : ''}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{election ? election.electionId : ''}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="election.title + i" ></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    all_elections: [],
  }),
  computed: {
    ...mapGetters([
      'getMyEnrolled',
      'getUser'
    ]),
    ...mapState([
      
    ]),
    elections(){
      let f = this.all_elections.map(e => {
        return this.getMyEnrolled.find(el => el.electionId == e.electionId) ?
        false : e
      }).filter(item => item)

      return this.getMyEnrolled.concat(f)
    },
  },
  methods: {
    initialize(){
      this.$gun.get('users')
        .get(this.getUser.username)
        .get('created')
        .map()
        .on(data => {
          // console.log(data)
          let d = Object.assign({}, data)
          d.cat = 'myContests'
          this.all_elections.push(d)
        })
    }
  },
  mounted(){
    this.initialize()
  }
}

// import { uniqBy } from "lodash";
import { mapGetters, mapState } from 'vuex';
</script>
