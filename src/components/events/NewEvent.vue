<template>
  <div>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Create New Event</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="" icon @click.native="$emit('close-event-drawer', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-stepper v-model="stepper" vertical>
      <v-stepper-step :complete="stepper > 1" step="1">
        Event Title
        <small>Choose a nice title</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card color="grey lighten-5" flat class="mb-5" height="200">
          <v-card-text>
            <p>What would be the title of your new event?<p>
            <p>Events can be webiners, online interactive sessions e.t.c</p>
            <v-text-field outlined color="primary"
              name="title" counter
              label="Title" :rules="[rules.counter]"
              v-model.trim="new_event.title"
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-btn color="primary" @click="stepper = 2" depressed 
          class="text-capitalize"
          :disabled="!new_event.title || new_event.title.length > 100">
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 2" step="2">
        Event Description
        <small>Summarize</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card color="grey lighten-5" class="mb-5" flat height="">
          <v-card-text>
            <p>Write a brief description about this event.</p>
            <v-textarea
              name="summary" v-model.trim="new_event.desc"
              label="Describe your event"
              color="primary" outlined
            ></v-textarea>
          </v-card-text>
          
        </v-card>
        <v-btn text @click.native="stepper = 1">Previous</v-btn>
        <v-btn color="primary" @click="stepper = 3" 
          depressed class="text-capitalize"
          :disabled="!new_event.desc">
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 3" step="3">Cover image</v-stepper-step>
      <v-stepper-content step="3">
        <v-card color="grey lighten-5" flat class="mb-5" height="">
          <v-card-text>
            <p>Upload a high quality cover image or banner of your event</p>
            <p>Recommended size of image is 800x300</p>
            <v-img :src="blob_url" v-if="selected_file" width="200" height="200"/>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" v-if="!selected_file"  outlined small
              @click.native="$helpers.trigFileSelector" class="mb-2">
              Select event banner</v-btn>


            <v-btn color="" v-if="selected_file" @click.native="selected_file = null; 
              blob_url = []; uploaded = false" class="mb-2" depressed :disabled="uploading">
              <v-icon class="pr-2">mdi-close</v-icon>
              Remove</v-btn>
            
            <v-btn color="success" v-if="selected_file" @click.native="uploadBanner"
              depressed class="mb-2" :loading="uploading" :disabled="!!uploaded">
              <v-icon class="pr-2">mdi-cloud-upload</v-icon>
              Upload</v-btn>
            
          </v-card-actions>
        </v-card>
        <v-btn text @click.native="stepper = 2">Previous</v-btn>
        <v-btn color="primary" @click="stepper = 4" 
          depressed class="text-capitalize"
          >
          Next step
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-stepper-content>


      <v-stepper-step :complete="stepper > 4" step="4">Schedule</v-stepper-step>

      <v-stepper-content step="4">
        <v-card color="grey lighten-5" flat class="mb-5" height="">
            <v-subheader>Select date and time for the event</v-subheader>
          <v-card-text>
            <v-row row wrap>
              <v-col cols="12" sm="6">
                <v-menu ref="menu"
                  v-model="date_dialog"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="new_event.date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="new_event.date"
                      label="Start date"
                      prepend-inner-icon="mdi-calendar"
                      readonly color="primary" outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="new_event.date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="date_dialog = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(new_event.date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" class="pl-3">
                <v-dialog ref="menu2"
                  v-model="time_dialog"
                  persistent
                  :return-value.sync="new_event.time"
                  transition="scale-transition"
                  offset-y
                  width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="new_event.time"
                      label="Start time"
                      prepend-inner-icon="mdi-calendar"
                      readonly color="primary" outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="new_event.time" scrollable color="primary">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="time_dialog = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu2.save(new_event.time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
            </v-row>
            

            <v-subheader class="pl-0">Event Location</v-subheader>
            <v-radio-group v-model="new_event.online" row :readonly="event_created">
              <v-radio label="Online" :value="true"></v-radio>
              <v-radio label="Offline" :value="false"></v-radio>
            </v-radio-group>

            <v-text-field outlined color="primary"
              name="venue" v-if="!new_event.online"
              label="Enter address" :readonly="event_created"
              v-model.trim="new_event.venue"
            ></v-text-field>

            <v-select
              :items="getMyEnrolled"
              v-model="new_event.audience"
              item-value="electionId"
              item-text="title"
              outlined
              :readonly="event_created"
              label="Select Audience"
              persistent-hint
              hint="You need to select a target audience for your event to be discoverable"
            ></v-select>

          </v-card-text>
        </v-card>
        <template v-if="!event_created">
          <v-btn text @click="stepper = 3" :disabled="loading">Previous</v-btn>
          <v-btn color="primary" :loading="loading" 
            @click="createEvent" depressed 
            class="text-capitalize"
            :disabled="!new_event.date || !new_event.time || !new_event.audience || (!new_event.online && !new_event.venue)">
            Create event
          </v-btn>
        </template>
        <v-btn color="info" depressed 
          @click.native="visitEvent" 
          v-if="event_created" class="text-capitalize">
          Visit Event page
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
export default {
  data: ()=> ({
    stepper: 1,
    date_dialog: false,
    time_dialog: false,
    new_event: {
      title: '',
      date: '',
      time: '',
      desc: '',
      online: true,
      venue: '',
      audience: ''
    },
    rules: {
      counter: value => value.length <= 100 || 'Max 100 characters',
    },
    loading: false,
    eventId: null,
    event_created: false,
    selected_file: null,
    blob_url: [],
    uploading: false,
    uploaded: false,
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    uploadBanner(){
      return new Promise((resolve, reject) =>{
        this.uploading = true

        this.$helpers.uploadMedia({
          files: [this.selected_file],
          options: {
            height: 300,
            width: 800
          }
        })
        .then(uploaded => {
          this.uploading = false
          this.uploaded = uploaded[0]
          resolve(uploaded[0])

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Image uploaded',
            color: 'success'
          })
          document.getElementById('file_img').value = null
        }).catch(err => {

          this.uploading = false
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Upload failed',
            color: 'error'
          })
          reject(err)
        })
      })
    },
    createEvent(){
      try {
        this.loading = true
        this.$emit('persist-drawer')
        
        // console.log(eventId)

        let userRef = this.$gun.get('users').get(this.getUser.username)
        let title = this.$sanitize(this.new_event.title)
        let desc = this.$sanitize(this.new_event.desc)
        let venue = this.$sanitize(this.new_event.venue)

        let eventId = this.$uuidv4()
        this.eventId = eventId
        
        let eventData = {
          eventId: eventId,
          dateCreated: this.$Gun.state(),
          author: this.getUser.username,
          title, desc, venue,
          date: this.new_event.date,
          time: this.new_event.time,
          online: this.new_event.online,
          imgSrc: this.uploaded,
          elecRef: this.new_event.audience,
          interested: 1,
          started: false,
          live: false,
          ended: false,
          
        }
        
        // create an event
        let event = this.$gun.get('events')
          .get(eventId)
          .put(eventData)

        event.get('interested_list')
          .get(this.getUser.username)
          .put(true)
        
        userRef.get('events')
          .set(event)

        
        this.loading = false
        this.event_created = true

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Event Created',
          color: 'success'
        })
      }
      catch(err){
        console.log(err)
        this.loading = false
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })
      }
    },
    visitEvent(){

      this.new_event = {
        title: '',date:'',time:'',desc: '',online:true,venue: '',audience: ''
      }

      this.event_created = false
      this.uploaded = []
      this.eventId = null
      this.selected_file = []
      this.blob_url = []
      this.stepper = 1

      this.$router.push(`/events/${this.eventId}`);

      this.$eventBus.$emit('EventDrawer', false)
    }
  },
  mounted(){
    this.$eventBus.$on('Selected_Files', data => {
      this.selected_file = data.selected_files[0],
      this.blob_url = data.imgSrc[0]
    })
  }
}
import {mapGetters, mapState} from 'vuex'
</script>