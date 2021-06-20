import ApiSkyppattern from '@/services/http/api-skypattern'

export default {
  async getListStatus({ commit }) {
    commit('setListStatus', await ApiSkyppattern.get(`/analysis/status`))
  },
}
