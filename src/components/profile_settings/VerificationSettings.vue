<template>
  <div>
    <v-card outlined>

      <v-card-title >
        {{ getUser.acc_type == 'personal' ? 'BVN' : 'Account' }} Verification

        <v-tooltip top open-on-click max-width="300">
          <template v-slot:activator="{on}">
            <v-icon 
              class="ml-1" 
              v-if="getUser.acc_type == 'personal'" 
              v-on="on">
              mdi-help-circle-outline
            </v-icon>
          </template>

          <span>
            Your BVN is an 11 digit number and it acts as your universal ID in all 
            commercial banks in Nigeria.
          </span>
        </v-tooltip>
      </v-card-title>
      
      <v-card-text v-if="getUser.acc_type == 'personal'">
        <p>
          Some contests may require BVN verification before participation.
          
        </p>
        <v-text-field
          name="bvn" type="number"
          label="Enter your BVN"
          v-model.number="form.bvn"
          counter="11" outlined
          hint="bvn must match your registered phone number"
        ></v-text-field>

        <small>
          Your BVN is used for verification purposes only. We don't 
          store your BVN or share it with any third-party.
        </small>
      </v-card-text>

      <v-card-text v-else>
        <p>Submit a document that shows you as part of this organization or
          have the authority to create contests on behalf of the organization or group.
        </p>

        <v-file-input
          append-icon="mdi-file"
          prepend-icon=""
          outlined
          v-model="form.file"
          accept="image/jpeg,image/png"
        >

        </v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="info" depressed
          @click="getUser.acc_type == 'personal' ? verify : submit"
          :loading="loading"
          ripple class="mx-auto"
          :readonly="getUser.pending_v"
          :disabled="disabled_btn"
          v-if="!is_verified">
          {{getUser.pending_v ? 'Request submitted' : getUser.acc_type == 'personal' ? 'Verify' : 'Submit'}}
        </v-btn>
        <v-btn color="success" depressed
          v-else block>
          Your {{getUser.acc_type == 'personal' ? 'BVN' : 'acount'}} is verified
          <v-icon>mdi-check</v-icon>
        </v-btn>

      </v-card-actions>

    </v-card>

    <v-card outlined class="mt-5">
      <v-card-title >
        Change Password
      </v-card-title>
      <v-card-text>
        <form>
        <v-row>
          <v-col>
            <v-text-field
              name="pass1"
              type="password"
              label="Old password"
              v-model="form.oldpassword"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              name="pass1"
              type="password"
              label="Enter new password"
              v-model="form.newpassword"
            ></v-text-field>
          </v-col>
        </v-row>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" depressed 
          :disabled="!form.oldpassword || !form.newpassword"
          :loading="changing_pass"
          @click="changePass"
        >Change</v-btn>
      </v-card-actions>
    </v-card>
        
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      bvn: '',
      file: null,
      oldpassword: '',
      newpassword: '',
    },
    loading: false,
    uploading: false,
    changing_pass: false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    }
  }),
  computed: {
    ...mapState([
      'is_verified'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    disabled_btn(){
      return !this.form.bvn || this.form.bvn.toString().length != 11 
      
    }
  },
  methods: {
    async verify(){

      try {
        
        let f = localStorage.getItem('vr-lv')
        let c = localStorage.getItem('vr-lt')
        let wait_for = ((c*1 + 30*60*1000) - Date.now())/(1000 * 60)

        if(f >= 54 && wait_for > 0){
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: `Too many trials. Wait for ${wait_for.toFixed()} minutes`,
            color: 'error'
          })
        }
        else {
          this.loading = true
  
          await api().post('verifyBVN', {
            bvn: this.form.bvn,
            phone: this.getUser.phone,
            token: this.getUser.token
          })
          
          // console.log(resp) 
          // BVN verified; mark user as verified
          this.$gUser.get('is_verified')
            .put(true)
  
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Your account has been verified',
            color: 'success'
          })
  
          this.loading = false
          
        }

      } catch (error) {

        console.log(error)
        this.loading = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: error.response ? error.response.data.message : 'Something went wrong',
          color: 'error'
        })

        // try to prevent abuse of the API
        if(error.response && error.response.data.success == false){

          let f = localStorage.getItem('vr-lv')
          
          f ? localStorage.setItem('vr-lv', f*1+1) : localStorage.setItem('vr-lv', 1)
          localStorage.setItem('vr-lt', Date.now())
        }

      }
    },
    async submit(){

      // upload document
      this.uploading = true
      let uploaded = await this.$helpers.uploadImage([this.file], this.cloudinary)

      // submit request
      api().post('verifyAcc', {
        name: this.getUser.name,
        email: this.getUser.email,
        file_link: uploaded[0]
      }).then(() => {

        // remember user has submitted doc
        this.$gun.get('users').get(this.getUser.username)
          .get('pending_v').put(true)

        this.$eventBus.$emit('Snackbar', {
          message: 'Request submitted',
          show: true,
          color: 'success'
        })

        this.uploading = false
      }).catch(err => {
        console.log(err)

        this.$eventBus.$emit('Snackbar', {
          message: 'Something went wrong',
          show: true,
          color: 'error'
        })

        this.uploading = false
      })
    },
    changePass(){

      try {
        
        let callback = ()=>{
          
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Password changed',
            color: 'success'
          })

          this.changing_pass = false
        }

        this.changing_pass = true
        this.$gUser.auth(this.getUser.username, this.form.oldpassword, callback, { change: this.form.newpassword })

      } catch (error) {
        console.log(error)
        this.changing_pass = false
      }
    }
  }
}


import { mapState, mapGetters } from 'vuex'
import api from '@/services/api2'
</script>

<style>

</style>