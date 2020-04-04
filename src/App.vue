<template>
  <div id="app">

    <div v-if="usingLocalAddr != null">
      <Peers/>
    </div>
    <div v-else>

      <Welcome/>

    </div>
  </div>
</template>

<script>
// Imported Components
import Peers from '@/components/Peers.vue'
import Welcome from '@/components/Welcome.vue'
// Imported Scripts
import { mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Peers,
    Welcome
  },
  computed: {
    ...mapState([
      'inGame',
      'usingLocalAddr'
    ])
  },
  methods: {
    ...mapActions([
    ])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
