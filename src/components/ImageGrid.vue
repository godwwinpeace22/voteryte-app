<template>
  <v-row v-if="imgs.length > 0" no-gutters class="mt-2">
    <v-card
      flat tile 
      :height="imgHeight" 
      class="col white"
      v-for="(img,i) in imgs" 
      :key="i + 'im'"
      :class="getColSize(i)">

      <v-img :src="img" 
        :lazy-src="`https://picsum.photos/10/6?image=${i + 10}`" 
        alt="" class="grey lighten-2 magnify" 
        max-height="300" aspect-ratio="2" 
        height="100%" width="100%"
        @click="carouselDialog(imgs,i)">
        
        <template v-slot:placeholder>
          <v-layout fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </template>
      </v-img>
      <div class="overlay" v-if="i == 2 && imgs.length > 4">
          
        <v-card 
          :height="imgs.length == 1 ? '100%' : breakpoint.xsOnly ? 100 : '150'" 
          class="mb-3 linkify" color="transparent" @click="carouselDialog(imgs, 3)">
          <div class="title text-xs-center white--text" style="padding-top: 35%;">+ {{imgs.length - 4}} more</div>
        </v-card>
      </div>
    </v-card>
    
  </v-row>
</template>
<script>
export default {
  data: () => ({

  }),
  props: ['imgs'],
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    imgHeight(){
      // console.log(this.imgs.length)
      let len = this.imgs.length <= 2 ? '250' : '150'
      // console.log({len})
      return len
    },
  },
  methods: {
    getColSize(i){
      let len = this.imgs.length;
      let class1 = ['col-6 round-top-left round-bottom-left pb-1']
      let class2 = ['col-6 round-top-right round-bottom-right pb-1']
      let class3 = ['col-12 round-bottom-left round-bottom-right']
      let class4 = ['col-6 round-bottom-right']

      if(len == 1) return ['col-12 round']
      else if(len == 2) return  i == 0 ? 
        class1 : class2
      else if(len == 3) {
        if(i == 2) return class3
        else return i == 0 ? ['col-6 round-top-left pr-1 pb-1'] : 
        ['col-6 round-top-right pb-1']
      }
      else return i == 0 ? ['col-6 round-top-left pb-1'] :  
      i == 1 ? ['col-6 round-top-right pb-1'] : 
      i == 2 ? ['col-6 round-bottom-left pr-1'] : class4
    },
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .overlay {
    height: 98%;
    width: 98%;
    background: rgba(0,0,0,.4);
    position: absolute;
    top: 1px;
  }
  
</style>
