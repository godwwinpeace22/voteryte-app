<template>
<v-app class="complete">
    <vue-headful
      :title="`Complate Setup  | ${$appName}`"
    />
    <v-content>
      <v-container fluid fill-height class="cc login">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">

            <h1 class="text-center white--text mb-3" >
              <a href="/" style="text-decoration:none;color:#fff">
                {{$appName}}
              </a>
            </h1>

            <v-subheader class="white--text text-center d-block">Log in to your account</v-subheader>

            <v-card dark flat tile style="background:inherit">

              <v-card-text>
                <span>
                  To complete the setup, we will need your username. Go to Blockstack to set this up.
                </span>
                <div> Add a username to your Blockstack account to continue using Voteryte.</div>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    <footr></footr>
    </v-content>
</v-app>
</template>
<script>
export default {
  components: {
    'footr': Footer
  }
}

import Footer from '@/components/Footer'
</script>
<style scoped>
  .complete{
    background:#042943;
  }
</style>

