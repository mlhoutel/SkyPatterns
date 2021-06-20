import Requests from '@/services/http/requests'

const base = process.env.VUE_APP_URL_API_SKYPATTERN

export default {
  get(url) {
    return Requests.get(`${base}${url}`)
  },
  put(url, data) {
    return Requests.put(`${base}${url}`, data)
  },
  post(url, data) {
    return Requests.post(`${base}${url}`, data)
  },
  delete(url) {
    return Requests.delete(`${base}${url}`)
  },
}
