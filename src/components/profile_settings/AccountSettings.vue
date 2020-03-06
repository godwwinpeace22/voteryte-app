<template>
  <div>
    <vue-headful :title="title"></vue-headful>
    <navigation>
      <span slot="title">Account settings</span>
    </navigation>

    <v-row v-if="showUi">
      <v-col cols="12">
        <v-card outlined>
          <v-card-title> Basic Info</v-card-title>

          <v-card-text class="mt-4">

            <v-text-field 
              class="mb-4 text-capitalize" 
              outlined
              v-model.trim="form.name" 
              color="primary" autocomplete="name" 
              :placeholder="getUser.name" 
              label="Name" hide-details
              :disabled="loading"
            >
            </v-text-field>

            <v-textarea
              label="About You"
              name="about" outlined 
              :placeholder="getUser.about"
              rows="9" v-model.trim="form.about"
              :disabled="loading"
            ></v-textarea>

            <v-file-input
              v-model="profile_photo"
              color="deep-purple accent-4"
              label="Profile photo"
              placeholder="Choose photo"
              append-icon="mdi-camera"
              prepend-icon=""
              outlined
              :rules="rules"
              :disabled="loading"
              :show-size="1000"
            >
            </v-file-input>

            <v-file-input
              v-model="header_img"
              color="deep-purple accent-4"
              label="Header image"
              placeholder="Choose header image"
              append-icon="mdi-camera"
              prepend-icon=""
              outlined
              :rules="rules"
              :disabled="loading"
              :show-size="1000"
            >
            </v-file-input>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed 
              class="success" 
              @click.native="updateProfile" 
              :disabled="disabled_save || loading" 
              :loading="loading">
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card outlined>
          <v-card-title>School</v-card-title>
          <v-card-text>
            
            <!-- <v-switch 
              label="I am a student"
              color="success"
              v-model="form.is_student">
            </v-switch> -->
            
            <div>
              <v-autocomplete
                required outlined
                v-model="form.sch" 
                :items="getSchools"
                :readonly="getUser.was_once_a_student"
                :disabled="getUser.was_once_a_student"
                color="primary"
                hide-details
                return-object
                label="Your school" >
                <v-icon slot="prepend-inner" color="teal">mdi-school</v-icon>
              </v-autocomplete>
              <div class="mb-5 mt-2">Can't find your school? 
                <a href="https://support.voteryte.com" target="_blank" rel="noopener noreferrer">
                  Let us know.
                </a>
              </div>
              
              <v-select
                required outlined
                v-model="form.fac"
                :items="form.sch.faculties"
                color="primary" return-object 
                :readonly="getUser.was_once_a_student"
                :disabled="getUser.was_once_a_student"
                label="Select faculty" >
                <v-icon slot="prepend-inner" color="teal">mdi-domain</v-icon>
              </v-select>

              <v-select
                required outlined
                v-model="form.dept"
                :items="form.fac.departments"
                return-object
                :readonly="getUser.was_once_a_student"
                :disabled="getUser.was_once_a_student"
                color="primary" label="Select department">
                <v-icon slot="prepend-inner" color="teal">mdi-map-marker</v-icon>
              </v-select>
            </div>
              
          </v-card-text>
          <v-card-actions>

            <v-spacer></v-spacer>

            <v-btn color="success" 
              @click="updateSchool"
              :loading="saving_sch"
              :disabled="disabled2"
              depressed>
              Save changes</v-btn>
              
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card outlined id="subscriptions">
          <v-card-title>
            Subscriptions
          </v-card-title>
          <v-card-text>
            <v-row v-if="isSuperUser && !subscription.cancelled">
              <v-col cols="4">
                Plan:
              </v-col>
              <v-col cols="6">
                <b>Premium</b>
              </v-col>
              <v-col cols="4">
                Subscription date:
              </v-col>
              <v-col cols="6">
                <b>{{new Date(subscription.paid_at)}}</b>
              </v-col>
              <v-col cols="4">
                Expires on: 
              </v-col>
              <v-col cols="6">
                <b>{{expiresOn}}</b>
              </v-col>
            </v-row>
            <v-subheader v-else>No active subscription</v-subheader>
          </v-card-text>
          <v-card-actions v-if="isSuperUser && !subscription.cancelled">
            <v-spacer></v-spacer>

          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <verification-settings/>
      </v-col>

    </v-row>

  </div>
</template>
<script>
export default {
  data: ()=>({
    showUi: false,
    loading: false,
    saving_sch: false,
    loading3: false,
    form: {
      name: '',
      title: '',
      about: '',
      is_student: '',
      sch: '',
      fac: '',
      dept: ''
    },
    profile_photo: null,
    header_img: null,
    rules: [
      value => !value || value.size < 2000000 || 'photo size should be less than 2 MB!',
    ],
    dialog: false,
  }),
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ]),
    title(){
      return `Profile Settings | ${this.$appName}`
    },
    expiresOn(){
      let d = new Date(this.subscription.paid_at)
      d.setMonth(d.getMonth() + 1)
      return new Date(d)
    },
    disabled_save(){
      return false //!this.form.about
    },
    disabled2(){
      // return false
      return !this.form.sch || 
       !this.form.fac ||
       !this.form.dept
    },
    getSchools(){
      return schools
    }
  },
  methods: {
    async uploadImage(file){
      let res = await this.$helpers.uploadMedia({
        files: [file],
        options: {
          height: 300,
          width: 800
        }
      })

      return res[0]
    },
    async updateProfile(){

      this.loading = true
      try{
        
        let photo = this.profile_photo ? await this.uploadImage(this.profile_photo) : this.getUser.photoURL
        let header_img = this.header_img ? await this.uploadImage(this.header_img) : this.getUser.header_img || false

        this.$gun.get('users').get(this.getUser.username)
          .put({
            name: this.form.name || this.getUser.name,
            about: this.form.about || this.getUser.about || '',
            photoURL: photo,
            header_img
          })
        

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Changes save',
          color: 'purple'
        })
        this.loading = false
      }
      catch(err) {

        this.$eventBus.$emit('Snackbar',{
          show: true,
          message: 'Profile update failed. Try again',
          color: 'error'
        })

        console.log(err)

        this.loading = false

      }
    },
    async updateSchool(){

      this.saving_sch = true
      try{
        
        this.$gun.get('users').get(this.getUser.username)
          .put({
            was_once_a_student: this.getUser.was_once_a_student ? true : true,
            is_student: !!this.form.sch.text || !!this.form.fac.text || !!this.form.dept.text,
            sch: this.form.sch.text || this.getUser.sch,
            fac: this.form.fac.text || this.getUser.fac,
            dept: this.form.dept.text || this.getUser.dept
          })
          

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Changes save',
          color: 'purple'
        })
        this.saving_sch = false
      }
      catch(err) {

        this.$eventBus.$emit('Snackbar',{
          show: true,
          message: 'Profile update failed. Try again',
          color: 'error'
        })

        console.log(err)

        this.saving_sch = false

      }
    },
    async cancelSubscription(){

      try {
        
        if(this.isSuperUser){

          this.loading3 = true;
          let dec = this.subscription
          // console.log(dec)
          
          if(!dec.cancelled){

            await api().post('/cancelSubscription', {
              plan_id: dec.plan_id,
              customer_id: dec.customer_id
            })
    
            let new_sub = JSON.stringify({
              ...dec,
              cancelled: true,
              cancelled_at: this.$Gun.state()
            })

            let epriv = this.$gUser['_'].sea.epriv
            let enc = await this.$SEA.encrypt(new_sub, epriv)
    
            this.$gung.get('users')
              .get(this.getUser.username)
              .get('subs').put(enc)
    
            this.loading3 = false
            this.dialog = false
            
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Subscription cancelled',
              color: 'success'
            })
          }
          else {

            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'You have not active subscriptions',
              color: 'error'
            })
            this.loading3 = false
            this.dialog = false
          }
        }

      } catch (error) {
        console.log(error)
        this.loading3 = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })
      }

    }
  },
  async mounted(){

    this.form = Object.assign({}, this.getUser)

    if(this.getUser.was_once_a_student){
      let sch = this.getSchools.find(s => s.text == this.getUser.sch)
      let fac = this.getUser.fac ? sch.faculties.find(f => f.text == this.getUser.fac) : ''
      let dept = this.getUser.dept ? fac.departments.find(d => d.text == this.getUser.dept) : ''

      this.form.sch = sch;
      this.form.fac = fac;
      this.form.dept = dept;
    }

    // get subscription details
    // let epriv = this.$gUser['_'].sea.epriv
    // let sub = await this.$gUser
    //   .get('subs')
    //   .then()

    // // console.log(sub)
    // this.subscription = sub ? await this.$SEA.decrypt(sub, epriv) : undefined

    this.showUi = true;
    
  },
  components: {
    VerificationSettings,
  }
}

import { mapGetters, mapState } from 'vuex'
import api from '@/services/api2'
import {schools} from '@/assets/js/schools'
import VerificationSettings from '@/components/profile_settings/VerificationSettings'
</script>

<style scss>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    cursor:pointer;
  }
  .profile_card .v-image__image{
    filter:blur(2px) !important;
  }
</style>
