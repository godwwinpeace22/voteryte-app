<template>
  <v-card flat>
    <v-subheader v-if="events.length == 0">No recent events</v-subheader>
    <v-subheader v-else class="font-weight-bold">Recent Events</v-subheader>
    <v-list class="pt-0">
      <template v-for="(event,i) in events">

        <v-list-item 
          :key="event.eventId" 
          :to="`/events/${event.eventId}`">

          <v-list-item-content>
            <v-list-item-title>
              {{event.title}}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{event.interested}} 
              <v-icon small color="primary">mdi-star</v-icon>
              
              <v-icon small color="teal" class="ml-3">mdi-clock</v-icon>
              {{new Date(event.date + ' ' + event.time).toLocaleString('en-US', options)}}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar 
            size="40" tile
            color="grey lighten-3">
            <img :src="event.imgSrc" v-if="event.imgSrc">
            <span v-else>{{event.title.charAt(0)}}</span>
          </v-list-item-avatar>
        </v-list-item>

        <v-divider :key="event.eventId + 'k'" v-show="i < events.length - 1"></v-divider>
      </template>
    </v-list>

  </v-card>
</template>
<script>
export default {
  data: () => ({
    events: [],
    options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    loading_more_events: false,
    isLastEvent: false,
  }),
  watch: {
    'getMyEnrolled': function(to) {
      
      to ? this.getEvents() : ''
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods: {
    moreEvents(){
      
    },
    getEvents(){

      this.events = []
      let myElections = this.getMyEnrolled.map(e => e.electionId)

      this.$gun
        .get('events')
        .map(item => item ? myElections.includes(item.elecRef) ? item : undefined : undefined)
        .on((e) => {

          // console.log({e})

          let event = Object.assign({}, e)
          this.$gun.get('users').get(e.author).once(a => {
            
            event.author = a
          })

          let event_index = this.events.findIndex(ev => ev.eventId == e.eventId)
          if(event_index != -1){
            this.events.splice(event_index, 1)
            this.events.push(event)
          }
          else {
            this.events.push(event)
          }
        })

        
    }
  },
  mounted(){
    this.curRoom ? this.getEvents() : ''

  }
}
import {mapGetters, mapState} from 'vuex'
</script>
