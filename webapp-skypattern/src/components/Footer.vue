<template>
  <v-footer dark padless fixed height="50px">
    <v-col text tile class="blue accent-3 white--text text-center"> {{ new Date().getFullYear() }} — IMT </v-col>
    <v-btn text tile :href="sources" target="_blank"><v-icon>mdi-gitlab</v-icon></v-btn>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer',
  data() {
    return {
      sources: process.env.VUE_APP_URL_SOURCES,
    }
  },
}
</script>
<style lang="scss"></style>
