<template>
  <v-footer class="pa-3" color="#042943" dark>
    <v-spacer></v-spacer>
    <div style="font-size: 0.8rem;">&copy; {{ new Date().getFullYear() }} — <strong>{{$appName}}</strong></div>
  </v-footer>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data:()=>({
    
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>
