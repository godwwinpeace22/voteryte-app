<template>
  <div>

    <vue-headful :title="title"/>
    <navigation>
      <span slot="action">
        <v-btn @click="$router.push('/messages/sent')" text class="px-1">
          <v-icon>mdi-chevron-left</v-icon>
          Back</v-btn>
      </span>
      <span slot="title"></span>
    </navigation>
    
    <v-card flat tile style="overflow: auto;" :height="$vuetify.breakpoint.smAndUp ? '450' : '100vh'">
      <v-subheader v-if="msgs.length == 0">Message not found</v-subheader>

      <template v-else>
        <v-list two-line dense>
          <v-list-item @click="$router.push('/users/' + $route.params.from)">
            <v-list-item-avatar :color="msgs[0].author.photoURL ? '' : $helpers.colorMinder(msgs[0].author.name.charAt(0))">
              <img :src="msgs[0].author.photoURL" v-if="msgs[0].author.photoURL">
              <span v-else class="white--text">{{msgs[0].author.name.charAt(0)}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize"> {{msgs[0].author.name}}</v-list-item-title>
              <v-list-item-subtitle >
                @{{msgs[0].author.username}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-text>
          
          <template v-if="mode == 'sent'">
            <v-card class="round my-3 grey lighten-4" flat 
              v-for="(msg,i) of msgs" :key="i + 'rd'">
              <v-card-text>
                {{msg.body}}
                <div class="font-weight-bold"><i>{{$helpers.parseDate(msg.date_created)}}</i></div>
              </v-card-text>
            </v-card>
          </template>

          <template v-if="mode == 'inbox'">

            <div v-for="(msg, i) in msgs" :key="i + 'selectd'">
              <div v-if="divide(msg.date_created, msgs[i-1])" class="time_divider">
                {{divide(msg.date_created, msgs[i-1])}}
              </div>
              <v-card class="round my-3 grey lighten-4" flat>
                <v-card-text>
                  {{msg.body}}
                  <div class="font-weight-light">{{$helpers.parseDate(msg.date_created)}}</div>
                </v-card-text>
              </v-card>
            </div>
          </template>

        </v-card-text>
      </template>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    msgs: [],
  }),
  props: ['from'],
  computed: {
    title(){
      return `Messages | ${this.$AppName}`
    },
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([
      'isSuperuser',
      'curRoom',
    ]),
    mode(){
      return this.from == this.getUser.username ? 'sent' : 'inbox'
    }
  },
  methods: {
    getMsgs(){
      this.$gun.get('users')
        .get(this.getUser.username)
        .get('enrolled')
        .map()
        .get('broadcasts')
        .map(item => item ? item.from == this.from ? item : undefined : undefined)
        .on(async (broadcast) => {

          let b = Object.assign({}, broadcast)
          b.author = await this.$gun.get(broadcast.author['#']).then()

          this.msgs.find(m => m.docId == b.docId) ? '' : 
          this.msgs.push(b)

          console.log(this.msgs)
        })
    },
    divide(timestamp,prev){
      timestamp = typeof timestamp == 'object' ? timestamp.toMillis() : timestamp
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.date_created){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.date_created)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          // let today = new Date()
          if((new Date()).toLocaleString('en-Us',options) == that_day){
            return 'Today'
          }
          // showing 'yesterday'
          else if(Date.now() - timestamp <= 2* 24 * 60 * 60 * 1000){
            return 'Yesterday'
          }
          // showing other days
          else{
            return that_day2
          }
          
          
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
  },
  mounted(){
    
    this.getMsgs()
  }
}

import { mapState, mapGetters } from "vuex"
</script>

<style>

</style>