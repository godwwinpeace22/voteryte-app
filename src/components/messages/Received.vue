<template>
  <div>
    <navigation>
      <span slot="title">Inbox</span>
    </navigation>
    <v-divider></v-divider>

    <v-toolbar flat dense>
      <v-toolbar-items>
        <v-btn 
          color="info" 
          depressed class="mr-2" 
          to="/messages/sent">
          <v-icon class="mr-1">mdi-keyboard-backspace</v-icon>
          Outbox</v-btn>
        <v-btn color="info" text @click="new_message = true">
          <v-icon class="mr-1">mdi-plus</v-icon>
          Compose</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    
    <v-card style="min-height: 500px;" flat>
      
      <v-text-field 
        class="px-2" solo 
        flat style="border-bottom: 1px solid #eee"
        name="name" color="primary"
        label="Search"
        hide-details
      ></v-text-field>

      <v-list two-line dense v-if="inbox.length > 0">
        
        <template v-for="(item,index) in inbox">
          <v-list-item 
            ripple 
            @click="selectItem(item)" :key="index + 'sent'">

            <v-list-item-avatar 
              :color="item[0].author.photoURL ? '' : $helpers.colorMinder(item[0].author.name.charAt(0))">
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

    <new-broadcast v-if="new_message"/>
  </div>
</template>

<script>
export default {
  data: () => ({
    new_message: false
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([
      'isSuperuser',
      'curRoom',
      'broadcasts'
    ]),
    inbox(){
      
      let inbox = this.broadcasts

      let u = 
      // uniqBy(this.broadcasts, 'key')
        this.broadcasts
        .filter(msg => 
          msg.author && msg.author.username != this.getUser.username
        )
        .map(m => {
            return {...m, username: m.author.username}
          })
      let c = groupBy(u, 'username')
      console.log(inbox, c)

      return Object.values(c)
    },
  },
  methods: {
    selectItem(item){
      console.log(item)
    },
  },
  mounted(){
    this.$eventBus.$on('bdialog', () =>{
      this.new_message = false
    })
  },
  components: {
    NewBroadcast
  }
}

import { mapState, mapGetters } from "vuex"
import NewBroadcast from '@/components/messages/NewBroadcast'
import { groupBy } from "lodash";
</script>

<style>

</style>