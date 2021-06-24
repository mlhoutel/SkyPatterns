<template>
  <div class="formulaire">
    <div id="dataSetFilter" class="divBlock">
      <h2>DataSet</h2>
      <h3 class="needed">Dataset's path ( -d )</h3>
      <v-select v-model="dataSetPath" :items="datasets" @change="LoadNoClass()" />

      <h3>Choose dataSet format ( --dat )</h3>

      <v-radio-group v-model="dataSetFormat">
        <v-radio type="radio" label="Binary" value="Binary" />
        <v-radio type="radio" label="Transactionnal" value="Transactionnal" />
      </v-radio-group>

      <v-checkbox v-model="dataSetClassTransaction" @click="checkNoClasses()" label="No classes ( --nc )" :disabled="!dataSetPath || datasetNoClass" />
    </div>

    <div id="patternFilter" class="divBlock">
      <h2>Parameters</h2>
      <div class="divBlock">
        <h3>Method</h3>
        <v-radio-group v-model="patternSubcommand">
          <v-radio @click="cpSky()" type="radio" label="cpsky" value="cpsky" />
          <v-radio @click="closedSky()" type="radio" label="closedsky" value="closedsky" />
        </v-radio-group>
      </div>
      <div class="divBlock">
        <h3>Type of patterns ( --pt )</h3>
        <v-radio-group v-model="patternType" @change="changePT()">
          <v-radio type="radio" label="Closed skypatterns" value="closedsky" />
          <v-radio type="radio" label="Skypatterns" value="sky" :disabled="patternSubcommand == 'closedsky'" />
          <v-radio type="radio" label="Closed patterns" value="closed" />
        </v-radio-group>
      </div>

      <div class="divBlock">
        <h3>Pattern measures ( -m )</h3>
        <div>
          <v-row>
            <v-col cols="auto"><v-checkbox v-model="withPatternMeasureFrequency" label="Frequency ( f )" :disabled="true" /></v-col>
            <v-col cols="auto"><v-checkbox @change="checkCstLength()" v-model="withPatternMeasureLength" :disabled="patternType == 'closed'" label="Length ( l )" @click="onMeasureLenght()" /></v-col>
            <v-col cols="auto"><v-checkbox v-model="withPatternMeasureArea" label="Area ( a )" :disabled="patternType == 'closed'" /></v-col>
            <v-col cols="auto"><v-checkbox v-model="withPatternMeasureGrowthRate" label="Growth-rate ( g )" :disabled="dataSetClassTransaction || patternType == 'closed'" /></v-col>
          </v-row>
        </div>
      </div>

      <div class="divBlock">
        <h3>Attribute measures ( -v )</h3>
        <div>
          <v-row>
            <v-col cols="auto"><v-checkbox v-model="attributeMeasureMin" label="Min ( m )" /></v-col>
            <v-col cols="auto"><v-checkbox v-model="attributeMeasureMax" label="Max ( M )" /></v-col>
            <v-col cols="auto"><v-checkbox v-model="attributeMeasureMean" :disabled="patternType == 'closed'" label="Mean ( n )" /></v-col>
            <v-col cols="auto"><v-checkbox v-model="attributeMeasureSum" :disabled="patternType == 'closed'" label="Sum ( u )" /></v-col>
          </v-row>
        </div>
      </div>

      <div class="divBlock">
        <h3>Constraints ( --cst )</h3>
        <v-text-field v-model="constraintMinFreq" type="number" label="Minimum frequency (in %)" placeholder="1" min="0" max="100" @change="checkMinFrequency()" :disabled="!withPatternMeasureFrequency" />
        <v-text-field v-model="constraintMinLength" type="number" label="Minimum lenght" placeholder="1" :disabled="cstLength" @change="checkMinLenght()" />
      </div>

      <div class="divBlock">
        <h3>Type of bitset ( --bst )</h3>
        <v-radio-group v-model="bitsetType">
          <v-radio type="radio" label="Sparse bitset" value="sparse" :disabled="patternSubcommand == 'cpsky'" />
          <v-radio type="radio" label="Classic bitset" value="classic" :disabled="patternSubcommand == 'cpsky'" />
          <v-radio type="radio" label="None" value="none" :disabled="patternSubcommand == 'cpsky'" />
        </v-radio-group>
      </div>

      <div class="divBlock">
        <h3>Strategy to branch on item ( --str )</h3>
        <v-select v-model="strategyBranchSelect" :items="strategyBranchSelectItems" label="Strategy branch" />
      </div>
    </div>

    <div id="otherFilter" class="divBlock">
      <h2>Other filters</h2>
      <v-checkbox v-model="traceSearch" :label="`Search tree ( --trace )`" disabled></v-checkbox>
      <v-checkbox v-model="statisticsSearch" :label="`Statistics about the search ( -s )`" disabled></v-checkbox>
      <v-checkbox v-model="jsonSearch" :label="`JSON search ( --json )`" disabled></v-checkbox>
      <v-checkbox v-model="printSkypattern" :label="`Print the skypattern ( -p --fp )`" disabled></v-checkbox>
      <v-text-field v-model="timeLimitSearch" type="number" label="Time limit of searching ( --tl ) in hours [0 to 24h]" min="0" max="24" placeholder="24" @change="checkTimeLimit()" />
    </div>
    <div class="create">
      <v-btn @click="newAnalysis()" elevation="2" height="50px" dark tile block color="#849fbc"><v-icon left size="25px">mdi-plus</v-icon>New analysis</v-btn>
    </div>
  </div>
</template>
<script>
import ApiSkyppattern from '@/services/http/api-skypattern'

const REFRESH_INTERVAL = 1000

export default {
  name: 'NouvelleAnalyse',
  data() {
    return {
      datasetNoClass: true,
      datasets: [],
      dataSetFormat: 'Binary', // ?
      dataSetClassTransaction: false, // ?
      dataSetPath: 'mushroom.dat', // path
      patternSubcommand: 'cpsky', // command
      patternType: 'sky', // pattern_types
      withPatternMeasureFrequency: true, // pattern_measures
      withPatternMeasureLength: false, // pattern_measures
      withPatternMeasureArea: false, // pattern_measures
      withPatternMeasureGrowthRate: false, // pattern_measures
      attributeMeasureMin: false, // attribute_measures
      attributeMeasureMax: false, // attribute_measures
      attributeMeasureMean: false, // attribute_measures
      attributeMeasureSum: false, // attribute_measures
      bitsetType: '', // bitset_type
      strategyBranchSelect: '', // strategy
      strategyBranchSelectItems: ['occ', 'mincov', 'minfreq', 'maxfreq', 'minval', 'maxval', 'minnorm', 'maxnorm', 'inpord'], // strategy
      constraintMinFreq: '', // minimum_frequency
      constraintMinLength: '', // minimum_length
      traceSearch: true,
      statisticsSearch: true,
      jsonSearch: true,
      printSkypattern: true,
      timeLimitSearch: 24,
      cstLength: true,
    }
  },
  methods: {
    async LoadNoClass() {
      await ApiSkyppattern.get(`/datasets/${this.dataSetPath}/noclasses`).then((response) => {
        this.datasetNoClass = response.data.noclasses
        if (this.datasetNoClass) {
          this.noclasses = true
        }
      })
    },
    onMeasureLenght() {
      if (!this.withPatternMeasureLength) {
        this.constraintMinLength = ''
      }
    },
    async refreshDatasets() {
      await ApiSkyppattern.get(`/datasets`).then((response) => {
        this.datasets = response.data
        // console.log('fetching datas...')
        setTimeout(() => {
          this.refreshDatasets()
        }, REFRESH_INTERVAL)
      })
    },
    closedSky() {
      this.patternType = 'closedsky'
    },
    cpSky() {
      this.strategyBranchSelect = 'occ'
      this.bitsetType = 'none'
    },
    changePT() {
      this.checkCstLength()
      this.checkClosedAttributeMeasure()
    },
    checkClosedAttributeMeasure() {
      if (this.patternType == 'closed') {
        this.withPatternMeasureArea = false
        this.withPatternMeasureLength = false
        this.withPatternMeasureGrowthRate = false
        this.attributeMeasureMean = false
        this.attributeMeasureSum = false
      }
    },
    checkCstLength() {
      if (!this.withPatternMeasureLength || this.patternType == 'closedsky') {
        this.cstLength = true
      } else {
        this.cstLength = false
      }
    },
    checkNoClasses() {
      if (this.dataSetClassTransaction) {
        this.withPatternMeasureGrowthRate = false
      }
    },
    checkTimeLimit() {
      if (Number(this.timeLimitSearch) > Number(24)) {
        this.timeLimitSearch = 24
      } else if (Number(this.timeLimitSearch) < Number(0)) {
        this.timeLimitSearch = 0
      }
    },
    checkMinFrequency() {
      if (Number(this.constraintMinFreq) > Number(100)) {
        this.constraintMinFreq = 100
      } else if (Number(this.constraintMinFreq) < Number(0)) {
        this.constraintMinFreq = 0
      }
    },
    checkMinLenght() {
      if (Number(this.constraintMinLength) < Number(0)) {
        this.constraintMinLength = 0
      }
    },
    newAnalysis() {
      const parametres = {
        command: this.patternSubcommand,
        path: this.dataSetPath,
        pattern_type: this.patternType,
        transactional: false,
        noclasses: false,
        // bitsetType: '', optionnal
        // strategy: '', optionnal
        // minimum_frequency: '', optionnal
        // minimum_length: '', optionnal
        // time_limit: '', optionnal
      }

      // pattern_measures

      if (this.withPatternMeasureLength || this.withPatternMeasureFrequency || this.withPatternMeasureArea || this.withPatternMeasureGrowthRate) {
        parametres['pattern_measures'] = []

        if (this.withPatternMeasureLength) {
          parametres.pattern_measures.push('length')
        }
        if (this.withPatternMeasureFrequency) {
          parametres.pattern_measures.push('frequency')
        }
        if (this.withPatternMeasureArea) {
          parametres.pattern_measures.push('area')
        }
        if (this.withPatternMeasureGrowthRate) {
          parametres.pattern_measures.push('growth-rate')
        }
      }

      // attribute_measures
      if (this.attributeMeasureMin || this.attributeMeasureMax || this.attributeMeasureMean || this.attributeMeasureSum) {
        parametres['attribute_measures'] = []
        if (this.attributeMeasureMin) {
          parametres.attribute_measures.push('min')
        }
        if (this.attributeMeasureMax) {
          parametres.attribute_measures.push('max')
        }
        if (this.attributeMeasureMean) {
          parametres.attribute_measures.push('mean')
        }
        if (this.attributeMeasureSum) {
          parametres.attribute_measures.push('sum')
        }
      }

      // transactional
      if (this.dataSetFormat == 'Transactionnal') {
        parametres['transactional'] = true
      }

      // noclasses
      if (this.dataSetClassTransaction) {
        parametres['noclasses'] = true
      }

      // bitset_type
      if (this.bitsetType != '' && this.bitsetType != 'none') {
        parametres['bitset_type'] = this.bitsetType
      }

      // strategie
      if (this.strategyBranchSelect != '') {
        parametres['strategy'] = this.strategyBranchSelect
      }

      // minimum_frequency
      if (this.constraintMinFreq != '') {
        parametres['minimum_frequency'] = this.constraintMinFreq
      }

      // minimum_length
      if (this.constraintMinLength != '') {
        parametres['minimum_length'] = this.constraintMinLength
      }

      // time_limit
      if (this.timeLimitSearch != '') {
        parametres['time_limit'] = this.timeLimitSearch
      }

      console.log(parametres)
      ApiSkyppattern.post(`/analysis/new`, parametres).then((response) => {
        if (response.status == 201) {
          this.$router.push({ name: 'ListeAnalyse' })
        }
      })
    },
  },
  computed: {
    isCPSky() {
      return this.patternSubcommand == 'cpsky'
    },
    isSelectionCPSky(value) {
      const strategies = ['occ', 'mincov', 'minfreq', 'maxfreq', 'minval', 'maxval', 'minnorm', 'maxnorm', 'inpord']
      const strat = value.toLowerCase()

      return strategies.includes(strat) ? isCPSky() : false
    },
  },
  mounted() {
    this.refreshDatasets().then(() => {
      if (this.datasets[0]) {
        this.dataSetPath = this.datasets[0] // initialise avec une valeur
        this.LoadNoClass()
      }
    })
  },
}
</script>
<style lang="scss">
.formulaire {
  margin-bottom: 60px;
}
.divBlock {
  border: 1px solid black;
  padding: 1em;
}
textarea {
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #999;
}
.needed {
  color: #ff8800;
}
</style>
>
