<template>
  <v-app class="signup">
    
    <vue-headful
      :title="title"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color"
      :timeout="5000" top :vertical="$vuetify.breakpoint.xsOnly">
      {{ snackbar.message }}
      <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-content>
      <v-container fluid fill-height class="">
        
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-row justify="center">
              
              <v-col cols="12" sm="8" md="6">

                <h1 class="text-center mb-5" >
                  <router-link to="/login" class="white--text">
                    {{$appName}}
                  </router-link>
                </h1>

                <p class="text-center mt-5">Sign Up for free</p>

                <v-card flat class="transparent">
                  
                  <v-card-text>
                    
                    <v-card
                      class="mx-auto mb-3"
                      max-width="500"
                      outlined
                    >
                      <v-card-title class="title font-weight-regular justify-space-between">
                        {{ currentTitle }}
                        
                      </v-card-title>

                      <v-window v-model="step">
                        
                        <v-window-item :value="1">
                          <v-card-text>

                            <v-subheader class="pl-0">Choose account type</v-subheader>
                            <v-radio-group class="mt-0" v-model="form.acc_type" mandatory>
                              <v-radio label="Individual" value="personal"></v-radio>
                              <v-radio label="Groups or organizations" value="group"></v-radio>
                            </v-radio-group>
                            
                            <v-text-field
                              name="name"
                              :label="form.acc_type == 'personal' ? 'Your name*' : 'Organization or group name'"
                              v-model.trim="form.name"
                            ></v-text-field>

                            <v-text-field
                              label="Username*"
                              v-model.trim="form.username"
                            ></v-text-field>

                            <v-text-field
                              :label="form.acc_type == 'personal' ? 'Email*' : 'Work email'"
                              type="email"
                              name="email"
                              required
                              v-model.trim="form.email"
                            ></v-text-field>
                            <span class="caption grey--text text--darken-1">
                              For account recovery and billing operations
                            </span>

                          </v-card-text>
                        </v-window-item>

                        <v-window-item :value="2">
                          <v-card-text>
                            <v-text-field
                              label="Password"
                              type="password"
                              v-model.trim="form.password1"
                            ></v-text-field>
                            <v-text-field
                              label="Confirm Password"
                              type="password"
                              v-model.trim="form.password2"
                            ></v-text-field>
                    
                            <span class="caption grey--text text--darken-1">
                              At least 6 characters in length
                            </span>
                          </v-card-text>
                        </v-window-item>

                      </v-window>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn
                          :disabled="step === 1"
                          text
                          @click="step--"
                        >
                          Back
                        </v-btn>

                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          depressed
                          :loading="loading"
                          :disabled="disabled"
                          @click.native="next"
                        >
                          {{ step == 2 ? 'Signup' : 'Next'}}
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <span class="mt-4">
                      Have an account ?
                      <v-btn text small 
                        color="primary" to="/login"
                        class="text-capitalize">Login</v-btn>
                    </span>
                    <br>

                    <small class="">
                      By signing up you agree to our 
                      <a 
                        href="https://voteryte.com/terms" 
                        target="_blank" 
                        rel="noopener">
                        terms of use
                      </a>

                      and 

                      <a 
                        href="https://voteryte.com/privacy" 
                        target="_blank" 
                        rel="noopener">
                        privacy policy
                      </a>
                    </small>

                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <footr></footr>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    step: 1,
    snackbar: {},
    loading: false,
    form: {
      acc_type: 'group',
      name: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
    }
  }),

  computed: {
    title(){
      return `Signup | ${this.$appName}`
    },
    currentTitle () {
      switch (this.step) {
        case 1: return 'Create account'
        default: return 'Create a password'
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    disabled(){

      if(this.step == 1 && (!this.form.username || !this.form.name || !this.form.email)) return true
      if(this.step == 2){
        return (!this.form.password1 || !this.form.password2) ? true : 
        this.form.password1.length < 6 ? true : this.form.password1 !== this.form.password2
      }
    },
    
  },
  methods: {
    next(){
      this.step == 2 ? this.signup() : this.step++
    },
    async signup(){
      try {

        this.loading = true
        // console.log(this.form)
        await Auth.signup({
          ...this.form,
          password: this.form.password1
        })

        this.$router.replace('/home?new=true')

      } catch (error) {
        console.log(error)
        this.loading = false

        this.snackbar = {
          show: true,
          message: error,
          color: 'error'
        }
      }
    },
  },
  mounted(){
    // document.getElementById('welcome_logo').style.display = 'none'
  },
  components:{
    footr: Footer,
  },
}

import Footer from '@/components/Footer'
import Auth from '@/plugins/auth'
</script>

<style scoped>
  .signup{
    background:#042943 !important;
    color: #9cb3c9;
  }

  a {
    text-decoration: none;
  }

  p, span, small {
    color: #9cb3c9 !important;
  }
</style>