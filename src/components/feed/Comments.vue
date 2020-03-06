<template>
  <div>
    <comment-template :posts="posts"/>
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: []
  }),
  props: ['post'],
  watch: {
    'postId': function(to){
      console.log(to)
      
    },
    post(to){
      console.log({to})
      if(to){

        this.posts = []
        this.post ? this.getComments() : ''
      }
    }
  },
  computed: {
    postId(){
      return this.$route.params.postId
    },
  },
  methods: {
    getComments(){

      console.log(this.post)
      this.$gun
        // .get('elections')
        // .get(this.post.erf)
        .get('posts')
        .map(item => item ? item.t == 'comment' && 
          item.pp == this.post.did ? 
          item : undefined : undefined)
        .on( async post => {

          // console.log({post}, post.did, this.post.did)
          if(post.did != this.post.did){

            let p = Object.assign({}, post)
            p.a = typeof post.a == 'object' ? post.a : await this.$gun.get('users').get(post.a).then()
            
            let img_list = post.imgs ? await this.$gun.get(post.imgs['#']).then() : false
            p.imgs = img_list ? Object.values(img_list).filter(item => typeof item == 'string') : ''
            p.liked = await this.hasLiked(post)
            p.b = msgdown(post.b)
            console.log(p.b)
  
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
          }

        })
    },
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
  },
  mounted(){

    this.getComments()

  },
  components: {
    CommentTemplate,
  },
}

import CommentTemplate from '@/components/feed/CommentTemplate'
import msgdown from 'msgdown'
</script>

<style>

</style>