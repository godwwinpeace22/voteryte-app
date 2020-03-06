<template>
	<div>
		<v-snackbar	v-model="snackbar.show">
			{{snackbar.message}}
			<v-btn text :color="snackbar.color" @click.native="snackbar.show = false">Close</v-btn>
		</v-snackbar>

		<v-card flat tile>
			<v-card-text>
				<v-radio-group v-model="campaign_type" row class="mt-0">
					<v-radio class="mr-2"
						label="Text"
						color="teal"
						value="text"
					></v-radio>
					<v-radio class="mr-0"
						label="Photo"
						color="primary"
						value="photo"
					></v-radio>
				</v-radio-group>
				<template v-if="campaign_type == 'text'">
					<v-card class="white--text title pa-3" 
						id="campaign_text" 
						flat :color="color" 
						style="width:100%;min-height:200px;border:1px solid #3ee;" 
						contenteditable>
						
							Type your message
						
					</v-card>

					<v-radio-group v-model="color" row>
						<v-radio class="mr-0"
							color="red"
							value="red"
						></v-radio>
						<v-radio class="mr-0"
							color="teal"
							value="teal"
						></v-radio>
						<v-radio class="mr-0"
							color="indigo"
							value="indigo"
						></v-radio>
						<v-radio class="mr-0"
							color="primary"
							value="primary"
						></v-radio>
						<v-radio class="mr-0"
							color="cyan"
							value="cyan"
						></v-radio>
						<v-radio class="mr-0"
							color="dark"
							value="dark"
						></v-radio>
						<v-radio class="mr-0"
							color="orange"
							value="orange"
						></v-radio>
						<v-radio class="mr-0"
							color="success"
							value="success"
						></v-radio>
					</v-radio-group>
        </template>
				<template v-else>
					<v-card flat contenteditable="false" v-if="imgSrc" color="" class="mb-2 jusity-center fill-height" height="200">
						<v-img height="100%" width="80%" style="margin:auto;" :src="imgSrc"/>
					</v-card>
					<v-btn v-else color="grey" depressed block style="padding:23%;" @click="$helpers.trigFileSelector">
						<div style="margin-top:-25px;">
							<v-icon color="white" large>mdi-plus</v-icon>
							<span class="d-block white--text">Add photo</span>
						</div>
					</v-btn>
					<v-text-field outline
						label="Add a caption" counter="100"
						name="caption" v-model.trim="img_caption"
						hint="should be less than 100 characters"
					></v-text-field>
				</template>

				<!-- <v-select
					:items="getMyEnrolled"
					v-model="audience"
					label="Select audience"
					item-text="title"
					item-value="electionId"
				></v-select> -->

			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="grey" depressed dark @click="$helpers.trigFileSelector" v-if="imgSrc" :disabled="loading">
					Change photo</v-btn>
				<v-btn color="primary" @click="submit" :loading="loading" depressed :disabled="disabled">Submit</v-btn>
			</v-card-actions>
		</v-card>
		
	</div>
</template>
<script>
export default {
	data(){
		return {
			loading: false,
			snackbar: {},
			color: 'red',
			campaign_type: 'text',
			img_caption: '',
			imgSrc: null,
			selected_file: null,
			group: ''
		}
	},
	props:['mycontests'],
	computed:{
		// eslint-disable-next-line vue/return-in-computed-property
		disabled(){
			// let doc = document.getElementById('campaign_text')
			// let text = doc ? doc.innerText.trim() : null
			
			if(this.campaign_type == 'photo'){
				
				return !this.imgSrc && this.img_caption.length > 100
			}
			else if(this.campaign_type == 'text'){
				return false
			}
		},
		...mapGetters([
      'getUser',
      'getMyEnrolled'
		]),
		...mapState([
			'curRoom'
		]),
		audience(){
			return this.curRoom.electionId
		}
	},
	methods:{
		async submit(){
			this.loading = true
			if(this.campaign_type == 'photo'){
				let image = await this.$helpers.uploadMedia({files: [this.selected_file]})
				this.postCampaign(image[0])
			}
			else{
				this.postCampaign()
			}
		},
		postCampaign(image){

			let docId = (new Date()).toISOString()
			// let userRef = this.$gun.get('users').get(this.getUser.username)
			let doc = document.getElementById('campaign_text')

			let campaign_text = doc ? doc.innerText : false
			let twenty4hrs = 24 * 60 * 60 * 1000

			let body = this.$sanitize(campaign_text)
			let imgSrc = image ? image : false
			// let date_key = (new Date()).toISOString().substr(0,10)
			

			let data = {
				docId: docId,
				imgSrc: imgSrc,
				img_caption: this.img_caption,
				body: body,
				author: this.getUser.username,
				type: this.campaign_type,
				color: this.color,
				elecRef: this.audience,
				date_created: Date.now(),
				expires_in: Date.now() + twenty4hrs
			}

			// let campaign = userRef.get('campaigns')
			// 	.get(docId).put(data)

			this.$gun.get('elections')
			.get(this.curRoom.electionId)
			.get('campaigns')
				// .get(date_key)
				.get(docId) // add a key to enable deletion
				.put(data)

				// campaign.get('author').put(userRef)
	

			
				this.loading = false
				this.$eventBus.$emit('Snackbar', {
					show: true, color:'dark',
					message: 'Campaign added'
				})
			
				this.$eventBus.$emit('HideNewCampaignDialog', false)
				
		}
	},
	mounted(){
		this.$eventBus.$on('Selected_Files', data=>{
			this.selected_file = data.selected_files,
			this.imgSrc = data.imgSrc[0]
			
		})
	}
}
// import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
</script>
<style>
	#campaign_text div{
		margin-top:5px;
	}
</style>
