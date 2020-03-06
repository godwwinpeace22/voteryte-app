<template>
  <div>
    <vue-headful :title="title"/>

    <navigation>
      <!-- <span slot="back_button">
        <v-btn color="info" @click="$router.back()" text class="px-1">
          <v-icon>mdi-chevron-left</v-icon>
          Back</v-btn>
      </span> -->
      <span slot="action">
        <v-btn @click="$router.push('/home')" text class="px-1">
          <v-icon>mdi-chevron-left</v-icon>
          Back</v-btn>
      </span>
      <span slot="title"></span>
    </navigation>

    <transition name="fade" mode="out-in">

      <div v-if="showUi">
        <post-template :posts="[post]" :single_post_view="true">

          <div slot="replying_to" v-if="post && post.ppa">
            <span>Replying to </span>
            <router-link :to="`/users/${post.ppa}`"  >
              @{{post.ppa}}
            </router-link>

          </div>
        </post-template>
        <comments :post="post"/>
      </div>
    </transition>

  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    post: {}
  }),
  props: ['postId'],
  watch: {
    'postId': function(){
      this.initialize()
    }
  },
  computed: {
    title(){
      return this.$appName
    },
    ...mapState([
      'curRoom',
      'isSuperUser'
    ]),
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    async hasLiked(post){
      if(post.reactions){
        let ref = await this.$gun.get('elections')
          .get(post.erf)
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
    getPost(){
      
      this.post = {}

      this.$gun.get(this.postId).on( async post => {

        let p = Object.assign({}, post)
        p.a = typeof post.a == 'object' ? post.a : await this.$gun.get('users').get(post.a).then()
        
        let img_list = post.imgs ? await this.$gun.get(post.imgs['#']).then() : false
        p.imgs = img_list ? Object.values(img_list).filter(item => typeof item == 'string') : ''
        p.liked = await this.hasLiked(post)
        p.b = msgdown(post.b)
        
        console.log({p})
        this.post = p
        this.showUi = true
        
      })
    },
    initialize(){
      this.getPost()
    }
  },
  mounted(){
    this.getPost()
  },
  components: {
    Navigation,
    PostTemplate,
    Comments
  }
}

import Navigation from '@/components/Navigation'
import PostTemplate from '@/components/feed/PostTemplate'
import Comments from '@/components/feed/Comments'
import { mapState, mapGetters } from 'vuex'
import msgdown from 'msgdown'
</script>
<style scoped>
  a {
    text-decoration: none;
  }
</style>