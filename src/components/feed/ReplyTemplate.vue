<template>
  <div class="post-template">
    
    <article 
      flat class="post__wrapper pa-4"
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

          <div>
            <span v-html="$sanitize(post.b)"
              v-linkified:options="linkify_options"></span>
          </div>


          <!-- UPLOADED IMAGES -->
          <image-grid :imgs="post.imgs" v-if="post.imgs && post.imgs.length > 0"/>
          
        </div>
      </div>

    </article>
    <v-divider></v-divider>

    <new-post class="px-2"
      :no_video="true"
      placeholder="Write a comment"
      type="comment"
      :post_parent="post"
      @close-dialog="$emit('close-dialog')"
    />

  </div>
</template>
<script>
export default {
  data: ()=>({
    body: [],
    loading: [],
  }),
  props: {
    post: {
      type: Object,
      required: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
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
    
  },
  async mounted(){
    
  },
  components: {
    ImageGrid,
    NewPost
  }
}
import { mapGetters, mapState } from 'vuex'
import ImageGrid from '@/components/ImageGrid'
import NewPost from '@/components/feed/NewPost'
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
  
  // article {
  //   border-right: 1px solid #e0e0e0;
  //   border-left: 1px solid #e0e0e0;
  // }
</style>
