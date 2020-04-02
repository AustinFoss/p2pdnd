<template lang="html">
    <div class="component">

      <h1>My Peers</h1>
      <button type="button" name="button" @click="disconnectFromGame(); p2pNode.stop()">Disconnect From Game</button>
      <p>My ID: {{p2pNode.peerInfo.id.toB58String()}}</p>
      <p>{{p2pNode.peerStore.peers.size}}</p>
      <ul>
        <li v-for="peer in p2pNode.peerStore.peers" :key="peer[0]">
          Peer - {{ peer[0] }}
        </li>
      </ul>


    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapState } from 'vuex'

  export default {
    name: 'Peers',
    components: {

    },
    data() {
      return {
        node: {}
      }
    },
    methods: {
      ...mapActions([
        'disconnectFromGame',
        'initNode',
      ])
    },
    computed: {
      ...mapState([
        'inGame',
        'peerType',
        'p2pNode'
      ])
    },
    created(){
      this.initNode()
    }
  }
</script>

<style lang="css" scoped>
</style>
