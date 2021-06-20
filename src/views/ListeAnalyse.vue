<template>
  <SplitPane :side="20">
    <template v-slot:left>
      <div class="filtrage">
        <h2>Filters</h2>
        <v-text-field prepend-inner-icon="mdi-magnify" v-model="nomFiltre" label="Name filter" outlined clearable></v-text-field>
        <v-select multiple :items="statusFilter" v-model="statusSelected" label="Status filter" outlined>
          <template slot="item" slot-scope="data">
            <div :style="colorStatus(data.item)">{{ data.item }}</div>
          </template>
          <template slot="selection" slot-scope="data">
            <div :style="colorStatus(data.item)" class="selected-items">{{ data.item }}</div>
          </template>
        </v-select>
      </div>
    </template>
    <template v-slot:right>
      <div class="results">
        <div class="display">
          <table cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Visualize</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(analysis, i) in filteredAnalysis()" :key="i">
                <td>{{ analysis.name }}</td>
                <td :style="colorStatus(analysis.status)">{{ analysis.status }}</td>
                <td>{{ analysis.date }}</td>
                <td>
                  <v-btn v-if="isAvaillable(analysis.status)" @click="openAnalysis(analysis.name)" elevation="0" tile block color="transparent" height="50px">
                    Open
                    <v-icon right size="25px">mdi-open-in-new</v-icon>
                  </v-btn>
                  <v-btn v-else-if="isRunning(analysis.status)" elevation="0" tile block color="transparent" height="50px">
                    <v-progress-circular indeterminate color="grey" width="3" size="25"></v-progress-circular>
                  </v-btn>
                  <v-btn v-else elevation="0" tile block color="transparent" height="50px" disabled>
                    Open
                    <v-icon right size="25px">mdi-open-in-new</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn elevation="0" @click="removeAnalysis(analysis.name)" tile block color="transparent" height="50px" :disabled="isRunning(analysis.status)">
                    Remove
                    <v-icon right size="25px">mdi-close</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="create">
          <v-btn @click="newAnalysis()" elevation="2" height="50px" dark tile block color="#849fbc"><v-icon left size="25px">mdi-plus</v-icon>New analysis</v-btn>
        </div>
      </div>
    </template>
  </SplitPane>
</template>
<script>
import SplitPane from '@/components/SplitPane.vue'
import { mapState } from 'vuex' // TODO
import ApiSkyppattern from '@/services/http/api-skypattern'

const REFRESH_INTERVAL = 1000

export default {
  name: 'ListeAnalyse',
  components: { SplitPane },
  data: () => ({
    adresseFichier: '',
    nomFiltre: '',
    statusFilter: ['ONGOING', 'COMPLETE', 'STOPPED'],
    statusSelected: [],
    analysis: [],
  }),
  computed: {
    ...mapState('commonStore', ['listStatus', 'testStore']),
  },
  methods: {
    refreshAnalysis() {
      ApiSkyppattern.get(`/analysis/status`).then((response) => {
        this.analysis = response.data
        // console.log('fetching datas...')
        setTimeout(() => {
          this.refreshAnalysis()
        }, REFRESH_INTERVAL)
      })
    },
    filteredAnalysis() {
      if (this.analysis == undefined) {
        return []
      }
      let filtered = this.analysis.filter((e) => e.name.toLowerCase().includes(this.nomFiltre.toLowerCase()))
      if (this.statusSelected && this.statusSelected.length) {
        filtered = filtered.filter((e) => {
          let found = false
          this.statusSelected.forEach((s) => {
            if (e.status.toLowerCase() == s.toLowerCase()) {
              found = true
            }
          })
          return found
        })
      }
      return filtered
    },
    colorStatus(status) {
      let color = 'grey'
      if (status == 'ONGOING') {
        color = '#F76a11'
      }
      if (status == 'COMPLETE') {
        color = '#2ec075'
      }
      if (status == 'STOPPED') {
        color = '#9d1113'
      }
      return { color: color, 'font-weight': 'bold' }
    },
    isAvaillable(status) {
      const labelFinished = 'COMPLETE'
      return status.toLowerCase() == labelFinished.toLowerCase()
    },
    isRunning(status) {
      const labelRunning = 'ONGOING'
      return status.toLowerCase() == labelRunning.toLowerCase()
    },
    removeAnalysis(name) {
      ApiSkyppattern.delete(`/analysis/status/${name}`).then((response) => {
        if (response.status == 200) {
          console.log(response)
          const id = this.analysis.findIndex((e) => {
            return e['name'] == name
          })
          if (id != -1) {
            this.analysis.splice(id, 1)
          }
        }
      })
    },
    openAnalysis(id) {
      this.$router.push({ name: 'Visualisation', params: { id: id } })
    },
    newAnalysis() {
      this.$router.push({ name: 'NouvelleAnalyse' })
    },
  },
  mounted() {
    this.refreshAnalysis()
  },
}
</script>
<style lang="scss">
.filtrage {
  padding: 20px;
  margin: 0px;
  height: 100%;
  width: 100%;
}
.results {
  display: flex;
  flex-flow: column;
  height: calc(100vh - 100px);
  overflow: hidden;
}
.display {
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.display table {
  width: 100%;
  text-align: center;
  position: relative;
}
.display table,
.display tr,
.display td {
  border: none;
}
.display thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #849fbc;
}
.create {
  flex: 0 1 50px;
  margin: 0px;
  padding: 0px;
}
.selected-items {
  font-size: 0.9em;
  padding: 3px;
}
</style>
