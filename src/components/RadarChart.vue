<script>
import { Radar } from 'vue-chartjs'

export default {
  extends: Radar,
  props: {
    labels: { type: Array, default: () => [] },
    datasets: { type: Array, default: () => [{ label: '', data: [] }] },
  },
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: 20,
        },
        legend: { display: true },
        scale: {
          ticks: {
            maxTicksLimit: 3,
            display: true,
            showLabelBackdrop: false,
          },
        },
        elements: {
          point: {
            radius: 3,
            borderWidth: 0,
          },
          line: {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            spanGaps: true,
          },
        },
      },
    }
  },
  watch: {
    datasets: function () {
      this.$data._chart.destroy()
      this.chartData = { labels: this.labels, datasets: this.datasets }
      this.renderChart(this.chartData, this.options)
    },
  },
  methods: {
    Update() {
      this.$data._chart.resize()
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
    //console.log(this.$data._chart.options)
  },
}
</script>
