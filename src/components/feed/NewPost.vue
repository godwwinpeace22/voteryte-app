<template>
  <div>
    <v-card class="pa-2 new-post" flat>
      <div class="new-post__avatar">
        <v-avatar
          size="40"
          tile
          color="info"
        >
          <v-img 
            :src="getUser.photoURL || ''" 
            v-if="getUser.photoURL"
            :alt="getUser.name">
          </v-img>

          <span v-else class="white--text">
            {{getUser.name.charAt(0)}}
          </span>

        </v-avatar>

      </div>
      <div class="new-post__content">

        <v-card-text class="pa-0">
          
          <v-textarea
            auto-grow
            :placeholder="placeholder"
            rows="2"
            solo flat
            dense
            @focus="onFocus"
            :readonly="loading"
            v-model.trim="form.message"
            hide-details
          ></v-textarea>

          <div 
            
            class="selected-images py-2">
            <v-badge
              icon
              bordered
              overlap
              color="grey"
              class="linkify mr-3"
              v-for="(image,i) in blob_urls"
              :key="i + 'img'"
              @click.native="loading ? '' : removeImage(image, i)"
            >
              <template v-slot:badge>
                <v-icon >mdi-close</v-icon>
              </template>

              <v-avatar size="40">
                <v-img :src="image"></v-img>
              </v-avatar>
            </v-badge>
          </div>
        </v-card-text>
        <v-divider v-show="show_actions"></v-divider>

        <v-expand-x-transition>
          <v-card-actions v-show="type == 'comment' || show_actions">
            <v-btn
              :disabled="loading"
              icon class="mr-1"
              @click.native="form.media_type = 'image'; $helpers.trigFileSelector()">
              <v-icon color="grey">mdi-image</v-icon>
            </v-btn>

            <v-btn
              v-if="!no_video"
              :disabled="loading"
              icon class="mr-1"
              @click.native="form.media_type = 'video'; $helpers.trigFileSelector()">
              <v-icon color="grey">mdi-video</v-icon>
            </v-btn>

              <v-menu max-width="300"
                max-height="500" top offset-y 
                :close-on-content-click="false"
                v-model="emoji_dialog"
              >
                <template v-slot:activator="{on}">
                  <v-btn 
                    color="grey" icon 
                    class="" v-on="on"
                    :disabled="loading">
                    <v-icon>mdi-emoticon-outline</v-icon>
                  </v-btn>
                </template>
                <emoji-picker @append-emoji="react"/>
                
              </v-menu>

            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{on}">
                <v-btn small v-on="on" text class="text-normal">formatting</v-btn>
              </template>
              <v-card flat>
                <!-- <div class="v-card__title">Formatting options</div> -->
                <v-card-text>
                  <p>*bold*  <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> <strong>bold</strong></p>
                  <p>/italic/ <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> <em>italice</em></p>
                  <p> _underline_  <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> <u>underline</u> </p>
                  <p>~strike~ <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> <del>strike</del></p>
                  <p>`code` <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> <code>code</code></p>
                  <p>A^sup^ <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> A<sup>sup</sup></p>
                  <p>A^sub^ <v-icon class="mx-3">mdi-arrow-right-bold</v-icon> A<sub>sub</sub></p>
                  
                </v-card-text>
              </v-card>
              
            </v-menu>

            <v-btn 
              color="info" 
              icon 
              class="mr-2"
              :disabled="!form.message"
              @click.native="create"
              :loading="loading">

              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-expand-x-transition>
      </div>
      
    </v-card>
    
    </div>
</template>
<script>
export default {
  data:()=>({
    video_file: null,
    emoji_dialog: false,
    show_actions: false,
    selected_files: [],
    blob_urls: [],
    form: {
      message: '',
      post_type: 'text',
      media_type: 'image',
    },
    toolbarItems: [
      {icon: 'mdi-pencil', type: 'text'},
      {icon: 'mdi-image', type: 'image'},
      {icon: 'mdi-video', type: 'video'}
    ],
    loading: false,
  }),
  props: {
    placeholder: {
      type: String,
      default: "What's on your mind?"
    },
    no_video: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'post'
    },
    post_parent: {
      type: Object,
      default: null
    }
  },
  computed: {
    audience(){
      return this.curRoom.electionId
    },
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ])
  },
  methods:{
    selectVideo(e){
      let file = e.target.files[0]
      
      if(file && file.size > 15500000){
        alert('Video size should be less than 15mb')
        // e.target.files = ''
        this.video_file = null
      }
      else {
        
        file ? this.video_file = file : ''

      }
    },
    onFocus(){
      this.show_actions = true
    },
    create(){

      this.loading = true

      let options = {
        files: this.form.media_type == 'video' ? [this.selected_files[0]] : this.selected_files,
      }
      if(this.curRoom){

        if(this.selected_files.length > 0){
  
          this.$helpers.uploadMedia(options).then(async uploaded => {
            // console.log(await uploaded)
            this.createPost(await uploaded)
          })
        }
        else {
  
          this.createPost()
        }
      }
      
    },
    removeImage(image, index){
      
      this.selected_files.splice(index, 1)
      this.blob_urls.splice(index, 1)

      // console.log(this.selected_files, this.blob_urls)
    },
    async createPost(uploaded){
      
      this.loading = true
        let d = new Date()

        let did = d.toISOString()
        let audience = this.type == 'comment' ? this.post_parent.erf : this.audience

        let user = this.$gun.get('users').get(this.getUser.username)
        let postRef = this.$gun
          .get('posts')
          .get(did)
  
        let body = this.$sanitize(this.form.message)
        
        let post_data = {
          did: did, // docId
          b: body,
          a: this.getUser.username, // author
          erf: audience, // election ref
          tstamp: this.$Gun.state(),
          lu: this.$Gun.state(), // last updated
          t: this.type, // type can be post or comment
          pp: this.type == 'comment' ? this.post_parent.did : false, // post_parent
          ppa: this.type == 'comment' ? this.post_parent.a.username : false, // post_parent_author
          cc: 0, // comments count
          lc: 0, // likes count
        }
        
        postRef
          .put(post_data)

        // increase comments count for post_parent if it exists
        if(this.type == 'comment'){
          
          let new_count = (this.post_parent.cc || 0) + 1
          this.$gun.get(this.post_parent['_']['#'])
          .get('cc')
          .put(new_count)
        }
  
        if(uploaded && uploaded.length > 0){
          console.log({uploaded})
          // add images and videos
          uploaded.forEach(u => {
            if(this.form.media_type == 'image'){
              // console.log('setting- ', u)
              postRef.get('imgs').set(u)
            }
            else {
              postRef.get('videoSrc').put(u)
            }
          })
    
          if(this.form.post_type == 'video'){
            postRef.get('videoSrc').put(uploaded[0])
          }
        }
        
        // save for user
        user.get('posts').set(postRef)
        this.loading = false
        this.form.message = ''
        this.selected_files = []
        this.blob_urls = []

    },
    react(e){
      this.form.message += e
      // console.log(e, this.form.message)
    }
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data => {
      
      this.blob_urls = data.imgSrc

      // append the file list to an array
      Array.prototype.push.apply( this.selected_files, data.selected_files )

    })
  },
  components: {
    EmojiPicker,
  }
}
import {mapGetters, mapState} from 'vuex'
import EmojiPicker from '@/components/emojis/EmojiPicker'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .new-post {
    overflow: auto;
  }
  .new-post__avatar {
    float: left;
    width: 9%;
  }
  .new-post__avatar .v-avatar {
    @include borderRadius(3px)
  }
  .new-post__content {
    float: left;
    width: 90%
  }
  @media (max-width: 420px){
    .new-post__avatar {
      width: 12%;
    }
    .new-post__content {
      width: 80%;
    }
  }
  .linkify {
    cursor: pointer;
  }
</style>