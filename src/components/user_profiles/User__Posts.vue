<template>
  <div>
      
    <v-subheader v-if="posts.length == 0">No recent post</v-subheader>
    <post-template :posts="posts" :outlined="false"></post-template>
          
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
  },
  methods: {
    initialize(){
      
      this.getUserPosts()
    },
    
    async getUserPosts(){

      let twenty4hrs = 24 * 60 * 60 * 1000
      let yesterday = (new Date(Date.now() - twenty4hrs)).toISOString().substr(0,8)

      this.$gun.get('users').get(this.username)
        .get('posts')
        .get({'.': {'>': yesterday}})
        .map()
        .once(async (p, key) => {
          
          // console.log({p})
          if(p && p.a){

            let post = Object.assign({}, p)
            post.key = key
            post.a = await this.$gun.get('users').get(this.username).then()
  
            let img_list = p.imgs ? await this.$gun.get(p.imgs['#']).then() : false
            post.imgs = img_list ? Object.values(img_list).filter(item => typeof item == 'string') : ''
            
            this.posts.push(post)
            
          }

        })
      
    },
  },
  mounted(){
    this.initialize()
  },
  components: {
    PostTemplate,
  }
}

import PostTemplate from '@/components/feed/PostTemplate'
import { mapState, mapGetters } from "vuex";
</script>
