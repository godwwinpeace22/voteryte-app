<template>
  <div>
    
    <v-card flat class="mb-4">
      <div style="overflow-y:auto;">
        <v-btn color="white" icon
          class="hidden-md-and-up"
          @click="$router.push('/home')"
        >
          <v-icon >mdi-chevron-left</v-icon>
        </v-btn>
        <v-subheader 
          class="font-weight-bold" 
          :class="$vuetify.breakpoint.smAndDown ? 'd-inline title' : ''">
          Campaigns</v-subheader>
        <!-- <v-subheader>no campaigns</v-subheader> -->
        <v-list dense >
          <v-list-item  @click="newCampaign" >
            <v-list-item-avatar color="grey lighten-1">
              <v-avatar size="45" color="grey lighten-1">
                <v-icon small color="white">mdi-plus</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title :class="dark ? '' : 'primary--text'">
                New Campaign</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider v-if="campaigns.length > 0"></v-divider>

        <v-list v-if="campaigns.length > 0"
          two-line dense>

          <v-list-item
            v-for="(campaign,i) in sortCampaigns" 
            :key="i" 
            @click="selectCampaign(campaign)">

            <v-list-item-avatar size="45" 
              :color="$helpers.colorMinder(campaign.author.name.charAt(0))">

              <img 
                :src="campaign.author.photoURL" 
                v-if="campaign.author.photoURL" alt="alt">
              <span 
                v-else small 
                class="white--text">
                {{campaign.author.name.charAt(0)}}
              </span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                :class="['text-capitalize', {'primary--text': !dark,}]">
                {{campaign.author.name}}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{$helpers.parseDate(campaign.latest)}}
                <v-icon 
                  small color="primary" 
                  class="pr-1">
                  mdi-chart-donut
                </v-icon>

                {{campaign.count}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <!-- <v-card-actions>
        <v-btn text small v-if="getCampaigns.length >= 15"
          color="primary" class="text-capitalize"
          @click="moreCampaigns" :loading="loading_more_campaigns">See More</v-btn>
      </v-card-actions> -->
    </v-card>

    <!-- NEW CAMPAIGN DIALOG -->
    <v-dialog v-model="new_campaign" scrollable persistent
      max-width="500px" :fullscreen="breakpoint.smAndDown">
      <v-card flat>
        <v-toolbar dense flat>
          <span>Create a Campaign</span>
          <v-spacer></v-spacer>
          <v-btn text icon @click="new_campaign = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          
          <new-campaign v-if="isSuperUser"/>
          
        </v-card-text>
        
      </v-card>
      
    </v-dialog>

  </div>
</template>
<script>
export default {
  data: () => ({
    selected_campaign: {},
    new_campaign: false,
    campaigns: []
  }),
  props: {
    // campaigns: {
    //   required: true,
    // },
    dark: {
      default: false
    },
    height: {
      default: ''
    }
  },
  watch: {
    'curRoom': function(to){
      to.electionId ? this.latestCampaigns() : ''
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    getCampaigns(){
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let sorted = this.campaigns.sort((a,b)=>
       
        b.date_created - a.date_created
      )
      return sorted
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
  },
  methods: {
    selectCampaign(campaign){
      
      let index = this.getCampaigns.findIndex(camp => {
        return camp.author.username == campaign.author.username
      })
      // // console.log({campaign, index})
      this.selected_campaign = index
      // this.view_campaign = true;

      this.$route.query.n == index ? '' : 
      this.$router.push(`/campaigns?n=${index}`)
      this.$eventBus.$emit('ShowList', false)
    },
    newCampaign(){
      
      this.isSuperUser ?
      this.new_campaign = true :
      this.$route.name == 'upgrade' ? '' :
      this.$router.push('/upgrade') 
    },
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
      

      // get only today campaigns
      ref.get({'.': {'>': yesterday}})
      .map()
      .on((d) => {
        console.log({d})

        let c = Object.assign({}, d)
        if(d.author){

          this.$gun.get('users').get(d.author).once(a => {
            c.author = a
          })
          myArr.push(c)
        }
        
      }, {change: true})

        
      // Allow only campaigns <= 1 day old

      setTimeout(() => {

        this.campaigns = myArr //myArr.filter(c => now - c.date_created <= twenty4hrs)
      }, 500)

    },
  },
  components: {
    NewCampaign,
  },
  mounted(){
    this.$eventBus.$on('HideNewCampaignDialog', () => {
      this.new_campaign = false
    })

    this.latestCampaigns()

    this.$route.query.new_campaign ? this.newCampaign() : ''
  }
}
import { mapState, mapGetters } from 'vuex'
import NewCampaign from '@/components/campaigns/NewCampaign'
</script>

<style scoped>
  /* .v-card {
    box-shadow: 0 1px 2px rgba(0,0,0,.3);
  } */
</style>