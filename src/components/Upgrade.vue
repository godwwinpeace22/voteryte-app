<template>
  <div>
    <vue-headful :title="title"/>
    <navigation/>
    
    <v-card class="" tile flat imgs="require('@/assets/upgrade-bgd-2.png')">
      <v-toolbar color="white" flat>
        <v-card-title primary-title class="pl-1 font-weight-bold title">
          Upgrade To Premium
        </v-card-title>

        <v-spacer></v-spacer>
        <v-btn light icon :disabled="loading" @click="$router.replace('/home')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-subheader class="black--text">
        Voteryte premium gives you all the tools you need to rise above the competition
      </v-subheader>
      
        <v-card-text class="px-0">
          <div style="overflow: auto" class="mb-2">
            <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
              <v-icon color="success">mdi-check</v-icon>
            </div>
            <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
              Create compelling manifestos 
            </div>
          </div>
          <!-- <div style="overflow: auto" class="mb-2">
            <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
              <v-icon color="success">mdi-check</v-icon>
            </div>
            <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
              Create events such as meetups, webinar, interactive sessions, e.t.c.
            </div>
          </div> -->
          <div style="overflow: auto" class="mb-2">
            <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
              <v-icon color="success">mdi-check</v-icon>
            </div>
            <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
              Engage targeted audience through campaigns and posts
            </div>
          </div>
          <!-- <div style="overflow: auto" class="mb-2">
            <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
              <v-icon color="success">mdi-check</v-icon>
            </div>
            <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
              Overview of contestant Insights and who's viewed your profile
            </div>
          </div> -->
          <div style="overflow: auto" class="mb-1">
            <div style="width: 30px; height: 30px;float: left;" class="ml-3 d-inline-block">
              <v-icon color="success">mdi-check</v-icon>
            </div>
            <div class="d-inline-block" style="width: calc(100% - 50px);float: right;">
              Send unlimited broadcast messages to election participants
            </div>
          </div>
        </v-card-text>
        <v-subheader class="teal--text">For only ₦ {{$premiumPrice.toLocaleString()}} per month</v-subheader>
        <v-row>
          <v-col cols="10" sm="4" md="3">
            <v-select
              class="ml-4"
              outlined
              v-model="plan.intervals"
              :items="payment_intervals"
              return-object
              :hint="`You pay ₦ ${plan.intervals.price.toLocaleString()}`"
              label="Pay for"
              persistent-hint
            ></v-select>

          </v-col>
        </v-row>
          

        <v-card-actions>
          <paystack
            v-if="!isSuperUser"
            :amount="plan.intervals.price * 100"
            :email="getUser.email"
            :metadata="metadata"
            :paystackkey="$paystackKey"
            :reference="$helpers.getRandomString(11)"
            :callback="verifyTxn"
            :close="onClose"
            :embed="false"
          >
            <v-btn color="teal" dark 
              class="ml-2 text-capitalize" 
              depressed :loading="loading">
              Upgrade Now
            </v-btn>
          </paystack>
          <v-btn color="success" text v-else>You are a premium user!</v-btn>
        </v-card-actions>
        
        <small class="ml-3">No automatic renewals.</small> <br>
        <v-btn color="primary" 
          style="text-transform: initial;margin-bottom: 15px;" 
          small class="" target="blank" href="https://voteryte.com/contestants" 
          text>
          <span style="text-decoration: underline;">Learn more  </span>
          <v-icon small class="pl-1">mdi-open-in-new</v-icon>
        </v-btn>
      
    </v-card>

    <v-dialog v-model="progress_dialog"
      persistent width="300"  >
      <v-card color="primary" dark class="justify-center">
        <v-card-text>
          <v-row row wrap justify-space-around align-center>
            <v-col>
              {{progress_text}}
            </v-col>
            <v-col>
              <v-progress-circular
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-circular>
            </v-col>
          </v-row>
          
          
        </v-card-text>
      </v-card>
      
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    plan: {
      plan_name: 'testplan',
      plan_code: 'PLN_npflhujgmzdqppi',
      amount: 1500,
      intervals: {text: '3 months - 20% off', value: '3-monthly', price: 3600},
    },
    progress_text: 'initializing...',
    progress_dialog: false,
    
  }),
  computed: {
    
    title(){
      return `Upgrade | ${this.$appName}`
    },
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
    ]),
    payment_intervals() {
      return [
        {text: '1 month', value: 'monthly', price: this.plan.amount},
        {text: '3 months - 20% off', value: '3-monthly', price: this.plan.amount * 3 - (0.2*this.plan.amount*3)},
        {text: '1 year - 30% off', value: 'yearly', price: this.plan.amount * 12 - (0.4*this.plan.amount*12)}
      ]
    },
    metadata: function(){
      return {
        plan_type: this.plan.plan_name,
        orderid: this.$helpers.getRandomString(),
        custom_fields: [
          {
            display_name: "Plan_type",
            variable_name: "plan",
            value: this.plan.plan_name
          },
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: 1500
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: this.getUser.name
          },
          {
            display_name: "CustomerId",
            variable_name: "customer_id",
            value: this.getUser.username
          }
        ]
      }
    },
  },
  methods: {
    async upgrade(resp){

      this.progress_text = 'Upgrading...'

      let plan_details = JSON.stringify(resp.payload)

      let epriv = this.$gUser['_'].sea.epriv
      let enc = await this.$SEA.encrypt(plan_details, epriv)

      this.$gUser.get('subs').put(enc)
      
      this.progress_dialog = false
      this.loading = false

      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Account upgraded successfully',
        color: 'success'
      })

    },
    async verifyTxn(res){

      this.loading = true
      this.progress_text = 'verifying...'
      this.progress_dialog = true
      console.log(res)

      try {
        
        let resp = await this.$helpers.verifyTxn({
          amount: this.plan.intervals.price,
          ref: res.reference
        })

        let thirty_days = 30 * 24 * 60 * 60 * 1000
        let expires_in = this.plan.intervals == 'monthly' ? Date.now() + thirty_days :
          this.plan.intervals == '3-monthly' ? Date.now() + (thirty_days*3) : 
          Date.now() + (thirty_days*12)

        resp.payload.reference = res.reference
        resp.payload.premium_expires_in = expires_in

        console.log(resp)

        this.upgrade(resp)

      } catch (error) {

        console.log(error)
        this.progress_dialog = false
        this.loading = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Transaction not completed',
          color: 'error'
        })
      }

      // setTimeout(() => {
      //   this.upgrade()
      // }, 2000);
    },
    onClose(){
      // console.log(res)
    }
  },
  async mounted(){
    // console.log()
    // let data = await this.$gUser.get('upgrade').then()
    // let epriv = this.$gUser['_'].sea.epriv
    // let dec = await this.$SEA.decrypt(data, epriv)
    // console.log(dec)

  },
  components: {
    paystack
  }
}

import { mapGetters, mapState } from 'vuex'
import paystack from 'vue-paystack'
// import axios from 'axios'
// import api2 from '@/services/api2.js'
</script>

<style>

</style>