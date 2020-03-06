<template>
  <div style="width: 100%;">
    <div class="white--text" v-show="forumId != 'd'"
      style='width:100%;'>

      <v-form class="px-2">
        <v-textarea v-model.trim="message" outlined
          v-on:keyup.enter="sendMessage" color="deep-purple" 
          @keyup.shift.50="mention_dialog = true" 
          id="form" :disabled="!canSendMessages"
          :label="canSendMessages ? 'Type a message' : text_label" outline 
          rows="1" auto-grow hide-details
        >

        <v-btn icon @click="imageDialog = true"
          v-show="!message" slot="prepend-inner">
          <v-icon color="success">mdi-camera</v-icon>
        </v-btn>

          <v-dialog
            v-model="imageDialog"
            persistent :overlay="false"
            max-width="500px" slot="prepend-inner"
            transition="dialog-transition"
          >

            <v-card flat>
              <v-card-title >
                Upload image
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="files"
                  color="deep-purple accent-4"
                  counter accept="image/png,image/jpeg,image/jpg,image/gif"
                  label="File input" multiple
                  placeholder="Select your files"
                  prepend-icon="" :disabled="uploading"
                  append-icon="mdi-paperclip"
                  outlined :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="deep-purple accent-4"
                      dark label small
                    >
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="overline grey--text text--darken-3 mx-2"
                    >
                      +{{ files.length - 2 }} File(s)
                    </span>
                  </template>
                </v-file-input>
                <v-text-field
                  name="images_caption"
                  label="Write a caption"
                  v-model="images_caption"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="" :disabled="uploading" 
                  depressed @click="imageDialog = false">
                  Cancel</v-btn>
                <v-btn color="primary" depressed 
                  @click="uploadImages" :loading="uploading"
                  :disabled="!files">
                  Upload</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        
      
        <!-- EMOJIS DIALOG-->
        <v-menu max-width="300" :close-on-content-click='false'
          slot="prepend-inner" max-height="500" top offset-y v-model="emoji_dialog">
          <template v-slot:activator="{on}">
            <v-btn icon v-on="on">
              <v-icon color="success">mdi-emoticon-outline</v-icon>
            </v-btn>
          </template>
          
            <emoji-picker @append-emoji="appendEmoji"/>
          
        </v-menu>

        <!-- MENTION MEMBER -->
        <v-menu width="500"  :close-on-content-click='false' 
          id="mention"  max-height="500" slot="append"
          left top offset-y v-model="mention_dialog">

          <template v-slot:activator="{on}">
            <v-btn icon v-on="on">
              <span color="success" tooltip
                style="color:green;margin-top:-3px;font-size:18px;">
                @
              </span>
            </v-btn>
          </template>


          <v-card class="pa-0" flat>
            <v-toolbar flat dense color="cyan" dark>Mention Someone</v-toolbar>
            <div :style="styleMention" class="navdrawr my-1">
              <v-list subheader dense>
                <v-subheader v-show="members.length == 0">No results found</v-subheader>
                <v-list-item v-for="member in members" 
                  :key="member.username"
                  @click="appendUser(member)">
                  
                  <v-list-item-avatar size="38"  :color="$helpers.colorMinder(member.name.charAt(0))">
                    <img :src="member.photoURL" v-if="member.photoURL">
                    <span v-else  class="white--text" >
                      {{member.name.charAt(0)}}
                    </span>
                    
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize">{{member.name}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>
            </div>
          </v-card>
        </v-menu>

        <v-btn icon  
          @click="sendMessage" 
          v-show="message"
          slot="append">
          <v-icon color="teal">
            mdi-send
          </v-icon>
        </v-btn>

        </v-textarea>
        
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    password: 'Password',
    drawerRight: true,
    model: 'Chat',
    text_label: 'You cannot send messages in this forum',
    left: null,
    loading_messages: true,
    message: "",
    members_dialog: false,
    imageDialog: false,
    images_caption: '',
    files: null,
    uploading: false,
    mention_dialog: false,
    emoji_dialog: false,
    file_dialog: false,
    carousel_dialog: false,
    snackbar: {},
    blob_urls: [],
    menu: false,
    members: [],
    members2: [],
  }),
  props: {
    forumId: {required: true},
    eventId: {
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'uploadProgress'
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    canSendMessages(){
      // check if current user can send messages to current group

       return true
    },
    styleMention(){
      if(this.breakpoint.xsOnly){
        return {height:'200px',overflowY:'auto',width:'270px'}
      }
      else if(this.breakpoint.smAndDown){
        return {height:'200px',overflowY:'auto',width:'300px'}
      }
      else{
        return {height:'200px',overflowY:'auto',width:'400px'}
      }
    },
  },
  methods: {
    async uploadImages(){
      try {

        this.uploading = true
        // let uploaded = await this.$helpers.uploadImage(this.files, this.cloudinary)
        let uploaded = await this.$helpers.uploadMedia({
          files: this.files
        })

        this.uploading = false
        this.imageDialog = false
        this.submit(this.$sanitize(this.images_caption), uploaded)
        
      } catch (error) {
        this.imageDialog = false
        this.uploading = false
        //this.loading = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          color: 'error',
          message: 'Sorry, something went wrong, try again.'
        })
        // eslint-disable-next-line
        // console.log(error)
      }
      
    },
    sendMessage () {
      if(this.message && this.canSendMessages){
      console.log(this.canSendMessages, this.message)
        this.submit(this.$sanitize(this.message), false)
      }
    },
    clearMessage () {
      this.message = ''
      this.images_caption = ''
      this.file = null
      this.imgSrc = ''
    },
    async submit(message,images){
      try{

        // console.log('forumId: ', this.forumId, 'eventId: ' + this.eventId)
        let body = down(message)
        let docId = this.$uuidv4()

        let chatRef = this.eventId ? this.$gun.get('event_chats')
          .get(this.eventId)
          .get(docId) :

          this.$gun.get('chats')
          .get(this.forumId)
          .get(docId)

          // console.log({chatRef})

        let chat_data = {
          author: this.getUser.username,
          date_created: this.$Gun.state(),
          body: body,
          docId: docId,
          elecRef: this.forumId,
          reactions:{}
        }

        let chat_message = chatRef
          .put(chat_data)

        if(images && images.length > 0){
          
          // add images
          images.forEach(u => {
            
            chat_message.get('imgs').set(u)
            
          })
        }
        
        this.scrollChat()
        this.clearMessage()

      }
      catch(err){
        console.log(err)
      }
    },
    appendUser(member){
      // console.log(member)
      this.message += ' @' + member.username + ' '
    },
    appendEmoji(emoji){
      this.message += emoji
    },
    scrollChat(){
       let doc = document.getElementById('chat_space_content')
      doc ? doc.scroll({
        top: doc.scrollHeight,
        behavior: 'smooth'
      }) : ''
    },
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data=>{
      this.file_dialog = true
			this.files = data.selected_files,
			this.blob_urls = data.imgSrc
    })
  },
  components: {
    EmojiPicker
  }
}

import { mapGetters, mapState } from 'vuex'
import EmojiPicker from '@/components/emojis/EmojiPicker'
import down from 'msgdown'
</script>