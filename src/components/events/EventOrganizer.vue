<template>
  <div>
    <v-card flat>
      <v-sheet flat 
        width="100%" height="120" 
        :color="$helpers.colorMinder(organizer.name.charAt(0)) + ' lighten-3'">

      </v-sheet>
      <v-sheet flat width="61%" height="124" 
        style="position: absolute;top: 55px;left: 20%;" color="transparent">
        <v-avatar
          size="124"
          color="white"
          class="elevation-1 d-block mx-auto"
          style="padding-top: 2px;"
        >
          
          <v-avatar class="d-block mx-auto"
            size="120"
            :color="$helpers.colorMinder(organizer.name.charAt(0))"
          >
            <img :src="organizer.photoURL" :alt="organizer.name" v-if="organizer.photoURL">
            <span v-else class="d-block white--text display-2 text-capitalize" style="padding-top: 35px;">{{organizer.name.charAt(0)}}</span>
          </v-avatar>
        </v-avatar>
      </v-sheet>

      <v-card-text class="text-center " style="margin-top: 65px;">
        
        <router-link :to="`/users/${organizer.username}`" style="text-decoration: none;">
          <span class="title text-capitalize primary--text" >{{organizer.name}}</span>
        </router-link>
        <!-- <span class="online_badge" :class="organizer.online ? 'success' : 'orange'"></span> -->
        <div class="mt-2" >@<strong>{{organizer.username}}</strong></div>
      </v-card-text>
      <v-card-actions class="justify-center" >
        
        <v-btn color="primary" depressed rounded class="text-capitalize" 
          @click="organizer.username == getUser.username ? '' : follow" :disabled="disabled_follow">
          Follow
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  data: ()=>({
    disabled_follow: false,
  }),
  props: ['organizer'],
  methods: {
    follow(event){
      let organizer = this.organizer

      this.disabled_follow = true

      this.$helpers.followUser(this.getUser, organizer)
      .then(data =>{
        this.disabled_follow = false

        if(data.following){
          organizer.followers += 1

          // this.$refs[organizer.uid][0].innerText = `You are following ${organizer.name}`
        }
        else{
          organizer.followers -= 1
          // this.$refs[organizer.uid][0].innerText = `Follow ${organizer.name}`
        }
      })
      .catch(err => {
        // console.log(err)
        // organizer.followers += 1
        // this.disabled.splice(this.disabled.indexOf(organizer.uid),1)
        this.disabled_follow  = false
      })
       
    },
  }
}
</script>

