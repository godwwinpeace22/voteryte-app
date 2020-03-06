<template>
  <div class="mb-3">
    <navigation v-if="$vuetify.breakpoint.smAndDown">
      <v-btn icon
        @click.native="$router.back()" 
        slot="back_button"
        >
        
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span slot="title">Forum members</span>
    </navigation>
    <v-card flat tile outlined min-width="100%" class="pt-4">
      
      <v-text-field hide-details dense v-model="search"
        prepend-inner-icon="mdi-account-search" color="primary"
        label="Search members..." class=" px-2" solo flat
      ></v-text-field>
      
      <v-list>
        <template v-for="member in filteredList">
          
          <v-divider :key="member.username + 'l'"></v-divider>
          <v-list-item :key="member.uid" :to="'/users/' + member.username">
            <v-list-item-avatar 
              :color="$helpers.colorMinder(member.name.charAt(0))">
              <v-img src="member.photoURL" v-if="member.photoURL"></v-img>
              <span v-else class="white--text headline">{{member.name.charAt(0)}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{member.name}}
              </v-list-item-title>
              <v-list-item-subtitle>
                @{{member.username}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </template>
      </v-list>
    </v-card>
  </div>
</template>
<script>
export default {
  data:()=>({
    search:'',
    //onlineMembers:[],
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    isLastDoc: false,
    loading_more_members: false,
    profile_menu: false,
    selected_profile: {},
    members: []
  }),
  computed: {
    filteredList() {
      
      if(this.members && this.members.length > 0){

        // >>>=== inefficient code ===<<<

        //console.log(this.members)
        // let those online appear first, at the top
        // let online = []
        // let offline = []
        // this.members.forEach(m=>{
        //   m.online ? online.push(m) : offline.push(m)
        // })

        // let sortedByOnline = [...online, ...offline]


        return this.members.filter(member => {
          return member.name.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      else{return []}
    },
    ...mapGetters([
      'getUser'
    ]),
    forumId(){
      return this.$route.params.forumId
    }
  },
  methods:{
    
    checkProfile(){
      this.$eventBus.$emit('show_right_sidebar','profile');
    },
    retrieveMembers(){
      // get all voters in an election
      
      this.$gun.get('elections')
        .get(this.forumId)
        .get('voters')
        .map()
        .on(async (data) => {
          
          // console.log({data, k})

          // let m = await this.$gun.get('users').get(k).then()
          let memberIndex = this.members.findIndex(m => m.username == data.username)
          
          if(memberIndex == -1){
            this.members.push(data)
          }
          else {
            this.members.splice(memberIndex, 1)
            this.members.push(data)
          }
          
        })

    },
  },
  async mounted(){
    this.retrieveMembers()
  },

  destroyed(){
    //this.$eventBus.$emit('show_right_sidebar',null);
  },
  components:{
  }
}
//import api from '@/services/api'
import {mapGetters} from 'vuex'
</script>

<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  .linkify {
    cursor: pointer;
  }
  // .menu_tabs{
  //   .v-tabs__div{
  //     text-transform:capitalize
  //   }
  //   .v-list__tile{
  //     font-size: 14px;
  //   }
  // }
  .online_badge{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }

.forum-members {
  // width: 100%;
  height: calc(100vh - 102px);
}

.navdrawr {
  width: 100%;
}
  /* --style the scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 8px;
    background-color: #87899c ;
    @include borderRadius(10px)
  }
  .thin_scrollbar::-webkit-scrollbar{
    width: 2px;
  }
.navdrawr::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #fff ;
  // @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
