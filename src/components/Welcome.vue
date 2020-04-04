<template lang="html">
  <div class="main">

    <h1>Welcome!</h1>

    <h3>Connect to Game Over</h3>
    <button type="button" name="button" @click="connect(true)">Local Area Network (LAN)</button>
    <p> or </p>
    <button type="button" name="button" @click="setRemoteIP(ip, false)">Peer to Peer (P2P)</button>
    <p>@</p>
    <input v-model="ip" maxlength="15" placeholder="255.255.255.255">

  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapState } from 'vuex'

  export default {
    name: 'Welcome',
    data() {
      return {
        ip: ''
      }
    },
    computed: {
      ...mapState([
        'remoteIP'
      ]),
    },
    methods: {
      ...mapActions([
        'connect',
        'disconnect',
        'setRemoteIP'
      ])
    },
  }

</script>

<style lang="css" scoped>
</style>
