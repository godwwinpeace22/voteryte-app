<template>
  <loading-bar v-if='loading_messages' height="75vh">
    <v-subheader slot='loading_info' class='mx-auto' style='display: table'>Loading messages...</v-subheader>
  </loading-bar>

  
  <v-container fluid v-else style="background:#fff;" class="pa-0 px-1">

    <div class="text-center" v-show="forumId == 'd'">
      Select a forum to start a conversation
    </div>
    
    <!-- NO DATA -->
    <div class="text-center" 
      v-if="forumId != 'd' && (!getChatMessages || getChatMessages.length == 0)">
      No recent messages yet. Be the first to write a message
    </div>

    <!-- LOAD PREVIOUS -->
    <!-- <v-btn text small @click="moreMessages()"
      color="primary" v-if="!isLastDoc && getChatMessages.length >= 4"
      class="d-block mx-auto text-capitalize" 
      :loading="loading_more_msgs">
      See older messages
    </v-btn> -->
    
    <v-row>
      
      <v-col cols="12" v-for="(msg,i) in getChatMessages" :key="i" class="py-0">
        
        <!-- DATE DIVIDER -->
        <div v-if="divide(msg.date_created, getChatMessages[i-1])" class="divide">
          {{divide(msg.date_created, getChatMessages[i-1])}}
        </div>

        <v-divider class="my-2 mx-4" v-else></v-divider>
        <v-card flat class="msg-block px-3">

          <div class="d-inline-block msg-avatar mr-5">
            <v-avatar
              size="40" 
              :color="$helpers.colorMinder(msg.author.name.charAt(0))">
              <img v-if="msg.author.photoURL" :src="msg.author.photoURL" alt="alt">
              <span v-else class="white--text">{{msg.author.name.charAt(0)}}</span>
            </v-avatar>
          </div>

          <div class="d-inline-block msg-text">
            <div class="msg-meta">
              <span class="pr-3 font-weight-bold">{{msg.author.name}}</span>
              <!-- <span>@{{msg.author.username}}</span> -->
              <small class="grey--text">{{$helpers.parseDate(msg.date_created)}}</small>
            </div>
            <div class="msg-body">

              <div class="msg-floating-action">
                <v-btn icon @click="selectEmoji($event, msg)" :id="msg.docId">
                  <v-icon color="success">mdi-emoticon-outline</v-icon>
                </v-btn>

                
              </div>

              <div v-html="msg.body" v-linkified:options="linkify_options"></div>

              <!-- UPLOADED IMAGES -->
              <v-row v-if="msg.imgs && msg.imgs.length > 0">
                <v-col cols="12" sm="8">
                  <image-grid :imgs="msg.imgs"/>
                </v-col>
              </v-row>

              <template v-for="(k,v, i) in msg.reactions">
                <v-tooltip :key="i + '-emoji'" top left>
                  <template v-slot:activator="{on}">
                    <v-chip small outlined label 
                      class="mr-2 mb-2 linkify" v-on="on"
                      @click="reactFromBtn(msg,v)">
                      <span class="mr-1">{{v}}</span>
                      <span>{{k.length}}</span>
                    </v-chip>
                  </template>

                  <span>{{getReactors(k)}}</span>
                  
                </v-tooltip>

              </template>

              
            </div>
          </div>
        </v-card>

      </v-col>

      <v-menu max-width="300"
        max-height="500" top offset-y 
        v-model="emoji_dialog" :close-on-content-click="false"
        absolute :position-x="selectedMsg.x"
        :position-y="selectedMsg.y"
      >
        
        <emoji-picker @append-emoji="react"/>
        
      </v-menu>

    </v-row>

  </v-container>
</template>

<script>

export default {
  data:()=>({
    show_reactions: false,
    reactions: {}, // temp holds reactions for quick feedback
    snackbar: {},
    drawer: null,
    message: 'Type a message',
    emoji_dialog: false,
    chat_messages: [],
    isLastDoc: false,
    loading_more_msgs: false,
    chatRef: '',
    selectedMsg: '',
    allReactions: [],
    // loading_messages: true,
  }),
  props:['members', 'loading_messages', 'electionId', 'eventId'],
  watch:{
    $route: function(e){
      
      if(e.name == 'profile'){
        this.$eventBus.$emit('Toggle_drawerRight', true)
      }
      
    },
    '$route.hash': function(e){
      let member = this.members.find(m => m.username == e.slice(1))
      if(member){
        this.$store.dispatch('openProfile', member)
      }
    },
    'selectedProfile': function(e){
      if(!e.name && this.$route.hash){
        
        this.$router.push(`/forum/${this.forumId}`)
      }
    },
    'forumId': function(to){
      if(to != 'd'){
        // console.log({to})
        // this.chatRef.off ? this.chatRef.off() : ''
        
        this.$eventBus.$emit('Overlay', {
          show: true,
          opacity: .5
        })

        setTimeout(() => this.$eventBus.$emit('Overlay', {
          show: false,
          opacity: .3
        }), 1000)

        this.getMessages()
      }
    },
    chat_messages(to){
      
      window.scrollTo(0, document.body.offsetHeight)
      console.log(to)
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      // 'getChatMessages'
    ]),
    ...mapState([
      'isSuperUser',
      'selectedProfile'
    ]),
    forumId(){
      return this.electionId ? this.electionId : this.$route.params.forumId
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    linkify_options(){
      return {
        className: 'linkified',
        
        ignoreTags: [
          'script',
          'style'
        ],
        format: (value, type) => {
          if (type === 'url' && value.length > 50) {
            value = value.slice(0, 50) + '…';
          }
          if(type === 'mention'){
            let found = this.members.find(member => member.username == value.substring(1))
            value = found ? '@' + found.username : value
          }
          return value;
        },
        formatHref: {
          mention: (href) => {
            let member = this.members.find(member => member.username == href.substring(1))
            if(member){

              return `${location.origin}/forum/${this.forumId}#${member.username}`;
            }
            else {
              return `${location.origin}/forum/${this.forumId}#${href.substring(1)}`;
            }
          },
          hashtag: (href) => {
            return location.origin + '/forum/#' + href.substring(1);
          }
        },
        nl2br: true,
      }
    },
    getChatMessages(){
     // eslint-disable-next-line vue/no-side-effects-in-computed-properties
     let sorted = this.chat_messages.sort((a,b) => a.date_created - b.date_created)
     .filter(msg => msg.elecRef == this.forumId)
  
     // remove duplicates caused by push
     return sorted.reduce((acc, cur) => [
        ...acc.filter((msg) => msg.docId !== cur.docId), cur
      ], []);
    },
  },

  methods: {
    getRep(chat){
      return chat.replace(/@([\w]+)/g,'<router-link to="/tag/$1">#$1</router-link>')
    },
    divide(timestamp,prev){
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.date_created){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.date_created)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          // let today = new Date()
          if((new Date()).toLocaleString('en-Us',options) == that_day){
            return 'Today'
          }
          // showing 'yesterday'
          else if(Date.now() - timestamp <= 2* 24 * 60 * 60 * 1000){
            return 'Yesterday'
          }
          // showing other days
          else{
            return that_day2
          }
          
          
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
    moreMessages(){
      // get messages within the last hour
      // if the messages are less than some threshold,
    },
    getMessages(){
      // get recent chats
      // console.log(this.members)
      let twentyfourHrs = 24*60*60*1000
      let one_day_ago = Date.now() - twentyfourHrs

      this.chat_messages = []
      let chatRef = this.eventId ? this.$gun.get('event_chats')
        .get(this.eventId) :
        
        this.$gun.get('chats')
        .get(this.forumId)
        
        chatRef.map(item => item.date_created >= one_day_ago ? item : undefined)
        .on( async msg => {

          console.log({msg}, this.chat_messages)
          let m = Object.assign({}, msg, this.chat_messages)

          m.author = await this.$gun.get('users').get(msg.author).then()

          let img_list = msg.imgs ? await this.$gun.get(msg.imgs['#']).then() : false
          m.imgs = img_list ? Object.values(img_list).filter(item => typeof item == 'string') : ''
          // console.log({img_list})

          this.chat_messages.push(m)
          // console.log(this.chat_messages)

          // let arr = []
          // for (const msg of Object.values(msgs)) {
          //   // get author
          //   let c = Object.assign({}, msg)
          //   c.author = await this.$gun.get('users').get(msg.author).then()
          //   let groupd = groupBy(Object.values(msg.reactions), 'a')
          //   // console.log(groupd)
          //   c.reactions = groupd
          //   c.imgs = msg.imgs ? Object.values(msg.imgs) : []

          //   arr.push(c)

          // }

          
          
        })

        // console.log(this.forumId, this.chat_messages)
      
    },
    getReactors(k){
      let o = Object.values(k).map(p => p.u)
      // console.log(uniq(o).join(', '))
      let uniqs = uniq(o)

      if(uniqs.length <= 5){
        return uniqs.join(', ')
      }
      else {
        return `${uniqs.slice(0,5)} and ${uniqs.length - 5} others`
      }
      // return uniqs.join(', ')
    },
    selectEmoji(e, msg){
      let msg2 = Object.assign({}, msg)

      // console.log(e)
      e.preventDefault()
      
      msg2.x = e.clientX
      msg2.y = e.clientY
      this.$nextTick(() => {
        
        this.selectedMsg = msg2;
        this.emoji_dialog = true;
      })
    },
    reactFromBtn(msg,rxn){
      // add a reaction when you click the reaction chips/buttons
      this.selectedMsg = msg
      this.react(rxn, 'from')

    },
    async react(e, from){
      
      let addRxn  = ()=>{
        let ref = this.eventId ?
        this.$gun.get('event_chats')
        .get(this.eventId)
        .get(this.selectedMsg.docId)
        .get('reactions') : 

        
        this.$gun.get('chat_messages')
          .get(this.forumId)
          .get(this.selectedMsg.docId)
          .get('reactions')


          ref.set({
            u: this.getUser.username,
            a: e,
          })
          

          this.emoji_dialog = false
      }
      
      if(!from){
        // check if msg has too many reactions
        if (Object.values(this.selectedMsg.reactions).length > 24){
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Sorry, this message already has too many reactions.',
            color: 'info',
          })
          // console.log('too much')

          return 
        }
        
      }

      // first check if user has reacted
      let the_reaction = this.selectedMsg.reactions[e]

      if(the_reaction){
        // the reaction has been made by at least one person

        let found = the_reaction.find(r => r.u == this.getUser.username)
        console.log({found})
        if(found){
          // user has already made this reaction - do nothing
        }
        else {
          // user has not made this reaction
          addRxn()
        }
      }
      else {
        // the reaction has not been made by anyone
        addRxn()
      }

      
    }
  },
  mounted() {

    if(this.forumId != 'd'){
      this.getMessages()
      
    }
  },
  destroyed(){
    // this.chatUpdate()
  },
  components:{
    LoadingBar,
    ImageGrid,
    EmojiPicker,
  }
}
import {mapGetters, mapState} from 'vuex'
  import LoadingBar from '@/spinners/LoadingBar'
  import ImageGrid from '@/components/ImageGrid'
  import EmojiPicker from '@/components/emojis/EmojiPicker'
  import * as linkify from 'linkifyjs';
  import hashtag from 'linkifyjs/plugins/hashtag';
  import mention from 'linkifyjs/plugins/mention';
  import { groupBy, uniq } from 'lodash'
  hashtag(linkify)
  mention(linkify)
</script>
<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor: #1c1f35;
$secondary: #1867c0;

a{
  color: $secondary;
}

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size: cover;
  background-position: center;
  height: 100%;
  background: #f3f2f1;
  //background-color: #00aabb;
}
.msg-avatar{
  float: left;
}
.msg-text {
  float: left;
  width: 80%;
}
.msg-block {
  clear: both;
  overflow: auto;
  min-height: 60px;
}

.msg-floating-action {
  position: absolute;
  right: 15px;
  visibility: hidden;
}

.msg-block:hover .msg-floating-action {
  visibility: visible;
}

.me, .thm {
  width: 97vw;
  // background: blue;
  overflow: auto;
  margin: 15px 0px 15px 0px;
}
.msg_inner {
  min-width: 50px;
  max-width: 85%;
  // width: 100%;
  padding: 10px;
  display: block;
  position: relative;
  @include borderRadius(10px);
  border-top-right-radius: 0px;
}
.msg_inner_imgs {
  min-width: 50px;
  max-width: 85%;
  width: 100%;
  padding: 10px;
  display: block;
  position: relative;
  @include borderRadius(10px);
  border-top-right-radius: 0px;
}

.me_inner {
  background: #e5f9cd;
  text-align: right;
  margin-right: 15px;
  margin-bottom: 10px;
  float: right;
}

.me_inner:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid #e5f9cd;
  border-right: 10px solid transparent;
  border-top: 10px solid #e5f9cd;
  border-bottom: 10px solid transparent;
  right: -19px;
  top: 6px;
}

.thm_inner {
  background: white;
  text-align: left;
  margin-left: 15px;
  float: left;
  margin-bottom: 2px;
}

.thm_inner:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #fff;
  border-top: 10px solid #fff;
  border-bottom: 10px solid transparent;
  left: -19px;
  top: 6px;
}
@media (min-width: 960){
  .chat_avartar{
    margin-right: 2%;
  }
}
.chat_content{
  display: inline-block;
  //background:yellow;
  width: calc(100% - 50px);
  min-height: 40px;
}
.chat_details {
  width: 100%;
  margin-top: 0px;
  margin-bottom: 0px;
}
.chat_rectangle {
  padding: 5px 15px;
  margin-bottom: 5px;
	//position: relative;
	//background: #00aabb;
	text-align: left;
  text-overflow: wrap;
  width: 100%;
  word-wrap: break-word;
  &:hover{
    background-color: rgb(241, 241, 241);
  }
  a{
    text-decoration: none;
    color: #00aabb;
  }
}

.divide {
  display: flex;
  padding-bottom: 15px;
  padding-top: 15px;
  // margin: auto;
  @include borderRadius(8px);
  // background: oldlace;
  font-weight: bold;
  text-align: center;
  align-items: center;
  line-height: 22px;
  box-align: center;
  -ms-flex-align: center;
}
.divide:before {
  content: "";
  margin: 0 15px;
  background-color: #ccc;
  height: 1px;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  right: 100%;
  margin-right: 8px;
}
.divide:after {
  content: "";
  margin: 0 15px;
  background-color: #ccc;
  height: 1px;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  left: 100%;
  margin-left: 8px;
}

#moderator_actions{
  float:right;
  margin-top: -30px;
  margin-right:-16px;
  display:none;
}
.chat_rectangle:hover #moderator_actions{
  display:block;
}

#chat_space{
  height: 100%;
}
.chat_space_content {
  background: #f3f2f1;
  overflow: auto;
  // height: 100%;
}
// .chat_space_content, #chat_space:hover, #chat_space:focus {
//   visibility: visible;
// }

#msg_img:hover{
  cursor: pointer;
}
/* --scrollbar --*/
.chat_home::-webkit-scrollbar {
    width: 9px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }

  .thin_scrollbar::-webkit-scrollbar{
    width: 2px;
  }
.chat_home::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: transparent;
  // @include borderRadius(10px)
}
.chat_home::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
  border-radius: 10px;
  background-color: rgba(100,100,100,.2);
  margin-right: 1px;
  -webkit-transition: opacity .3s ease-in-out;
  transition: opacity .3s ease-in-out;
}
.show_reactions{
  position: relative;
  width:50px;
  width:fit-content;
  display:inline-block;
  &:hover .reactions{
    display:block;
    
  }
}
.reactions{
  display:none;
  position: absolute;
  z-index: 1;
  top:-90%;
  width:280px;
  height: 40px;
  @include borderRadius(10px);
  //opacity: .8;
  background: #d4d4d4;
}
.emojis{
  font-size: 22px;
}
</style>