<template>
  <v-card flat tile :style="styleObj" height="500" style="overflow-y: hidden;">

    <v-app-bar color="cyan" dark dense flat>
      
      <v-btn text icon
        v-if="read && $vuetify.breakpoint.smAndDown"
        @click="read = false">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-toolbar-title class="hidden-sm-and-down">Messages</v-toolbar-title>

      <v-btn 
        :color="mode == 'inbox' ? 'primary' : 'cyan'" 
        v-if="!read"
        depressed
        class="hidden-md-and-up mr-2" 
        @click="mode = 'inbox'">
        Inbox
      </v-btn>

      <v-btn 
        :color="mode == 'sent' ? 'primary' : 'cyan'"
        v-if="!read"
        depressed
        class="hidden-md-and-up" 
        @click="mode = 'sent'">
        Sent
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn icon @click="$eventBus.$emit('ToggleInboxDialog', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-container class="pt-0">
      <v-row >
        <v-col sm="2" class="grey lighten-4" v-if="$vuetify.breakpoint.mdAndUp">
          
          <v-list dense nav class="ml-1 pt-0 grey lighten-4">
            <v-list-item @click="$eventBus.$emit('Toggle_New_Broadcast', true)">
              <v-list-item-action >
                <v-icon color="ml-3 success lighten-2">mdi-plus</v-icon>
              </v-list-item-action>
              <v-list-item-title>New</v-list-item-title>
            </v-list-item>

            <v-list-item v-for="(item, i) in items" :key="'item' + i" @click="switchMode(item.title)">
              <v-list-item-action>
                <v-icon :color="mode == item.title ? 'orange' : ''">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item>
              <v-list-item-title>{{mode}}</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-col>
        
        <!-- LIST -->
        <v-col cols="12" sm="12" md="4" 
          style="border-right: 1px solid #eee;" 
          :class="{'hidden-sm-and-down': read}"
        >
          <v-text-field 
            class="px-2" solo 
            flat style="border-bottom: 1px solid #eee"
            name="name" color="primary"
            label="Search"
            hide-details
          ></v-text-field>
          <v-card flat tile :height="$vuetify.breakpoint.smAndUp ? '400' : '400'">
            
            <v-list two-line dense >
              
              <template v-for="(item,index) in msgs">
                <v-list-item :class="{'selected': selected == item[0]}" ripple @click="selectItem(item)" :key="index + 'sent'">
                  <v-list-item-avatar :color="item[0].author.photoURL ? '' : $helpers.colorMinder(item[0].author.name.charAt(0))">
                    <img :src="item[0].author.photoURL" v-if="item[0].author.photoURL">
                    <span v-else class="white--text">{{item[0].author.name.charAt(0)}}</span>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize">{{item[0].author.name}}</v-list-item-title>
                  
                    <v-list-item-subtitle>
                      <span >{{item[0].body}}</span>
                    </v-list-item-subtitle>

                  </v-list-item-content>

                  <v-list-item-action>
                   
                    <v-avatar
                      size="24" class="white--text"
                      color="primary"
                    >
                      {{item.length}}
                    </v-avatar>
                  </v-list-item-action>

                </v-list-item>
                <v-divider :key="index + 'dv'"></v-divider>
              </template>

            </v-list>
          </v-card>
        </v-col>

        <!-- MAIN -->
        <v-col sm="12" md="6" :class="{'hidden-sm-and-down': !read}">
          <v-card flat tile style="overflow: auto;" :height="$vuetify.breakpoint.smAndUp ? '450' : '100vh'">
            <v-subheader v-if="!selected">Select a message</v-subheader>

            <template v-if="selected">
              <v-list two-line dense>
                <v-list-item >
                  <v-list-item-avatar :color="selected[0].author.photoURL ? '' : $helpers.colorMinder(selected[0].author.name.charAt(0))">
                    <img :src="selected[0].author.photoURL" v-if="selected[0].author.photoURL">
                    <span v-else class="white--text">{{selected[0].author.name.charAt(0)}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize"> {{selected[0].author.name}}</v-list-item-title>
                    <v-list-item-subtitle >
                      {{selected[0].author.title}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-card-text>
                
                <template v-if="mode == 'sent'">
                  <v-card class="round my-3 grey lighten-4" flat 
                    v-for="(msg,i) of selected" :key="i + 'rd'">
                    <v-card-text>
                      {{msg.body}}
                      <div class="font-weight-light">{{$helpers.parseDate(msg.date_created)}}</div>
                    </v-card-text>
                  </v-card>
                </template>

                <template v-if="mode == 'inbox'">

                  <div v-for="(msg, i) in selected" :key="i + 'selectd'">
                    <div v-if="divide(msg.date_created, selected[i-1])" class="time_divider">
                      {{divide(msg.date_created, selected[i-1])}}
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
          
        </v-col>

      </v-row>
    </v-container>

  </v-card>
</template>
<script>
export default {
  data:()=>({
    drawer: null,
    read: false,
    selected: '',
    mode: 'inbox',
    outbox: [],
  }),
  computed:{
    // eslint-disable-next-line vue/return-in-computed-property
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh'
        }
      }
    },
    items(){
      return [
        {icon: 'mdi-inbox', title: 'inbox', color: 'purple'},
        {icon: 'mdi-send', title: 'sent', color: 'success'},
        // {icon: 'mdi-star', title: 'Stared', color: 'purple'},
      ]
    },
    msgs(){
      return this.mode == 'inbox' ?
      this.inbox : this.sent
    },
    inbox(){
      
      let inbox = this.broadcasts

      let u = 
      // uniqBy(this.broadcasts, 'key')
        this.broadcasts
        .filter(msg => 
          msg.author.username != this.getUser.username
        )
        .map(m => {
            return {...m, username: m.author.username}
          })
      let c = groupBy(u, 'username')
      console.log(inbox, c)

      return Object.values(c)
    },
    sent(){
      let u = uniqBy(this.outbox, 'key')
      .map(m => {
          return {...m, username: m.author.username}
        })
        
      let c = groupBy(u, 'username')

      console.log({c})

      return Object.values(c)
    },
    ...mapState([
      'curRoom',
      'isSuperUser',
      'broadcasts'
    ]),
    ...mapGetters([
      'getUser',
    ])
  },
  methods:{
    selectItem(items){
      this.selected = items

      if(this.$vuetify.breakpoint.smAndDown){
        this.read = true
      }
      if(this.mode == 'inbox'){
        for(let item of items){
          // console.log({item})

          // this.$gun.get('users').get(this.getUser.username)
          //   .get('read_broadcasts')
          //   .set(item.docId)
        }
      }
    },
    switchMode(mode){
      this.mode = mode
      this.selected = ''
      // console.log(mode,this.mode)
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
          let today = new Date()
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
    getOutbox(){
      // get msgs sent by user
      this.$gun.get('users').get(this.getUser.username)
        .get('broadcasts')
        .get('outbox')
        .map().on((d,k) => {
          console.log('outbox ==> ', {d})
          let o = Object.assign({}, d)
          o.author = this.getUser
          o.key = k
          this.outbox.push(o)
        })
    },
  },
  components:{
    
  },
  mounted(){

    this.getOutbox()

  }
}
//import LoadingBar from '@/spinners/LoadingBar'
import {mapState, mapGetters} from 'vuex'
import { uniqBy, groupBy } from "lodash";
</script>
<style scoped>
  .selected {
    border-left: 3px solid orange;
  }
  .broadcast_msg{
    background: aliceblue;
    padding: 5px;
  }
</style>
