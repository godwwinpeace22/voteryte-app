<template>
  <div>
    <vue-headful :title="title" :description="description"/>
    <navigation>
      <span slot="title">Create Contest</span>
    </navigation>

    <v-snackbar v-model="snackbar.show" dark :timeout="5000" :color="snackbar.color" top right>
      {{snackbar.message}}
      <v-btn dark color="white" text @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <v-card outlined v-if="showUi">
      <v-stepper v-model="step" class="white elevation-0" vertical>
      
        <v-stepper-step :complete="step > 1" step="1">
          Basic info
          <!-- <small>General information about the election</small> -->
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="12">
              <v-row>

                <v-col cols="12" sm="6">
                  <v-subheader class="pl-0 font-weight-bold">Title of Contest</v-subheader>
                  <v-text-field color="primary"
                    :rules="[rules.counter]" label="Title" outlined 
                    v-model="form.title" maxlength="100" counter small
                    hint="e.g NAPPS Elections 2019">
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-subheader class="pl-0 font-weight-bold">Contest Type
                    <v-dialog bottom max-width="500">
                      <template v-slot:activator="{on}">
                        <v-icon class="ml-3" v-on="on">mdi-help-circle</v-icon>
                      </template>
                      <span>
                        <v-card>
                          <v-card-title >
                            What election type should I use
                          </v-card-title>
                          <v-card-text>
                            <v-subheader class="font-weight-bold pl-0">School election</v-subheader>
                            <p>Use this if you are creating election for your department, faculty, or campus-wide/general elections,
                              post-graduate elections.
                            </p>
                            <!-- <v-subheader class="font-weight-bold pl-0">Governement election</v-subheader>
                            <p>For local, state, and federal governement elections, senate elections.
                            </p> -->
                            <v-subheader class="font-weight-bold pl-0">Others</v-subheader>
                            <p>For peagentries, reality shows, party elections, other groups and organizations.
                            </p>
                          </v-card-text>
                        </v-card>
                      </span>
                    </v-dialog>
                  </v-subheader>
                  <v-select required
                    v-model="form.type" outlined
                    :items="electionTypes"
                    item-text="text"
                    item-value="text"
                    item-disabled="disabled"
                    color="primary"
                    label="Select type"
                    persistent-hint
                    hint="Only students can create school elections"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="12" v-show="form.type == 'Government' || form.type == 'School'">
                  <v-subheader class="pl-0 font-weight-bold">
                    Level
                  </v-subheader>
                  <v-select required outlined v-model="form.level" 
                    :items="form.type == 'School' ? levels[0]: form.type == 'Governement' ? levels[1] : levels[2]" 
                    item-disabled="disabled" 
                    color="primary" label="Level" 
                    persistent-hint
                    hint="Note: You can create elections only in your department, faculty, or school.">
                  </v-select>
                </v-col>

              </v-row>
            </v-col>

          </v-row>

          <v-btn color="success" @click="step = 2" v-if="!disabled_step_one">
            Next step <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">Add a Schedule</v-stepper-step>
        <v-stepper-content step="2">
          
          <v-card class="mb-5 mr-1 ml-1 mt-3 pa-3" flat light>
            <v-subheader class="title primary--text pl-0 mb-0">Scheduling</v-subheader>
            
            <v-row>
              
              <v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['px-2'] : ''">
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
                    :allowed-dates="allowedDates" 
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
                    v-model="form.time" header-color='primary'
                    :allowed-hours="allowedHours">
                    <v-spacer></v-spacer>
                      <v-btn text  @click="modal2 = false">Cancel</v-btn>
                      <v-btn text color="success" outlined @click="$refs.dialog2.save(form.time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>

              <v-col cols="6" sm="6">
              <v-subheader class="font-weight-bold mb-0 pl-0">End date</v-subheader>

              <v-dialog ref="dialog6" v-model="modal4" :return-value.sync="form.enddate"
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
                    <v-btn text   @click="modal4 = false">Cancel</v-btn>

                    <v-btn text small outlined color="success" 
                    @click="$refs.dialog6.save(form.enddate)">OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
              <v-subheader class="mb-0 pl-0 font-weight-bold">End time</v-subheader>

              <v-dialog ref="dialog3" v-model="modal3" :return-value.sync="form.endtime"
                persistent width="290px">

                <template v-slot:activator="{on}">
                  <v-text-field  v-on="on" v-model="form.endtime"  
                    label="Time" color="primary" readonly outlined>
                    <v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
                  </v-text-field>
                </template>

                <v-time-picker v-if="modal3" format="ampm" 
                  :allowed-hours="allowedHours2" 
                  v-model="form.endtime" 
                  header-color='primary'>
                  <v-spacer></v-spacer>

                    <v-btn text  @click="modal3 = false">Cancel</v-btn>
                    <v-btn text color="success" outlined 
                      @click="$refs.dialog3.save(form.endtime)">
                      OK</v-btn>
                </v-time-picker>

              </v-dialog>
            </v-col>

              <v-col sm="12" style="padding-bottom:0px;">
                <v-subheader class="font-weight-bold pl-0 mb-0">Set Timer</v-subheader>
                <v-switch 
                  class="mt-0"
                  v-model="form.timed" 
                  label="Contest begins and ends automatically at the selected date and time"
                  color="success">
                </v-switch>
              </v-col>
            </v-row>
          </v-card>

            <v-btn text @click="step = 1" color="grey">
            <v-icon small>mdi-chevron-left</v-icon>
            Previous
          </v-btn>
          <v-btn color="success" @click="step = 3" v-if="!disabled_step_two">
            Next step <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

        </v-stepper-content>

        <v-stepper-step :complete="step > 3" step="3">Contestants and Roles</v-stepper-step>
        <v-stepper-content step="3">
          <v-card flat class="ma-0 mb-5" style="min-height:200px;" light>
            <v-toolbar light flat height="50px">
              <v-toolbar-title class="">Select Roles</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" class="text-capitalize"
                depressed left 
                @click.native.stop="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
                New Role
              </v-btn>
            </v-toolbar>
            
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title primary-title class="title mb-0 pb-0">Create A New Role</v-card-title>
                <v-card-text>
                  <v-text-field label="Role title" v-model="role_input" color="primary" 
                    hint="e.g president, secretary, vice-chancellor"></v-text-field>
                  <small class="grey--text"></small>
                  <p>
                    <small class="grey--text">* try not to use abbreviations</small>
                  </p>
                  <v-divider></v-divider>
                  <v-textarea v-model="role_input_desc"
                    label="Role description (optional)" outlined
                    name="name" color="primary" hint="e.g what this role can do"
                  ></v-textarea>
                </v-card-text>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn text @click.native="dialog = false">Cancel</v-btn>

                    <v-btn text color="success" 
                    @click.native="addrole" 
                    :disabled="!role_input.trim()">
                    Add role</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-select class="mt-4" deletable-chips
              v-model="form.roles" dense
              :items="form.roles" return-object
              item-text="title" cache-items
              color="primary"
              chips label="Roles"
              multiple outlined
            ></v-select>

            <!-- <v-subheader class="font-weight-bold mb-2 pl-0">Who can contest in this contest?</v-subheader>
            <v-radio-group class="" v-model="form.who_can_contest" mandatory>
              <v-radio label="Anyone" value="everyone"></v-radio>
              <v-radio label="Invite only" value="manual"></v-radio>
            </v-radio-group> -->
            
          </v-card>
          <v-card-actions>
              <v-btn text @click="step = 2" color="grey">
              <v-icon small>mdi-chevron-left</v-icon>
              Previous
            </v-btn>
            <v-btn color="success" depressed @click="step = 4" v-if="!disabled_step_three">
              Next step <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
          
        </v-stepper-content>
        
        <v-stepper-step :complete="step > 4" step="4">Voting and results</v-stepper-step>
        <v-stepper-content step="4">
          <v-card color="" flat class="mb-5" light>
            <v-card-text class="px-0">

              <v-subheader class="font-weight-bold mb-2">Who Can Vote</v-subheader>
              
              <v-radio-group class="ml-md-4" v-model="form.who_can_vote" mandatory>
                
                <v-radio 
                  label="Open - Anyone can vote" 
                  value="anyone"></v-radio>
                <!-- <v-radio 
                  label="Only those with access token can vote" 
                  value="anyone_with_access"></v-radio> -->
                <v-radio 
                  label="Invite only - Voting is limited to users you specify" 
                  value="manual"></v-radio>
              </v-radio-group>

              <v-divider class="m"></v-divider>

              <v-list three-line subheader>
                <v-subheader class="font-weight-bold mb-0">Voting</v-subheader>
                <v-list-item :disabled="form.type != 'Others'">
                  <v-list-item-action>
                    <v-checkbox 
                      :disabled="form.type != 'Others'"
                      v-model="form.allow_multiple_voting"
                      class="mt-0"
                      color="success">
                    </v-checkbox>
                    
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Allow multiple voting</v-list-item-title>
                    <v-list-item-subtitle>Voters vote more than once</v-list-item-subtitle>
                    <!-- <v-list-item-subtitle 
                      class="warning--text">
                      Note: This option is not available for school and government elections.
                    </v-list-item-subtitle> -->
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
                <v-subheader class="font-weight-bold mb-0">Result</v-subheader>
                <v-list-item>
                  <v-list-item-action>
                    <v-checkbox v-model="form.realtime_results"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Real-time results</v-list-item-title>
                    <v-list-item-subtitle>Show results in real time as votes are casted, otherwise after the contest.</v-list-item-subtitle>
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
          </v-card>

            <v-btn text @click="step = 3" color="grey">
            <v-icon small>mdi-chevron-left</v-icon>
            Previous
          </v-btn>
            <v-btn depressed @click="step = 5" color="primary">
            Next
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>

        </v-stepper-content>

        <v-stepper-step :complete="step > 5" step="5">Payment</v-stepper-step>
        <v-stepper-content step="5">
          <v-card flat >
            <div class="v-card__title">Complete your setup</div>
            <v-card-text class="px-0">
              <p>Simple pay per contest pricing. Select the right plan below to finish creating your contest.</p>

              <v-row justify="center">
                <v-col cols="12" sm="6" v-for="plan in plans" :key="plan.amount + '-a'">
                  <v-card outlined>
                    <div class="mt-4 text-center">
                      {{plan.no_of_voters}}
                    </div>
                    <!-- <v-divider></v-divider> -->
                    <div class="title text-center py-4">
                      <span>$ {{plan.amount}}</span>
                    </div>

                    <v-card-actions class="px-1">
                      
                      <v-btn v-if="plan.amount == 'Custom'"
                        color="info" class="mx-auto px-5" depressed target="_blank"
                        href="https://voteryte.com/contact">
                        Let's talk
                      </v-btn>
                      <v-btn v-else
                        color="info" class="mx-auto px-8" outlined
                        @click="selected_plan = plan; plan_dialog = true;">
                        Select
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              
              <v-btn text href="https://voteryte.com/pricing" 
                color="primary" target="_blank" rel="noopener">
                See detailed pricing
                <v-icon small class="ml-1">mdi-open-in-new</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
          

          <v-btn text @click="step = 4" color="grey">
            <v-icon small>mdi-chevron-left</v-icon>
            Previous
          </v-btn>
        </v-stepper-content>

      </v-stepper>
    </v-card>

    <v-card v-else flat height="400">
      <v-card-text class="text-center">
        <h2 class="mb-5">Account Not Verified</h2>
        <p>You need to first verify your account </p>
        <v-btn color="info" depressed to="/settings#verification">Proceed</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="plan_dialog" max-width="350">
      <v-card>
        <v-card-title primary-title>
          Selected Plan
        </v-card-title>
        <v-card-text>
          You have selected the plan: {{selected_plan.max_voters}} voters at
          ${{selected_plan.amount}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <paystack 
            v-if="selected_plan.amount > 0"
            :amount="selected_plan.amount * 100"
            :email="getUser.email"
            :metadata="metadata"
            :paystackkey="$paystackKey"
            :reference="$helpers.getRandomString()"
            :callback="verifyTxn"
            :close="onClose"
            :embed="false"
          >
            <v-btn class="ml-0 mt-3" depressed block color="primary">Make Payment</v-btn>
          </paystack>
            <v-btn class="ml-0 mt-3" 
              depressed block 
              v-else @click="createNewElection"
              color="primary">
              Create Election
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- < Creating Election Progress Dialog> -->
    <v-dialog v-model="progress_dialog"
      persistent width="300"  >
      <v-card color="primary" dark class="justify-center">
        <v-card-text>
          <v-row>
            <v-col>
              {{p_text}}
            </v-col>
            <v-col>
              <v-progress-circular
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-circular>
            </v-col>
          </v-row>
          
          
        </v-card-text>
      </v-card>
      
    </v-dialog>

  </div>
</template>
<script>

export default {
  data: ()=>({
    showUi: false,
    step: 1,
    title: 'Create A Contest | Voteryte',
    description: '',
    snackbar: {},
    plan_dialog: false,
    selected_plan: 'a',
    loading: false,
    p_text: 'Verifying...',
    progress_dialog: false,
    role_input: '',
    role_input_desc: '',
    dialog: false,
    dialog2: false,
    dialog3: false,
    modal: false,
    modal2: false,
    modal3: false,
    modal4: false,
    today: new Date().getTime(),
    electionId: null,
    form: {
      title: '',
      type: '',
      school: '',
      level: '',
      timed: true,
      faculty: '',
      department: '',
      date: '',
      enddate: '',
      endtime: '',
      time: '',
      roles: [
        {title:'president', value:'president', description:''},
        {title:'secretary', value:'secretary', description:''},
        {title:'treasurer', value:'treasurer', description:''},
        {title:'financial secretary', value:'financial secretary', description:''},
        {title:'vice president', value:'vice president',description:''},
      ],
      who_can_vote: 'manual',
      // who_can_contest: 'everyone',
      allow_multiple_voting: false,
      realtime_results: true,
      results_visible_to_all: true,
      verification_method: false,
    },
    rules: {
      counter: value => value.length <= 100 || 'Max 100 characters',
    },

  }),
  watch: {
    'form.date': function(){
      this.form.enddate = ''
      this.form.endtime = ''
    },
    'form.enddate': function(){
      this.form.endtime = ''
    },
    'form.time': function(){
      this.form.enddate = ''
      this.form.endtime = ''
    }
  },
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    levels() {
      return [
        [
          {text: 'Students Union Election', value: 'General', disabled: !this.getUser.sch},
          {text: 'Faculty Election', value: 'Faculty', disabled: !this.getUser.fac},
          {text: 'Departmental Election', value: 'Department', disabled: !this.getUser.dept}
        ],
        // ['Federal', 'State','Local governement'],
        ['General']
      ]
    },
    plans(){
      return [
        { amount: 0, 
          max_voters: 20,
          no_of_voters: 'Up to 20 voters'
        },
        {
          amount: 10000,
          max_voters: 2000,
          no_of_voters: 'Up to 2,000 voters'
        },
        {
          amount: 20000, 
          max_voters: 10000,
          no_of_voters: 'Up to 10,000 voters'
        },
        {
          amount: 'Custom',
          max_voters: 'Custom',
          no_of_voters: 'Custom',
        },
      ]
    },
    metadata(){
      return {
        orderid: this.$helpers.getRandomString(),
        custom_fields: [
          {
            display_name: "Amount Paid",
            variable_name: "amount_paid",
            value: this.selected_plan.amount
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: this.getUser.name
          },
          {
            display_name: "CustomerId",
            variable_name: "customer_id",
            value: this.getUser.username
          }
        ]
      }
    },
    electionTypes(){
      return [

        {text:'School', disabled: !this.getUser.is_student},
        // {text:'Organizations', disabled: false},
        // {text:'Governement - comming soon',disabled: true},
        {text:'Others', disabled: false},
      ]
    },
    disabled_step_one(){
      return !this.form.title.trim() || this.form.title.trim().length > 100 || !this.form.type || 
      (this.form.type == 'School' && !this.form.level) 
      // || (this.form.type == 'Governement' && !this.form.level)
       
    },
    disabled_step_two(){
      return this.form.timed && 
      (!this.form.date || 
      !this.form.time || 
      !this.form.enddate || 
      !this.form.endtime)
      
    },
    disabled_step_three(){
      return this.form.roles.filter(role => role != false).length == 0
    },
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ])
  },
  methods:{
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
    addrole(){
      if(this.role_input.length == 0){
        alert("Title should not be empty")
        return 
      }else{
        this.dialog = false;
        this.form.roles.push({
          title: this.$sanitize(this.role_input),
          value: this.$sanitize(this.role_input),
          description: this.$sanitize(this.role_input_desc)
        })
        this.role_input = '' //empty it
        this.role_input_desc = ''
        }
      
    },
    createNewElection(){
      // create an election

      this.progress_dialog = true
      this.p_text = 'Creating Election...'

      let electionId = randomWords({exactly: 2, maxLength: 6, join: '-'}) + '-' + this.$helpers.getRandomNumber(6)

      this.form.title = this.$sanitize(this.form.title)

      let election_data = {
        title: this.$sanitize(this.form.title),
        type: this.form.type,
        level: this.form.level,
        timed: this.form.timed,
        electionId: electionId,
        sch: this.getUser.sch,
        fac: this.getUser.fac,
        dept: this.getUser.dept,
        startDate: this.form.date,
        endDate: this.form.enddate,
        startTime: this.form.time,
        endTime: this.form.endtime,
        contestants_count: 0,
        voters_count: 0,
        voterSize: this.selected_plan.max_voters,
        votersByDept: {},
        votes_by_dept: {},
        who_can_vote: this.form.who_can_vote,
        allow_multiple_voting: this.form.type != 'Others' ? false : this.form.allow_multiple_voting,
        realtime_results: this.form.realtime_results,
        results_visible_to_all: this.form.results_visible_to_all,
        verification_method: this.form.verification_method ? 'bvn' : 'default',
        // who_can_contest: this.form.who_can_contest,
        // enable_forum: true,
        allow_manifestos: true,
        dateCreated: this.$Gun.state(),
        status: 'not_started',
        official: false,
      }

      // create the election
      let election = this.$gun.get('elections')
        .get(electionId)
        .put(election_data)


      // set the admin for the election
      let user = this.$gun.get('users').get(this.getUser.username)
      election.get('admin').put(this.getUser.username)
      election.get('admins').set(user)

      // add the roles
      this.form.roles.forEach(role=>{
        let new_token = this.$uuidv4()
        
        election.get('roles')
        .get(this.$uuidv4())
        .put({
          title: role.title,
          description: role.description,
          value: new_token,
        })
      })

      // save the election for the creator
      let el = this.$gun.get('elections').get(electionId)

      user.get('created')
        .set(el)

      
      this.progress_dialog = false;
      this.plan_dialog = false;

      //this.loading = !this.loading
      this.snackbar = {
        show: true,
        message: 'Election created successfully',
        color: 'success'
      }

      setTimeout(() => {
        this.$router.push(`/elections/${electionId}/manager`)
      }, 2000)


    },
    prefillForm(user){
      this.form.school = user.sch
      this.form.faculty = user.fac

      this.form.department = user.dept
    },
    onClose(){
      
    },
    verifyTxn(res){
      // verfy on the server that the transaction is ok
      this.progress_dialog = true
      this.p_text = 'Verifying...'
      
      this.$helpers.verifyTxn({
        amount: this.selected_plan.amount,
        ref: res.reference
      })
      .then(() => {
        this.createNewElection()
      })
      .catch(err => {

        console.log(err)

        this.snackbar = {
          show: true,
          message: 'Transaction not completed',
          color: 'error'
        }
      })
      
    },
  },
  mounted(){
    if(this.getUser.acc_type != 'group'){
      this.$router.push('/notFound')
    }
    else {
      this.showUi = true
    }

  },
  components: {
    
    paystack,
  },
  
}

  import { mapGetters, mapState } from 'vuex'
  import paystack from 'vue-paystack'
  import randomWords from 'random-words'
</script>
<style lang='scss' scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  .round{
    @include borderRadius(15px)
  }
  
  //.v-stepper{
   // min-height:100vh;
  //}
  
</style>
)