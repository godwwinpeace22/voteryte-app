<template>
  <div>
    <transition name="fade">
      <v-overlay v-if="!showUi"
        :absolute="true" opacity=".3"
        :value="!showUi"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-container class="my-2" v-else>
          <v-subheader v-if="manifestos.length == 0">No data</v-subheader>
          <v-btn 
            color="success" outlined
            class="mb-3"
            :disabled="manifestos.find(m => m.author.username == getUser.username)"
            v-if="canCreateManifesto"
            @click="openDialog">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Create New
          </v-btn>
        <v-row>
          
          <v-col v-for="(manifesto, i) in manifestos" 
            :key="i + 'manifestos'" cols="12" sm="6"
            >

            <v-card  outlined
              @click="$router.push('/manifestos/' + manifesto.manifestoId)"
              height="230"
            >

              <v-card-title>
                {{$helpers.truncateText(manifesto.title, 28)}}
              </v-card-title>
              <div class="v-card__subtitle"> By {{manifesto.author.name}}</div>
              <v-card-text>
                <div style="max-height: 120px; overflow: hidden;" v-html="$helpers.truncateText(manifesto.body, 200)"></div>
                
              </v-card-text>

              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-icon class="mr-1" small>mdi-heart</v-icon>
                <small class="subheading mr-2">256</small>
                <span class="mr-1">·</span>
                <v-icon class="mr-1" small>mdi-share</v-icon>
                <small class="subheading">45</small>
                
              </v-card-actions> -->

            </v-card>
          </v-col>
        </v-row>
      </v-container>


    </transition>

    <v-dialog
      v-model="dialog"
      fullscreen 
      persistent :overlay="false"
      transition="dialog-transition"
    >
      <v-card flat tile>
        <v-toolbar flat color="primary" dark>
          <v-spacer></v-spacer>
          <v-btn icon large @click.native="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <manifestos 
          v-if="dialog"
          :currElection="currElection" 
          :electionId="electionId" 
          :manifestoId="manifestoId"
          @close-dialog="dialog = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    manifestos: [],
    currElection: {},
    dialog: false,
    manifestoId: 'new',
    has_a_manifesto_already: false,
    is_contestant: true,
  }),
  watch: {
    electionId: function(to){
      this.manifestos = []
      to ? this.initialize() : ''
    }
  },
  computed: {
    electionId(){
      return this.$route.params.electionId
    },
    ...mapState([
      'isSuperUser'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    canCreateManifesto(){
      return this.currElection.allow_manifestos &&
      !this.has_a_manifesto_already && this.is_contestant &&
      this.isSuperUser
    }
  },
  methods: {
    async initialize(){
      // setTimeout(() => this.showUi = true, 1000)
      this.getManifestos()
      this.getElection()
      this.has_a_manifesto_already = !!(await this.hasManifesto())
      this.is_contestant = !!(await this.isContestant())
      // console.log(this.has_a_manifesto_already, this.is_contestant)
      this.showUi = true
    },
    async isContestant(){
      return await this.$gun.get('elections')
        .get(this.electionId)
        .get('contestants')
        .get(this.getUser.username)
        .then()
    },
    getElection(){
      this.$gun.get('elections')
        .get(this.electionId)
        .once(e => {
          this.currElection = e
        })
    },
    getManifestos(){
      this.$gun
        .get('manifestos')
        .map(item => item ? item.electionRef == this.electionId ? item : undefined : undefined)
        .on(async (d)=> {

          // console.log({d})
          let username = d.author
          
          let manifesto = Object.assign({}, d)

          let author = await this.$gun.get('users').get(username).then()
          // console.log(d.manifestoId)

          let found = this.manifestos.find(m => m.manifestoId == d.manifestoId)
          // console.log({found})

          if(found){
            // replace it
            let index = this.manifestos.findIndex(item => item.manifestoId == found.manifestoId)
            this.manifestos.splice(index, 1)
            this.manifestos.push({
              ...manifesto,
              author
            })
          }
          else {
            this.manifestos.push({
              ...manifesto,
              author
            })
          }
        })
    },
    openDialog(){
      if (this.isSuperUser){
        this.manifestoId = 'new'
        this.dialog = true; 
      }
      else {
        this.$router.push('/upgrade')
      }
    },
    async hasManifesto(){
      // this user already created a manifesto for this election
      // Only one manifesto per election is allowed
      return await this.$gun.get('users').get(this.getUser.username)
        .get('manifestos')
        .get(this.electionId)
        // .put(null)
        .then()
    },
  },
  mounted(){
    this.initialize()
  },
  components: {
    Manifestos
  }
}
import Manifestos from "@/components/elections/Manifestos";
import { mapState, mapGetters } from 'vuex'
</script>

<style>

</style>