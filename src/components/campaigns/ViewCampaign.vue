<template>
	<v-card height="500">
		<VueSlickCarousel 
			v-if="showUi"
			v-bind="settings" 
			ref="slick_carousel"
			@afterChange="onAfterChange">

			<v-sheet
				:color="campaign.color"
				v-for="(campaign,i) in campaigns" :key="i"
				:height="$vuetify.breakpoint.mdAndUp ? 500 : '94vh'" >

				<v-card-actions>
					<v-list dense class="py-0" :color="campaign.color">
						<v-list-item class="pl-0">
							<v-icon 
								class="mr-1 hidden-md-and-up"
								@click="$eventBus.$emit('ShowList', true)">
								mdi-chevron-left</v-icon>
							<v-list-item-avatar 
								class="mr-2 mr-md-5"
								:color="$helpers.colorMinder(campaign.author.name.charAt(0))">
								<img :src="campaign.author.photoURL" v-if="campaign.author.photoURL">
								<span v-else class="white--text">{{campaign.author.name.charAt(0)}}</span>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title 
									class="text-capitalize font-weight-bold">

									{{campaign.author.name}}
								</v-list-item-title>
								<v-list-item-subtitle>
									{{$helpers.parseDate(campaign.date_created,true)}}
								</v-list-item-subtitle>
							</v-list-item-content>

						</v-list-item>
						
					</v-list>
					
					<v-spacer></v-spacer>

					<v-progress-circular color="primary">
						<v-btn 
							icon small
							:disabled="current_slide_index == campaigns.length - 1"
							@click.native="playSlides">
							<v-icon> {{play ? 'mdi-pause' : 'mdi-play'}}</v-icon>
						</v-btn>
					</v-progress-circular>

					<!-- <v-btn text icon @click.native="showViewers"
						v-if="campaign.author && campaign.author.username == getUser.username">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn> -->
				</v-card-actions>
				
				<div class="slide_body">

					<v-row
						class="fill-height"
						align="center"
						justify="center"
					>
						
						<div v-if="campaign.type == 'text'" class="title mx-5 text-center">
							{{campaign.body}}
							
						</div>
						<div v-if="campaign.type == 'photo'">
							<v-img 
								:src="campaign.imgSrc"
								width="300px" height="200px" 
								max-height="300"
								@error="onError"
								@load="onImgLoad($event, i)">

								<template v-slot:placeholder>
									<v-row
										class="fill-height ma-0"
										align="center"
										justify="center"
									>
										<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
									</v-row>
								</template>
							</v-img>
							
						</div>
					</v-row>
					<v-row v-if="campaign.type == 'photo'">
						<v-col class="pt-0">
							<div class="px-4 text-center">
								{{campaign.img_caption}}
							</div>
						</v-col>
					</v-row>
				</div>
			</v-sheet>
		</VueSlickCarousel>

	</v-card>
	
</template>
<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data(){
		return {
			showUi: false,
			timeout: 3000,
			current_slide_index: null,
			play: true,
			drawer: false,
			loading_viewers: false,
			viewers: {},
			loaded_imgs: [],
		}
	},
	props: {
		selectedcampaign: {
			default: 0
		},
		campaigns: {
			require: true,
		}
	},
	watch: {
		'campaigns': {
			immediate: true,
			handler: function(to,from){
				// console.log({to})
				if(this.campaigns.length > 0){
					this.showUi = true;

				}
			},
		},
		'start_slide': function(to, from){
			
			this.$refs.slick_carousel.goTo(to)
			this.$refs.slick_carousel.play()
		}
	},
	computed: {
		...mapGetters([
			'getUser',
		]),
		...mapState([
			'curRoom',
			'isSuperUser'
		]),
		settings() {
			return {
				arrows: true,
				dots: false,
				fade: true,
				autoplay: true,
				autoplaySpeed: this.timeout,
				infinite: false,
				initialSlide: this.start_slide,
				swipeToSlide: true,
			}
		},
		start_slide(){
			return this.$route.query.n*1 || 0
		},
		sortByUid(){
			
			let f = this.campaigns.map(camp => {
				camp.username = camp.author.username
				return camp
			})
			
			// sort by date_created, then sort by username
			return f.sort((a,b) => {
				if(a.date_created > b.date_created) return -1
				if(a.date_created < b.date_created) return 1
				if(a.username > b.username) return 1
				if(a.username < b.username) return -1
			}
				// (b.uid > a.uid) ? 1 : ((a.uid > b.uid) ? -1 : 0)
			)
		},
	},
	methods:{
		playSlides(){
			
			if(this.play){
				this.$refs.slick_carousel.pause()
				this.play = !this.play
			}
			else{
				if(this.campaigns.length <= this.current_slide_index + 1){

					this.$refs.slick_carousel.play()
					this.play = !this.play
				}
			}
		},
		onError(e){
			console.log('onError: ', e)
			this.$refs.slick_carousel.pause()
		},
		onImgLoad(e, index){
			// console.log('onimageload: ', e, index)
			this.loaded_imgs.push(index)
		},
		onAfterChange(e){

			// console.log(e)
			this.current_slide_index = e
			let current_campaign = this.campaigns[e]

			// pause slide if type is not 'text'
			// and resume after media loads (photo) or finish playing (video)
			if(current_campaign.type != 'text'){
			
				// check that the current image is not loaded before pausing
				if(!this.loaded_imgs.includes(e)){

					this.$refs.slick_carousel.pause()
				}
			}
		}
	},
	mounted(){
		
		if(this.campaigns.length > 4){
			
			this.showUi = true;
		}
		
	},
	components: {
		VueSlickCarousel
	},
}

import {groupBy} from 'lodash'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
</script>

<style scoped>

	.slick__card--height {
		height: 500px;
		/* background-color: aqua; */
	}

	.slide_body {
		height: calc(100% - 150px);
	}

	.v-overlay--active:before {
		opacity: 0.86;
	}


	.img_caption::-webkit-scrollbar {
		width: 0 !important;
	}
	/* .next {
		position: absolute;
		right: -20%;
		top: 54%;
	}
	.prev {
		position: absolute;
		left: -20%;
		top: 54%;
	} */

	/* animations */

.fadeInUp {
  animation: fadeInUp .5s ease-in both;
}
.fadeOutDown {
  animation: fadeOutDown .5s ease-in both;
}
.fadeInDown {
  animation: fadeInDown .5s ease-in both;
}
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translate3d(0, -3%, 0);
	}
	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translate3d(0, 3%, 0);
	}
	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}
@keyframes fadeOutDown {
	from {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
	to {
		opacity: 0;
		transform: translate3d(0, 3%, 0);
	}
}
</style>
