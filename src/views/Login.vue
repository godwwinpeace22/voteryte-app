<template>
  <v-app class="login">
    
    <vue-headful
      :title="title"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color"
      :timeout="5000" top :vertical="$vuetify.breakpoint.xsOnly">
      {{ snackbar.message }}
      <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-content>
      <v-container fill-height>
        
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4">
            
            <v-card class="login" flat>
              
              <v-card-text>
                <h1 class="text-center mb-3" >
                  <router-link to="/login" class="white--text">
                    {{$appName}}
                  </router-link>
                </h1>

                <p class="text-center mt-5">Log in to your account</p>

                <v-text-field
                  solo flat
                  name="username"
                  label="Username"
                  v-model="form.username"
                ></v-text-field>

                <v-text-field
                  name="password"
                  solo flat
                  label="Enter password"
                  v-model="form.password1"
                  hide-details
                ></v-text-field>
                
              </v-card-text>
              <v-card-actions class="px-4">

                <div class="d-block pt-5">
                  <small style="color: #9cb3c9;">
                    Don't have an account yet? 
                    <v-btn text small
                      to="/signup"
                      color="white" tile
                      class="text-capitalize px-1  signup__btn">
                      Sign up
                    </v-btn>
                  </small>
                </div>

                <v-spacer></v-spacer>

                <v-btn type="submit"
                  class=" text-capitalize"
                  depressed
                  :disabled="disableLogin"
                  @click.native="login" color="success" 
                  :loading="loading">
                  Login
                </v-btn>
                
              </v-card-actions>
            </v-card>
          </v-col>
              
        </v-row>
      </v-container>
    </v-content>
    <footr></footr>
  </v-app>
</template>
<script>
export default {
  data:()=>({
    loading: false,
    snackbar: {},
    dialog: false,
    form: {
      name: '',
      email: '',
      username: '',
      password1: '',
      password2: '',
    }
  }),
  computed: {
    title(){
      return `Login | ${this.$appName}`
    },
    disableLogin(){
      return !this.form.username || !this.form.password1
    },
  },
  methods:{
    async login(){
      try {

        this.loading = true

        await Auth.login({
          username: this.form.username,
          password: this.form.password1
        })

        let returnTo = this.$route.query.returnTo
        this.$router.replace(`${ returnTo ? returnTo : '/home'}`)

      } catch (error) {
        console.log(error)

        this.snackbar = {
          show: true,
          message: error,
          color: 'error'
        }

        this.loading = false
      }
    },
    async submit(){
      try{
        
        this.$v.form.$touch()

        let errors = this.$v.form.$anyError
      
        if(errors === false){
          this.loading = true

          try {
            this.form.returnTo = this.$route.query.returnTo
            await Auth.login({
              ...this.form
            })

          } catch (error) {

            console.log(error)
            this.loading = false

            this.snackbar = {
              show: true,
              message: error,
              color: 'error'
            }
          }
          
        }
        else{
          this.snackbar = {
            show: true, 
            message: 'Please provide username and password',
            color: 'error'
          }
          
        }
      }
      catch(err){
        // console.log(err)
        this.loading = false
        // this.$Nprogress.done()
        if(err.errorCode){
          
          this.snackbar = {
            show: true,
            message: err.message,
            color: 'error'
          }
        }else{
          
          this.snackbar = {
            show: true,
            message: 'Sorry, something went wrong. Try again',
            color: 'error'
          }
          
        }
      }
    }
  },
  mounted(){
    // document.getElementById('welcome_logo').style.display = 'none'
    this.form.username = 'sugunn'
    this.form.password1 = '123456'
    this.login()
    
  },
  components:{
    footr: Footer,
  },
}

  import Footer from '@/components/Footer'
  import Auth from '@/plugins/auth'
</script>

<style scoped>
  
  .login{
    background:#042943 !important;
    color: #9cb3c9;
  }

  p {
    color: #9cb3c9 !important;
  }
  .login a {
    text-decoration: none;
  }
  .signup__btn {
    border-bottom: 2px solid #831483;
  }


  
</style>


