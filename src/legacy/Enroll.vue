<template>
  <div>
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">{{$vuetify.breakpoint.smAndUp ? 'Dashboard' : 'Enroll'}}</span>
      <h1 slot="extended_nav" v-if="$vuetify.breakpoint.smAndUp">Enroll</h1>
    </navigation>

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <transition name="fade">
      <v-container grid-list-xl :pa-0="$vuetify.breakpoint.xsOnly" :mt-4="$vuetify.breakpoint.smAndUp">
        <v-card class="black--text" :class="{round:$vuetify.breakpoint.smAndUp}">
          <v-stepper v-model="e5"  class="" style="min-height:300px;">
            <v-stepper-header :class="{'teal': $vuetify.breakpoint.xsOnly}" >
              <!-- <v-stepper-step :complete="e5 > 1" step="1">Intro</v-stepper-step> -->
              <!-- <v-divider></v-divider> -->
              <v-stepper-step :complete="e5 > 1" step="1" color="secondary">Select election</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 2" step="2" color="secondary">Enroll</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e5 > 3" step="3" color="secondary">Finish</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items :style="style_stepper_items">
              
              <v-stepper-content step="1">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;"  flat tile>
                  <v-card-text>Insert the Id of the election you want to enroll for below</v-card-text>
                  <v-container>
                    <v-layout row>
                      <v-flex xs12 sm6>
                        <v-text-field label="Election Id" outline color="secondary" name="electionId" :value="electionId" 
                          hint="e.g gray-fighter-2187" v-model="electionId" browser-autocomplete="electionId">
                        </v-text-field>
                        
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-card-actions>
                    
                    <v-btn color="success" @click="getElection" 
                      :disabled="!electionId" :loading="loading">
                      Submit
                      <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-5" light color="grey lighten-5"  style="min-height:200px;" flat tile>
                  <v-card-text v-if="election.length != 0">
                    <span class="subheading">{{election.title}}</span>
                    <v-divider></v-divider>
                    <h3 v-if="hide" class="error--text">{{error_msg}}</h3>
                  </v-card-text>
                </v-card>

                <v-btn color="grey lighten-1" depressed @click="e5 = 1" :disabled="loading">
                  <v-icon small>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn color="secondary" @click="enroll" 
                v-if="!hide" :loading="loading" depressed>Enroll</v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-5" light color="grey lighten-5" style="min-height:200px;" flat tile>
                  <v-card-text v-if="election.length != 0">
                    <span class="subheading">{{election.title}}</span>
                    <v-divider></v-divider>
                    </v-card-text>
                  <v-card-text>
                    <h3>You have successfully enrolled for this election</h3>
                    <p>Whats next?</p>
                    
                  </v-card-text>
                  <v-card-actions >
                    <v-btn color="secondary" @click="$store.dispatch('curRoom', election)"
                      v-if="getMyEnrolled.find(elec => elec.electionId == election.electionId)"
                      :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2': $vuetify.breakpoint.xsOnly}]">
                      Switch current election
                    </v-btn>
                    <template v-if="curRoom && curRoom.electionId == election.electionId">
                      <v-btn color="success" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]" to="/forum">Join the conversation</v-btn>
                      <v-btn color="success" :block="$vuetify.breakpoint.xsOnly" :class="[{'mb-2 ml-0': $vuetify.breakpoint.xsOnly}]" to="/contest">Contest</v-btn>
                    </template>
                  </v-card-actions>
                </v-card>
                
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>

        <v-dialog
          v-model="dialog"
          
          persistent
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card height="400" flat class="round_top">
            <v-toolbar flat color="teal">
              <div class="title white--text">Enroll</div>
            </v-toolbar>
            <v-container grid-list-xs>
              <v-flex>
                <loading-bar height="30vh">
                  <div class="title mb-2" slot="loading_info">
                    Enrolling...
                  </div>
                </loading-bar>
              </v-flex>
            </v-container>
          </v-card>
        </v-dialog>
      </v-container>
    </transition>
    
  </div>
</template>
<script>
export default {
  data:()=>({
    title: 'Enroll | Voteryte',
    e5: 1,
    snackbar: {},
    dialog: false,
    loading: false,
    message: 'Enrolling...',
    electionId: null,
    election: {},
    contestant: {
      acstoken: '',
      role: ''
    },
    voter: {
      image:''
    },
    error_msg: '',
    hide: false,
    vid: '',
    cloudinary: {
       uploadPreset: 'izcl0gzg',
       cloudName: 'unplugged',
       folder: 'securepoll',
        transformation:[
          {width: 400, height: 400, crop: "thumb", gravity:"face"},
        ],
     }, 
  }),
  computed:{
    style_stepper_items(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          "min-height": 'calc(100vh - 128px) !important'
        }
      }
    },
    ...mapGetters([
      'getUserInfo',
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom'
    ])
  },
  methods:{
    async getElection(){
      try {
        
        // prevent making unneccessary api calls
        if(!this.electionId){
          alert('Id is required') 
        }
        else if(this.curRoom && this.curRoom.electionId == this.electionId.trim()){
          this.error_msg = 'Sorry, you have already enrolled for this election'
          this.hide = true
          this.e5 = 2
        }
        else if(this.getUserInfo && this.getUserInfo.enrolled && !!this.getUserInfo.enrolled.find(id => id == this.electionId)){
          this.error_msg = 'Sorry, you have already enrolled for this election'
          this.hide = true
          this.e5 = 2
        }
        else{
          this.loading = true
          let details = db.collection('moreUserInfo').doc(this.$store.getters.getUser.uid);
          let doc, user

          user = this.getUserInfo
          $Nprogress.start()

          let electionRef = db.collection('elections').doc(this.electionId)
          
          let id = await electionRef.get()
          // console.log(id.data())
          
          if(!id.exists){
            this.snackbar = {
              show:true,message:'Sorry, election not found', color:'error'
            }
            this.loading = false
            $Nprogress.done()
          }
          else if(this.getUserInfo && this.getUserInfo.enrolled && !!this.getUserInfo.enrolled.find(id => id == this.electionId)){
            this.error_msg = 'Sorry, you have already enrolled for this election'
            this.hide = true
          }
          else{
            $Nprogress.done()
            this.election = id.data()
            this.loading = false
            this.e5 = 2

            if(this.election.type == 'School' && user.sch == this.election.sch){
              if(this.election.level == 'Department' && user.dept != this.election.dept){
                this.error_msg = 'Sorry, you can only vote in your department'
                this.hide = true
              }
              else if(this.election.level == 'Faculty' && user.fac != this.election.fac){
                this.error_msg = 'Sorry, you can only vote in your faculty'
                this.hide = true
              }
              else{
                this.hide = false
              }
            }
            else if(this.election.type == 'School' && user.sch != this.election.sch){
              // console.log(user, this.election)
              this.error_msg = 'Sorry, you can only vote in your school'
              this.hide = true
            }
            else{
              this.hide = false
            }
          }
        }
        
      } catch (error) {
        // console.log(error)
        // console.log(error.response)
        error.response ? error.response.status == 404 ? this.snackbar = {
          show:true,message:error.response.data.message, color:'error'
        } : '' : ''
      }
    },
    async enroll(){
      firebase.auth().currentUser.getIdToken().then((token)=>{
        this.loading = true
        this.dialog = true
        api().post('dashboard/enroll',{
          electionId:this.election.electionId,
          idToken:token
        }).then(result =>{
          this.message = 'Done'
          this.$store.dispatch('setMyEnrolled', {election: this.election, merge: true})

          this.snackbar = {
            show:true,message:'Enrollement successfull!', color:'success'
          }

          this.loading = false
          this.dialog = false
          this.e5 = 3
        }).catch(error=>{
          $Nprogress.done()
          this.loading = false
          // console.log(error)
          // console.log(error.response)

          if(error.response){
            this.snackbar = {
              show:true,message:error.response.data.message, color:'error'
            }
          }else{
            this.snackbar = {
              show:true,message:'Something went wrong, check your internet connection and try again', color:'error'
            }
          }
          
        })
      })
    }
  },
  created(){
    
    
  },
  components:{
    Navigation,
    LoadingBar
  }
}
import api from '@/services/api'
import axios from 'axios'
import Navigation from '@/components/Navigation'
import { mapGetters, mapState } from 'vuex';
import LoadingBar from '@/spinners/LoadingBar'
import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss">
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .round{
    @include borderRadius(15px)
  }
</style>

