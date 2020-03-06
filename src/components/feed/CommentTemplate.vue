<template>
  <div class="post-template">
    
    <template v-for="(post,i) in uniqPosts">
      <article 
        flat class="post__wrapper pa-4"
        :key="i + '_posts'"
      >

        <div class="d-inline-block post__avatar mr-3">
          <v-avatar
            size="40"
            tile
            :color="$helpers.colorMinder(post.a.name.charAt(0))">
            <img v-if="post.a.photoURL" :src="post.a.photoURL" alt="alt">
            <span v-else class="white--text">{{post.a.name.charAt(0)}}</span>
          </v-avatar>
        </div>

        <div class="d-inline-block post__content">
          <div class="post-meta">
            <span 
              class="pr-2 font-weight-bold linkify" 
              @click="visitProfile(post.a.username)">
              {{post.a.name}}
            </span>
            <span class="pr-3">@{{post.a.username}}</span>
            <small class="grey--text">{{$helpers.parseDate(post.tstamp)}}</small>
          </div>
          <div class="post__body">

            <div class="replying_to">
              <span>Replying to </span>
              <router-link :to="`/users/${post.ppa}`"  >
                @{{post.ppa}}
              </router-link>
            </div>

            <div 
              v-if="!single_post_view" 
              class="linkify" 
              @click="$router.push(`/posts/${post['_']['#']}`)">

              <span v-html="$helpers.truncateText(post.b, 300)"
                v-linkified:options="linkify_options"></span>
          
              <!-- <span @click="$router.push(`/posts/${post['_']['#']}`)" 
                class="primary--text linkify pl-2" 
                style="text-decoration:none;"
                v-show="post.b.length > 300">
                Read more
              </span> -->
            </div>

            <div v-else>
              <span v-html="post.b"
                v-linkified:options="linkify_options"></span>
            </div>


            <!-- UPLOADED IMAGES -->
            <image-grid :imgs="post.imgs" v-if="post.imgs && post.imgs.length > 0"/>

            <video-player v-if="post.videoSrc == 'video'" :video-src="post.videoSrc"/>

            <v-card-actions class="pl-0">
              <div style="width:fit-content;" class="text-xs-center">
                
                <v-btn depressed icon class="ml-1" small>
                  <span>{{post.lc}}</span>
                  <v-icon color="icon_btn" small>mdi-thumb-up</v-icon>
                </v-btn>

                <v-btn icon class="ml-3" depressed
                  @click="selected_comment = post; comment_dialog = true;">
                  <span>{{post.cc}}</span>
                  <v-icon color="icon_btn" small >mdi-comment</v-icon>
                </v-btn>

                <v-btn 
                  icon small 
                  class="ml-4" 
                  :id="post.did" 
                  @click="openMenu($event, post)"
                >
                  <v-icon >mdi-dots-horizontal</v-icon>
                </v-btn>

              </div>
            </v-card-actions>
            
          </div>
        </div>

      </article>
      <v-divider :key="i + 'div'"></v-divider>
    </template>

    <!-- POST MENU -->
    <v-menu 
      offset-y 
      v-if="selected_post.did"
      v-model="post_menu_dialog"
      :position-x="selected_post.x"
      :position-y="selected_post.y"
    >
      
      <v-list dense>
        <template v-for="menu in postMenu">
          <v-list-item 
            :key="menu.action"
            @click="postAction(menu.action, selected_post)"
            v-if="menu.sensitive ? menu.sensitive && selected_post.a.username == getUser.username : true"
          >
            <v-list-item-title>
              {{menu.text}}
            </v-list-item-title>
          </v-list-item>
          <v-divider v-if="menu.divider" :key="menu.action + 'd'"></v-divider>
        </template>
      </v-list>
    </v-menu>

    <!-- COMMENT DIALOG -->
    <v-dialog
      v-model="comment_dialog" 
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card flat tile>
        <v-toolbar dense flat>
          Reply to @{{selected_comment.a ? selected_comment.a.username : ''}}
          <v-spacer></v-spacer>
          <v-icon @click="comment_dialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-divider></v-divider>
        
        <reply-template 
          v-if="selected_comment" 
          :post="selected_comment" 
          @close-dialog="comment_dialog = false"
        />
        
      </v-card>
    </v-dialog>

    <v-row row justify-center>
      <v-dialog v-model="flag_post_dialog" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Report Post</v-card-title>
          <v-card-text class="pt-0">
            <div class="mb-3">Am reporting this post because it contains:</div>
            <!-- <v-select
              v-model.trim="flag_reason"
              :items="flagItems"
              chips outlined
              label="Select reason"
              multiple hide-details
            ></v-select> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="info" text :disabled="flagging" @click.native="flag_post_dialog = false">Cancel</v-btn> -->
            <v-btn color="info" text :loading="flagging" @click.native="hidePost" :disabled="flag_reason.length == 0">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  data: ()=>({
    disabled_btns: [],
    readmore: [],
    body: [],
    loading: [],
    comment_dialog: false,
    selected_comment: {},
    selected_post: {},
    post_menu_dialog: false,
    post_to_flag: {},
    flagging: false,
    flag_post_dialog: null,
    flag_reason: [],
  }),
  props: {
    posts: {
      type: Array,
      required: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    single_post_view: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
    ]),
    uniqPosts(){
      
      // latest posts and posts with highest comments on top
      return orderBy(this.posts, ['tstamp', 'cc'], ['desc', 'desc'])
    },
    postMenu(){
      return [
        {text: 'Expand post', action: 'expandPost'},
        {text: 'Copy post link', action: 'copyLink', divider: true},
        {text: 'Delete post', action: 'deletePost', sensitive: true},
      ]
    },
    linkify_options(){
      return {
        className: 'linkified',
        events: {
          click: function () {
            
          },
          mouseover: function () {
           
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
            return location.origin + '/#/home/#@'+ href.substring(1);
          },
          hashtag: (href) => {
            return location.origin + '/#/home/#' + href.substring(1);
          }
        },
        nl2br: true,
      }
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
  },
  methods: {
    visitProfile(username){

      this.$route.path.includes('/users/') ? '' :
      this.$router.push(`/users/${username}`)
    },
    truncateText(text){
      let paragraph_texts = text.replace(/\n$/gm, '').split(/\n/)
      // let no_of_paragraphs = paragraph_texts.length
      // console.log(paragraph_texts)

      let str = ''
      for(let i=0; i<paragraph_texts.length; i++){
        let t = paragraph_texts[i]
        str = str ? str + '@[' + t : t
        if(str.length >= 200){
          
          return str.split('@[').join('\n \n')
        }
        else if(i >= 4){
          
          return str.split('@[').join('\n \n')
        }
        else if(i == paragraph_texts.length -1){
          
          return str.split('@[').join('\n \n')
        }
      }

    },
    openMenu(event, post){
      
      this.selected_post = {
        ...post,
        x: event.clientX,
        y: event.clientY
      }

      this.post_menu_dialog = true
    },
    expandPost(post){

      this.$route.path.includes('/posts/' + post['_']['#']) ? '' : 
      this.$router.push(`/posts/${post['_']['#']}`)
    },
    async copyPostLink(text){
      
      await this.$helpers.copyToClipboard(text)

      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Post Link copied to clipboard',
        color: 'success'
      })

    },
    postAction(action, post){
      let text = `${location.origin}/posts/${post['_']['#']}`
      switch (action) {
        case 'expandPost': 
          this.expandPost(post)
          break;
        case 'copyLink':
          this.copyPostLink(text)
          break;
        case 'deletePost':
          this.deletePost(post)
          break;
        default:
          break;
      }
    },
    async copyToClipboard(text) {
      
      await this.$helpers.copyToClipboard(text)
      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Post Link copied to clipboard',
        color: 'success'
      })
    },
    hidePost(){
      // save flag report
      this.flagging = true

      this.$gun.get(this.getUser)
        .get('hidden_posts')
        .set(this.post_to_flag.did)
      
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: "Your won't see this post again",
          color: 'black'
        })

        this.flagging = false

        this.flag_post_dialog = false
      
    },
    deletePost(post){
      if(post.a.username == this.getUser.username){
        console.log({post})
        
        let yes_delete = confirm('Are you sure to delete post?')

        if(yes_delete){

          this.$gun.get('elections')
            .get(post.erf)
            .get('posts')
            .get(post.did)
            .put(null)
          let postIndex = this.uniqPosts.indexOf(post)
          console.log(this.uniqPosts, {postIndex})
          
          this.posts.splice(postIndex, 1)
        }
      }
    },
    async hasLiked(post){
      // console.log(post, post.reactions)
      if(post.reactions){
        let liked = await this.$gun.get('elections')
          .get(post.erf)
          .get('posts')
          .get(post.did)
          .get('reactions')
          .get(this.getUser.username)
          .then()
        // console.log({liked})
        return !!liked
      }
      else {
        return false
      }

    },
    async add_reaction(post){

      this.disabled_btns.push(post.did)

      let postRef = this.$gun.get('elections')
        .get(post.erf)
        .get('posts')
        .get(post.did)

      let liked = await this.hasLiked(post)
      // console.log({liked})

      if(liked){
        
        let newLikes = (post.likes || 0)*1 - 1
        postRef.get('reactions')
          .get(this.getUser.username)
          .put(false)

        postRef.get('likes')
          .put(newLikes)
      }
      else {

        let newLikes = (post.likes || 0)*1 + 1


        postRef.get('reactions')
          .get(this.getUser.username)
          .put(true)

        postRef.get('likes')
          .put(newLikes)
        
      }
      // if(this.getUser.username )
      this.disabled_btns.splice(this.disabled_btns.indexOf(post.did),1)

    },
    
  },
  async mounted(){
    
  },
  components: {
    ImageGrid,
    VideoPlayer,
    ReplyTemplate
  }
}
import { mapGetters, mapState } from 'vuex'
import { orderBy } from 'lodash'
import ImageGrid from '@/components/ImageGrid'
import VideoPlayer from '@/components/VideoPlayer'
import ReplyTemplate from "@/components/feed/ReplyTemplate";
import * as linkify from 'linkifyjs'
import hashtag from 'linkifyjs/plugins/hashtag'
import mention from 'linkifyjs/plugins/mention'
hashtag(linkify);
mention(linkify)
</script>


<style lang="scss" scoped>
  
  .post-template .v-card {
    box-shadow: 0 1px 2px rgba(0,0,0,.3);
  }

  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }

  .post__avatar{
    float: left;
    
  }
  .post__avatar .v-avatar {
    @include borderRadius(3px)
  }
  .post__content {
    float: left;
    width: 85%;
  }
  @media (max-width: 420px) {
    .post__content {
      width: 81%
    }
  }
  .post__wrapper {
    clear: both;
    overflow: auto;
    min-height: 60px;
  }

  .post__body {
    font-size: 15px;
  }

  a {
    text-decoration: none;
  }
  
  // article {
  //   border-right: 1px solid #e0e0e0;
  //   border-left: 1px solid #e0e0e0;
  // }
</style>
