<template lang="html">
    <div class="component">

      <h1>My Peers</h1>
      <button type="button" name="button" @click="disconnect()">Disconnect From Game</button>

      <div v-if='p2pNode == null'>
        <p>Loading</p>
      </div>
      <div v-else>
        <p>My ID: {{p2pNode.peerInfo.id.toB58String()}}</p>
        <p>{{p2pNode.registrar.connections.size}}</p>
        <ul>
          <li v-for="peer in p2pNode.registrar.connections" :key="peer[0]">
            Peer - {{ peer[0] }}
          </li>
        </ul>
      </div>

    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapState } from 'vuex'

  export default {
    name: 'Peers',
    components: {

    },
    methods: {
      ...mapActions([
        'disconnect',
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
