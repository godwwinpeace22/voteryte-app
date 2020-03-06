<template>
  <div>
    <vue-headful :title="title"/>

    <navigation :show_extension="true" :extension_height="40" :prominent="false">
      <span slot="title">Home</span>

      <!-- <template v-slot:extension>
        <v-tabs v-if="$vuetify.breakpoint.smAndDown"
          v-model="tab"
          background-color="transparent"
          dark
          slider-color="grey lighten-5"
        >
          <v-tab href="#tab-posts">Home</v-tab>
          <v-tab href="#tab-campaigns">Campaigns</v-tab>
          <v-tab href="#tab-events">Events</v-tab>
        </v-tabs>
      </template> -->
    </navigation>

    <!-- <transition name="fade"> -->

    <template v-if="showUi">

       <new-post v-if="curRoom"/>

      <v-divider></v-divider>

      <welcome-post-template
        
        v-if="posts.length == 0 || $route.query.new"
      />

      <post-template 
        :posts="posts"
        :loading_more_posts="loading_more_posts"
        
        @loadmore="''"
      />

     </template>
    <!-- </transition> -->

    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable :close-on-content-click="false"
      persistent :fullscreen='breakpoint.smAndDown'
      max-width="650px"
      :transition="switchTransition">

      <new-post></new-post>
    </v-dialog>

  </div>
</template>
<script>
export default {
  inject: ['theme'],
  data:()=>({
    title:'Home | Votertye',
    tab: 'tab-posts',
    posts: [],
    lower_bound: 150,
    upper_bound: 200,
    increment: 50,
    expanded: [],
    readmore: [],
    loading: [],
    loading_comments: [],
    loading_more_comments: [],
    loading_more_posts: false,
    loading_more_campaigns: false,
    disabled_btns: [],
    sorted: [],
    campaigns: [],
    campRef: '', // for listener
    selected_campaign: 0,
    new_post_dialog: false,
    comments: {},
    showUi: false,
    nodata: false,
    
  }),
  watch: {
    'curRoom': function(to){
      if(to){

        this.campaigns = []
        this.posts = []
        this.latestPosts()
      }
    },
  },
  components: {
    NewPost,
    // CampaignsList,
    // ListEvents,
    PostTemplate,
    WelcomePostTemplate
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    show_events(){
      if(this.breakpoint.mdAndUp){
        return true
      }
      else if(this.tab == 'tab-events'){
        return true
      }
      else {return false}
    },
    show_posts(){
      if(this.breakpoint.mdAndUp){
        return true
      }
      else if(this.tab == 'tab-posts'){
        return true
      }
      else {return false}
    },
    show_campaigns(){
      if(this.breakpoint.mdAndUp){
        return true
      }
      else if(this.tab == 'tab-campaigns'){
        return true
      }
      else {return false}
    },
    switchTransition(){
      return this.breakpoint.smAndDown ? 
      'slide-x-reverse-transition' : 
      'dialog-transition'
    },
    // eslint-disable-next-line vue/return-in-computed-property
    styleForTabs(){
      if(this.breakpoint.xsOnly){
        return {height:'calc(100vh - 112px)'}
      }
      
    },
    moreImages(){
      return this.breakpoint.xsOnly ? {
        top:'34%'
      } : {
        top:'27%'
      }
    },
    moreImagesText(){
      return this.breakpoint.xsOnly ? {
        marginTop:'42%'
      } : {
        marginTop:'90%'
      }
    },
    myContests(){
      let enrolled = []
      this.getMyEnrolled.forEach(election=>{
        if(election.contestants.find(contestant => contestant == this.getUser.uid)){
          enrolled.push(election)
        }
      })
      return enrolled
    },
    getCampaigns(){
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let sorted = this.campaigns.sort((a,b) =>{
        return b.date_created - a.date_created
      })

      return sorted
    },
    
  },
  methods:{
    
    async postAuthor(a){
      return await this.$gun
        .get(a['#']).then()
    },
    async latestPosts(){

      this.showUi = true;
      let twenty4hrs = 24 * 60 * 60 * 1000
      let yesterday = (new Date(Date.now() - twenty4hrs)).toISOString().substr(0,8)

      this.$gun
      .get('posts')
      .get({'.': {'>': yesterday}})
      .map(p => {
        return p ? p.erf == this.curRoom.electionId && p.t != 'comment' ? p : undefined : undefined
      })
      .on(async (post, k) => {
        console.log({post}, k)

        let p = Object.assign({}, post)
        p.a = typeof post.a == 'object' ? post.a : await this.$gun.get('users').get(post.a).then()
        
        p.b = msgdown(post.b)

        let img_list = post.imgs ? await this.$gun.get(post.imgs['#']).then() : false
        p.imgs = img_list ? Object.values(img_list).filter(item => typeof item == 'string') : ''
        p.liked = await this.hasLiked(post)

        let found = this.posts.find(item => item.did == post.did)
        if(found){
          
          console.log({found})

          let index = this.posts.findIndex(item => item.did == found.did)
          // console.log({found})
          // remove the old ones, add the new one
          this.posts.splice(index,1)
          this.posts.push(p)
        }
        else {
          this.posts.push(p)
        }

        // console.log(p.did, p)
      })
    
      

    },
    async hasLiked(post){
      if(post.reactions){
        let ref = await this.$gun
          // .get('elections')
          // .get(post.erf)
          .get('posts')
          .get(post.did)
          .get('reactions')
          .get(this.getUser.username)
          .then()
        
        return !!ref
      }
      else {
        return false
      }
    },
    
  },
  mounted(){
    this.$eventBus.$on('HideNewPostDialog', ()=>{
      this.new_post_dialog = false
    })
    
    this.showUi = true

    if(this.curRoom){
      
      this.latestPosts()
      // console.log(this.curRoom)
    }

    if(this.$route.query.new){
      if(this.isSuperUser){
        this.new_post_dialog = true
      }
    }

    window.onscroll = () =>{
      
      setTimeout(() => {
        
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

          this.lower_bound = this.upper_bound
          this.upper_bound = this.upper_bound + this.increment

          this.latestPosts()
        }
      }, 200)

      // debounce(() =>{

      // }, 100)

      
    }
    
  },
  destroyed(){
    // this.campRef()
  }
}

import PostTemplate from '@/components/feed/PostTemplate'
import WelcomePostTemplate from '@/components/feed/WelcomePostTemplate'
import NewPost from '@/components/feed/NewPost'
import msgdown from 'msgdown'
// import CampaignsList from '@/components/campaigns/CampaignsList'

// import {uniq} from 'lodash'
// import ListEvents from '@/components/events/ListEvents'
import {mapGetters, mapState} from 'vuex'
// import {firebase, db, database} from '@/plugins/firebase'

</script>
<style lang="scss" scoped>
  @mixin borderTopRadius($radius) {
    border-top-right-radius: $radius;
    -webkit-border-top-right-radius:$radius;
    -moz-border-top-right-radius:$radius;
    -o-border--top-right-radius:$radius;
    border-top-left-radius: $radius;
    -webkit-border-top-left-radius:$radius;
    -moz-border-top-left-radius:$radius;
    -o-border--top-left-radius:$radius;
  }

  .v-card {
    box-shadow: 0 1px 2px rgba(0,0,0,.3);
  }
  
  a{
    text-decoration: none;
  }
  .linkify{
    cursor: pointer;
  }
  
  .emojis{
    font-size: 22px;
  }
  .wireframe::after{
    content: '';
    position: absolute;
    width: 40%;
    height: 12px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255,255,255, 15%), rgba(0, 0, 0, 0));
    transform: translateX(-10%);
    animation: loading 1.5s infinite;
  }

  .round_top{
    @include borderTopRadius(10px);
  }
  #more_images{
    height: 200px;
    position: absolute;
    width: 100px;
    top: 27%;
    right: 15px;
    background-color: rgba(0, 0, 0, 0.7);
  }
  @keyframes loading{
    100%{
      transform: translateX(100%)
    }
  }
</style>
