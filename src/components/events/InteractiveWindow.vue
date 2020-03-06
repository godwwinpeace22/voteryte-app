<template>
  <loading-bar v-if='loading_messages' height="75vh">
    <v-subheader slot='loading_info' class='mx-auto' style='display: table'>Loading messages...</v-subheader>
  </loading-bar>

  
  <div v-else style="background:#fff;" class="pa-0 px-1 chat_home" id="chat_home">
    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" 
      class="white--text" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <!-- NO DATA -->
    <v-subheader class="text-xs-center" v-if="!msgs || msgs.length == 0">No recent messages yet. Be the first to write a message</v-subheader>
    
    <div flat id="chat_space">
      
      <div class="chat_space_content" id="chat_space_content"
        v-if="msgs.length > 0 && $vuetify.breakpoint.mdAndUp"
        style="background: white;" :style="styleForChatSpaceContent">

        <v-btn flat small @click="moreMessages()"
          color="secondary" v-if="offset != null && msgs.length <! 25"
          class="d-block mx-auto text-capitalize" 
          :loading="loading_more_msgs">
          See older messages
        </v-btn>

        <div v-for="(msg,i) in msgs" :key="i">
          <!-- DATE DIVIDER -->
          <div v-if="divide(msg.tstamp, msgs[i-1])" class="divide">
            {{divide(msg.tstamp, msgs[i-1])}}
          </div>

          <div class="chat_rectangle ">

            <div class="chat_avartar">
              <v-avatar
                size="40" tile
                :color="$helpers.colorMinder(msg.onr.name.charAt(0))"
              >
                <img v-if="msg.onr.photoURL" :src="msg.onr.photoURL" alt="alt">
                <span v-else class="white--text">{{msg.onr.name.charAt(0)}}</span>
              </v-avatar>
            </div>
            
            <div class="chat_content">
              <div style="width:100%;margin-top:0px;margin-bottom:0px;">
                <span class="text-capitalize" v-if="msg.onr.uid != getUser.uid " style="font-size:15px;margin-right:5px;">
                  <a class="black--text font-weight-bold" @click.prevent="''">
                  {{msg.onr.name}}</a>
                </span>
                <span v-else style="margin-right:5px;" class="font-weight-bold"><strong>You  </strong></span>
                <span style="font-size:.83em;color:#555;" color="grey lighten-5">
                  {{$helpers.parseDate(msg.tstamp)}}
                </span>
              </div>
              
              <div style="width:100%;">

                <!-- the spice of life -->
                <div v-html="$sanitize(msg.body)" v-linkified:options="linkify_options"></div>
                

                <!-- UPLOADED IMAGES -->
                <v-container grid-list-md v-if="msg.imgs">
                  <v-layout row wrap justify-center>
                    <v-flex v-for="(image,i) in msg.imgs.slice(0,3)" :key="i"
                      :class="{'xs3': msg.imgs.length >=3,'xs6': msg.imgs.length < 3}">
                      <v-card class="mb-1" flat id="msg_img"
                        max-height="500px" :height="$vuetify.breakpoint.xsOnly ? 100 : '200'">
                        <v-img :src='image' :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" height="100%" max-height="500px" @click="carouselDialog(msg.imgs,i)">
                          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-layout>
                        </v-img>
                      </v-card>
                    </v-flex>
                    <v-flex xs3>
                      <v-card id="more_images" v-if="msg.imgs.length >= 4"
                        :height="msg.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" 
                        class="mb-3 linkify" dark @click="carouselDialog(msg.imgs, 3)">
                        <div class="title text-xs-center" style="padding-top: 55%;">+ {{msg.imgs.length - 3}} more</div>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
              
            </div>
          </div>

        </div>
      </div>

      <div v-if="msgs.length > 0 && $vuetify.breakpoint.smAndDown" class="chat_space_content"
        :style="styleForChatSpaceContent">
       
        <v-btn flat small @click="moreMessages()"
          color="secondary" v-if="offset != null"
          class="d-block mx-auto text-capitalize" 
          :loading="loading_more_msgs">
          See older messages
        </v-btn>

        <template v-for="(msg,i) in msgs">
          <div v-if="divide(msg.tstamp, msgs[i-1])" class="divide" :key="i">
            {{divide(msg.tstamp, msgs[i-1])}}
          </div>

          <div class="me" v-if="msg.onr.uid == getUser.uid" :key="i + 'me'">
            <div class="me_inner elevation-1" :class="[msg.imgs ? 'msg_inner_imgs': 'msg_inner']">
              <div class="body">
                <div v-html="$sanitize(msg.body)" v-linkified:options="linkify_options"></div>
                <!-- the spice of life -->

                <!-- UPLOADED IMAGES -->
                <v-container grid-list-xs v-if="msg.imgs">
                  <v-layout row wrap justify-center>
                    <v-flex v-for="(image,i) in msg.imgs.slice(0,3)" :key="i"
                      :class="{'xs3': msg.imgs.length >=3,'xs6': msg.imgs.length < 3}">
                      <v-card class="mb-1" flat id="msg_img"
                        max-height="500px" :height="$vuetify.breakpoint.xsOnly ? 100 : '200'">
                        <v-img :src='image' :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" height="100%" max-height="500px" @click="carouselDialog(msg.imgs,i)">
                          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-layout>
                        </v-img>
                      </v-card>
                    </v-flex>
                    <v-flex xs3>
                      <v-card id="more_images" v-if="msg.imgs.length >= 4"
                        :height="msg.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" 
                        class="mb-3 linkify" dark @click="carouselDialog(msg.imgs, 3)">
                        <div class="title text-xs-center" style="padding-top: 55%;"><small>+ {{msg.imgs.length - 3}} more</small></div>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
              <div class="meta2">
                {{(new Date(msg.tstamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) }}
              </div>
            </div>
          </div>

          <div class="thm" v-else :key="i + 'thm'">
            <div class="thm_inner elevation-1" :class="[msg.imgs ? 'msg_inner_imgs': 'msg_inner']">
              <div class="meta1 text-capitalize" :class="[$helpers.colorMinder(msg.onr.name.charAt(0)) + '--text']">
                {{msg.onr.name}}
              </div>
              <div class="body">
                <!-- the spice of life -->
                <div v-html="$sanitize(msg.body)" v-linkified:options="linkify_options"></div>

                <!-- UPLOADED IMAGES -->
                <v-container grid-list-xs v-if="msg.imgs">
                  <v-layout row wrap justify-center>
                    <v-flex v-for="(image,i) in msg.imgs.slice(0,3)" :key="i"
                      :class="{'xs3': msg.imgs.length >=3,'xs6': msg.imgs.length < 3}">
                      <v-card class="mb-1" flat id="msg_img"
                        max-height="500px" :height="$vuetify.breakpoint.xsOnly ? 100 : '200'">
                        <v-img :src='image' :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" height="100%" max-height="500px" @click="carouselDialog(msg.imgs,i)">
                          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-layout>
                        </v-img>
                      </v-card>
                    </v-flex>
                    <v-flex xs3>
                      <v-card id="more_images" v-if="msg.imgs.length >= 4"
                        :height="msg.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" 
                        class="mb-3 linkify" dark @click="carouselDialog(msg.imgs, 3)">
                        <div class="title text-xs-center" style="padding-top: 55%;"><small>+ {{msg.imgs.length - 3}} more</small></div>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
              <div class="meta2">
                <strong>{{(new Date(msg.tstamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) }}</strong>
              </div>
            </div>
          </div>

        </template>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  data:()=>({
    show_reactions: false,
    reactions: {}, // temp holds reactions for quick feedback
    snackbar: {},
    loading_messages: false,
    msgs: [],
    carousel_images: [],
    onboarding: 0,
    drawer: null,
    message: 'Type a message',
    chat_messages: [],
    offset: '',
    loading_more_msgs: false,
    updateRef: '',
  }),
  props:['eventId','tabs-value'],
  watch:{
    'tabsValue': function(to, from){
      if(to == 'tab-2') {

        this.msgs.length == 0 ? this.chatUpdate() : ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    isAdmin(){
      return this.curRoom.admins.includes(this.getUser.uid)
    },
    styleForChatSpaceContent(){
    
      return { height: '100%'}
    },
    linkify_options(){
      return {
        className: 'linkified',
        events: {
          click: function (e) {
          },
          mouseover: function (e) {
           return e
          }
        },
        ignoreTags: [
          'script',
          'style'
        ],
        format: (value, type) => {
          if (type === 'url' && value.length > 50) {
            value = value.slice(0, 50) + '…';
          }
          
          return value;
        },
        formatHref: {
          mention: (href) => {

            return `${location.origin}/#/events/${this.eventId}/#${href.substring(1)}`;
            
          },
          hashtag: (href) => {
            return `${location.origin}/#/events/${this.eventId}/#${href.substring(1)}`;
          }
        },
        nl2br: true,
      }
    },
  },

  methods: {
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
    scroll(e){
      let scrolled_to_bottom = e.target.scrollTop === (e.target.scrollHeight - e.target.offsetHeight)
      let scrolled_to_top = e.target.scrollTop === 0
      // console.log(e.target.offsetHeight/6)
      if(scrolled_to_bottom){
        // console.log('scrolled to bottom')
      }
      if(scrolled_to_top){
        // console.log('scrolled to top')
        // this.moreMessages(e)
        
        
      }
    },
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

      if(prev && prev.tstamp){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.tstamp)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          let today = new Date()
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
   
    scrollChat(){
       let doc = document.getElementById('chat_space_content')
      //  console.log(doc)
      doc ? doc.scroll({
        top: doc.scrollHeight,
        behavior: 'smooth'
      }) : ''
    },
    moreMessages(e){
      if(this.offset != undefined){
        this.loading_more_msgs = true

        db.collection('chat_messages')
          .where('elecRef','==',this.curRoom.electionId)
          .orderBy('tstamp', 'desc')
          .startAfter(this.offset)
          .limit(25).get().then(querySnapshot =>{
            let msgs = []
            querySnapshot.forEach(doc =>{
              msgs.unshift(doc.data())
            })
            this.offset = querySnapshot.docs[querySnapshot.docs.length - 1]
            
            this.loading_more_msgs = false
            setTimeout(() => {
              this.scrollChat()
            }, 1000);
          })
      }
    },
    chatUpdate(){
      
      let msgs = []
      if(this.curRoom){
        this.updateRef = db.collection('event_messages')
        .where('eventId','==',this.eventId)
        .orderBy('tstamp', 'desc')
        .limit(25)
        .onSnapshot(snapshot=>{
          
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
              // console.log("New", change.doc.data());
              msgs.push(change.doc.data())
            }
        })

          this.offset = snapshot.docs[snapshot.docs.length - 1]
          this.msgs = msgs.sort((a,b) => a.tstamp - b.tstamp)
          // this.$store.dispatch('eventMsgs', msgs)
          this.loading_messages = false

          setTimeout(() => {
              this.scrollChat()
          }, 1000);
        })
      }
    },
  },
  destroyed(){
    // this.chatUpdate()
  },
  components:{
    LoadingBar,
    //'users':Users,
  }
}
import {mapGetters, mapState} from 'vuex'
  import LoadingBar from '@/spinners/LoadingBar'
  import * as linkify from 'linkifyjs';;
  import hashtag from 'linkifyjs/plugins/hashtag';
  import mention from 'linkifyjs/plugins/mention';
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
  color:$secondary;
}

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size: cover;
  background-position: center;
  height: 100%;
  background: #f3f2f1;
  //background-color: #00aabb;
}
#chat_home {
  position: absolute;
  height: calc(100% - 100px);
  width: 100%;
  overflow-y: auto;
}
.chat_avartar{
  width: 40px;
  height: 40px;
  border-radius: 5px;
  //float:left;
  //display:inline-block;
  margin-right: 1%;
  float: left;
  img{
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
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
  display: table;
  padding: 5px;
  margin: auto;
  @include borderRadius(8px);
  background: oldlace;
  font-weight: bold;
  text-align: center;
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
  height: 100%;
}
// .chat_space_content, #chat_space:hover, #chat_space:focus {
//   visibility: visible;
// }

#msg_img:hover{
  cursor: pointer;
}
/* --scrollbar --*/
.chat_space::-webkit-scrollbar {
    width: 8px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
  .thin_scrollbar::-webkit-scrollbar{
    width: 2px;
  }
.chat_space::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #fff;
  // @include borderRadius(10px)
}
.chat_space::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
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