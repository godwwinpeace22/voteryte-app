<template>
  <div>
    <vue-headful :title="_title"/>
    <navigation v-if="manifestoId != 'new'">
      <span slot="title">{{_title}}</span>
    </navigation>

    <transition name="fade" appear>
      <!-- <v-overlay v-if="!showUi"
        absolute opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->

      <v-container class="white">
        <v-card flat min-height="500">
          <v-fab-transition>
            <v-btn
              v-if="isOwner && $route.params.manifestoId != 'new'"
              :key="activeFab.icon"
              :color="activeFab.color"
              fab large dark
              @click.native="activeFab.action"
              absolute
              right :loading="loading"
            >
              <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
          </v-fab-transition>

            <v-btn
              v-if="isOwner && $route.params.manifestoId != 'new'"
              color="error"
              fab dark
              @click.native="delete_dialog = true"
              absolute bottom
              right :loading="loading"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

          <v-row v-if="$route.params.manifestoId == 'new' || not_found">
            <v-card flat>
              <v-card-text class="text-center">
                <h3>Manifesto not found</h3>
              </v-card-text>
            </v-card>
          </v-row>

          <v-row v-else>
            <v-col cols="12">
              <v-card flat class="pb-3">
                <div class="display-1 text-cent" 
                  :contenteditable="!readonly" 
                  v-text="title" ref="title">
                </div>
                
                <v-list v-if="manifestoId != 'new' && manifesto.author">
                  <v-list-item class="pl-0">
                    <v-list-item-avatar color="grey lighten-3">
                      <img :src="`${manifesto.author.photoURL}`" 
                        v-if="manifesto.author.photoURL" alt="author_img"/>
                      <span class="text-capitalize" v-else>
                        {{manifesto.author.name.charAt(0)}}
                      </span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title 
                        @click="$router.push('/users/' + manifesto.author.username)"
                        class="text-capitalize linkify">
                        {{manifesto.author ? manifesto.author.name : ''}}
                      </v-list-item-title>
                      <v-list-item-subtitle >
                        <span class="mr-2">{{formatDate(manifesto.date_created)}}</span>
                        <!-- <span class="mr-1">·</span> -->
                        <!-- <span class="mr-2">8 min read</span> -->
                        <!-- <span class="mr-1">·</span>
                        <v-icon class="mr-1" small>mdi-heart</v-icon>
                        <small class="subheading mr-2">256</small>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1" small>mdi-share</v-icon>
                        <small class="subheading">45</small> -->
                      </v-list-item-subtitle>

                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <v-card flat>
                <div style="min-height: 300px;">
                  <div class="editable" ref="editable"></div>
                  
                  <!-- <v-divider></v-divider> -->
                  <!-- <div v-html="manifesto_body"></div> -->

                </div>

                <!-- <v-card-actions v-if="manifestoId != 'new'">

                  <v-btn color="info" text>
                    <v-icon color="red">mdi-heart</v-icon>
                    Like
                  </v-btn>
                  <v-btn color="info" text>
                    <v-icon>mdi-share</v-icon>
                    Share
                  </v-btn>

                  <v-spacer></v-spacer>

                  <v-icon class="mr-1">mdi-heart</v-icon>
                  <span class="subheading mr-2">256</span>
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1">mdi-share</v-icon>
                  <span class="subheading">45</span>

                </v-card-actions> -->
              </v-card>
            </v-col>
          </v-row>
          
        </v-card>

        <v-dialog
          v-model="delete_dialog"
          :overlay="false"
          max-width="300px"
          transition="dialog-transition"
        >
          <v-card>
            <div class="v-card__title">Delete manifesto</div>
            <v-card-text>
              Are you sure ?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialog = false" text>Cancel</v-btn>
              <v-btn color="error" depressed @click="deleteManifesto">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>

    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    readonly: true,
    manifesto: {},
    manifesto_body: '',
    title: 'Click to edit title',
    loading: false,
    created: false,
    editor: '',
    delete_dialog: false,
    not_found: false,
  }),
  props: ['electionId', 'manifestoId', 'currElection'],
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    _title(){
      return `${this.manifestoId == 'new' && this.$route.params.manifestoId != 'new' ? 'Create Manifesto' : this.manifesto.title || 'Manifesto'} | ${this.$appName}`
    },
    // manifestoId(){
    //   return this.$route.params.manifestoId
    // },
    // electionId(){
    //   return this.$route.params.electionId
    // },
    activeFab () {
      switch (this.readonly) {
        case false: return { color: 'primary', icon: 'mdi-content-save', action: this.save }
        default: return { color: 'success', icon: 'mdi-square-edit-outline', action: this.edit }
      }
    },
    isOwner(){
      if(this.manifestoId == 'new'){
        return true
      }
      else if(this.manifesto.author){
        return this.manifesto.author.username == this.getUser.username
      }
      else {return false}
    }
  },
  components: {
    
  },
  methods: {
    initialize(){
      
      if(this.manifestoId == 'new'){
        this.readonly = false
        // this.edit()
        this.showUi = true;
        this.initializeEditor()
      }
      else {
        this.readonly = true
        this.getManifesto()
        this.showUi = true
        // console.log(this.manifesto)
      }
      // console.log(this.manifestoId)

    },
    getManifesto(){
      console.log(this.manifestoId)
      this.$gun.get('manifestos').get(this.manifestoId)
      .on(async (d,k) => {

        console.log(d,k)

        if(d){

          let username = d.author
  
          let author = await this.$gun.get('users').get(username).then()
          this.manifesto = {
            ...d,
            author,
            manifestoId: k,
          }
  
          this.manifesto_body = d.body
          this.title = d.title
          this.$refs['editable'].innerHTML = d.body
        }
        else {
          this.not_found = true
        }
      })
    },
    deleteManifesto(){

      this.loading = true

      let userRef = this.$gun.get('users')
        .get(this.getUser.username)

      let electionRef = this.$gun.get('elections')
        .get(this.manifesto.electionRef)

      let manifesto = this.$gun.get('manifestos')
        .get(this.manifestoId)
        .put(null)

      userRef.get('manifestos')
        .get(this.manifesto.electionRef) 
        .put(null)
      
      electionRef
        .get('manifestos')
        .unset(manifesto)
      
      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Manifesto deleted',
        color: 'success'
      })

      this.$router.replace('/home')
    },
    initializeEditor(){

      this.editor = new MediumEditor('.editable', {
        delay: 1000,
        targetBlank: true,
        autoLink: true,
        toolbar: {
            buttons: ['bold', 'strikethrough', 'h1', 'h2','h3', 'italic','orderedlist','unorderedlist', 'quote','underline','anchor'],
            diffLeft: 25,
            diffTop: 10,
        },
        anchor: {
          // placeholderText: 'Type a link',
          // customClassOption: 'btn',
          // customClassOptionText: 'Create Button',
          linkValidation: true
        },
        paste: {
          cleanPastedHTML: true,
          cleanAttrs: ['style', 'dir'],
          cleanTags: ['label', 'meta'],
          unwrapTags: ['sub', 'sup']
        },
        // anchorPreview: {
        //   hideDelay: 300
        // },
        placeholder: {
          text: 'Compose an epic'
        }
      })

      let _this = this
      // console.log(this.editor)
      this.editor.subscribe('editableInput', function (event, editable) {
        // console.log(editable)
        _this.manifesto_body = editable.innerHTML
      })

    },
    async save(){

      // check if user has manifesto for this election already
      let has_already = this.manifestoId == 'new' ? await this.hasManifesto() : false
      // console.log({has_already})

      
      this.manifestoId == 'new' ?
      has_already ? '' : this.create() : 
      this.update()
    },
    async hasManifesto(){
      return await this.$gun.get('users').get(this.getUser.username)
        .get('manifestos')
        .get(this.electionId)
        .then()
    },
    async create(){

      this.loading = true

      let userRef = this.$gun.get('users')
        .get(this.getUser.username)
      let manifestoId = this.$uuidv4()

      let manifesto_data = {
        body: this.$sanitize(this.manifesto_body),
        title: this.$sanitize(this.title),
        manifestoId: manifestoId,
        electionRef: this.electionId,
        author: this.getUser.username,
        date_created: this.$Gun.state(),
        last_updated: this.$Gun.state()
      }

      let electionRef = this.$gun.get('elections')
        .get(this.electionId)

      let manifesto = this.$gun.get('manifestos')
        .get(manifestoId)
        .put(manifesto_data)

      userRef.get('manifestos')
        .get(this.electionId) // can't have two manifestos for same election
        .put(manifesto)
      
      electionRef
        .get('manifestos')
        .set(manifesto)


      setTimeout(() => {
        this.readonly = true
        this.loading = false
        this.$emit('close-dialog')

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Saved',
          color: 'success'
        })
      }, 1000)

      this.editor.destroy()

    },
    update(){
      this.loading = true

      let manifestoId = this.manifestoId

      let manifesto = this.$gun.get('manifestos').get(manifestoId)

      let title = this.$refs.title.innerText

      manifesto.get('title')
        .put(title)
      manifesto.get('body')
        .put(this.manifesto_body)
      manifesto.get('last_updated')
        .put(this.$Gun.state())

      setTimeout(() => {
        this.readonly = true
        this.loading = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Saved',
          color: 'success'
        })
      }, 1000)

      this.editor.destroy()
    },
    edit(){
      this.readonly = false

      if(this.editor){
        this.editor.setup()
      }
      else {
        this.initializeEditor()
      }
    },
    formatDate(date){
      return new Date(date).toLocaleString('en-Us', {
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      })
    }
  },
  async mounted(){

     // manifestoid maybe 'new' in the $router prop
     // don't do anything if this is true - 
     // manifestos cannot/should not be created on that page
     // i.e /elections/manifestos/manifestoId

    this.$route.params.manifestoId == 'new' ? '' : this.initialize()
    // console.log(has_already)
  },
  beforeDestroy(){
    this.editor ? this.editor.destroy() : ''
  }
}

import MediumEditor from 'medium-editor'
// import editor from 'vue2-medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/beagle.min.css'
import { mapGetters } from 'vuex'
</script>
<style >
  .editable {
    min-height: 300px;
    padding: 15px;
  }
</style>