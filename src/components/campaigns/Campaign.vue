<template>
  <div>
    <vue-headful :title="title"></vue-headful>

    <v-dialog
      v-model="dialog"
      fullscreen
      
      transition="dialog-transition"
    >
      <v-card style="overflow-x: hidden;" tile flat dark>
        <v-btn color="white" icon fab absolute
          class="hidden-sm-and-down"
          @click="$router.push('/home')"
        >
          <v-icon >mdi-close</v-icon>
        </v-btn>

        <v-navigation-drawer 
          v-model="drawer" 
          right fixed
          v-if="$vuetify.breakpoint.mdAndUp && drawer">
          <!-- <v-toolbar dark flat>
            <v-toolbar-title>All campaigns</v-toolbar-title>
          </v-toolbar> -->
          <v-divider class="hidden-sm-and-down"></v-divider>

          <v-subheader v-if="campaigns.length == 0">No campaigns</v-subheader>
          <!-- <v-list two-line dense v-if="groupedCampaigns.length > 0">
            <v-list-item  v-for="(campaign,i) in groupedCampaigns" :key="i" @click="selectCampaign(campaign)">
              <v-list-item-avatar size="45" color="grey">
                <img v-if="campaign[0].author.photoURL" :src="campaign[0].author.photoURL" 
                   :alt="campaign[0].author.name">
                <span v-else small class="white--text">
                  {{campaign[0].author.name ? campaign[0].author.name.charAt(0) : ''}}
                </span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">
                  {{campaign[0].author.name}}</v-list-item-title>
                <v-list-item-subtitle>
                  {{$helpers.parseDate(campaign[0].date_created)}}
                  <v-icon small color="info" class="pr-1">mdi-chart-donut</v-icon>
                  {{campaign.length}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list> -->

          <campaigns-list :campaigns="campaigns" :dark="true"/>
        </v-navigation-drawer>

        <v-row justify="center">
          <v-col cols="12" 
            v-if="$vuetify.breakpoint.smAndDown" 
            :class="{'d-none': $vuetify.breakpoint.smAndDown && show == 'card'}">
            
              <campaigns-list :campaigns='campaigns' :dark="true" height="100vh"/>
            
          </v-col>
          <v-col cols="12" md="3" 
            :class="{'d-none': $vuetify.breakpoint.smAndDown && show == 'list'}">
            
            <view-campaign 
              :start_slide="start_slide" 
              :campaigns='campaigns' 
              />
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    dialog: true,
    drawer: true,
    campaigns: [],
    index: '',
    start_slide: 0,
    show: 'list',
  }),
  computed: {
    title(){
      return `Campaigns (${this.campaigns.length}) | ${this.$appName}`
    },
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'curRoom',
    ]),
    getCampaigns(){
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let sorted = this.campaigns.sort((a,b)=>
       
        b.date_created - a.date_created
      )
      return sortBy(sorted, 'username')
    },
    sortCampaigns(){
      // group campaigns by user
      const uniqueArray = this.getCampaigns.filter((thing,index) => {
        return index === this.getCampaigns.findIndex(obj => {
          return obj.docId === thing.docId;
        })
      })

      let uniques = []
      // console.log(uniques, this.campaigns)
      uniqueArray.forEach((item) =>{
        if(!uniques.find(camp => camp.author.username == item.author.username)){
          let user_campaigns = uniqueArray.filter(u => u.author.username == item.author.username)
          uniques.push({
            ...item,
            latest: user_campaigns[0].date_created, // the latest by the user
            count: user_campaigns.length // number of 
            // campaigns by this user
          })
        }
      })
      // console.log({uniques})
      // this.sorted = uniques
      return uniques
    },
    groupedCampaigns(){
      let grouped = Object.values(groupBy(this.campaigns, 'author'))
      // console.log({grouped})
      return grouped
    }
  },
  watch: {
    'start_slide': function(){
      // console.log(to)
      this.show = 'card'
    },
  },
  methods: {
    async latestCampaigns(){

      let twenty4hrs = 24 * 60 * 60 * 1000
      let yesterday = (new Date(Date.now() - twenty4hrs)).toISOString().substr(0,8)
      
      let myArr = []
      
      let ref = this.$gun
        .get('users')
        .get(this.getUser.username)
        .get('enrolled')
        .map()
        .get('campaigns')


      ref.get({'.': {'>': yesterday}})
      .map()
      .on(async (d,key) => {
        console.log({d,key})

        let c = Object.assign({}, d)
          if(d.author){

            this.$gun.get('users').get(d.author).once(a => {
              c.author = a
            })
            myArr.push(c)
          }
        
      }, {change: true})

      this.campaigns = myArr //myArr.filter(c => now - c.date_created <= twenty4hrs)
      this.showUi = true
      console.log(this.campaigns, myArr)

    },
    selectCampaign(campaign){

      // let c = sortBy(this.getCampaigns, 'username')

      // let last_campaign_in_group = campaign[campaign.length -1]
      let first_campaign_in_group = campaign[0]

      this.start_slide = this.getCampaigns.indexOf(first_campaign_in_group)
      
    }
  },
  mounted(){
    this.latestCampaigns()
    
    // CHECK THAT THIS IS VALID E.G ITS A NUMBER
    this.start_slide = this.$route.query.n*1 ? this.$route.query.n : 0

    this.$eventBus.$on('ShowList', data => {
      this.show = data ? 'list' : 'card'
    })

    
  },
  beforeDestroy(){
    this.drawer = false
  },
  components: {
    ViewCampaign,
    CampaignsList
  }
}

import { mapGetters, mapState } from 'vuex'
import {groupBy, sortBy} from 'lodash'
import ViewCampaign from '@/components/campaigns/ViewCampaign'
import CampaignsList from '@/components/campaigns/CampaignsList'
</script>
