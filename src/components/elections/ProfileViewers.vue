<template>
  <div>
    <v-container px-2>
      <v-row >
        <v-col cols="12">
          <v-card outlined shaped style="border-top: 4px solid gold">
            <v-toolbar class="white" flat dense>
              <v-subheader>Who Viewed Your Profile</v-subheader>
              <v-spacer></v-spacer>
              <v-icon color="#FFC107" class="pr-2">mdi-flash-circle</v-icon>
              <span class="font-weight-bold">Premium</span>
            </v-toolbar>

            <v-container>
              <v-row row wrap>
                <v-col cols="12" sm="4">
                  <v-card flat>
                    <pie-chart :chart-data="chartdata" :chartOptions="chartOptions"></pie-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card flat>
                    <bar-chart :chart-data="chartdata2" :options="chartOptions2"></bar-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card flat class="round_top" style="border: 1px solid #eee;">
                    <v-toolbar flat dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Your Profile Viewers</v-subheader>
                      
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line dense>
                        <v-subheader v-if="profileViews.length == 0">0 profile views</v-subheader>
                        <template v-for="(item, index) in profileViews">
                          <v-list-item :key="index" @click="$eventBus.$emit('ViewProfile', item.author)">
                            <v-list-item-avatar :color="$helpers.colorMinder(item.author.name.charAt(0))">
                              <img :src="item.author.photoURL" v-if="item.author.photoURL">
                              <span v-else class="white--text">{{item.author.name.charAt(0)}}</span>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title >
                                {{$helpers.capitalize(item.author.name)}}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{item.author.dept}}
                              </v-list-item-subtitle>
                              
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    profileViews: [],
    chartdata: {},
    offset: '',
    more_profile_views: false,
    chartdata2: {},
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
    },
    chartOptions2:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    labels: [
      '12am',
      '3am',
      '6am',
      '9am',
      '12pm',
      '3pm',
      '6pm',
      '9pm'
    ],
    value: [
      200,
      675,
      410,
      390,
      310,
      460,
      250,
      240
    ]
  }),
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
    ])
  },
  methods: {
    moreProfileViews(){

    },
    async getProfileViewers(){
      // get profile views
      this.$gun.get('users')
      .get(this.getUser.username)
      .get('profile_views')
      .map().once( async (v,k) => {

        console.log({v,k})
        let d = Object.assign({}, v)

        d.author = await this.$gun.get('users').get(v.author['#'] || v.author).then()
        console.log({d})
        this.profileViews.push(d)
      })

      await this.$helpers.sleep()

      this.profileViewsByDept()
      this.profileViewsByFac()
    
    },
    get_random_color() {
      var letters = 'ABCDE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    profileViewsByDept(){
      
      let byDept = {}
      this.profileViews.forEach(view =>{
        
        byDept[view.author.dept] ? 
        byDept[view.author.dept] = byDept[view.author.dept]++ : 
        byDept[view.author.dept] = 1
      })

      this.chartdata = {
        labels: Object.keys(byDept).map(item =>{
          return this.$helpers.truncateText(item)
        }),
     
        datasets: [
        {
          label: 'Your profile views by department',
          backgroundColor: Object.keys(byDept).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(byDept)
        }]
      }
    },
    profileViewsByFac(){
      
      let byFac = {}
      this.profileViews.forEach(view =>{
        
        byFac[view.author.fac] ? 
        byFac[view.author.fac] = byFac[view.author.fac]++ : 
        byFac[view.author.fac] = 1
      })

      this.chartdata2 = {
        labels: Object.keys(byFac).map(item =>{
          return this.$helpers.truncateText(item)
        }),

        datasets: [
        {
          label: 'Your profile views by faculty',
          backgroundColor: Object.keys(byFac).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(byFac)
        }]
      }
    }
  },
  mounted(){
    this.getProfileViewers()
  },
  components: {
    PieChart,
    BarChart
  }
}
import PieChart from '@/charts/piechart'
import BarChart from '@/charts/barchart'
import { mapGetters, mapState } from 'vuex';
</script>
