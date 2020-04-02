<template lang="html">
  <div class="main">
    <h1>Welcome!</h1>
    <h3>Do you want to play as a:</h3>
    <button type="button" name="dm" @click="connectToGame(true)">Dungeon Master</button>
    <p> or a </p>
    <button type="button" name="pc" @click="connectToGame(false)">Player Character</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Welcome',
    methods: {
      ...mapActions([
        'connectToGame'
      ])
    },
  }

</script>

<style lang="css" scoped>
</style>
