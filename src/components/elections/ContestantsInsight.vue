<template>
  <div>
    <v-container grid-list-md :px-2="$vuetify.breakpoint.xsOnly">
      <v-row row wrap>
        <v-col cols="12">
          <v-card height="" class="round_top" style="border-top: 4px solid gold">
            <v-toolbar class="white" flat dense>
              <v-subheader>Contestants Insight</v-subheader>
              <v-spacer></v-spacer>
              <v-icon color="#FFC107" class="pr-2">mdi-flash-circle</v-icon>
              <span class="font-weight-bold"> Premium</span>
            </v-toolbar>
            <v-container grid-list-lg pt-3 v-if="curRoom">
              <v-row row wrap>
                <v-col cols="12" sm="4">
                  <v-card flat>
                    <bar-chart v-if="spyReady" :chart-data="chartdata" :options="chartOptions2"></bar-chart>
                  </v-card>
                </v-col>

                <!-- YOUR OPPONENTS -->
                <v-col cols="12" sm="4">
                  <v-card flat class="round_top" style="border: 1px solid #eee;">
                    <v-toolbar flat dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Your Opponents</v-subheader>
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line dense>
                        <v-subheader v-if="myOpponents.length == 0">No opponents</v-subheader>
                        <template v-for="(item, index) in myOpponents">
                          <v-list-item :key="index + 'opponent'" @click="$eventBus.$emit('ViewProfile', item)">
                            <v-list-item-avatar :color="$helpers.colorMinder(item.name.charAt(0))">
                              <img :src="item.photoURL" v-if="item.photoURL">
                              <span v-else class="white--text">{{item.name.charAt(0)}}</span>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title class="text-capitalize">
                                {{item.name}}
                              </v-list-item-title>
                              <v-list-item-subtitle >
                                <span class="online_badge" :class="item.online ? 'success' : 'orange'"></span>
                                {{item.online ? 'online' : 'offline'}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-card-text>
                    
                  </v-card>
                </v-col>

                <!-- OTHER CONTESTANTS -->
                <v-col cols="12" sm="4" mb-12>
                  <v-card height="300" class="round_top" flat style="border: 1px solid #eee;">
                    <v-toolbar flat dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Other Contestants</v-subheader>
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line dense>
                        <v-subheader v-if="otherContestants.length == 0">No contestants</v-subheader>
                        <template v-for="(item, index) in otherContestants" v-else>
                          <v-list-item :key="index" @click="$eventBus.$emit('ViewProfile', item)">
                            <v-list-item-avatar :color="$helpers.colorMinder(item.name.charAt(0))">
                              <img :src="item.photoURL" v-if="item.photoURL">
                              <span v-else class="white--text">{{item.name.charAt(0)}}</span>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title class="text-capitalize">
                                {{item.name}}
                                <span class="online_badge" :class="item.online ? 'success' : 'orange'"></span>
                              </v-list-item-title>
                              <v-list-item-subtitle>{{item.role}}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row row wrap>
                
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () =>({
    regVoters: [],
    contestants: [],
    meAndMyOpponents: '',
    postsByPersons: [],
    followersByPersons: [],
    profileViewsByPersons: [],
    postViewsByPersons: [],
    chartdata: {
      labels: ['posts','followers','profile views','post views'],
    
      datasets: []
    },
    chartOptions2: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            autoSkip: false,
          }
        }]
      }
    },
    spyReady: false,
    
  }),
  watch: {
    'curRoom': function(from,to){
      // console.log(to,from)
      if(this.curRoom && this.getUserInfo && this.getUserInfo.contests){
        let isContestant = !!this.getUserInfo.contests.find(contest => contest == this.curRoom.electionId)
        // console.log(isContestant, this.getUserInfo)
        isContestant ? this.setContestantMonitor() : ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ]),
    myOpponents(){
      
      let myRole = this.getRole(this.getUserInfo)
      let opponents = this.contestantsByRoles.filter(cont =>{
        return cont.role == myRole && cont.uid != this.getUser.uid
      })
      // console.log(myRole,this.contestantsByRoles)
      return opponents
    },
    otherContestants(){
      return this.contestantsByRoles.filter(cont =>{
        return cont.role != this.getRole(this.getUserInfo)
      })
    },
    contestantsByRoles(){
      let contestantsByRoles = []

      this.contestants.forEach(cont =>{
        contestantsByRoles.push({
          ...cont,
          role: this.getRole(cont)
        }) 
      })
      return contestantsByRoles
    }
  },
  methods: {
    getRole(contestant){
      
      if(contestant.contestsRef){

        let ref = contestant.contestsRef
        .find(item=>item.electionRef == this.curRoom.electionId)
        let found = ref ? this.curRoom.roles.find(role=>role.value == ref.role) : false
        return found ? found.title : false
      }
      else{ return false}
    },
    async allContestants(){
      // get contestants
      return new Promise((resolve, reject)=>{
        
        db.collection('moreUserInfo')
          .where('contests', 'array-contains', this.curRoom.electionId)
          .get().then(docs =>{
            let contestants = []
            docs.forEach(doc =>{
              doc.data().uid != this.getUser.uid ? 
              contestants.push(doc.data()) : ''
            })

            contestants.push(this.getUserInfo)

            this.contestants = contestants
            // console.log(this.contestants)
            resolve(contestants)
          }).catch(err => {
            // console.log(err)
          })
      })
      
    },
    async setContestantMonitor(){
      try{
        // console.log(this.meAndMyOpponents)

        this.allContestants().then(contestants =>{
          // console.log(contestants)
          let myRole = this.getRole(this.getUserInfo)

          this.contestantsByRoles.filter(cont =>{
            return cont.role == myRole
          })

          .forEach(person =>{
            // console.log(person)
            let random1 = Math.floor(Math.random() * Math.floor(255))
            let random2 = Math.floor(Math.random() * Math.floor(255))
            let random3 = Math.floor(Math.random() * Math.floor(255))

            this.chartdata.datasets.push({
              label: person.uid == this.getUser.uid ? 'You' : this.$helpers.truncateText(person.name,15),
              backgroundColor: `rgba(${random1}, ${random2},  ${random3}, 0.6)`,
              data: [
                person.posts ? person.posts : 0,
                person.followers ? person.followers : 0,
                person.profile_views ? person.profile_views : 0,
                person.followers ? person.followers : 0
              ]
            
            })

            // console.log(this.chartdata)
          })
          this.spyReady = true
        })
        .catch(err => {
          // console.log(err)
        })
      }
      catch(err){
        // console.log(err)
      }
      


    }
  },
  mounted(){
    // this.curRoom ? this.setContestantMonitor() : ''
    // first check if user is contestant in curRoom
    if(this.curRoom && this.getUserInfo && this.getUserInfo.contests){
      let isContestant = !!this.getUserInfo.contests.find(contest => contest == this.curRoom.electionId)
      // console.log(isContestant, this.getUserInfo)
      isContestant ? this.setContestantMonitor() : ''
    }
  },
  created(){
    
  },
  components: {
    RadarChart,
    BarChart
  }
}
import RadarChart from '@/charts/radar'
import BarChart from '@/charts/barchart'
import { mapState, mapGetters } from 'vuex';
import { constants } from 'fs';
import {firebase, db, database} from '@/plugins/firebase'
</script>
