import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'ListeAnalyse',
      component: () => import(/* webpackChunkName: "liste" */ '@/views/ListeAnalyse.vue'),
    },
    {
      path: '/nouvelle',
      name: 'NouvelleAnalyse',
      component: () => import(/* webpackChunkName: "nouvelle" */ '@/views/NouvelleAnalyse.vue'),
    },
    {
      path: '/visualisation/:id',
      name: 'Visualisation',
      component: () => import(/* webpackChunkName: "visualisation" */ '@/views/Visualisation.vue'),
    },
  ],
})
