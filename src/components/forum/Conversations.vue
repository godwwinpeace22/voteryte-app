<template>
  <v-card outlined tile class="mb-3">
    <v-card-text>
    <div>Your forums</div>
      <v-list dense flat>
        <v-list-item-group v-model="item" color="primary">
          <template v-for="(item,i) in getMyEnrolled">
            <v-list-item 
              :key="item.electionId +'-' + i"
              :to="`/forum/${item.electionId}`">
              <v-list-item-title>
                {{item.title}}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
      
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    item: 1
  }),
  computed: {
    ...mapGetters([
      'getMyEnrolled'
    ]),
    ...mapState([
      'is_verified'
    ])
  }
}

import { mapGetters, mapState } from "vuex";
</script>

<style>

</style>