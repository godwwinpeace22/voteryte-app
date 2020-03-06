<template>

  <v-app-bar
      app
      dense
      clipped-right
      color="blue-grey"
      dark
      flat
      v-if="show"
    >

      <slot name="action">
        <v-app-bar-nav-icon @click.stop="$eventBus.$emit('Toggle_Left_Drawer')"></v-app-bar-nav-icon>
      </slot>

      <v-toolbar-title>
        <slot name="title">Toolbar</slot>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn color=""
        depressed
        outlined
      >
        Upgrade
      </v-btn> -->

      <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn color="grey lighten-3" class="px-1" dark v-on="on" text>
            <v-icon class="">mdi-plus</v-icon>
            <!-- <span class="mr-1">New</span> -->
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <template>
          <v-list-item 
            
            v-for="item in items.filter(itm => itm.show)" 
            :key="item.text"
            @click="item.link ? $router.push(item.link) : $eventBus.$emit('EventDrawer', true)">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
          </template>
        </v-list>
      </v-menu>

      <v-menu transition="slide-y-transition" offset-y v-if="getUser">
        <template v-slot:activator="{on}">
          <v-btn text v-on="on" class="mt-1" :icon="$vuetify.breakpoint.xsOnly">
            <template v-if="$vuetify.breakpoint.smAndUp">
              <v-avatar size="36" :color="$helpers.colorMinder(getUser.name.charAt(0))">
                <img v-if="getUser && getUser.photoURL" :src="getUser.photoURL" alt="avatar">
                <img v-else-if="getUser.photoURL"  :src="getUser.photoURL" alt="avatar">
                <span v-else class="white--text headline text-capitalize">{{getUser.name.charAt(0)}}</span>
              </v-avatar>
              <v-icon dark>mdi-menu-down</v-icon>
            </template>
            <v-icon v-else>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        
        <v-list dense>
          <!-- <slot name="forum_members"></slot> -->

          <v-list-item :to="`/users/${getUser.username}`">
            <v-icon color="success">mdi-account</v-icon>
            <v-list-item-title style="margin-left:5px;">My Profile</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-icon color="cyan">mdi-settings</v-icon>
            <v-list-item-title style="margin-left:5px;">Settings</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
              <v-icon color="error">mdi-logout</v-icon>
            <v-list-item-title style="margin-left:5px;">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <slot name="extension" slot="extension"></slot>
      <!-- <v-app-bar-nav-icon ></v-app-bar-nav-icon> -->
    </v-app-bar>

  
</template>
<script>
export default {
  data:()=>({
    show: true,
    settings_dialog: false
  }),
  props: {
    show_extension: {
      default: false,
    },
    color: {
      default: 'teal'
    },
    extension_img: {
      default: '',
    },
    shrink_on_scroll: {
      default: false,
    },
    prominent: {
      default: false,
    },
    extension_height: {
      default: '150'
    },
    hide_on_scroll: {
      default: true
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
    },
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled',
      
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ]),
    canCreateElections(){
      return this.getUser.acc_type == 'group' 
        // &&
        // this.is_verified
    },
    items() {
      return [
        // {text: 'New post', link: '/home?new=true'},
        // {text: 'New event', action: '/events/new'},
        {text: 'New election', link: '/elections/create', show: this.canCreateElections},
        // {text: 'New campaign', link: '/campaigns?new_campaign=true', show: true},
      ]
    },
    height(){
      if(this.show_extension){

        return this.$vuetify.breakpoint.xsOnly ? '150' : '230'
      }
      else {
        return this.extension_height
      }
    }
    
  },
  components:{
    
  },
   mounted(){
    //  console.log(this.getUser)
     this.$eventBus.$on('hide_profile_settings', ()=>{
      this.settings_dialog = false
    })
    this.$eventBus.$on('show_profile_settings', ()=>{
      this.settings_dialog = true
    })
   }
}
import { mapGetters, mapState } from 'vuex'
</script>
<style lang="sass" scoped>
  
</style>
