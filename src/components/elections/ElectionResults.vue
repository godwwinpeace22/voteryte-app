<template>
  <transition name="fade">
    <v-overlay v-if="!showUi"
      opacity=".3"
      :value="!showUi"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  <div v-if="showUi">
    
    <div v-if="hideResults" class="text-center">
      <h1>Election In progress</h1>
      <p>See results after election ends</p>
    </div>
    <div v-else>

      <v-container mt-md-3 class="grey lighten-5" 
        pa-xs-0>
        <v-card flat class="grey lighten-5">
          <v-row row wrap>

            <!-- ==== WINNERS ===== -->
            <v-col cols="12"
              d-flex class="pt-0" mb-sm-2>
              <v-card outlined min-height="200">
                <v-subheader class='font-weight-bold'>Top Performers by role
                </v-subheader>
                <v-divider></v-divider>
                
                <v-list dense two-line>
                  <v-subheader v-if="winners.length == 0">No votes</v-subheader>
                  <div v-for="(winnersInEachRole,i) in uniqWinners" :key="winnersInEachRole.length + Math.random() * i">
                    
                    <v-list-item v-for="winner in winnersInEachRole" :key="winner.username" >
                      <v-list-item-avatar 
                        :color="$helpers.colorMinder(winner.author.name.charAt(0))">
                        <img :src="winner.author.photoURL" v-if="winner.author.photoURL">
                        <span class="white--text text-capitalize" v-else>{{winner.author.name.charAt(0)}}</span>
                      </v-list-item-avatar>
                      <v-list-item-content 
                        class='font-weight-bold text-capitalize'
                        >
                        {{winner.author.name}}
                        <v-list-item-subtitle> for {{winner.role}}</v-list-item-subtitle>
                      </v-list-item-content>
                        <!-- if there are ties in the scores -->
                        <v-list-item-action 
                          class='font-weight-bold' 
                          v-if='winnersInEachRole.length > 1'>
                          <v-tooltip top>
                            <v-btn color="purple" slot='activator' dark icon class='text-capitalize mr-2'>Tie</v-btn>
                            <span>There was a tie for this role</span>
                          </v-tooltip>
                          
                        </v-list-item-action>

                        <v-list-item-action class='font-weight-bol'>{{winner.score}} votes</v-list-item-action>
                      
                    </v-list-item>
                    <v-divider v-if="i != winners.length -1"></v-divider>
                  </div>
                </v-list>
              </v-card>
            </v-col>

            <!-- ==== ALL SCORES ===== -->
            <v-col cols="12" d-flex class="pt-0" mb-sm-2>
              <v-card outlined min-height="200">
                <v-subheader class="font-weight-bold">All results</v-subheader>

                <v-card-text class="mb-3" v-if="currElection.type != 'Others' ">

                  Voting started on {{startDate}}, and ended on {{endDate}} with 
                  {{(currElection.voters_count || 0).toLocaleString()}} enrolled voters

                </v-card-text>

                <v-data-table
                  :headers="headers"
                  :items="tabledata"
                  :loading='false'
                >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                </v-data-table>
              </v-card>
            </v-col>

            <!-- ==== CHARTS ==== -->
            <v-col cols="12">
              <v-card outlined>
                <v-subheader class="font-weight-bold">Charts</v-subheader>
                <v-row justify="center">
                  <v-col cols="12" 
                    mb-3 v-for="role in roles" :key="role.title">
                    <v-card outlined :tile="roles.length == 1">
                      <v-container>
                        <v-toolbar flat dense color="white" tabs>
                          <v-toolbar-title><h5 class="text-capitalize">{{role.title}}</h5></v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-tabs slot="extension"
                            v-model="model[role.value]" right
                            color="" slider-color="yellow"
                          >
                            <v-tab href="#tab-1">Bar</v-tab>
                            <v-tab href="#tab-2"> Pie</v-tab>
                          </v-tabs>
                        </v-toolbar>
                        
                        <v-tabs-items v-model="model[role.value]">
                          
                          <v-tab-item value="tab-1">
                            <v-card flat height="400">
                              <bar-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions"></bar-chart>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item value="tab-2" >
                            <v-card flat height="400">
                              <pie-chart :chart-data="chartData[role.title] ? chartData[role.title] : {}" :options="chartOptions2"></pie-chart>
                            </v-card>
                          </v-tab-item>
                        </v-tabs-items>
                        
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

          </v-row>
        </v-card>
      </v-container>

    </div>
  </div>
  </transition>
</template>
<script>
export default {
  data:()=>({
    showUi: false,
    model:[],
    elecRef: '', // detatch listeners
    status: {},
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short',
      day:'numeric',
      hour:'numeric', 
      minute:'numeric'
    },
    sortedResults:[],
    chartData:{},
    chartOptions:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    chartOptions2:{
      responsive: true, 
      maintainAspectRatio: false,
    },
    all_contestants: [],
    roles: [],
    currElection: {},
    votes: [],
    headers: [
      {
      text: 'Name',
      align: 'left',
      value: 'name'
      },
      {text:'Role', value:'role'},
      {text:'Votes', value:'score'},
    ],
    tabledata: [],
    timeout: null, // clear timeout
  }),
  
  watch: {
    'roles': function(){
      
      
      this.setResultsChart()
    },
    'contestants': function(to){
      
      to ? this.setTableData() : ''
      this.setResultsChart()
    }
  },
  computed:{
    title(){
      return `Results | ${this.$appName}`
    },
    endTime(){
      let a = this.currElection
      let enddate = new Date(a.startDate + ' ' + a.startTime)
      enddate.setHours(enddate.getHours() + a.duration)
      return enddate.toLocaleString('en-Us',
        this.date_options
      )
    },
    startDate(){
      let a = this.currElection
      let start_time = new Date(a.startDate + ' ' + a.startTime)
      return start_time.toLocaleString('en-Us',this.date_options)
    },
    endDate(){
      let a = this.currElection
      let start_time = new Date(a.endDate + ' ' + a.endTime)
      return start_time.toLocaleString('en-Us',this.date_options)
    },
    regVoters(){
      return this.currElection.voters_count
    },
    contestants(){
      return uniqBy(this.all_contestants, 'username')
    },
    winners(){
      
      let w = this.roles.map(role => {
        
        let theWinner = this.getWinner(role.title)
        // console.log({role, theWinner})
          return theWinner ? [theWinner] : []
        
      })
      .filter(i => i.length > 0)
      
      return w
      
    },
    uniqWinners(){
      return uniqBy(this.winners, 'username')
    },
    hideResults(){
      
      return !this.currElection.realtime_results
       && 
      this.electionStatus != 'ended'
      
    },

    // eslint-disable-next-line vue/return-in-computed-property
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
      let now = this.$Gun.state()
      let start = (new Date(this.currElection.startDate + ' ' + this.currElection.startTime)).getTime()
      let end = (new Date(this.currElection.endDate + ' ' + this.currElection.endTime)).getTime()
      
			if(this.currElection.timed){
	
				if(now < start){
					return 'notstarted'
				}
				else if(now > start && start < end){
					return 'inprogress'
				}
				else{
					return 'ended'
				}
			}

			else {
        
				this.currElection.status

			}
      
		},
    isAdmin(){
      // console.log(this.currElection)
      return this.currElection.admin &&
      this.currElection.admin == this.getUser.username
    },
    isContestant(){
      return !!this.contestants
        .find(contestant => contestant.username == this.getUser.username)
    },
    electionId(){
      return this.$route.params.electionId
    },
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },
  components:{
    'pie-chart':piechart,
    'bar-chart':barchart,
    
  },
  methods:{
    initialize(){
      this.$gun.get('elections')
        .get(this.electionId)
        .on( async election => {
          
          if(election){
            this.currElection = election
            
            let open = async () =>{
              if(!election.realtime_results){
                this.showUi = true
              }
              else {

                await this.getRoles()
                await this.getContestants()
                
                await this.setTableData()
  
                this.showUi = true
              }
            }
            // show results if the election settings allows it
            
            if(election.results_visible_to_all){
              
              open()
            }
            else if(this.isAdmin){
              open()
            }
            else {
              
              this.$router.push('/elections/' + this.electionId)
              
            }
            
          }
          else {
            // console.log('router')
            this.$router.push('/not-found')
            // showUi = false
          }
          
        })
    },
    getRoles(){
      this.$gun.get('elections')
        .get(this.electionId)
        .get('roles')
        .load((roles) => {
          
          this.roles = Object.values(roles)
          this.setResultsChart()
          // console.log(this.roles)
        })
    },
    async getPerson(username){
      return await this.$gun
        .get('users')
        .get(username)
        .then()
    },
    async getContestants(){
      
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .once(async (data) => {
          // console.log({data})
          if(data && data.author && data.role && data.contestantId){

            let cont = Object.assign({}, data)
            cont.author = await this.$gun.get(data.author['#']).then() //await this.getPerson(key)
            cont.role = await this.$gun.get(data.role['#']).then() //await this.getRole(key)
            cont.username = cont.contestantId
            
            this.all_contestants.push(cont)
            
          }
          
        })

    },
    setTableData(){
      this.tabledata = [] // to prevent multiple pushings
      if(this.contestants.length > 0){
        this.tabledata = this.contestants.map(cont=>{
          // console.log({cont})
          // get votes for a particular contestant
          let her_vote = cont.t
  
          let myObj = {
            value: false,
            name: cont.author.name,
            contId: cont.author.username, // contestant username
            role: cont.role.title,
            department: cont.author.dept,
            faculty: cont.author.fac,
            score: her_vote || 0
          }

          // this.tabledata.push(myObj)
          return myObj
        })
      }
    },
    setResultsChart(){
      
      this.chartData = {}
      this.roles.forEach(role=>{
        
        let mylabels = []
        let mydata = []
        let mybgdColor = []
        this.contestants.map(d=>{
          
          let cont_vote = d.t || 0
          

          if(d.role.value == role.value){
            
            mylabels.push(this.capitalizeText(d.author.name))
            
            mydata.push(cont_vote)
            mybgdColor.push(this.get_random_color())
          }

        })
        this.chartData[role.title] = {
          labels:mylabels,
          datasets :[
            {
              label: 'votes',
              backgroundColor: mybgdColor,
              data: mydata,
            }
          ]
        }
        //console.log(this.chartData[role.title])
      })
      
    },
    getWinner(role){
      let v = this.contestants.filter(
        item => item.role.title == role
      ) // filter out other roles

      // let uniqueScores = []
      // rl.forEach(item => {
      //   if(uniqueScores.indexOf(item.score) == -1){
      //     uniqueScores.push(item.score)
      //   }
      // });
      
      // let theHighestScore = uniqueScores.sort((a,b) => b-a)[0]
      //find all results with the highest unique score
      // console.log({v})
      let w = maxBy(v, 't')
      
      if(w && w.username){

        let u = Object.assign({}, w)
        u.role = w.role.title
        u.score = u.t
        
        return u
      }
      else return false
      // return rl.filter(result => result.score == theHighestScore)
    },
    percentage_score(contestant,role){
      let total_score_for_role = this.sortedResults.find(a=> a.role == role)
      //console.log(total_score_for_role)
      total_score_for_role ? total_score_for_role = total_score_for_role.total_score : ''
      return total_score_for_role ?  contestant.score/total_score_for_role * 100 : ''
    },
    async getRole(username){

      // get the role of a contestant
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(username)
        .get('role')
        .then()
          
    },
    get_random_color() {
      var letters = 'A98DE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    capitalizeText(text){
      return text ? text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ') : ''
    },
    
  },
  mounted(){
    
    this.timeout = setTimeout(() => {
      this.initialize()
    }, 500);
    
    
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`
    this.timeout ? clearTimeout(this.timeout) : ''
  }
}

import {mapGetters, mapState} from 'vuex'
import piechart from '@/charts/piechart'
import barchart from '@/charts/barchart'
import { maxBy, uniqBy } from "lodash";
</script>



