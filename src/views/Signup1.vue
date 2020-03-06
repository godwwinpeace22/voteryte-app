<template>
  <v-app id="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md5>

          <v-snackbar v-model="snackbar.show" dark :color="snackbar.color" :timeout="5000" top>
             <span v-html='snackbar.message'></span>
            <v-btn dark text color="white" @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <v-alert
            :value="alert.show"
            dismissible
            transition="fade-transition"
            :type="alert.type"
          >
            {{alert.message}}
          </v-alert>

          <h1 class="text-center white--text mb-4" ><a href="/" style="text-decoration:none;color:#fff">{{$appName}}</a></h1>
          
          <v-card class="" max-width="800" v-if="!show_confirm_text">
            <v-card-title class="title font-weight-bold justify-space-around">
              <span>{{ currentTitle }}</span>
              
            </v-card-title>

            <v-window v-model="step">

              <v-window-item :value="1">
                <v-card-text >
                  <v-form ref="form" class="text-center pa-3">
                    <!-- <p class="text-center"></p> -->
                    <v-text-field outlined
                      label="Full Name" class="mb-0"
                      v-model.lazy="$v.form.name.$model" :error-messages="nameErrors"
                      color="primary" required>
                      <v-icon slot="prepend-inner" color="teal">mdi-account</v-icon>
                    </v-text-field>

                    <v-text-field 
                      label="Email" name="email" class="mb-0" outlined
                      v-model.lazy="$v.form.email.$model" 
                      color="primary" :error-messages="emailErrors"
                      required type="email">
                      <v-icon slot="prepend-inner" color="teal">mdi-email</v-icon>
                    </v-text-field>

                    <v-text-field 
                      label="Username" class="mb-0"
                      v-model.lazy="$v.form.username.$model" :error-messages="usernameErrors" 
                      color="primary" outlined
                      required>
                      <v-icon slot="prepend-inner" color="teal">mdi-account</v-icon>
                    </v-text-field>

                    <v-text-field
                      name="phone" outlined
                      label="Phone Number" type="tel"
                      prefix="+234" placeholder="7094342323"
                      v-model.lazy="$v.form.phone.$model" :error-messages="phoneErrors"
                    ></v-text-field>

                    <v-text-field class="mb-0"
                      v-model.lazy="$v.form.password1.$model"
                      color="primary" :error-messages="password1Errors"
                      label="Password" outlined
                      :type="show1 ? 'text' : 'password'"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      hint="At least 6 characters"
                      @click:append="show1 = !show1"
                      required counter>
                      <v-icon slot="prepend-inner" color="teal">mdi-lock</v-icon>
                    </v-text-field>

                    <!-- <v-text-field required
                      v-model.lazy="$v.form.password2.$model"
                      type="password" color="primary" outlined
                      name="password2" :error-messages="password2Errors"
                      label="Confirm Password">
                      <v-icon slot="prepend-inner" color="teal">mdi-lock</v-icon>
                    </v-text-field> -->
                  </v-form>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <v-radio-group v-model="form.is_student" row class="px-3">
                    <v-radio label="I am a student" :value="true"></v-radio>
                    <v-radio label="I am not a student" :value="false"></v-radio>
                  </v-radio-group>
                  <v-form ref="form2" v-if="form.is_student == true" v-model="valid2" class="text-center pa-3">
                    <v-autocomplete
                      v-model.lazy="form2.mySchool" hint="Select your school"
                      :items="schools" return-object item-text="text" hide-no-data  class="mb-0"
                      label="School" persistent-hint color="primary">
                      <v-icon slot="prepend-inner" color="teal">mdi-school</v-icon>
                    </v-autocomplete>

                    <v-autocomplete color="primary"
                      label="Faculty"  v-model.lazy="form2.myFaculty" 
                      :items="form2.mySchool.faculties"
                      return-object item-text="text" class="mb-0" hide-no-data
                      required >
                      <v-icon slot="prepend-inner" color="teal">mdi-domain</v-icon>
                    </v-autocomplete>
                    <v-autocomplete label="Department" class="mb-0" hide-no-data 
                      v-model.lazy="form2.myDepartment" :items="form2.myFaculty.departments" required
                      return-object item-text="text" color="primary">
                      <v-icon slot="prepend-inner" color="teal">mdi-map-marker</v-icon>
                    </v-autocomplete>
                  </v-form>
                  <div class="text-center">
                    <span class="caption grey--text text--darken-1">
                      * Please note that you need to be a student to paticipate in student elections.
                    </span><br>
                    <small class="grey--text text--darken-1">By signing up, you agree with our </small><br>
                    <small class="grey--text text--darken-1">
                      <v-btn href="https://voteryte.com/terms" 
                        color="primary" style="font-size: 12px" 
                        target="blank" class="text-capitalize" text small>Terms of Use</v-btn> and 
                      <v-btn href="https://voteryte.com/privacy" 
                        color="primary" style="font-size: 12px" 
                        target="blank" class="text-capitalize" text small> Privacy Policy</v-btn></small>
                  </div>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <v-card-text class="b-0">
                  <p>We sent a 6-digit verification code to your phone. Enter the numbers below.</p>
                  <v-text-field
                    name="verification_code"
                    outlined hide-details
                    v-model="form3.verification_code_from_user"
                    label="Verification code"
                  ></v-text-field>

                  <span>Didn't get the code ?</span>
                  
                  <v-btn color="info" text class="d-inline" 
                    @click="resendCode"
                    :disabled="disable_resend_btn">
                    Resend Code
                  </v-btn>
                </v-card-text>
                <v-card-actions>
                </v-card-actions>
              </v-window-item>

            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn :disabled="step === 1 || loading" text @click="step--">
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="step !== 4"
                
                color="success" :loading="loading" 
                depressed @click="next"
              >
                {{step == 3 ? 'Verify' : 'Continue'}}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else>
            
            <v-card-text>
              <p class="subheading">
                We've sent an email to <b>{{form.email}}</b>. 
                Click the confirmation link in that email to begin using {{$appName}}
              </p>
              <p>Didn't get the verification link ? <br>
                <v-btn color="info" text 
                  @click="sendVerificationLInk(true)" 
                  :loading="sending_link">
                  Resend verification link
                </v-btn>
              </p>
            </v-card-text>
          </v-card>

          <v-subheader class="ml-5 white--text text-center">Already have an account? 
            <router-link to="/login" 
              class="pl-2 font-weight-bold success--text" 
              style="text-decoration:none;">
               Sign in
            </router-link>
          </v-subheader>
        </v-flex>
      </v-layout>
    </v-container>

    <footr></footr>
  </v-app>
</template>
<script>

export default {
  data:()=>({
    step: 1,
    message: 'Login',
    alert: {show: false},
    snackbar: {},
    loading: false,
    sending_link: false,
    disabled: false,
    show_confirm_text: false,
    confirm_text: 'Email verification link has been sent',
    show1: false,
    form: {
      name: '',
      email: '',
      phone: '',
      username: '',
      is_student: true, // whether is student or not
      password1: '',
      password2: '',
    },
    form2: {

      mySchool: '',
      myFaculty: '',
      myDepartment: '',
    },
    form3: {},
    disable_resend_btn: false,
    schools: [],
    select: null,
    show3: false,
    show4: false,
    valid: true,
    valid2: true,
    checkbox: false
  }),
  validations: {
    form: {
      name: {required},
      username: {required},
      phone: {required, minLength: minLength(10)},
      email: {required, email},
      is_student: {required},
      password1: {required, minLength: minLength(6)},
      // password2: {required, minLength: minLength(6), sameAsPassword: sameAs('password1')}
    },
    form2: {
      mySchool: {required},
      myFaculty: {required},
      myDepartment: {required}
    },
    form3: {
      verification_code: '',
      verification_code_from_user: ''
    },
  },
  components:{
    // 'toolbar':Nav,
    footr: Footer
  },
  computed: {
    title(){
      return `Sign Up | ${this.$appName}`
    },
    currentTitle () {
      switch (this.step) {
        case 1: return 'Sign Up For Free'
        case 2: return 'Almost done...'
        case 3: return 'Verify Phone'
        default: return 'Account created'
      }
    },
    password1Errors () {
      const errors = []
      if (!this.$v.form.password1.$dirty) return errors
      !this.$v.form.password1.required && errors.push('Password is required.')
      !this.$v.form.password1.minLength && errors.push('Mininum length of 6 characters.')
      return errors
    },
    password2Errors () {
      const errors = []
      if (!this.$v.form.password2.$dirty) return errors
      !this.$v.form.password2.required && errors.push('Password is required.')
      !this.$v.form.password2.minLength && errors.push('Mininum length of 6 characters.')
      !this.$v.form.password2.sameAsPassword && errors.push('Passwords don\'t match.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email && errors.push('Email must be valid')
      !this.$v.form.email.required && errors.push('E-mail is required')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Name is required')
      return errors
    },
    usernameErrors () {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.required && errors.push('Username is required')
      // !this.usernameIsTaken() && errors.push('Username is taken')
      return errors
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.form.phone.$dirty) return errors
      !this.$v.form.phone.required && errors.push('Phone number is required')
      // !this.phoneIsTaken() && errors.push('Phone number already exists')
      !this.$v.form.phone.minLength && errors.push('Please use a valid phone number.')
      return errors
    },
    disable_step_two(){
      return this.step == 2 && 
      (!this.form2.mySchool ||
      !this.form2.myFaculty ||
      !this.form2.myDepartment)
    }
  },
  methods:{
    next(){
      this.$v.form.$touch()

      if(this.step == 1 && this.$v.form.$anyError){
        // console.log(this.$v.form)
      }
      else if(this.step == 2 && this.$v.form2.$anyError){
        ''
      }
      else if(this.step == 2){
        this.sendVerificationToPhone()
      }
      else if(this.step == 3){
        this.verifyPhone()
      }
      else {
        // console.log(this.$v.form2)
        // this.step == 2 ? this.signup() : this.step++
        this.step++
      }
    },
    async getSchools(){
      try {
        
        this.schools = schools
      } catch (error) {
        // console.log(error)
      }
    },
    submit(){
      try{
        // check if forms are valid before submit
        if(this.form.is_student){
          if((this.$refs.form && this.$refs.form.validate()) && (this.$refs.form2 && this.$refs.form2.validate())){
            this.send()
          }else{
            this.snackbar = {status:true,color:'error', message:'Please provide all required fields'}
          }
        }
        else{
          if(this.$refs.form && this.$refs.form.validate()){
            this.send()
          }else{
            this.snackbar = {status: true, color: 'error', message: 'Please provide all required fields'}
          }
        }
      }
      catch(err){
        // console.log(err)
      }
    },
    sendVerificationToEmail(){

    },
    resendCode(){

      this.disable_resend_btn = true
      this.form3.verification_code = this.$helpers.getRandomNumber()
      console.log(this.form3)

      this.snackbar = {
        show: true,
        message: 'Verification Code resent',
        color: 'info'
      }
    },
    async sendVerificationToPhone(){

      // check that the phone number doesn't already exist in db
      let exists = await this.phoneIsTaken()

      if(exists){

        this.snackbar = {
          show: true,
          message: 'That phone number already exists in the system',
          color: 'error'
        }
        
        this.step = 1
        
        return 
      }
      else {
        // phone doesn't exist, send the code

        this.loading = true
        console.log(this.form3)
        
        setTimeout(() => {
          this.form3.verification_code = this.$helpers.getRandomNumber()
          this.loading = false
          this.step++
        }, 2000);
      }
    },
    async usernameIsTaken(){
      // check that username does not exist already
      // let isTaken = true;

      this.$gun.get('users').get(this.form.username).not(function(){
        
        // isTaken = key ? false : true
        
      })

      let u = await this.$gun.get('users').get(this.form.username).then()

      return !!u

    },
    async phoneIsTaken(){
      // check that the phone number doesn't already exist in db
      
      let exists = await this.$gun.get('phone_numbers').get('234' + this.form.phone).then()
      return !!exists

    },
    async signup(){
      try {

        this.loading = true;

        let data = {
          name: this.form.name,
          email: this.form.email,
          username: this.form.username,
          phone: '234' + this.form.phone,
          is_student: this.form.is_student,
          was_once_a_student: this.form.is_student,
          photoURL: '',
          password: this.form.password1,
          sch: this.form2.mySchool.text,
          dept: this.form2.myDepartment.text,
          fac: this.form2.myFaculty.text
        }

        if(await this.usernameIsTaken()){
          this.loading = false
          this.step = 1
          this.alert = {
            show: true,
            message: 'Sorry that username is already taken',
            type: 'error'
          }
        }

        else {
          // console.log('Username not taken... About to signup...')
          
          // get token for authentication from api server
          let token = await this.getToken()
          data.token = token;
          
          await Auth.signup(data)
          this.loading = false
        }
        
      } catch (error) {
        console.log(error)
      }
    },
    async verifyPhone(){
      
      // check that saved code matches user input
      if(this.form3.verification_code == this.form3.verification_code_from_user){

        // code matches, save the number
        this.$gun.get('phone_numbers').get('234' + this.form.phone)
        .put(this.form.username)

        this.signup()
      }
      else {
        this.snackbar = {
          show: true,
          message: 'Invalid or expired code',
          color: 'error'
        }
      }
      
    },
    async getToken(){
      let resp = await api().post('/createToken', {username: this.form.username})
      return resp.data.token
    }
  },
  async mounted(){
    this.getSchools()
    document.getElementById('welcome_logo').style.display = 'none'

    // let e = await this.$gun.get('users').get('bradpi').then()
    // console.log(!!e)
  }
}

// import Nav from '@/components/Nav'
  import api from '@/services/api2'
  import Auth from '@/plugins/auth'
  import { schools } from '@/assets/js/schools'
  import Footer from '@/components/Footer'
  import { required, minLength, email } from 'vuelidate/lib/validators'
</script>
<style lang="scss" scoped>
  @mixin MainColor(){
    //background:#fdba1e;
    background:#042943;
    color:#fff;
  }
  #cc{
    background:#042943;
    //background:#e8e8e8;
  }
  
  .form_buttons button{
    text-transform:none;
  }

  .v-btn {
    text-transform: capitalize;
  }
  
</style>


