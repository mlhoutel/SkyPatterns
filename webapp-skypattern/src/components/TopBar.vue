<template>
  <v-container>
    <v-app-bar app color="primary" dark dense height="50px">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-toolbar-title style="cursor: pointer" @click="goListeAnalyse()">SkyPattern Visualisation</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item @click="goListeAnalyse()">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Liste d'analyses</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goNouvelleAnalyse()">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Nouvelle analyse</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-list nav dense>
          <v-list-item :href="documentation" target="_blank" link>
            <v-list-item-icon><v-icon>mdi-file-document-multiple</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>Documentation</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item :href="sources" target="_blank" link>
            <v-list-item-icon><v-icon>mdi-xml</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>Sources</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item :href="about" target="_blank" link>
            <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>About</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </v-container>
</template>
<script lang="ts">
export default {
  name: 'TopBar',
  components: {},
  data() {
    return {
      drawer: false,
      group: null,
      documentation: process.env.VUE_APP_URL_DOCUMENTATION,
      sources: process.env.VUE_APP_URL_SOURCES,
      about: process.env.VUE_APP_URL_ABOUT,
    }
  },
  methods: {
    goListeAnalyse() {
      if (this.$route.name != 'ListeAnalyse') {
        this.$router.push({ name: 'ListeAnalyse' })
      }
    },
    goNouvelleAnalyse() {
      if (this.$route.name != 'NouvelleAnalyse') {
        this.$router.push({ name: 'NouvelleAnalyse' })
      }
    },
  },
}
</script>
<style lang="scss">
td {
  border: 1px solid #333;
}
thead {
  background-color: #333;
  color: #fff;
}
</style>
