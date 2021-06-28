<template>
  <SplitPane :side="50" :onResize="onResize">
    <template v-slot:left>
      <div class="table-container">
        <v-container fluid class="px-6 py-0" height="50px">
          <v-switch v-model="multiple" :label="`${multiple ? `Multiple` : `Simple`} - Displayed ${displayed} / ${max_displayed} Max`"></v-switch>
        </v-container>
        <v-system-bar window dark color="blue darken-3" height="30">{{ data.title }}</v-system-bar>
        <v-data-table
          fill-height
          :headers="getHeaders()"
          :footer-props="{ itemsPerPageOptions: [10, 20, 30, 100] }"
          :items="data.datasets"
          v-model="selected"
          item-key="label"
          class="select-table"
          height="calc(100vh - 260px)"
          show-select
        >
          <template v-slot:item="{ item, isSelected, select }">
            <tr :class="isSelected ? 'selected-row' : ''" @click="select(!isSelected)">
              <td><v-checkbox v-model="selected" :value="item" @click.native="select(!isSelected)" style="margin: 0px; padding: 0px" hide-details /></td>
              <td>{{ item.label }}</td>
              <td>{{ item.area }}</td>
              <td v-for="(prop, j) in item.data" :key="j">{{ prop }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </template>
    <template v-slot:right>
      <div class="graphs-container" :class="{ 'd-flex flex-wrap': multiple }">
        <RadarChart v-for="(data, i) in getDatasets" :key="`chart_${i}`" :class="{ 'multiple-charts': multiple }" class="charts" :labels="getLabels" :datasets="data" ref="charts" />
      </div>
    </template>
  </SplitPane>
</template>
<script>
import SplitPane from '@/components/SplitPane.vue'
import RadarChart from '@/components/RadarChart.vue'
import ApiSkyppattern from '@/services/http/api-skypattern'

export default {
  name: 'Visualisation',
  components: { SplitPane, RadarChart },
  data() {
    return {
      multiple: false,
      selected: [],
      displayed: 0,
      max_displayed: 50,
      data: {
        title: '',
        labels: [],
        datasets: [],
      },
      colors: ['rgba(120, 120, 230, 0.3)', 'rgba(255, 0, 0, 0.3)', 'rgba(50, 190, 50, 0.3)'],
    }
  },
  methods: {
    onResize: function () {
      for (const chart of this.$refs.charts) {
        chart.Update()
      }
    },
    getHeaders() {
      const temp_headers = [
        { text: 'Pattern', align: 'start', sortable: false, value: 'label', width: '130px' },
        { text: 'Top-k', value: 'area' },
      ]

      for (const index in this.data.labels) {
        temp_headers.push({ text: this.data.labels[index], value: `data[${index}]` })
      }

      return temp_headers
    },
  },
  computed: {
    getLabels: function () {
      return this.data.labels.map((e, i) => {
        return e || `Proprieté ${i + 1}`
      })
    },
    getDatasets: function () {
      const size = Math.min(this.max_displayed, this.selected.length)
      this.displayed = size

      const datasets = this.selected.slice(0, size).map((e, i) => {
        return { label: e.label || `Dataset ${i + 1}`, data: e.rdata, backgroundColor: this.colors[i % this.colors.length] } // Copie l'objet sans modifier l'original
      })

      if (this.multiple) {
        return datasets.map((e) => {
          return [e]
        })
      }
      return [datasets]
    },
    getNumCols: function () {
      const size = this.getDatasets.size
      if (size < 5) {
        return Math.round(size / 2)
      }
      return Math.round(size / 2) - 1
    },
  },
  mounted() {
    ApiSkyppattern.get(`/analysis/result/${this.$route.params.id}`).then((response) => {
      console.log(response)
      const title = response.data.title
      const method = title.substring(title.indexOf('_') + 1, title.indexOf('['))
      this.data.title = `Results of ${method.charAt(0).toUpperCase() + method.slice(1)} (${title})`
      this.data.labels = response.data.labels
      this.data.datasets = response.data.dataset

      console.log(this.data)
    })

    ApiSkyppattern.get(`/colors`).then((response) => {
      if (response.data) {
        this.colors = response.data
      }
    })
  },
}
</script>
<style lang="scss">
.table-container {
  height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: scroll;
}
.select-table thead {
  background-color: white !important;
}

.select-table tr td {
  border: 0px !important;
}

.selected-row {
  background-color: rgba(173, 216, 230, 0.8) !important;
}

.graphs-container {
  margin: 10px;
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.charts {
  width: auto;
  padding: 10px;
  margin: auto;
  max-width: 80vh;
  min-width: 300px;
}

.multiple-charts {
  max-width: 50vh;
}
</style>
