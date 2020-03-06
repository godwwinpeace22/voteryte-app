import {Radar} from 'vue-chartjs'
// const { reactiveProp } = mixins

export default {
  extends: Radar,
  // mixins: [reactiveProp],
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartdata, this.options)
  }
}