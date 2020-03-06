<template>
  <div>
    <vue-headful title="Not Found"/>
    <navigation></navigation>
    <v-container fluid fill-height id="notfound" style="min-height:84.6vh;">

      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <h1 class="text-center mb-3" style="color:#333;" >Page Not Found</h1>
          <v-btn color="success" class="d-block mx-auto" style="line-height:2.5" depressed
            @click="$router.replace('/home')">
            Take me out of here
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <footr></footr>
  </div>
</template>
<script>
export default {
  components:{
    Navigation,
    footr:Footer
  },
  mounted(){
    // document.getElementById('welcome_logo').style.display = 'none'
  }
}
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
</script>

<style>
  #notfound{
    /*background:#042943;*/
    min-height:84vh;
    background:url('../assets/404.png');
    background-size: cover;
    background-position: center;
    background-repeat:no-repeat;
  }
</style>