<template>
  <div>
    <v-container grid-list-sm fluid>
      <v-row justify="center">
        <v-col sm="12" md="8">
          <v-card class="round">
            <v-card-title primary-title>
              {{currElection.title}}
            </v-card-title>
            <v-row row wrap>
              <v-col cols="12" sm="6">
                <v-list dense>
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-stop</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Title:</span>
                      <span>{{currElection.title}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item v-if="currElection.type == 'School'" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-school</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">School:</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-layers</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Level:</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-domain</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Faculty:</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.level == 'Department'" @click="''">
                    <v-list-item-action>
                      <v-icon>mdi-map-marker</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="text-capitalize">
                      <span class="mr-3">Department:</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-poll</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Contestants:</span>
                      <span>{{currElection.contestants}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-account-group</v-icon>   
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Enrolled Voters:</span>
                      <span>{{currElection.voters}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-vote-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">People that voted:</span>
                      <span >{{rawVotes.length}}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                
              </v-col>
              <v-col cols="12" sm="6">
                <v-list dense>
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Date Created:</span>
                      <span>{{(new Date(currElection.dateCreated.toMillis())).toLocaleString('en-Us')}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Created By:</span>
                      <span class="text-capitalize">{{getAdmin.name | capitalize}}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Start Date:</span>
                      <span>{{(new Date(currElection.fullStartDate))}}</span>
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item v-if="currElection.timed" @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-timer</v-icon>   
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Duration:</span>
                      <span>{{currElection.duration}} hrs</span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="''">
                    <v-list-item-action>
                      <v-icon color="teal">mdi-adjust</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                      <span class="mr-3">Status:</span>
                      <span v-if="!timer_ready">Checking...</span>
                      <span v-else>{{status.not_started ? 'Not started' : status.inprogress ? 'In progress' : 'Ended'}}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            
            <v-subheader class="mt-5 font-weight-bold">Contestants and votes</v-subheader>
            <v-data-table
              :headers="headers"
              :items="tabledata"
              :loading='false'
              :hide-default-footer="isPrinting"
            >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name | capitalize}}</td>
                <td class="text-xs-left">{{ props.item.role }}</td>
                <td class="text-xs-left">{{ props.item.department }}</td>
                <td class="text-xs-left">{{ props.item.faculty }}</td>
                <td class="text-xs-left">{{props.item.score}}</td>
              </template>
            </v-data-table>

            <v-divider></v-divider>
            <v-subheader class="mt-5 font-weight-bold">Votes Breakdown</v-subheader>
            <v-data-table
              :headers="votes_breakdown_headers"
              :items="votes_breakdown_tabledata"
              :loading='false' :hide-default-footer="isPrinting"
            >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.dept | capitalize}}</td>
                <td class="text-xs-left">{{ props.item.fac }}</td>
                <td class="text-xs-left">{{ props.item.voters }}</td>
                <td class="text-xs-left">{{ props.item.voted }}</td>
                <td class="text-xs-left">{{ props.item.votes_in_dept }}</td>
                <td class="text-xs-left">{{props.item.percentage_of_total}}%</td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    headers: [
      {
      text: 'Name',
      align: 'left',
      value: 'name'
      },
      {text:'Role', value:'role'},
      {text:'Department', value:'department'},
      {text:'Faculty', value:'faculty'},
      {text:'Votes', value:'score'},
    ],
    votes_breakdown_headers: [
      {
        text: 'Department',
        align: 'left',
        value: 'dept'
      },
      {text:'Faculty', value:'fac'},
      {text: 'Enrolled', value: 'voters'},
      {text:'Voted', value:'voted'},
      {text:'Votes', value:'votes_in_dept'},
      {text:'Percentage of Total', value:'percentage_of_total'},
    ],
    tabledata: [],
    votes_breakdown_tabledata: [],
  }),
  props: [
    'currElection',
    'status',
    'getAdmin',
    'timer_ready',
    'contestants',
    'allVotes',
    'rawVotes',
    'totalVotes', 
    'isPrinting'
  ],
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    }
  },
  computed: {
    title(){
      return `Results Summary | ${this.$appName}`
    },
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    setTableData(){
      this.tabledata = [] // to prevent multiple pushings
      if(this.allVotes && this.contestants.length > 0){

        this.contestants.forEach(cont=>{
          
          // get votes for a particular contestant
          let foo = this.allVotes.filter(vote=> {
            return cont.uid == vote.id
          })
  
          let myObj = {
            value: false,
            name: cont.name,
            email: cont.email,
            contId: cont.uid, // contestant id
            role: this.getRole(cont),
            department: cont.dept,
            faculty: cont.fac,
            score: foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0
          }
          this.tabledata.push(myObj)
        })
      }
    },
    initialize(){
      this.setTableData()
      this.votesBreakdown()
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : false
    },
    votesBreakdown(){
      
      let grouped = this.rawVotes.reduce((r, a) => {
          const { dept, fac, choices } = a;

          r[a.dept] = [...r[a.dept] || [], {
            dept,
            fac,
            choices
          }];

          return r;
        }, {});

        this.votes_breakdown_tabledata = []
        Object.values(grouped).forEach(group => {

          let votes_in_dept = group.length * Object.keys(group[0].choices).length
          
          this.votes_breakdown_tabledata.push({
            dept: group[0].dept,
            fac: group[0].fac,
            voters: this.currElection.votersByDept[group[0].dept],
            voted: group.length,
            votes_in_dept,
            percentage_of_total: votes_in_dept / this.totalVotes * 100
          })

        })
    }
  },
  mounted(){
    this.initialize()
  }
}
import { mapGetters, mapState } from 'vuex';
</script>
