<template>
  <div style="overflow:hidden;" class="navdrawr">
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Forum</span>
      <template slot="nav_item" 
        v-if="$vuetify.breakpoint.smAndDown">

        <v-divider vertical class="ml-3"></v-divider>
        <v-btn color="info" text :to="`/forum/${forumId}/members`">
          Members
        </v-btn>
      </template>
    </navigation>

    
    <chatwindow 
      :members='members' 
      :loading_messages="loading_messages">
    </chatwindow>

    <v-footer v-if="showUi" app inset>
      <chat-input-box 
        :forumId="forumId"
        :members="members"/>
    </v-footer>
      

    <v-dialog
      v-model="members_dialog"
      fullscreen 
      persistent :overlay="false"
      v-if="$vuetify.breakpoint.smAndDown"
      transition="dialog-bottom-transition"
    >
      <v-card tile flat>
        <v-toolbar flat dense dark color="primary">
          <v-icon @click="members_dialog = false" class="mr-2">mdi-chevron-left</v-icon>
          <v-toolbar-title>Forum Members</v-toolbar-title>
        </v-toolbar>
        <router-view 
          :members='members' 
          v-if="showUi" 
        >
        </router-view>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
export default {
  data: ()=>({
    password: 'Password',
    drawerRight: true,
    model: 'Chat',
    text_label: 'You cannot send messages in this forum',
    showUi: false,
    loading_messages: true,
    message: "",
    members_dialog: false,
    members: [],
    suspended: [], // suspended voters and contestants
    updateRef: '', // stop listening for updates
    membersRfef: '', // stop listening for updates
  }),
  watch: {
    
    forumId: function(){
      this.loading_messages = true
      this.initialize()
    }
  },
  computed: {
    
    title(){
      return `Forum | ${this.$appName}`
    },
    forumId(){
      return this.$route.params.forumId
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    styleChat(){
      if(this.breakpoint.smAndDown){
        return {height: 'calc(100vh - 124px)', overflowY: 'auto', overflowX: 'hidden'}
      }else{
        return {height: 'calc(100vh - 140px)', overflowY: 'auto', overflowX: 'hidden'}
      }
    },
    
  },

  methods: {
    
    async initialize(){
      
      if(this.forumId){

        this.loading_messages = false

        setTimeout(() => {
          this.scrollChat()
        }, 1000);

        // this.members = []
        // await this.retrieveMembers()

        this.showUi = true;
        
      }
      else{
        // this.$router.push('/home')
      }
    },
    scrollChat(){
       let doc = document.getElementById('chat_space_content')
      doc ? doc.scroll({
        top: doc.scrollHeight,
        behavior: 'smooth'
      }) : ''
    },
    async getSuspended(){
      // get suspended members
      
    },
    
    
  },
  mounted(){

    // this.$eventBus.$emit('Hide_Left_Drawer')
    
  },
  created() {
    
    this.initialize()

    // this.$eventBus.$on('Toggle_drawerRight', data=>{
    //   this.drawerRight = data
    //   this.model = 'Members'
    // })

  },
  components:{
    'chatwindow': Chatwindow,
    // 'users': ForumUsers,
    // LoadingBar,
    // EmojiPicker,
    // Conversations,
    ChatInputBox
  }
}

// import {mapGetters, mapState} from 'vuex'
  // import ForumUsers from '@/components/forum/ForumUsers'
  import Chatwindow from '@/components/forum/Chatwindow'
  // import LoadingBar from '@/spinners/LoadingBar'
  // import EmojiPicker from '@/components/emojis/EmojiPicker'
  // import Conversations from "@/components/forum/Conversations"
  import ChatInputBox from "@/components/forum/ChatInputBox"
  // import down from 'msgdown'
</script>
<style lang="scss" scoped>
.v-content{
  padding-top:0 !important;
}
@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size: cover;
  background-position: center;
  //background-color: #00aabb;
}


</style>

