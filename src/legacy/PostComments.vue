<template>
  
    <v-container class="px-1">
      <v-card flat>
        <h3>peace</h3>
        <v-card-text class="px-2">
          <!-- <v-textarea auto-grow color="primary" rows="1" v-model="form.message"
            name="comment" outlined @keyup.enter="createComment(post)"
            label="Add a comment"
          >
          <v-btn icon slot="append-outer" :disabled="loading"
            @click.native="createComment(post)" v-if="form.message">
            <v-icon color="primary" >mdi-send</v-icon>
          </v-btn> -->

          <!-- EMOJIS DIALOG-->
          <!-- <v-menu max-width="330" :close-on-content-click='false'
            slot="prepend-inner" max-height="" top offset-y>
              <template v-slot:activator="{on}">
                <v-btn v-on="on" icon v-show="body[post.did]">
                  <v-icon color="success">mdi-emoticon-outline</v-icon>
                </v-btn>
              </template>
            <v-card class="">
              <emoji-picker @append-emoji="appendEmoji($event, post)"/>
            </v-card>
          </v-menu> -->
          <!-- </v-textarea> -->
        </v-card-text>

        <v-divider></v-divider>
        
        <v-subheader class="font-weight-bold px-2">Comments</v-subheader>
        <v-progress-circular indeterminate color="grey lighten-1" 
          size="20" class="d-block mx-auto" v-if="loading_comments.find(id => id == post.did)">
        </v-progress-circular>

        <v-card-text class="pt-0">
          
          <v-row>
            <v-col cols="12" v-for="(comment,i) in comments[post.did]" :key="'comment' + i">
              <v-card flat class="grey lighten-3 round">
                <div style="clear: both; overflow: auto;">
                  <div class="pa-2" style="float:left; width: 40px; height: 40px;">
                    <v-avatar
                      size="40"
                      :color="$helpers.colorMinder(comment.a.name ? comment.a.name.charAt(0) : '')"
                    >
                      <img :src="comment.a.photoURL" v-if="comment.a.photoURL">
                      <span v-else class="white--text">{{comment.a.name ? comment.a.name.charAt(0) : ''}}</span>
                    </v-avatar>
                  </div>

                  <div class="ml-5 pa-2" style="float: left;">
                    <div class="">
                      <span style="cursor: pointer;"
                        class="primary--text text-capitalize font-weight-bold"
                        @click="$helpers.openProfile($event, comment.a)">
                        {{comment.a.name}}
                      </span>
                      <small>
                        {{$helpers.parseDate(comment.tstamp, true)}}
                      </small>
                    </div>
                    <div>
                      <v-card-text
                        class="pt-0 pl-0"
                        v-html="comment.b"
                        v-linkified:options="linkify_options">
                      </v-card-text>
                    </div>
                  </div>
                </div>
                
              </v-card>
            </v-col>
          </v-row>
          
        </v-card-text>

      </v-card>
    </v-container>
    
</template>

<script>
export default {
  data: () => ({
    comments: [],
    loading_comments: true,
  }),
  computed: {
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
  },
  props: ['post'],
  methods: {
    appendEmoji(emoji){
      let curMsg = this.form.message
      
      this.form.message = curMsg ? 
      curMsg + emoji : emoji
      
    },
    async getAuthor(comment){
      // console.log({comment})
      return await this.$gun
      .get(comment.a['#']).then()
    },
    createComment(post){
      try {
        
        this.loading.push(post.did)

        let commentId = this.$uuidv4()
        let user = this.$gun.get('users').get(this.getUser.username)

        let postRef = this.$gun.get('elections')
          .get(post.erf)
          .get('posts')
          .get(post.did)

        let comment_data = {
          did: commentId,
          pr: post.did, // postRef
          b: this.$sanitize(this.body[post.did]),
          tstamp: Date.now()
        }


        let comment = postRef
          .get('comments')
          .get(commentId)
          .put(comment_data)
        comment.get('a').put(user)
        
        // comments counter
        let count = (post.cc || 0)*1 + 1
        postRef
          .get('cc')
          .put(count)

        this.body[post.did] = ''
        this.loading.splice(this.loading.indexOf(post.did),1)


      } catch (error) {
        console.log(error)
      }
    },
    async getComments(post){
      
      let postRef = this.$gun.get('elections')
        .get(post.erf)
        .get('posts')
        .get(post.did)


      if(!this.comments[post.did]){
        this.loading_comments.push(post.did)
        // get comments for this post
        
        let cmts = this.comments[post.did] ? this.comments[post.did] : []
        postRef.get('comments')
          .map()
          .on(async (data, key) => {
            console.log({data,key})
            let comment = Object.assign({}, data)
            if(data.a){

              // comment.did = key
              this.getAuthor(data).then(a => {
                console.log({a})
                comment.a = a

                // let item_index = cmts.findIndex(item => item.did == comment.did)
                // if(item_index != -1){
                  
                //   cmts.splice(item_index, 1)
                //   cmts.push(comment)
                // }
                // else {
                  cmts.push(comment)
                // }
              })
            }
          })

        // console.log(cmts)
        
        this.comments = cmts

        this.comments[post.did] = cmts
        this.loading_comments.splice(this.loading_comments.indexOf(post.did),1)

      }
      
    },
  },
  mounted(){

  },
  components: {
    // EmojiPicker,
  }

}

// import EmojiPicker from '@/components/emojis/EmojiPicker'
import * as linkify from 'linkifyjs'
import hashtag from 'linkifyjs/plugins/hashtag'
import mention from 'linkifyjs/plugins/mention'
hashtag(linkify);
mention(linkify)
</script>

<style>

</style>