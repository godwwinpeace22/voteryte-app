<template>
  <div>
    <v-row row justify-center>
      <v-dialog 
        v-model="bdialog" persistent 
        :scrollable="$vuetify.breakpoint.smAndUp"
        :fullscreen="$vuetify.breakpoint.xsOnly" 
        max-width="500">
        <v-card>
          <v-toolbar dark color="teal" dense flat>
            <v-toolbar-title>Composer</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn 
                icon text
                @click.native="$eventBus.$emit('bdialog')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-textarea 
              placeholder="Type your message" 
              class="mt-5" 
              outlined label="Broadcast message"
              auto-grow
              v-model.trim="message">
            </v-textarea>

            <small>Audience: {{curRoom.title}}</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="success" depressed 
              :loading="loading" 
              :disabled="disabled" 
              @click="createBroadcast">
              Send <v-icon class="ml-2">mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  data(){
    return {
      bdialog: true,
      message: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    audience(){
      return this.curRoom ? this.curRoom.electionId : false
    },
    disabled(){
      return !this.message.trim() || !this.audience
    },
    switchTransition2(){
      return this.$vuetify.breakpoint.xsOnly ? 
      'slide-x-reverse-transition' : 
      'dialog-transition'
    },
    
  },
  methods: {
    createBroadcast(){
      this.loading = true

      // create new broadcast message
      let broadcastId = this.$uuidv4()
      let broadcastRef = this.$gun.get('broadcasts')
        .get(broadcastId)

      let userRef = this.$gun.get('users').get(this.getUser.username)
      let electionRef = this.$gun.get('elections')
        .get(this.audience)

      let data = {
        
        body: this.$sanitize(this.message),
        date_created: Date.now(),
        from: this.getUser.username,
        docId: broadcastId,
        elecRef: this.audience,
        status:'unread'
      }

      // save in broadcaster's outbox
      let broadcast = userRef.get('broadcasts')
        .get('outbox')
        .get(broadcastId)
        .put(data)
      broadcast.get('author')
        .put(userRef)

      
      electionRef.get('broadcasts')
        .set(broadcast)
      
      // electionRef.get('voters')
      // .map().once(voter => {

      //   console.log({voter})
      //   if(voter.username != this.getUser.username){

      //     this.$gun.get(voter.username)
      //       .get('broadcasts')
      //       .get('inbox')
      //       .get(broadcastId)
      //       .put(broadcast)
      //   }

      // })


      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Broadcast Sent',
        // color: 'success'
      })
      this.loading = false
      this.$eventBus.$emit('bdialog')
      
    }
  }
  
}

import { mapGetters, mapState } from 'vuex'
// import {firebase, db, database} from '@/plugins/firebase'
</script>
