import Vue from 'vue'
import Vuex from 'vuex'
const commonStore = require('@/store/modules/common/common.module')

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    commonStore,
  },
})
