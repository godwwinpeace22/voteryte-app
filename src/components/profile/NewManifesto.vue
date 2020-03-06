<template>
	<div>
		<!-- <v-snackbar	v-model="snackbar.show">
			{{snackbar.message}}
			<v-btn flat :color="snackbar.color" @click.native="snackbar.show = false">Close</v-btn>
		</v-snackbar> -->

		<v-card flat tile>
			<v-card-text>
				<v-text-field	label="Manifesto title" 
					class="mb-3" 
					v-model.trim="manifesto_title" 
					color="primary" outline>

				</v-text-field>

				<quill v-model.trim="manifesto_text" :config="config" output="html"></quill>
				<small>Note: You can create only one manifesto per election</small>
        

			</v-card-text>

			<v-card-actions>

				<v-spacer></v-spacer>

				<!-- <v-btn color="grey" depressed dark 
					@click="$helpers.trigFileSelector" 
					v-if="imgSrc" :disabled="loading">
					Change photo</v-btn> -->

				<v-btn color="primary" 
					@click="submit" 
					:disabled="disabled" 
					:loading="loading">
					Create
				</v-btn>
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
			manifestos: [],
			config: { // config for rich text editor
				placeholder: 'Compose an epic...',
				modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],        // toggled buttons
					['blockquote'],
					[{ 'list': 'ordered'}, { 'list': 'bullet' }],
					[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

					[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

					[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
					[{ 'font': [] }],
					[{ 'align': [] }]
				]
			},
			},
			manifesto_type: 'text',
			manifesto_text: '',
			manifesto_title: '',
			img_caption: '',
			video_link: '',
			imgSrc: null,
			selected_file: null,
			group: '',
		}
	},
	props:['mycontests'],
	computed:{
		disabled(){
			let doc = document.getElementById('manifesto_text')
			let text = doc ? doc.innerText.trim() : null
			if(this.manifesto_type == 'text'){
				return !this.manifesto_text || !this.manifesto_title
			}
		},
		...mapGetters([
      'getUser',
      'getMyEnrolled'
		]),
		...mapState([
			'curRoom',
			'isSuperUser'
		])
	},
	methods:{
  
		async submit(){
			this.loading = true
			
			if(this.manifesto_type == 'photo'){
				let image = await this.$helpers.uploadImage(this.selected_file, this.cloudinary)
				this.createManifesto(image[0])
			}
			else{
				this.createManifesto()
			}
		},
		createManifesto(image){

			try{
			
				this.loading = true;

				let data = {
					date_created: Date.now(),
					elecRef: this.curRoom.electionId,
					body: this.$sanitize(this.manifesto_text),
					title: this.$sanitize(this.manifesto_title)
					
				}

				let userRef = this.$gun.get(this.getUser.username)
				let manifestoId = this.$uuidv4()
				
console.log(this.manifestos)

				let has_m_for_election = this.manifestos
					.find(m => m.elecRef == this.curRoom.electionId)

				if(has_m_for_election){

					this.$eventBus.$emit('Snackbar', {
						show: true,
						message: 'You already have a manifesto for this election',
						color:'success',
					})
				}

				else {

					// create a manifesto
					let electionRef = this.$gun.get('elections')
						.get(this.curRoom.electionId)
	
					let manifesto = userRef.get('manifestos')
						.get(manifestoId)
						.put(data)
	
					manifesto.get('author')
						.put(userRef)
					manifesto.get('electionRef')
						.put(electionRef)
					electionRef
						.get('manifestos')
						.set(manifesto)
					this.$gun.get('manifestos')
							.get(manifestoId)
							.put(manifesto)
							
							
					this.loading = false
					this.$eventBus.$emit('CloseNewManifestoDialog')
	
					this.$eventBus.$emit('Snackbar', {
						show: true,color:'success',
						message: 'Manifesto created successfully'
					})
				}
			
			}
			catch(err){
				this.loading = false
				console.log(err)

				this.$eventBus.$emit('Snackbar',{
					show: true, color:'error',
					message: 'Something went wrong, try again'
				})
			}
		},
		getManifestos(){
			let userRef = this.$gun.get(this.getUser.username)

			userRef
				.get('manifestos')
				.map()
				.on((m,k) => {

					
					console.log({m,k})
					
					m.author = this.user
					m.key = k
					this.manifestos.push(m)
				})
		}
	},
	mounted(){
		this.getManifestos()
		this.$eventBus.$on('Selected_Files', data=>{
			this.selected_file = data.selected_files
			this.imgSrc = data.imgSrc[0]
		})
	}
}
import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
import '@/assets/css/quill.snow.css'
</script>
<style lang="scss">
	
	#manifesto_text div{
		margin-top:5px;
	}
</style>
