<template>
  <div class="white">
    <vue-headful title="Discover elections, people, and events | Voteryte"/>

    <navigation
      >
      <template v-slot:title>
        <span>Discover <span class="hidden-xs-only">elections, people, and events</span></span>
      </template>
      <template v-slot:extension>
        
      </template>
    </navigation>

    <transition name='fade'>
      <v-container v-if="showUi">
        
        <v-row>
          <v-col cols="12" class="text-center">
            <!-- <h3 class="title"></h3> -->
            <v-text-field
              outlin class="mb-5"
              name="search"
              @keyup.enter="search"
              append-icon="mdi-magnify"
              append-icon-cb="search"
              label="Search election, users, or event"
              v-model.trim="query" hide-details
            >

            <template v-slot:append-outer>
              <v-btn icon @click.native="search">
                <v-icon v-if="query">mdi-send</v-icon>
              </v-btn>
            </template>
            </v-text-field>
            
          </v-col>
        </v-row>
        <v-tabs 
            v-model="tab"
            background-color="white"
            color="deep-purple accent-4"
            right
          >
            <v-tab href="#elections">Elections</v-tab>
            <v-tab href="#people">People</v-tab>
            <!-- <v-tab href="#events">Events</v-tab> -->
          </v-tabs>
        <v-card outlined :loading="searching">
          
          <v-tabs-items v-model="tab">
            <v-tab-item value="elections">
              <v-container>
                <v-card flat min-height="300">
                  <v-row>
                    <v-col cols="12" v-if="elections.length > 0">
                      <v-subheader>Search results</v-subheader>
                    </v-col>
                    <v-col v-for="(election, i) in elections" :key="election.electionId + i" cols="12" sm="6">
                      <v-card outlined>
                        <v-list-item three-line :to="`elections/${election.electionId}`">
                          <v-list-item-content>
                            <v-list-item-title class="title mb-0">{{election.title}}</v-list-item-title>
                            <!-- <v-list-item-subtitle>{{election.electionId}}</v-list-item-subtitle> -->
                          </v-list-item-content>

                          <v-list-item-avatar
                            size="35" tile
                            color="grey lighten-3"
                          >
                            <img :src="election.logo" v-if="election.logo" alt="election_logo"/>
                            <span v-else>{{election.title ? election.title.charAt(0) : ''}}</span>
                          </v-list-item-avatar>
                        </v-list-item>

                        <v-card-actions>
                          <v-btn text small>
                            <v-icon class="pr-1" small>mdi-account-group-outline</v-icon>
                            {{(election.contestants_count || 0).toLocaleString()}}
                          </v-btn>

                          <v-btn text small>
                            <v-icon class="pr-1" small>mdi-vote-outline</v-icon>
                            {{(election.voters_count || 0).toLocaleString()}}
                          </v-btn>

                          <v-spacer></v-spacer>

                          <v-btn text small class="text-capitalize" v-if="!election.timed">
                            <span class="online_badge mr-1"
                            :class="election.status == 'ended' ? 'orange' :
                              election.status == 'inprogress' ? 'success' : 'primary'">
                            </span>
                            {{election.status == 'ended' ? 'Closed' : election.status == 'inprogress' ? 'in progress' : 'Not started'}}
                          </v-btn>

                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-subheader class="font-weight-bold">Elections your enrolled in</v-subheader>
                      <v-row>
                        
                        <v-col 
                          v-for="(election,i) in getMyEnrolled" 
                          :key="election.title + i" cols="12" sm="6">
                          <v-card outlined>
                            <v-list-item three-line :to="`elections/${election.electionId}`">
                              <v-list-item-content>
                                <v-list-item-title class="title mb-0">{{election.title}}</v-list-item-title>
                                <!-- <v-list-item-subtitle>{{election.electionId}}</v-list-item-subtitle> -->
                              </v-list-item-content>

                              <v-list-item-avatar
                                size="35" tile
                                color="grey lighten-3">

                                <img :src="election.logo" v-if="election.logo" alt="logo"/>
                                <span v-else>{{election.title.charAt(0)}}</span>
                              </v-list-item-avatar>
                            </v-list-item>

                            <v-card-actions>
                              <v-btn text small>
                                <v-icon class="pr-1" small>mdi-account-group-outline</v-icon>
                                {{(election.contestants_count || 0).toLocaleString()}}
                              </v-btn>

                              <v-btn text small>
                                <v-icon class="pr-1" small>mdi-vote-outline</v-icon>
                                {{(election.voters_count || 0).toLocaleString()}}
                              </v-btn>

                              <v-spacer></v-spacer>

                              <v-btn text small class="text-capitalize" v-if="!election.timed">
                                <span class="online_badge mr-1"
                                :class="election.status == 'ended' ? 'orange' :
                                election.status == 'inprogress' ? 'success' : 'primary'">
                                </span>
                                {{election.status == 'ended' ? 'Closed' : election.status == 'inprogress' ? 'in progress' : 'Not started'}}
                              </v-btn>

                            </v-card-actions>
                          </v-card>
                        </v-col>

                      </v-row>
                    </v-col>
                  </v-row>
                  
                </v-card>
              </v-container>
            </v-tab-item>

            <v-tab-item value="people">
              <v-container>
                <transition name="fade" appear>
                  <v-card min-height="300" flat v-if="!searching">
                    <v-subheader class="font-weight-bold">People</v-subheader>
                    <v-subheader v-show="people.length == 0">No results for your search</v-subheader>
                    <v-row>
                      <v-col v-for="(person, i) in people" :key="person.username + i" cols="12" sm="4">
                        
                        <v-card class="mb-2" 
                          outlined
                          height="320" 
                          style="position: relative">

                          <v-sheet width="100%" height="80" 
                            
                            :color="$helpers.colorMinder(person.name.charAt(0)) + ' lighten-3'">
                            <img :src="person.header_img || require('@/assets/profile-background.jpg')" width="100%" height="80" alt="altText"/>

                          </v-sheet>
                          
                          <div style="width: 100%; height: 100px;" class="mx-auto mt-n12" color="transparent">
                            <v-avatar
                              size="90"
                              class="elevation-1 d-flex mx-auto"
                              :color="$helpers.colorMinder(person.name.charAt(0))"
                            >
                              <img :src="person.photoURL" v-if="person.photoURL">
                              <span v-else class="white--text display-1 text-capitalize">
                                {{person.name.charAt(0)}}
                              </span>
                            </v-avatar>
                          </div>

                          <v-card-text class="px-1 text-center" :id="person.username + 'cont'"
                          >
                            <div class="subheading font-weight-bold mb-0 text-capitalize .text-truncate"
                              style="cursor: pointer;" @click="$router.push(`/users/${person.username}`)">
                              {{person.name}}
                              <span class="online_badge success" v-if="person.online"></span>
                            </div>
                            <div>
                              @{{person.username}}
                            </div>
                            
                          </v-card-text>
                          <v-card-actions>

                            <v-btn color="primary lighten-3" dark small text
                              class="mx-auto text-capitalize" 
                              >
                              {{(person.followers_count || 0).toLocaleString()}} Followers
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </transition>
              </v-container>
            </v-tab-item>

            <!-- <v-tab-item value="events">
              <v-container>
                <v-card min-height="300" flat>
                  <v-subheader>Events</v-subheader>
                  <v-subheader v-if="events.length == 0">No events found for your search</v-subheader>

                  <v-row>
                    <v-col cols="12" sm="6" v-for="(event, i) in events" :key="event.eventId + i">
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
                          ></v-list-item-avatar>
                        </v-list-item>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text small class="text-capitalize"></v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-container>
            </v-tab-item> -->
          </v-tabs-items>
        </v-card>

      </v-container>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    query: '',
    searching: false,
    tab: 'elections',
    elections: [],
    people: [],
    events: [],
  }),
  computed: {
    ...mapGetters([
      'getMyEnrolled'
    ]),
    ...mapState([
      'auth'
    ])
  },
  methods: {
    async initialize(){
      await this.sleep(500)
      this.showUi = true;
    },
    sleep (limit=100) {
      return (new Promise((res)=>{
        setTimeout(res, limit);
      }))
    },
    async search(){
      // let resulst = [
        this.searching = true;

        await this.searchElection()
        await this.searchPeople()
        // await this.searchEvents()

        // setTimeout(() => {
          this.searching = false;
        // }, 3);
        
    },
    async searchElection(){
      // search for an election using the electionId
      
      try {
        
        let query = this.query.toLowerCase()
        // grab all the elections
        let elections = async ()=>{
          let arr = []
          this.$gun.get('elections')
            .map(item => item && item.title ? item.title.toLowerCase()
              .includes(query) || item.electionId == this.query ? item : undefined : undefined)
            .once(elec => {
              // console.log({elec})
              if(elec){
                arr.find(e => e.electionId == elec.electionId) ? '' : 
                arr.push(new Promise((res) => {
                  res(elec)
                }))
              }
    
            })
  
            await this.sleep()
  
            return Promise.all(arr)
        }
  
        let data_list = (await elections())
  
        this.elections = this.fuseSearch(data_list, ['title','electionId'])
  

      } catch (error) {

        console.log(error)
      }

      
    },
    async searchPeople(){
      
        let query = this.query.toLowerCase()
        // grab all the elections
        let people = async ()=>{
          let arr = []
          this.$gun.get('users')
            .map(item => (item.username && item.name) ? item.name.toLowerCase()
              .includes(query) || item.username.toLowerCase().includes(query) ? item : undefined : undefined)
            .once(d => {
              // console.log(d)

              if(d){
                arr.find(p => p.username == d.username) ? '' : 
                arr.push(new Promise((res) => {
                  res(d)
                }))
              }

            })
  
            await this.sleep()
  
            return Promise.all(arr)
        }

        let data_list = (await people())
        let options = ['name', 'username']
  
        this.people = this.fuseSearch(data_list, options)

    },
    async searchEvents(){
      
      let query = this.query.toLowerCase()
  
      let events = async () => {
        let arr = []
        this.$gun.get('events')
          .map(item => item ? item.title.toLowerCase().includes(query) ? item : undefined : undefined )
          .once(async d => {

            // console.log(d)
            let ev = Object.assign({}, d)

            if(d){

              if(ev.author && !d.author.username){
                ev.author = await this.$gun.get('users').get(d.author['#']).then()
              }

              ev.soul = d['_']['#']

              arr.find(p => p.eventId == d.eventId) ? '' : 
              arr.push(new Promise((res) => {
                res(ev)
              }))
            }
          })

          await this.sleep()
          return Promise.all(arr)
      }

      let data_list = (await events())
      let options = ['title', 'eventId']

      this.events = this.fuseSearch(data_list, options)

    },
    fuseSearch(data_list, keys=['name','title']){

      let fuseOptions = {
				shouldSort: true,
				tokenize: true,
				threshold: 0.4,
				location: 0,
        distance: 100,
        keys
      }
      
      let fuse = new Fuse(data_list, fuseOptions)
      
      return fuse.search(this.query)
    }
  },
  mounted(){
    this.initialize()
    
  },
}

import { mapState, mapGetters } from "vuex";
import Fuse from 'fuse.js'
</script>

<style>

</style>