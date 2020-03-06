<template>
  <v-container>

      <v-card class="pa-4" flat v-if="showUi">
        <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>
        
        <carousel 
          v-if="showCarousel && contestants && contestants.length > 0" 
          :nav='true' 
          :responsive="{0:{items:1,nav:false},600:{items:2,nav:true},800:{items:3,nav:true}}" >

          <v-card class="mr-2 mb-2" 
            outlined
            height="320" v-for="contestant in contestants" 
            :key="contestant.author.username" 
            style="position: relative">

            <v-sheet width="100%" height="200" tile>
              <img :src="contestant.author.photoURL" alt="" width="100%" height="100%" contain/>
            </v-sheet>

            <v-card-text 
              class="px-1 text-center"
              :id="contestant.author.username + 'cont'"
            >
              <div class="subheading font-weight-bold mb-0 text-capitalize .text-truncate"
                style="cursor: pointer;">
                {{contestant.author.name}}
                <span class="online_badge success" v-if="contestant.author.online"></span>
              </div>
              <div>
                <i>for</i> {{contestant.role.title}}
              </div>
              <div class="overline mt-3">
                contestant number {{contestant.number}}
              </div>
            </v-card-text>
          </v-card>
          
        </carousel>
      </v-card>
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="i in 3" :key="i">
          <v-skeleton-loader
            
            class="mb-6"
            type="card"
          ></v-skeleton-loader>

        </v-col>
      </v-row>

  </v-container>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    contestants: [],
    showCarousel: false,
    disabled: [],
    contRef: '',
  }),
  watch: {
    electionId: function(to){
      to ? this.initialize() : ''
    }
  },
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async getContestants(){
      // get contestants
      
      this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .map()
        .once(async (d) => {

          if(d){
            let data = Object.assign({}, d)
            data.author = await this.$gun.get(data.author['#']).then()
            data.role = await this.$gun.get(data.role['#']).then()
            // console.log({data})
            
            this.contestants.push(data)

            this.showUi = true
            this.showCarousel = true;
          }
          
        })
    },
    async getRole(username){

      // get the role of a contestant
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(username)
        .get('role')
        .then()
          
    },
    async getPerson(username){
      return await this.$gun
        .get('users')
        .get(username)
        .then()
    },
    follow(event,contestant){

      this.disabled.push(contestant.username)

      this.$helpers.followUser(this.getUser, contestant)
      .then(data =>{
        this.disabled.splice(this.disabled.indexOf(contestant.username),1)
        // console.log(this.$refs)
        if(data.following){
          // contestant.followers += 1

          this.$refs[contestant.username][0].innerText = `You are following ${contestant.name}`
        }
        else{
          // contestant.followers -= 1
          this.$refs[contestant.username][0].innerText = `Follow ${contestant.name}`
        }
      })
      .catch(err => {
        console.log(err)
        // contestant.followers += 1
        this.disabled.splice(this.disabled.indexOf(contestant.username),1)
      })
       
    },
    initialize(){
      this.getContestants().then(() => {
        this.showUi = true;
      })
    }
  },
  mounted(){
    this.initialize()
  },
  destroyed(){
    // this.contRef.off()
  },
  components: {
    carousel
  }
}

import { mapGetters } from "vuex";
// import { uniqBy } from "lodash";
import carousel from 'vue-owl-carousel'
</script>


