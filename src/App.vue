<template>
  <v-app>
    <TopBar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Vue from 'vue'
import TopBar from '@/components/TopBar.vue'
import Footer from '@/components/Footer.vue'

export default Vue.extend({
  name: 'App',
  components: { TopBar, Footer },
})
</script>
