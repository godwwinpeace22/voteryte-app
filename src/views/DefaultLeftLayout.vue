<template>
  <div>
    <elections-list/>
    <!-- <campaigns-list/> -->
    <!-- <list-events/> -->
  </div>
</template>

<script>
export default {
  data: () =>({
    
  }),
  computed: {
    layout(){
      return 'default'
    }
  },
  components: {
    // ListEvents,
    // CampaignsList,
    ElectionsList,
  }
}

// import CampaignsList from '@/components/campaigns/CampaignsList'
import ElectionsList from '@/components/elections/ElectionsList'
// import ListEvents from '@/components/events/ListEvents'
</script>

<style>

</style>