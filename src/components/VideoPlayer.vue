<template>
  <div>
    <v-layout row wrap>
      <v-flex>
        <v-card flat tile >
          <video ref="videoPlayer" class="video-js"  width="640px" height="267px"></video>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data: () => ({
    player: null,
    
  }),
  props: {
    videoSrc: {
      type: String,
      required: true
    }
  },
  computed: {
    videoOptions(){
      return {
        autoplay: false,
        muted: true,
        fluid: true,
        responsive: true,
        controls: true,
        sources: [
          {
            src: `${this.videoSrc}#t=0.9`,
            type: "video/mp4"
          }
        ]
      }
      
    },
  },
  methods: {
    viewHandler(e){
      
      if(e.percentInView >= 0.9){
        
        this.player.play()
      }
      else{ 
        this.player.pause()
      }
    }
  },
  mounted() {
    let _this = this
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {

    })

    this.player.log.level('off')
      
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
</script>
<style lang="scss" scoped>
  .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    margin-left: -1em;
    margin-top: -1em;
    width: 2em;
    height: 2em;
    line-height: 2em;
    border: none;
    border-radius: 50%;
    font-size: 3.5em;
    background-color: rgba(0,0,0,.45);
    color: #fff;
    -webkit-transition: border-color .4s,outline .4s,background-color .4s;
    -moz-transition: border-color .4s,outline .4s,background-color .4s;
    -ms-transition: border-color .4s,outline .4s,background-color .4s;
    -o-transition: border-color .4s,outline .4s,background-color .4s;
    transition: border-color .4s,outline .4s,background-color .4s
  }

  .video-js .vjs-play-progress,.video-js  .vjs-volume-level {
    background-color: initial;
  }

  .vjs-paused.vjs-has-started.video-js 
    .vjs-big-play-button,.video-js.vjs-ended 
    .vjs-big-play-button,.video-js.vjs-paused 
    .vjs-big-play-button {
      display: block
    }

</style>

