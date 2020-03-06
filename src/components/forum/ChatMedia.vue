<template>
	<div>
		<v-container grid-list-sm class="white">
			<v-row row wrap>
				<v-subheader v-show="allMedia.length == 0">No items</v-subheader>
				<v-col cols="6" sm="4" md="2" v-for="(image,i) in allMedia" :key="i">
					<v-card height="150" class="mb-1 linkify" flat>
						<v-img :src="image" height="150" @click="carouselDialog(allMedia,i)"></v-img>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>
<script>
export default {
	data: () => ({
		carousel_dialog: false,
		carousel_images: [],
		onboarding: 0
	}),
  props: [],
  computed: {
    allMedia(){
      let photos = this.$store.state.chat_messages.map(msg => {
        if(msg.imgs){
          return msg.imgs
        }
      })
      let newArr = [].concat(...photos)
      newArr = Array.from(new Set(newArr)) // removes duplicate values
      return newArr.filter(item => !!item) // remove null or undefined values
      
    }
  },
	methods: {
		carouselDialog(images, index) {
			this.$eventBus.$emit("Open_Image_Gallery", {
				images,
				index
			});
		}
	},
	mounted() {
    // console.log(this.$store.getters.getChatMedia);
    // console.log(this.allMedia)
	}
};
</script>
