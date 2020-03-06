<template>
  <div>
    <v-container class="mt-12">
      <v-row>

        <v-col v-for="(manifesto, i) in manifestos" 
          :key="i + 'manifestos'" cols="12" sm="6"
          >

          <v-card  outlined height=""
            :to="`/manifestos/${manifesto.soul}`"
          >

            <v-card-title>
              {{$helpers.truncateText(manifesto.title, 28)}}
            </v-card-title>
            <div class="v-card__subtitle"> By {{manifesto.author.name}}</div>
            <v-card-text>
              <div v-html="$helpers.truncateText(manifesto.body, 200)"></div>
              
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              
              <v-icon class="mr-1" small>mdi-heart</v-icon>
              <small class="subheading mr-2">256</small>
              <span class="mr-1">·</span>
              <v-icon class="mr-1" small>mdi-share</v-icon>
              <small class="subheading">45</small>
              
            </v-card-actions>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    manifestos: [],
  }),
  computed: {
    username(){
      return this.$route.params.username
    },
    user(){
      return this.$gun.get('users')
        .get(this.username).then()
    }
  },
  methods: {
    
    save(){
      
    },
    initialize(){
      this.getManifestos()
    },
    getManifestos(){
      this.$gun.get('users')
        .get(this.username)
        .get('manifestos')
        .map().once(async m => {
          let manifesto = Object.assign({}, m)
          manifesto.author = this.user
          manifesto.soul = m['_']['#']

          manifesto.author = await this.user
          console.log({manifesto})

          this.manifestos.find(mn => mn.soul == manifesto.soul) ? '' : 
          this.manifestos.push(manifesto)
        })
    }
  },
  mounted(){
    this.initialize()
  },
  components: {
    // 'medium-editor': editor
  }
}

</script>

<style>

</style>