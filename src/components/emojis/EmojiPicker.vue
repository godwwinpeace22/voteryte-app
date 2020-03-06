<template>
  <div >
    <v-sheet class="mx-auto" tile flat>
      <v-slide-group show-arrows v-model="slide_group">
        <v-slide-item
          v-for="cat in categories"
          :key="cat.name" 
          
        >
          <v-btn
            class="mx-2" icon
            :input-value="slide_group"
            active-class="purple white--text"
            depressed
            @click="scrollToGroup($event, cat.name)"
          >
            <v-icon>{{ cat.icon }}</v-icon>
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <v-divider></v-divider>

    <v-sheet id="emoji-contents" 
      class="py-1 mb-2 text-center px-0 navdrawr" 
      style="overflow: auto;" height="300">

      <template v-for="(item, i) in emojiData">
        <div :id="item.name" :key="i" 
          class="text-left pl-2 font-weight-bold py-2">
          {{item.name}}

        </div>
        <div :key="i + ': e'" >
          <v-btn icon small 
            @click="emitEvent($event, emoji)" 
            v-for="(emoji, i) in item.emojis" 
            :key="i" style="font-size: 20px;" class="ma-0">

            {{emoji}}
          </v-btn>
        </div>
      </template>
    </v-sheet>

  </div>
</template>
<script>
export default {
  data: () =>({
    emojiData: emojiData,
    showUi: false,
    slide_group: '',
    options: {},
  }),
  computed: {
    active_tab(){
      return this.emojiData
    },
    categories(){
      return [
        {name: 'People', icon: 'mdi-emoticon-excited-outline'},
        {name: 'Nature', icon: 'mdi-nature'},
        {name: 'Objects', icon: 'mdi-camera'},
        {name: 'Places', icon: 'mdi-home-city'},
        {name: 'Symbols', icon: 'mdi-pound-box'},
      ]
    }
  },
  methods: {
    emitEvent(e, emoji){
      // console.log(e, emoji)
      this.$emit('append-emoji', emoji)
    },
    onScroll(e){
      console.log(e)
    },
    scrollToGroup(e, id){
      let elem = document.getElementById(id)
      let emoji_contents = document.getElementById('emoji-contents')

      // console.log({elem})
      elem.scrollIntoView(true)

    },
    transformEmojis(){
      return this.emojiData.map((d, i) => {
        return {
          name: d.name,
          emojis: d.emojis.map((e,n) => {
            return {value: e, id: n+d.name}
          })
        }
        
      })
    }
  },
  created(){

    // this.emojiData = this.transformEmojis()
    // this.showUi = true;
    // console.log('😃' == '😀')
    // console.log(this.transformEmojis())
  }
}

import emojiData from '@/components/emojis/emojiData'
</script>

<style >
  .picker-card {
    overflow: auto;
  }

  .theme--light.v-btn.v-btn--icon {
    color: rgba(0,0,0,9)
  }

  html {
    scroll-behavior: smooth;
  }
</style>
