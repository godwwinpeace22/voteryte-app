<template>
  <div>
    <navigation/>

    <v-row v-if="showUi">
      <v-col>
        <v-card style="min-height: 450px;">
          <v-list dense dark>
            <v-list-item>
              <v-list-item-avatar :color="!manifesto.author.photoURL ? manifesto.author.name.charAt(0) : ''">
                <img v-if="manifesto.author.photoURL" :src="manifesto.author.photoURL">
                <span v-else class="white--text">{{manifesto.author.name.charAt(0)}}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">{{manifesto.author.name}}</v-list-item-title>
                <v-list-item-subtitle>{{$helpers.parseDate(manifesto.date_created)}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>

          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-col shrink>
                  <v-card flat class="grey lighten-5 pa-3">
                    <div v-html="manifesto.body"></div>
                    
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    manifesto: {},
    showUi: false,
  }),
  props: ['electionId','manifestoId'],
  computed: {
    ...mapState([
      'curRoom',
      'curProfile',
    ]),
    ...mapGetters([
      'getUser',
    ]),
    user(){
      return this.curProfile
    },
  },
  methods: {
    getManifesto(){
      let electionRef = this.$gun
        .get('elections')
        .get(this.electionId)
      this.$gun.get('manifestos')
        .get(this.manifestoId)
        .once(d => {
          // d.author = this.curProfile
          if(!d.author.username){
            this.$gun.get(d.author['#']).once(a => {
              d.author = a
            })
          }
          this.manifesto = d
          // console.log(d, this.manifestoId)

          this.showUi = true
        })
      if(!this.manifesto){
        console.log('not found')
      }
    }

  },
  mounted(){
    // console.log(this.electionId, this.manifestoId)
    this.electionId && this.manifestoId ? this.getManifesto() : ''
  },
  components: {
    Navigation,
  }
}

import { mapGetters, mapState } from "vuex";
import Navigation from '@/components/Navigation'
</script>

<style>

</style>