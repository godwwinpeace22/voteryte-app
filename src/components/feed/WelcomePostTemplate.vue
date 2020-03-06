<template>
  <div>

    <article 
      flat class="post__wrapper px-3 pt-3" 
      v-for="(post,i) in welcome_posts" 
      :key="i + '_posts'"
    >

      <div class="d-inline-block post__avatar mr-5">
        <v-avatar
          size="40"
          tile
          :color="$helpers.colorMinder(post.author.name.charAt(0))">
          <img v-if="post.author.photoURL" :src="post.author.photoURL" alt="alt">
          <span v-else class="white--text">{{post.author.name.charAt(0)}}</span>
        </v-avatar>
      </div>

      <div class="d-inline-block post__content">
        <div class="post-meta">
          <span class="pr-3 font-weight-bold">{{post.author.name}}</span>
          <span class="pr-3">@{{post.author.username}}</span>
          <small class="grey--text">{{$helpers.parseDate(post.date_created)}}</small>
        </div>
        <div class="post__body">

          <div v-html="post.b" ></div>

          <!-- UPLOADED IMAGES -->
          <v-row v-if="post.imgs && post.imgs.length > 0">
            <v-col cols="12" sm="8">
              <image-grid :imgs="post.imgs"/>
            </v-col>
          </v-row>

          <v-card-actions class="pl-0">
            <div style="width:fit-content;" class="text-xs-center">
              
              <v-btn depressed icon class="ml-1" small>
                <span>1</span>
                <v-icon color="icon_btn" small>mdi-thumb-up</v-icon>
              </v-btn>

              <v-btn icon dark class="ml-3" depressed small>
                <span>3</span>
                <v-icon color="icon_btn" small>mdi-comment</v-icon>
              </v-btn>

            </div>
          </v-card-actions>
          
        </div>
      </div>

    </article>

  </div>
</template>
<script>

export default {
  data: () =>({

  }),
  props: [],
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    welcome_posts(){
      return [
        {
          author: {
            name: 'Godwin Gabriel',
            username: 'godwin',
            is_student: false,
            photoURL: myImg,
          },
          date_created: Date.now(),
          b: `Hi ${this.getUser.name}. I want to personally welcome you onboard. You’re joining thousands of users who use Voteryte to select their next set of leaders. Thank you for chosing us.

You can create posts, campaigns, manifestos, or interact with other voters in the forum. 
We are here to help if you need any help. Feel free to chat with us.`
        }
      ]
    }
  }
}

let myImg = require('@/assets/andrew.jpg')
import { mapGetters} from 'vuex';
</script>
<style lang="scss" scoped>

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
    width: 80%;
  }
  .post__wrapper {
    clear: both;
    overflow: auto;
    min-height: 60px;
  }

  .post__body {
    font-size: 15px;
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
</style>