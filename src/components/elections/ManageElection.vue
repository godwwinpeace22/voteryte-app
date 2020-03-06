<template>
  <div>

		<vue-headful :title="title"/>

    <navigation :show_extension="true" color="purple"
      extension_height="50"
      :prominent="true"
      >
			<template v-slot:title>
        <span>Contest Manager - {{currElection.title}}</span>
      </template>

      <template v-slot:img="{ }">
        <v-img
          :src="require('@/assets/webinar.jpg')"
        ></v-img>
      </template>

      <template v-slot:extension>

        <v-tabs
          :align-with-title="$vuetify.breakpoint.smAndUp"
          v-model="tabs"
          background-color="transparent"
					show-arrows
          >
          <v-tab href="#tab-1" class="text-capitalize"> Overview</v-tab>
          <v-tab href="#tab-2" class="text-capitalize"> General Settings</v-tab>
          <v-tab href="#tab-3" class="text-capitalize"> Contestants and roles</v-tab>
          <v-tab href="#tab-4" class="text-capitalize"> Voting and results</v-tab>
          <v-tab href="#tab-5" class="text-capitalize"> Scheduling </v-tab>
        </v-tabs>
      </template>
    </navigation>

		<transition name="fade" mode="out-in">
			
		<loading-bar v-if="!showUi" height="80vh"></loading-bar>
			
		<div v-if="showUi">

			<v-tabs-items v-model="tabs">
				<v-tab-item value="tab-1">
					
					<!-- == OVERVIEW == -->
					<v-container class="pb-0 px-0 pt-0 px-sm-2">
						<v-row>
							<v-col cols="12">
								<transition name="fade">
									<v-card color="rgb(6, 43, 60)" 
										dark flat tile outlined>

										<v-list class="transparent">
											<v-list-item  ref="list">
												<v-list-item-avatar color="teal">
													<img :src="currElection.logo" v-if="currElection.logo">
													<span v-else class="text-capitalize">{{currElection.title.charAt(0)}}</span>
												</v-list-item-avatar>
												<v-list-item-content>
													<v-list-item-title>{{currElection.title}}</v-list-item-title>
													<v-list-item-subtitle>{{currElection.electionId}}</v-list-item-subtitle>
												</v-list-item-content>
												<v-list-item-action>
													<v-menu offset-y>
														<template v-slot:activator="{on}">
															<v-icon v-on="on">mdi-dots-vertical</v-icon>
														</template>
														
														<v-list dense>
															<v-list-item @click="copyLink">
																<v-list-item-title>Copy contest link</v-list-item-title>
															</v-list-item>
														</v-list>
													</v-menu>
												</v-list-item-action>
											</v-list-item>
										</v-list>
										
											<v-card-text  v-if="showUi">
												<v-container justify-center fill-height>
													<v-row align-center justify-center>
														<v-col cols="12" sm="12">
															<v-card-text class="">
																<div class="d-block">

																	<div class="text-xs-left py-5" style="display:table;margin:auto;">
																		<h3 class="display-1">
																			{{electionStatus[0]}}
																		</h3>
																		</div>
																	
																</div>
																
															</v-card-text>
														</v-col>
													</v-row>
												</v-container>

											</v-card-text>
											<v-card-actions>
												
												<v-btn color="success" 
													depressed small 
													@click="changeElectionStatus('inprogress')"
													v-if="!currElection.timed && currElection.status == 'not_started'"
													class="text-capitalize">
													Start Contest
												</v-btn>
												<v-btn color="warning" depressed 
													v-if="!currElection.timed && currElection.status == 'inprogress'"
													@click="changeElectionStatus('ended')"
													small class="text-capitalize">
													End Contest
												</v-btn>
											</v-card-actions>

									</v-card>
                </transition>
							</v-col>
							<v-col cols="12">
								<v-card outlined class="pt-4" flat>
										
										<v-card-text class="pt-0">

											<v-list dense >
												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-clock</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Start Date</span>
														<span>{{electionStartDate}}</span>
													</v-list-item-title>
												</v-list-item>
												
												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-school</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">School</span>
														<span>{{currElection.sch}}</span>
													</v-list-item-title>
													<v-list-item-action>
													</v-list-item-action>
												</v-list-item>

												<v-list-item v-if="currElection.level == 'Faculty'">
													<v-list-item-action>
														<v-icon color="teal">mdi-domain</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Faculty</span>
														<span>{{currElection.fac}}</span>
													</v-list-item-title>
												</v-list-item>

												<v-list-item v-if="currElection.level == 'Department'">
													<v-list-item-action>
														<v-icon color="teal">mdi-map-marker</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Department</span>
														<span>{{currElection.dept}}</span>
													</v-list-item-title>
												</v-list-item>

												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-adjust</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Status</span>
														<span :class="[electionStatus[1] + '--text']">
															{{electionStatus[0]}}
														</span>
													</v-list-item-title>
												</v-list-item>

											</v-list>

										</v-card-text>

										<v-card-actions>
											<v-row justify="center" align="center">
												
												<div class="mr-10">
													<v-progress-circular
														:value="100"
														size="60" 
														color="success"
													>
													{{no_of_voters || 0}}
													</v-progress-circular>
													<span	class="d-sm-block mt-sm-2 text-center"> Voters</span>
												</div>

												<div class="ml-10 ">
													<v-progress-circular
														:value="80" size="60"
														color="purple lighten-2"
													>
													{{no_of_contestants || 0}}
													</v-progress-circular>
													<span	class="d-sm-block mt-sm-2">Contestants</span>
												</div>

											</v-row>
										</v-card-actions>

									</v-card>
							</v-col>
						</v-row>
					</v-container>

				</v-tab-item>

				<v-tab-item value="tab-2">
					
					<v-row justify="center">
						<v-col cols="12">
							<v-card outlined>
				
								<v-card-text class="pt-3">
									<v-subheader class="pl-0 font-weight-bold">Contest title</v-subheader>
									<v-text-field
										class="mb-5"
										name="title" hide-details color="primary"
										label="Edit Title" outlined
										:value="currElection.title" v-model.trim="form.title"
									></v-text-field>

									<v-textarea
										class="mb-5"
										name="desc" hide-details color="primary"
										label="About this contest" outlined
										:value="currElection.about" v-model.trim="form.about"
									></v-textarea>
									
									<v-subheader class="pl-0 font-weight-bold">Contest logo</v-subheader>
									<v-file-input 
										show-size outlined 
										v-model="logo"
										prepend-icon=""
										hide-details class="mb-3"
										append-icon="mdi-paperclip"
										:disabled="uploading_logo"
										accept="image/jpeg, image/png" 
										label="Select logo">
									</v-file-input>

									<v-btn depressed small color="primary" 
										v-if="logo" class="text-normal ml-0 mb-5"
										:loading="uploading_logo"
										@click="uploadLogo">
										Upload logo
									</v-btn>

									<v-subheader class="pl-0 font-weight-bold">Contest Banner</v-subheader>
									<v-file-input 
										show-size outlined 
										v-model="contest_banner"
										prepend-icon=""
										hide-details class="mb-3"
										append-icon="mdi-paperclip"
										accept="image/jpeg, image/png"
										:disabled="uploading_banner" 
										label="Select image">
									</v-file-input>

									<v-btn depressed small color="primary" 
										v-if="contest_banner" class="text-normal ml-0 mb-5"
										:loading="uploading_banner"
										@click="uploadBanner">
										Upload Banner
									</v-btn>

									<v-textarea
										name="terms" outlined
										label="Terms and conditions"
										v-model="form.terms"
									></v-textarea>

									<!-- <v-list subheader three-line>
										
										<v-subheader class="font-weight-bold mb-0">Manifestos</v-subheader>
										<v-list-item >
											<v-list-item-action>
												<v-checkbox
													v-model="form.allow_manifestos"
													class="mt-0"
													color="success">
												</v-checkbox>
												
											</v-list-item-action>
											<v-list-item-content>
												<v-list-item-title>Allow manifestos</v-list-item-title>
												<v-list-item-subtitle>Contestants can submit their manifestos</v-list-item-subtitle>
												
											</v-list-item-content>
										</v-list-item>
										
									</v-list> -->

								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="success"
										depressed
										:disabled="currElection.status == 'ended'"
										@click="updateGeneralSettings">
										Save Changes
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-col>
					</v-row>
				</v-tab-item>

				<v-tab-item value="tab-3">
					
					<v-card outlined class="my-5" style="min-height:200px;">
						<v-toolbar light flat height="50px">
							<v-toolbar-title class="">Roles</v-toolbar-title>

							<v-spacer></v-spacer>
							<v-btn 
								color="primary" class="text-capitalize"
								depressed left text
								@click.native.stop="dialog = !dialog"
								:icon="$vuetify.breakpoint.xsOnly"
							>
								<v-icon>mdi-plus</v-icon>
								<span class="hidden-xs-only">New</span>
							</v-btn>

							<v-btn color="info" class="ml-3 text-capitalize"
								depressed
								:disabled="electionStatus[2] != 'not_started'"
								@click="updateRoles">
								Save
							</v-btn>
							
						</v-toolbar>

						<v-card-text class="pt-0">
							<!-- <v-subheader class="font-weight-bold mb-2">Adding Contestants</v-subheader>
							<p class="ml-4">Who can contest in this contest?</p>
							<v-radio-group class="ml-4" v-model="form.who_can_contest" mandatory>
								
								<v-radio label="Anyone" value="everyone"></v-radio>
								<v-radio label="Manual selection" value="manual"></v-radio>
							</v-radio-group> -->

							<v-dialog v-model="dialog" max-width="500px">
								<v-card>
									<v-card-title primary-title class="title mb-0 pb-0">Create A New Role</v-card-title>
									<v-card-text>
										<v-text-field label="Role title" v-model.trim="role_input" color="primary" 
											hint="e.g president, secretary, vice-chancellor"></v-text-field>
										<small class="grey--text"></small>
										<p>
											<small class="grey--text">* try not to use abbreviations</small>
										</p>
										<v-divider></v-divider>
										<v-textarea v-model.trim="role_input_desc"
											label="Role description (optional)" outlined
											name="name" color="primary" hint="e.g what this role can do"
										></v-textarea>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
											<v-btn text @click.native="dialog = false">Cancel</v-btn>
											<v-btn 
												text color="success" 
												@click.native="addrole" 
												:disabled="!role_input || electionStatus[2] != 'not_started'">
												Add role</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>

							<v-select class="mt-4" deletable-chips
								v-model="form.roles"
								:items="form.roles" return-object
								item-text="title" cache-items
								item-disabled="disabled"
								color="primary"
								chips label="Roles"
								hide-details
								multiple outlined
							></v-select>
						</v-card-text>

						<v-toolbar light flat height="50px" class="mt-8">
							<v-toolbar-title>Contestants</v-toolbar-title>

							<v-spacer></v-spacer>
							<v-text-field
								v-model="search"
								append-icon="mdi-magnify"
								label="Search"
								single-line solo-inverted flat dense
								color="primary"
								hide-details
							></v-text-field>

							<v-dialog
								v-model="add_contestant_dialog"
									
								persistent :overlay="false"
								max-width="500px"
								transition="dialog-transition">

								<template v-slot:activator="{on}">
									<v-btn color="primary" v-on="on" 
										text class="ml-3 text-capitalize">
										<v-icon>mdi-plus</v-icon>
										Add contestant
									</v-btn>
								</template>

								<v-card flat>
									<div class="v-card__title">
										Add contestants
									</div>
									<v-card-text>
										<v-text-field
											name="name"
											autocomplete="name"
											label="Enter contestant name"
											v-model="form2.name"
										></v-text-field>
										
										<v-row>
											<v-col>
												<v-select
													:items="roles"
													v-model="form2.role"
													item-value="value"
													item-text="title"
													return-object
													label="Assign Role or position"
												></v-select>
											</v-col>
											<v-col>
												<v-text-field
													name="contestant-number"
													label="Contestant number"
													type="number"
													v-model.number="form2.contestant_number"
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-file-input
													name="contestant_img"
													v-model="form2.file"
													label="Upload contestant image"
													:disabled="loading"
													prepend-icon=""
													append-icon="mdi-file"
													accept="image/jpeg,image/png"
												>

												</v-file-input>
											</v-col>
										</v-row>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn @click="add_contestant_dialog = false" depressed>Close</v-btn>
										<v-btn color="info" 
											:disabled="!form2.name || !form2.role || !this.form2.contestant_number || electionStatus[2] != 'not_started'"
											depressed :loading="loading"
											@click="addContestant">
											Add
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-toolbar>
						<v-divider></v-divider>
						
						<v-data-table
							:headers="headers"
							:items="contestants"
							:search="search"
							:loading='false'
							class="elevation-0"
						>
							<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
							<template v-slot:item.actions="{item}" >
								
								<td class="justify-center">
									
									<v-tooltip top>
										<template v-slot:activator="{on}">
											<v-icon v-on="on"
												class="mt-3" color="error" 
												small @click="culprit = item; 
												delete_dialog = true"
												:disabled="item.suspended">
												mdi-delete
											</v-icon>
										</template>
										<span>Delete contestant</span>
									</v-tooltip>
								</td>
							</template>
						</v-data-table>
					</v-card>

				</v-tab-item>
				
				<v-tab-item value="tab-4">
					
					<v-card color="" outlined class="mb-5">
						<v-card-text>

							<v-subheader class="font-weight-bold mb-2">Who Can Vote</v-subheader>
							
							<v-radio-group class="ml-4" v-model="form.who_can_vote" mandatory>
								<v-radio 
									label="Anyone can vote" 
									value="anyone"></v-radio>
								<v-radio 
									label="Invite only - add voters manually" 
									value="manual"></v-radio>
							</v-radio-group>

							<v-card v-if="form.who_can_vote == 'manual'" flat width="500" class="grey lighten-4">
								<v-card-text>
									
									<v-textarea
										v-model.trim="list"
										rows="3"
										outlined
										label="Enter usernames"
										placeholder="Comma seperated list of usernames"
									>
									</v-textarea>

									<v-btn color="info" depressed small
										@click="saveApprovedList"
										:disabled="!list || electionStatus[2] != 'not_started'"
										:loading="loading">
										Save list
									</v-btn>

									<v-btn color="grey" depressed small
										class="ml-2" dark
										@click="view_list_dialog = true;"
									>
										View list
									</v-btn>
								</v-card-text>
							</v-card>

							<v-divider class="m"></v-divider>

							<v-list three-line subheader>
								<v-subheader class="font-weight-bold mb-0">Voting</v-subheader>
								<v-list-item 
									:disabled="currElection.type != 'Others'">
									<v-list-item-action>
										<v-checkbox 
											:disabled="currElection.type != 'Others'"
											v-model="form.allow_multiple_voting"
											class="mt-0"
											color="success">
										</v-checkbox>
										
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title>Allow multiple voting</v-list-item-title>
										<v-list-item-subtitle>Voters can vote more than once</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item>
                  <v-list-item-action>
                    <v-checkbox
                      v-model="form.verification_method"
                      class="mt-0"
                      color="success">
                    </v-checkbox>
                    
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Use BVN Verification</v-list-item-title>
                    <v-list-item-subtitle>Tighten security with BVN verification</v-list-item-subtitle>
                    
                  </v-list-item-content>
                </v-list-item>
								
							</v-list>

							<v-divider></v-divider>
							<v-list three-line subheader>
								<v-subheader class="font-weight-bold mb-0">Showing Result</v-subheader>
								<v-list-item>
									<v-list-item-action>
										<v-checkbox v-model="form.realtime_results"></v-checkbox>
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title>Real-time results</v-list-item-title>
										<v-list-item-subtitle>Show results in real time as votes are casted, otherwise after the election.</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
								<v-list-item>
									<v-list-item-action>
										<v-checkbox v-model="form.results_visible_to_all"></v-checkbox>
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title>Result visibility</v-list-item-title>
										<v-list-item-subtitle>Results are visible to all voters and contestants</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" class="" 
								@click="updateVotingSettings" 
								:disabled="electionStatus[2] != 'not_started'"
								depressed>
								Save Changes
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-tab-item>

				<v-tab-item value="tab-5">
					<v-card class="mb-5 mr-1 ml-1 mt-3 pa-3" outlined max-width="800">
						<v-subheader class="title primary--text pl-0 mb-0">Scheduling</v-subheader>
						
						<v-row>
							
							<v-col cols="6" sm="6">
								<v-subheader class="font-weight-bold mb-0 pl-0">Start date</v-subheader>

								<v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
									persistent width="290px" >
									
									<template v-slot:activator="{on}">
										<v-text-field v-on="on" color="primary" v-model="form.date"
											label="Choose date" readonly outlined>
											<v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
										</v-text-field>
									</template>

									<v-date-picker v-model="form.date" 
										scrollable :allowed-dates="allowedDates" 
										header-color="primary">
										<v-spacer></v-spacer>
											<v-btn text   @click="modal = false">Cancel</v-btn>

											<v-btn text small outlined color="success" 
											@click="$refs.dialog.save(form.date)">OK
										</v-btn>
									</v-date-picker>
								</v-dialog>
							</v-col>

							<v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
								<v-subheader class="mb-0 pl-0 font-weight-bold">Start time</v-subheader>

								<v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time"
									persistent width="290px">

									<template v-slot:activator="{on}">
										<v-text-field  v-on="on" v-model="form.time"  
											label="Time" color="primary" readonly outlined>
											<v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
										</v-text-field>
									</template>
									<v-time-picker v-if="modal2" format="ampm" 
										:allowed-hours="allowedHours" 
										v-model="form.time" header-color='primary'>
										<v-spacer></v-spacer>
											<v-btn text  @click="modal2 = false">Cancel</v-btn>
											<v-btn text color="success" 
												outlined 
												@click="$refs.dialog2.save(form.time)">
												OK</v-btn>
									</v-time-picker>
								</v-dialog>
							</v-col>

							<v-col cols="6" sm="6">
								<v-subheader class="font-weight-bold mb-0 pl-0">End date</v-subheader>

								<v-dialog ref="dialog6" v-model="modal3" :return-value.sync="form.enddate"
									persistent width="290px" >
									
									<template v-slot:activator="{on}">
										<v-text-field v-on="on" color="primary" v-model="form.enddate"
											label="Choose date" readonly outlined>
											<v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
										</v-text-field>
									</template>

									<v-date-picker v-model="form.enddate" 
										scrollable :allowed-dates="allowedDates2" 
										header-color="primary">
										<v-spacer></v-spacer>
											<v-btn text   @click="modal3 = false">Cancel</v-btn>

											<v-btn text small outlined color="success" 
											@click="$refs.dialog6.save(form.enddate)">OK
										</v-btn>
									</v-date-picker>
								</v-dialog>
							</v-col>

							<v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
								<v-subheader class="mb-0 pl-0 font-weight-bold">End time</v-subheader>

								<v-dialog ref="dialog3" v-model="modal4" :return-value.sync="form.endtime"
									persistent width="290px">

									<template v-slot:activator="{on}">
										<v-text-field  v-on="on" v-model="form.endtime"  
											label="Time" color="primary" readonly outlined>
											<v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
										</v-text-field>
									</template>
									<v-time-picker v-if="modal4" format="ampm" 
										:allowed-hours="allowedHours2"
										v-model="form.endtime" header-color='primary'>
										<v-spacer></v-spacer>
											<v-btn text  @click="modal4 = false">Cancel</v-btn>
											<v-btn text color="success" outlined @click="$refs.dialog3.save(form.endtime)">OK</v-btn>
									</v-time-picker>
								</v-dialog>
							</v-col>

							<v-col sm="12" style="padding-bottom:0px;">
								<v-subheader class="font-weight-bold pl-0 mb-0">Set Timer </v-subheader>
								<v-switch 
									class="mt-0"
									v-model="form.timed" 
									label="Contest begins and ends automatically at the selected date and time"
									color="success">
								</v-switch>
							</v-col>
						</v-row>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" depressed
								:disabled="electionStatus[2] != 'not_started'"
								@click="updateScheduleSettings">Save Changes
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-tab-item>

			</v-tabs-items>
			
		</div>
		</transition>
    
    <!-- delete contestant dialog -->
    <v-dialog 
			v-model="delete_dialog" 
			max-width="500px" 
			persistent hide-overlay>
      <v-card min-height='' flat>
        <v-card-title>
          <span class='headline text-capitalize'>Delete {{culprit.author ? culprit.author.name : ''}}</span>
        </v-card-title>
        <v-card-text>
         Are you sure?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false; loading = false">Cancel</v-btn>
          <v-btn 
						:disabled="electionStatus[2] != 'not_started'"
						color="orange" outlined 
						@click="deleteContestant" 
						:loading="loading">
						Delete
					</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

		<!-- Approved list dialog -->
		<v-dialog
			v-model="view_list_dialog"
			scrollable 
			:overlay="false"
			max-width="500px"
			transition="dialog-transition">
			<v-card min-height="400">
				<div class="v-card__title">
					Approved List
				</div>

				<v-card-text>
					<ol>
						<li v-for="(user,i) in approved_list" :key="i">
							{{user}}
						</li>
					</ol>
				</v-card-text>
			</v-card>
		</v-dialog>

  </div>
</template>
<script>
export default {
  data:()=>({
    showUi: false,
    flagged_user_dialog: false,
		flagged_user: {},
		tabs: 'tab-1',
		edit_dialog: false,
		view_list_dialog: false,
		role_input: '',
		role_input_desc: '',
		dialog: false,
		suspended: [],
		add_contestant_dialog: false,
		access_token: '',
		voter_access_token: '',
		file: null,
		list: '',
		form: {
      title: '',
      type: '',
      school: '',
			level: '',
			about: '',
      timed: true,
      faculty: '',
      department: '',
			date: '',
			enddate: '',
			endtime: '',
      time: '',
      auto_enroll_admin: true,
			// public: true,
			access_token: '',
      roles: [],
      who_can_vote: 'anyone',
      voter_list: [],
      allow_multiple_voting: false,
      realtime_results: true,
      results_visible_to_all: true,
			verification_method: false,
			terms: '',
			// who_can_contest: 'everyone',
			unrestricted_contesting: false,
			manually_add_contestants: false,
			allow_manifestos: true,
		},
		approved_list: [],
		blob_url: '',
		logo: null,
		contest_banner: null,
		uploading_logo: false,
		uploading_banner: false,
		saving_edit: false,
		modal: false,
    modal2: false,
		modal3: false,
		modal4: false,
    today: new Date().getTime(),
    contestants: [],
    currElection: {},
		regVoters: [],
		loading_more_voters: false,
		loading_more_activities: false,
		isLastVoter: false,
		isLastActivity: false,
		activities: [],
		regActivities: [],
		form2: {
			name: '',
			role: '',
			contestant_number: '',
			file: null,
		},
		chartData: {},
		chartOptions:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip: false,
            }
          }]
      }
    },
		tabledata: [],
		adminList: [],
    date_options: {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    search: '', // search contestants
    headers: [
      {
				text: 'Name',
				align: 'left',
				value: 'author.name'
      },
      {text:'Role', value: 'role.title'},
      {text:'Actions', value: 'actions'},
    ],
		loading: false,
		making_admin: false,
    delete_dialog: false,
		culprit: {},
		roles: [],
		elecRef: '',
  }),
	watch: {
		'form.date': function(to,from){
			if(from){
				// console.log({to,from})

				this.form.enddate = ''
				this.form.endtime = ''
			}
    },
    'form.enddate': function(to,from){
			if(from){

				this.form.endtime = ''
			}
    },
    'form.time': function(to,from){
			if(from){

				this.form.enddate = ''
				this.form.endtime = ''
			}
		},
		view_list_dialog: function(to){
			to ? this.getApprovedList() : ''
		}
	},
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
		]),
		title(){
			return `Contest Manager | ${this.$appName}`
		},
		disabled_save(){
			return !this.form.title.trim() || !this.form.date.trim() || !this.form.time.trim()
		},
		no_of_voters(){
      let len = this.currElection.voters_count
        
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    // purposely duplicated this instead of merging
    // it with above as a method bcs it should be reactive
    no_of_contestants(){
			let len = this.contestants.length
			
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
		// eslint-disable-next-line vue/return-in-computed-property
		all_voters(){
			if(this.regVoters){

				return this.regVoters.map(voter => {
					let suspended = !!this.suspended.voters && this.suspended.voters.find(v => v == voter.uid)
					return {
						...voter,
						suspended
					}
				})
			}
		},
    electionStartDate(){
      let d = new Date(this.currElection.startDate + ' ' + this.currElection.startTime)
      return d.toLocaleString('en-US',{
        month: 'short',
        day: 'numeric',
        'year': 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
	
			if(this.currElection.timed){

				let start = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime()
				let end = new Date(this.currElection.endDate + ' ' + this.currElection.endTime).getTime();
				// let one_hour = 1000 * 60 * 60
				let now = new Date().getTime()
	
				if(start > now){
					return ['Not Started', 'primary', 'not_started'] // not started
				}
				else if(end > now){
					return ['In Progress', 'success', 'inprogress'] // in progress
				}
				else{
					return ['Ended','error', 'ended'] // ended
				}
			}

			else {
				switch(this.currElection.status){
					case 'inprogress': return ['In Progress', 'success', 'inprogress'];
					case 'ended': return ['Ended', 'error', 'ended'];
					default: return ['Not Started', 'primary', 'not_started']
				}

			}
      
		},
		electionId(){
			return this.$route.params.electionId
		},
    
  },
  methods:{
		prefillForm(){
			// console.log(this.currElection)

			this.form = Object.assign({}, this.currElection)
			this.form.title = this.currElection.title
			this.form.date = this.currElection.startDate
			this.form.time = this.currElection.startTime
			this.form.enddate = this.currElection.endDate
			this.form.endtime = this.currElection.endTime
			this.form.verification_method = this.currElection.verification_method

			this.form.roles = this.roles.map(role => {
				return {
					...role,
					disabled: true
				}
			})

			// bcs putting access_token in the form is not very reactive
			this.access_token = this.currElection.cont_access_token
			this.voter_access_token = this.currElection.voter_access_token
		},
		async copyLink(){

      let text = `${location.origin}/elections/${this.currElection.electionId}`
      await this.$helpers.copyToClipboard(text)

      this.$eventBus.$emit('Snackbar', {
        show: true,
        message: 'Link copied to clipboard',
        color: 'success'
      })
    },
		addrole(){
      if(this.role_input.length == 0){
        alert("Text should not be empty")
        return 
      }else{
        this.form.roles = [
					...this.form.roles,
					{
						title: this.role_input,
						value: this.role_input,
						description: this.role_input_desc,
						disabled: false,
					}
				]
				this.dialog = false;

        this.role_input = '' //empty it
        this.role_input_desc = ''
        }
      
		},
		async saveApprovedList(){
			
			this.loading = true
			let election = this.$gun.get('elections')
				.get(this.electionId)

			let i = 0

			// REMEMBER TO REMOVE NEW LINES
			let usernames = this.$sanitize(this.list).split(',')

			for (const username of usernames) {
				
				let u = await this.$gun.get('users').get(username).then()

				if(u){
					console.log(u)
					let already_added = !!this.approved_list.find(a => a == username)
					if(!already_added){
						console.log('returning', already_added)
						
						election.get('approved_list')
							// .get(username)
							.set(username)
					}
					
				}

				if(i+1 == usernames.length){

					this.$eventBus.$emit('Snackbar', {
						show: true,
						message: 'List saved',
						color: 'success'
					})

					this.loading = false
				}

				i++
			}
		},
		getApprovedList(){
			this.$gun.get('elections')
				.get(this.electionId)
				.get('approved_list')
				.map()
				.once(l => {
					this.approved_list.find(a => a == l) ? '' : 
					this.approved_list.push(l)

					console.log({l})
				})
		},
		uploadVoterList(){
			
			this.loading = true

			let formData = new FormData()
			formData.append( 'file', this.file)
			api().post('/convertCSV', formData).then(r => {
				// console.log({r})
				let phone_numbers = r.data.map(item => item.phone)
				
				this.saveApprovedList(phone_numbers)
			})
		},
		changeElectionStatus(new_status='inprogress'){
			if(!this.currElection.timed){

				this.$gun.get('elections')
					.get(this.electionId)
					.get('status').put(new_status)
					
				this.$eventBus.$emit('Snackbar', {
					show: true,
					message: 'Status Updated',
					color: 'success'
				})

			}
		},
		updateVotingSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			elecRef.put({
				who_can_vote: this.form.who_can_vote,
				allow_multiple_voting: this.currElection.type != 'Others' ? false : this.form.allow_multiple_voting,
				verification_method: this.form.verification_method,
        realtime_results: this.form.realtime_results,
        results_visible_to_all: this.form.results_visible_to_all,
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		updateScheduleSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			elecRef.put({
				startDate: this.form.date,
				startTime: this.form.time,
				endDate: this.form.enddate,
				endTime: this.form.endtime,
				timed: this.form.timed
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})

		},
		updateGeneralSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)
			
			elecRef.put({
				title: this.$sanitize(this.form.title),
				about: this.$sanitize(this.form.about),
				terms: this.$sanitize(this.form.terms),
				// allow_manifestos: this.form.allow_manifestos
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		updateRoles(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			let new_roles = this.form.roles.filter(r => r.disabled == false)

			new_roles.forEach(role => {

				let new_token = this.$uuidv4()

				elecRef.get('roles')
					.get(this.$uuidv4())
					.put({
						title: role.title,
						description: role.description,
						value: new_token
					})
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		async addContestant(){

			this.loading = true
			// upload contestant image
			let uploaded = await this.$helpers.uploadMedia({
				files: [this.form2.file]
			})

			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

				let contestantId = this.$uuidv4()
        let data = {
          electionId: this.electionId,
          date_created: this.$Gun.state(),
          author: {
						name: this.form2.name,
						photoURL: uploaded[0],
					},
					number: this.form2.contestant_number,
					suspended: false,
					contestantId: contestantId,
					role: this.form2.role
        }
      
        elecRef
          .get('contestants')
          .get(contestantId)
          .put(data)

        // contestant.get('role').put(this.form2.role)

				elecRef.get('contestants_count')
					.put(this.currElection.contestants_count + 1)

				this.loading = false
				this.add_contestant_dialog = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Successfull',
          color: 'success'
				})
				
				this.form2 = {
					name: '',
					role: '',
					contestant_number: '',
					file: null
				}

		},
		allowedDates(val){
			// only allow dates greater than or equal to today
			let today = this.today

			let toAllow = new Date(val).getTime()
	
			return today - toAllow - 24 * 60 * 60 * 1000 <= 0
    },
    allowedDates2(val){
			// only allow dates greater than or equal to today
			let startdate = new Date(this.form.date).getTime()
      
			let enddate = new Date(val).getTime()
	
			return startdate <= enddate
    },
    allowedHours(val){
      // only allow hours that are not yet past
			let curHour = new Date().getHours()
			let today = (new Date()).toISOString().substring(0,10)
      if(this.form.date == today){

				return curHour < val
			}
			else {
				return true
			}
    },
    allowedHours2(val){
    
      let starttime = this.form.time.split(':')[0]
      // console.log(starttime, val)

      if(this.form.date == this.form.enddate){
        return starttime < val
      }
      else {
        return true
      }
      
    },
		async uploadLogo(){
			
			this.uploading_logo = true
			
			return this.$helpers.uploadMedia({
				files: [this.logo],
				path: `logos/${this.currElection.electionId}`,
				file_name: `${this.currElection.title.split(' ').join('-')}-logo`
			}).then(res => {
				
				this.$gun.get('elections')
					.get(this.electionId)
					.get('logo')
					.put(res[0])

				this.uploading_logo = false
				
				this.$eventBus.$emit('Snackbar', {
					show: true,
					message: 'Logo uploaded',
					color: 'success'
				})
				return res
			})
			.catch(err => {
				console.log(err)
				this.uploading_logo = false
			})
			
		},
		async uploadBanner(){
			
			this.uploading_banner = true
			
			return this.$helpers.uploadMedia({
				files: [this.contest_banner],
				path: `banners/${this.currElection.electionId}`,
				file_name: `${this.currElection.title.split(' ').join('-')}-banner`
			}).then(res => {
				
				this.$gun.get('elections')
					.get(this.electionId)
					.get('contest_banner')
					.put(res[0])

				this.uploading_banner = false
				
				this.$eventBus.$emit('Snackbar', {
					show: true,
					message: 'Banner uploaded',
					color: 'success'
				})
				return res
			})
			.catch(err => {
				console.log(err)
				this.uploading_banner = false
			})
			
		},
		async getContestants(){

			this.$gun.get('elections')
				.get(this.electionId)
				.get('contestants')
				.map().on(async c => {

					// console.log({c})
					if(c){

						let author = await this.$gun
							.get(c.author).then()
	
						let contestant = Object.assign({}, c)
						// console.log(contestant)
						contestant.author = author
	
						let role = this.roles.find(r => r.soul == c.role['#'])
						contestant.role = role
						// console.log(contestant)
	
						// if(contestant.role){
	
							// this.contestants.find(ct => ct.contestantId == c.contestantId) ? '' : 
							this.contestants.push(contestant)
						// }
					}
					
				})
			
		},
    async setUp(){
      try {
				
				let username = this.getUser.username;
        // Set current election
				this.$gun.get('elections')
        .get(this.electionId)
        .on( async el => {

					let election = Object.assign({}, el)
					// console.log({election})

          if(election){
						if(election.admin == username){
							this.currElection = election

							// get election roles
							this.$gun.get('elections').get(this.electionId)
								.get('roles').map().on((r,key) => {

									let rn = Object.assign({}, r)
									rn.key = key
									rn.soul = r['_']['#']
									// console.log(r, key)
									this.roles.find(rl => rl.value == rn.value) ? '' : 
									this.roles.push(rn)
								})

							setTimeout(() => {
								
								this.showUi = true
							}, 1000)

							this.getApprovedList()
						}
						else {
							console.log('admin', election.admin)
							// this.$router.push('/not-found')
						}
					}
					else {
						this.$router.push('/not-found')
					}

					this.prefillForm()
				})


				this.getContestants()
				.then(()=>{

				// eslint-disable-next-line no-unused-vars
				}).catch(err=>{
					// console.log(err)
				})
				

      } catch (error) {
        // console.log(error)
      }
    },
    async deleteContestant(){
			this.loading = true
			// console.log(this.culprit)
			let elecRef = this.$gun.get('elections')
				.get(this.currElection.electionId)
				
				elecRef.get('contestants')
				.get(this.culprit.contestantId)
				.put(null)

				elecRef.get('contestants_count')
					.put(this.currElection.contestants_count*1 - 1)

			this.loading = false
			this.delete_dialog = false

			this.$eventBus.$emit('Snackbar', {
				message: 'Contestant Deleted',
				show: true,
				color: 'success'
			})

			this.contestants = this.contestants.filter(c => c.contestantId != this.culprit.contestantId)
			
    },
    
	},
	components:{
		LoadingBar,
		// BarChart,
		Navigation
	},
  async mounted(){
    try {
			this.setUp()
      
    } catch (error) {
      // console.log(error)
		}
		
		this.$eventBus.$on('Selected_Files', data => {
			if(data.selected_files[0].size > 1000000){
				alert('Logo must be less than 1mb')
			}
			else {

				this.logo = data.selected_files[0],
				this.blob_url = data.imgSrc[0]
			}
		})
    
	},
	beforeDestroy(){
		// this.elecRef.off()
	}
}
import Navigation from '@/components/Navigation'
import api from '@/services/api2'
import {mapGetters, mapState} from 'vuex'
import LoadingBar from '@/spinners/LoadingBar'
// import BarChart from '@/charts/barchart'
</script>
<style scoped>
  .linkify{
    cursor: pointer;
  }
  .v-card--offset {
    top: -70px;
    position: relative;
  }
</style>
