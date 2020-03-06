<template>
  <div>
    <div class="text-center pa-3" v-if="events.length == 0">No recent events</div>
    <v-row>
      <v-col 
        cols="12" sm="6" md="6" 
        v-for="(event, i) in events" 
        :key="event.eventId + i">
        <v-card
          class="mx-auto"
          max-width="344"
          outlined
        >
          <v-list-item three-line @click="$router.push(`/events/${event.eventId}`)">
            <v-list-item-content>
              <v-list-item-subtitle>{{event.title}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            >
              <v-img :src="event.imgSrc"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <!-- <v-btn text small @click="deleteEvent(event)">Delete</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn text small>
              <v-icon small>mdi-star</v-icon>
              <span class="ml-1 mr-2">Interested</span>
              {{event.interested}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  data: () => ({
    events: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
  },
  methods: {
    getEvents(){
      this.$gun
        // .get('users').get(this.username)
        .get('events')
        .map(item => item ? item.author == this.username ? item : undefined : undefined)
        .once(async (event) => {

          // console.log({event})

          if(event && event.eventId){
            
            let e = Object.assign({}, event)

            e.author = await this.$gun.get('users')
            .get(this.username)
            .then()

            // console.log(e, key)
            
            this.events.find(e => e.eventId == event.eventId) ? '' : 
            this.events.push(e)
          }
        })
    },
    deleteEvent(event){
      this.$gun.get('events')
        .get(event.eventId)
        // .once((d,k) =>console.log({k}))
        .put(null)
        
      this.$gun.get('users')
        .get(this.getUser.username)
        .get('events')
        .unset(event.eventId)

        // console.log(ref, u)
        // ref.put(null)
    },
    initialize(){
      this.getEvents()
    }
  },
  mounted(){
    this.initialize()

  },
  components: {
    
  }
}

import { mapState, mapGetters } from "vuex"
</script>
