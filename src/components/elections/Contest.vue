<template id="contest">
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Contest</span>
    </navigation>

      <v-container grid-list-lg v-if="!ready" :pa-0="$vuetify.breakpoint.xsOnly">
        <v-card :class="{round:$vuetify.breakpoint.smAndUp}">
        <loading-bar :height="$vuetify.breakpoint.xsOnly ? '70vh' : '50vh'"><div slot="loading_info">Loading...</div></loading-bar>
        </v-card>
      </v-container>

    <transition name="fade">

      <v-container v-if="ready">
        
        <v-card class="contest_main_card" outlined>
          <v-stepper v-model="step" class="white elevation-0">
            <v-stepper-header class="elevation-0">
              <v-stepper-step :complete="step > 1" step="1">Select election</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 2" step="2">Choose a position</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 3" step="3">Submit</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 4" step="4">Finish</v-stepper-step>
            </v-stepper-header>
            <v-divider></v-divider>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card color="grey lighten-5" style="min-height:240px;"  flat tile>
                  <v-card-text>Select the election you want to contest in to continue</v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select required small v-model="selectedElection"
                          :items="getMyEnrolled" color="primary" outlined
                          item-text="title" :loading="loading_rooms"
                          no-data-text="No elections"
                          return-object hint='you can contest in only elections you have enrolled in'
                          persistent-hint
                          label="select election"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                  
                </v-card>

                <v-btn color="primary" dark depressed @click="step = 2" v-if="selectedElection.admin">
                  Next
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-5" light color="grey lighten-5"  style="min-height:250px;" flat tile>
                  <v-card-text >
                    <span class="title mb-3">Contest in {{selectedElection.title}}</span>
                    
                    <v-row >
                      <v-col cols="12" sm="6" v-if="selectedElection.who_can_contest != 'manual'">
                        
                        <v-select :items="selectedElectionRoles" 
                          outlined label="Select role" 
                          color="primary" 
                          v-model="selectedRole"
                          item-text="title" return-object>
                        </v-select>

                      </v-col>
                      <v-col v-else>
                        <v-subheader>Sorry you are not allowed to contest in this election</v-subheader>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  
                </v-card>

                <v-btn text @click="step = 1" dark color="grey">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="primary" depressed @click="step = 3" v-if="!disabled">
                  Next
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:250px;" flat tile>
                  <v-card-text >
                    <span class="subheading">Contest: {{$helpers.truncateText(selectedElection.title, 50)}}</span>
                    <v-divider></v-divider>
                    </v-card-text>
                    <v-spacer></v-spacer>
                  <v-card-text>
                    <p>You are applying to contest for the position: <strong> {{selectedRole.title}} </strong></p>
                    <p>Make sure you complete your profile info as this will be used to complete your application</p>
                  
                  </v-card-text>
                </v-card>

                <v-btn text @click="step = 2" color="grey" :disabled="loading">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="primary" @click="contest" :loading="loading"> Finish</v-btn>
              </v-stepper-content>

              <v-stepper-content step="4">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
                  <v-card-text >
                    <span class="subheading font-weight-bold">Application successful!</span>
                    
                    </v-card-text>
                    <v-spacer></v-spacer>
                  <v-card-text>
                    <p>What next?</p>
                  </v-card-text>
                  <v-card-actions :class="{'d-block': $vuetify.breakpoint.xsOnly}">

                    <template>
                      <!-- <v-btn color="success" :to="`/forum/${selectedElection.electionId}`" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Join the conversation</v-btn> -->
                      <v-btn color="success" :to="`/elections/${selectedElection.electionId}`" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]">Vote</v-btn>
                    </template>

                  </v-card-actions>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-container>

    </transition>
    
    <!-- APPLICATION FOR CONTESTANT DIALOG -->
    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card color="primary" dark flat>
        <v-card-text>
          Application in progress
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Contest | Voteryte',
    step: 1,
    loading: false,
    ready: false,
    electionId: null,
    selectedElection: {},
    selectedRole: {},
    elections: [],
    election: {},
    token: '',
    roles: [],
  }),
  watch: {
    selectedElection(){
      this.getRoles()
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'loading_rooms'
    ]),
    disabled(){
      
      if(this.step == 1){
        return false
      }
      else if(this.step == 2){
        
        if(this.selectedElection.who_can_contest == 'everyone'){
          return !this.selectedRole.value
        }
        else if(this.selectedElection.who_can_contest == 'everyone_with_access'){
          return !this.selectedRole.value || !this.token
        }
        else return true
      }
      else {return false}

    },
    selectedElectionRoles(){
      return uniqBy(this.roles, 'value')
    }
    
  },
  methods:{
    getRoles(){
      
      if(this.selectedElection.electionId){
        this.roles = []

        this.$gun.get('elections')
          .get(this.selectedElection.electionId)
          .get('roles')
          .load((r) => {
            // console.log(Object.values(r))
            
           this.roles = Object.values(r)
          })
          // console.log(this.roles)
          
      }

      // return roles
    },
    async contest(){
      let has_contested = await this.hasContested()

      let elecRef = this.$gun.get('elections')
        .get(this.selectedElection.electionId)

      console.log({has_contested})

      // if election not started; if is an ACL (if it exists)
      let not_started = this.selectedElection.status == 'not_started'
      let is_in_the_contestants_list = ''

      // ************************** 
      if(this.selectedElection.who_can_contest == 'manual' && !is_in_the_contestants_list){ // seriously??
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Sorry, You are not allowed to contest in this election',
          color: 'error'
        })
      }

      // check if user is already a contestant
      else if(has_contested){
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message:'Sorry, you are already a contestant in this election',
          color: 'error'
        })
      }

      // check if contesting is still possible
      else if(!not_started){
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message:'Sorry, you cannot contest at this time',
          color: 'error'
        })
      }


      // create a contestant
      else{
        this.loading = true

        let data = {
          electionId: this.selectedElection.electionId,
          date_created: Date.now(),
          author: this.getUser.username,
          suspended: false,
          t: 0
        }
      
        let contestant = elecRef
          .get('contestants')
          .get(this.getUser.username)
          .put(data)

        // let role_node = elecRef
        //   .get('roles').get(this.selectedRole.value)
        // console.log(this.selectedRole, role_node)

        contestant.get('role').put(this.selectedRole)
        
        elecRef.get('contestants_count')
          .put(this.selectedElection.contestants_count + 1)

        this.$gun.get('users')
          .get(this.getUser.username)
          .get('contests')
          .get(this.selectedElection.electionId)
          .put(contestant)

        this.loading = false
        this.$store.dispatch('curRoom', this.selectedElection)
        this.step = 4

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'You are now a contestant!',
          color: 'success'
        })


      }
    },
    async hasContested(){
      let contest = await this.$gun
        .get('users')
        .get(this.getUser.username)
        .get('contests')
        .get(this.selectedElection.electionId)
        .then()
      // console.log(contest)
      return contest
    }
  },
  async mounted(){
    if (this.getUser) {
      this.elections = this.getMyEnrolled
      this.ready = true
      
      let query = this.$route.query.eId;

      if(query){
        
        let is_valid_elec = this.getMyEnrolled.find(e => e.electionId == query)
        if(is_valid_elec){
          this.selectedElection = is_valid_elec
          this.step = 2
          // console.log(this.selectedElection, this.step)
          // console.log(await this.hasContested())
        }
      }
    }
  },
  components:{
    Navigation,
    LoadingBar,
  }
}
// import api from '@/services/api'
import Navigation from '@/components/Navigation'
import LoadingBar from '@/spinners/LoadingBar'
import { mapGetters, mapState } from 'vuex'
import { uniqBy } from "lodash";
</script>
<style lang="scss" scoped>
  //.v-stepper{
    //min-height:100vh;
  //}
</style>
