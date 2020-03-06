<template>
  <div id="vote_target">
    <transition name="fade">
      <v-overlay v-if="!showUi"
        :absolute="true" opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <div v-if="showUi">
        <v-subheader v-if="contestants.length >! 0">No contestants</v-subheader>
        
        <v-stepper v-model="stepper_step" 
          :vertical="$vuetify.breakpoint.smAndDown" 
          style="background:#fff;box-shadow:none;" 
          class="d-block">
          
          <template v-if="$vuetify.breakpoint.smAndDown">
            <template v-for="i in steps" >

              <v-stepper-step 
                :key="i"
                :complete="stepper_step > i" 
                :step="i">

                <span class="text-capitalize">
                  {{roles[i-1] ? roles[i-1].title : ''}}
                </span>

                <small>
                  Vote for
                  {{roles[i-1] ? roles[i-1].title : ''}}
                </small>
              </v-stepper-step>

              <v-divider vertical
                v-if="i !== steps"
                :key="`${i}--div-v`"
              ></v-divider>

              <v-stepper-content :step="i" :key="`${i}--content-v`">
                <v-card color="grey lighten-4" outlined
                  class="mb-5" style="min-height:200px;" 
                  v-if="contestants.length > 0 && 
                    contestantsByRoles[roles[i-1].value] && 
                    contestantsByRoles[roles[i-1].value].length > 0">

                  <v-row class="mt-4">
                    <v-col sm="4" 
                      md="3" class="pb-4"
                      v-for="contestant in contestantsByRoles[roles[i-1].value]"
                      @click.stop="select(contestant,$event,roles[i-1].title)" 
                      :class="roles[i-1].title" 
                      :ref="contestant.contestantId" 
                      :key="contestant.contestantId" 
                      style="min-height:200px;">
                      
                      <v-tooltip top>
                        <template v-slot:activator="{on}">
                          <v-card  class=" mt-4 mx-4" 
                            outlined hover 
                            :id="contestant.author.name" v-on="on">
                            <v-img
                              :src="contestant.author.photoURL || 
                              `https://ui-avatars.com/api/?size=300&name=${contestant.author.name}`"
                              height="140px"
                            ></v-img>

                            <v-card-title>
                              <div>
                                <h4 class="title mb-0" style='text-transform:capitalize;'>{{contestant.author.name}}</h4>
                              </div>
                            </v-card-title>
                          </v-card>
                        </template>
                        <span>Click to select</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-card>

                <v-subheader v-else class="title">No contestant for this role</v-subheader>

                <v-btn text color="primary" 
                  @click="previousStep(i)" v-if="i > 1" 
                  :disabled="loading">Previous
                </v-btn>

                <v-btn color="primary" 
                  @click="nextStep(i)" 
                  depressed :disabled="loading" 
                  v-if="i < steps">Next</v-btn>

                <v-btn color="primary" 
                  @click="vote" :loading="loading" 
                  :disabled="disabled" depressed v-else>
                  Submit Vote
                </v-btn>
              </v-stepper-content>
            </template>
          </template>

          <template v-else>
            <v-stepper-header>
              <template v-for="i in steps">
                <v-stepper-step
                  :key="`${i}-step`"
                  :complete="stepper_step > i"
                  :step="i"
                >
                  <span class="text-capitalize">
                    {{roles[i-1] ? roles[i-1].title : ''}}
                  </span>
                </v-stepper-step>

                <v-divider
                  v-if="i !== steps"
                  :key="`${i}--div`"
                ></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="i in steps"
                :step="i" :key="i + '--content'">
                <v-card color="grey lighten-4"
                  outlined
                  class="mb-5" 
                  style="min-height:200px;" 
                >
                  
                  <v-item-group 
                    active-class="yellow" 
                    v-model="votes[roles[i-1].value]"
                    :mandatory="stepper_step == i"
                  >
                    <v-container
                      v-if="contestants.length > 0 && 
                      contestantsByRoles[roles[i-1].value] && 
                      contestantsByRoles[roles[i-1].value].length > 0"
                    >
                      <div class="title ml-3 mt-3">Select your candidate</div>

                      <v-row>
                        <v-col
                          cols="12" md="3" sm="4"
                          v-for="contestant in contestantsByRoles[roles[i-1].value]"
                          :class="roles[i-1].title"
                          :ref="contestant.contestantId" 
                          :key="contestant.contestantId"
                        >
                          <v-item v-slot:default="{ active, toggle }" :value="contestant.contestantId">
                            
                            <v-card  class=" mt-4 mx-4" 
                              outlined hover @click="toggle"
                              :id="contestant.author.name">
                              <v-img
                                :src="contestant.author.photoURL || 
                                require('@/assets/avatar.png')"
                                height="180px"
                              ></v-img>

                              <v-card-title>
                                <div>
                                  <div class="title mb-0" 
                                    style='text-transform:capitalize;'>
                                    {{contestant.author.name}}
                                  </div>
                                  <div class="overline">Contestant number {{contestant.number}}</div>
                                </div>
                              </v-card-title>
                              <v-scroll-y-transition>
                                <div
                                  v-if="active"
                                  class="flex-grow-1 text-center"
                                >
                                  Selected
                                </div>
                              </v-scroll-y-transition>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-subheader v-else class="title">No contestant for this role</v-subheader>
                  </v-item-group>
                  
                </v-card>


                <v-btn text color="primary" 
                  @click="previousStep(i)" v-if="i > 1" 
                  :disabled="loading">Previous
                </v-btn>

                <v-btn color="primary" 
                  @click="nextStep(i)" 
                  depressed :disabled="disable_next || loading" 
                  v-if="i < steps">Next</v-btn>

                <v-btn color="primary" 
                  @click="vote" :loading="loading" 
                  :disabled="disable_submit" depressed v-else>
                  Submit Vote
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </template>
        </v-stepper>

      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data:()=>({
    stepper_step: 1,
    // steps: 5,
    showUi: false,
    no_contestants: false,
    myVote: {},
    roles: [],
    votes: {},
    approved_list: [],
    contestants: [],
    disabled: true,
    snackbar: {},
    message: '',
    loading: false
  }),
  props: ['status','currElection'],
  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    electionId(){
      return this.$route.params.electionId
    },
    steps(){
      return this.roles.length
    },
    contestantsByRoles(){
      let contestantsByRoles = {}

      this.getUniques(this.contestants, 'username').forEach(contestant=>{
        // console.log(contestant)
        contestantsByRoles[contestant.role.value] ? '' : 
        contestantsByRoles[contestant.role.value] = []
      
        contestantsByRoles[contestant.role.value].push(contestant)
        
      })

      return contestantsByRoles
    },
    disable_next(){

      let curRole = this.roles[this.stepper_step - 1].value
      let roles_with_contestants = Object.keys(this.contestantsByRoles)
      let curRole_has_contestants = roles_with_contestants.includes(curRole)

      // console.log(curRole, curRole_has_contestants)
      return curRole_has_contestants ? this.votes[curRole] ? false : true : false
      
    },
    disable_submit(){
      
      let roles_with_contestants = Object.keys(this.contestantsByRoles)
      
      return !isEqual(Object.keys(this.votes), roles_with_contestants)
      
    }
  },
  methods:{
    nextStep (n) {
      if (n !== this.steps) {
        this.stepper_step = n + 1
      } 
    },
    previousStep(n){
      if(n !== 1){
        this.stepper_step = n - 1
      }
    },
    getUniques(arr, str){
      return uniqBy(arr, str)
    },
    async getContestants(){
      // get contestants
      
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .once(async (data) => {
          // console.log({data})

          if(data){

            let role = await this.$gun.get(data.role['#']).then() //await this.getRole(key)
            let author = await this.$gun.get(data.author['#']).then() //await this.getPerson(key)
  
            let cont = Object.assign({}, data)
            cont.author = author;
            cont.role = role;
            cont.username = cont.contestantId
  
            this.contestants.find(c => c.contestantId == cont.contestantId) ? '' : 
            this.contestants.push(cont)
            // console.log(this.contestants)

            this.showUi = true
          }
        })

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
    async getPerson(username){
      return await this.$gun.get('users')
        .get(username)
        .then()
    },
    async setRoles(){
      
      // let roles = []
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('roles')
        .load(r => {
          // console.log({r})
          this.roles = Object.values(r)
        })

      // console.log({roles})

      // this.roles = roles
      // this.steps = roles.length
      // return roles
    },
    select(contestant,event,role){
      // console.log(contestant)
      let elems = document.getElementsByClassName(role)
      if(this.$refs[contestant.contestantId][0].style.backgroundColor == 'yellow'){
        
        // remove the vote
        delete this.myVote[role]
        
        for(var i= 0; i<elems.length;i++){
          elems[i].style.backgroundColor = ''
        }

        // disable vote submissin if voter has not voted for all roles
        // but first, filter out the roles that don't have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants

        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false
        

        this.$refs[contestant.contestantId][0].style.backgroundColor = ''
      }
      else{
        // eslint-disable-next-line no-redeclare
        for(var i= 0; i<elems.length; i++){
          elems[i].style.backgroundColor = ''
        }
        this.$refs[contestant.contestantId][0].style.backgroundColor = 'yellow'

        this.myVote[contestant.contestantId] = true

        // disable vote submision if voter has not voted for all roles
        // but first, filter the roles that have contestants
        let arr = Object.keys(this.contestantsByRoles) // contains all the roles that have contestants
        
        this.disabled = Object.keys(this.myVote).length < arr.length ? true : false

      }
    },
    async isOnline(){
      
      try {
        
        await api().get('/ping')
        // console.log(resp.data, resp.status, resp)
        return true

      } catch (error) {
        return false
      }
    },
    async vote(){
      this.loading = true
      let is_online = await this.isOnline()
      let has_enrolled = await this.hasEnrolled()
      // console.log({has_enrolled})
      
      /* Check that:
        - voting has started and has not ended
        - voter has enrolled and has not voted
        - voter is not suspended
        - voter is online

      */

      let showMessage = (msg,color="error") => {

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: msg,
          color: color
        })

        setTimeout(() => {
          this.$emit('close-dialog', true)
        }, 3000)

      }

      let proceedToVote = async () => {

        try{
          
          let contestants = Object.values(this.votes)
          let elecRef = this.$gun.get('elections')
            .get(this.electionId)
            
          
          let putVote = async (contestant) => {

            let cont = elecRef.get('contestants')
              .get(contestant)
              .get('t') // get(vote)
              console.log(contestant)

              let v = await cont.then()
              console.log({v})
              v ? cont.put(v*1 + 1) : cont.put(1)

              // add voting stats for schools
              // let vbd = await this.$gun.get(this.currElection.votes_by_dept['#']).then()
              // console.log({vbd})
              // if(vbd){
              //   let b = vbd[this.getUser.dept]
                
              //   vbd[this.getUser.dept] = b ? b* 1 + 1 : 1;
              //   elecRef.get('votes_by_dept')
              //   .put(vbd)
              //   console.log(vbd)

              // }
              

            if(contestant == contestants[contestants.length - 1]){
              this.$gUser
                .get('voted')
                .get(this.electionId)
                .put(true)

              showMessage("You have voted successfully", 'success')
            }
          }

          for (const contestant of contestants) {
            
            putVote(contestant)

          }
            
        }
        catch(err){
          console.log(err)
          
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Something went wrong, try again',
            color: 'error'
          })
  
          this.loading = false
        }
      }

      if(!is_online){
          showMessage('You seem to be offline. Check your internet connection')
          return
        }
      else if(this.status.not_started){
        
        // election not started
        showMessage("Sorry, enrollement has ended")
        return
      }

      else if(!has_enrolled){
        
        // Voter is not enrolled
        showMessage("You need to enroll to vote")
        return
      }
      else if(await this.hasVoted() && this.currElection.allow_multiple_voting){
        
        // Voter has already voted
        showMessage("You have already voted")
        return
      }

      else {
        proceedToVote()
      }

    },

    async hasEnrolled(){
      let enrolled = 
      this.getMyEnrolled
      // .filter(el => el.cont == 'myEnrolled')
      .find(election => {
        return election.electionId == this.electionId
      })

      console.log(enrolled)
      return !!enrolled
    },
    async hasVoted(){

      return await this.$gUser
          .get('voted')
          .get(this.electionId)
          .then()

      // this.$gUser
      //   .get('votes')
      //   .get(this.electionId)
      //   .on(v => {
      //     // console.log({v})
      //     this.hasVoted = v ? true : false
      //   })
    },
    getApprovedList(){

      // get approved list
      this.$gun.get('elections').get(this.electionId)
        .get('approved_list').map().on(l => {
          
          this.approved_list.find(i => i.username == l.username) ? '' :
          this.approved_list.push(l)
        })
    },
  },
  
  async mounted(){
    try {
      
      this.setRoles()
      this.getContestants()
  
      await this.getApprovedList()

    } catch (error) {
      console.log(error)
    }
  },
  destroyed(){
    document.title = `Vote | ${this.$appName}`
  },
  components:{
    
  },
}

import { mapGetters } from 'vuex'
import { uniqBy, isEqual } from "lodash";
import api from '@/services/api2'
</script>

<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;
  .v-stepper--vertical .v-stepper__content{
    border-left: 1px solid rgba(0,0,0,0.12);
  }
  .v-stepper--vertical span:last-of-type .v-stepper__content{
    border-left: 1px solid rgba(0,0,0,0.12);
  }
  
</style>
