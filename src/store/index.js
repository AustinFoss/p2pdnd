import Vue from 'vue'
import Vuex from 'vuex'
const Libp2p = require('libp2p')
const Websockets = require('libp2p-websockets')
const WebRTCStar = require('libp2p-webrtc-star')
const Secio = require('libp2p-secio')
const Mplex = require('libp2p-mplex')
const remoteAddr = '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star/p2p/'
const localAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star'
const usingLocalAddr = true

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    p2pNode: null, // the libp2p node instance and API access
    inGame: false,
    peerType: false, //false for pc, true for dm
  },

  mutations: {
    inGameChange(state) {
      if(state.inGame==false){
        state.inGame=true
      } else {
        state.inGame=false
      }
    },
    peerTypeSet(state, peerType) {
      state.peerType = peerType
    },
    syncNode(state, libp2p) {
      Vue.set(state, 'p2pNode', null); // This must be inserted first in order for Vuex to detect the state state change 
      Vue.set(state, 'p2pNode', libp2p);
    }
  },

  actions: {
    // The LibP2P Node
    async initNode({dispatch}) {
      const libp2p = await Libp2p.create({
         modules: {
           transport: [Websockets, WebRTCStar],
           connEncryption: [Secio],
           streamMuxer: [Mplex]
         }
      })

      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      let webrtcAddr = ''
      if(usingLocalAddr == false) {
        webrtcAddr = remoteAddr + libp2p.peerInfo.id._idB58String
      } else {
        webrtcAddr = localAddr
      }
      console.log(`Connecting to WebRTC Server: ${webrtcAddr}`);
      libp2p.peerInfo.multiaddrs.add(webrtcAddr)

      // Listen for new peers
      libp2p.on('peer:discovery', (peerInfo) => {
        console.log(`Found peer ${peerInfo.id.toB58String()}`)
      })

      // Listen for new connections to peers
      libp2p.on('peer:connect', (peerInfo) => {
        console.log(this.state.p2pNode.registrar.connections.size);
        dispatch('syncNode', libp2p)
        console.log(`Connected to ${peerInfo.id.toB58String()}`)
      })

      // Listen for peers disconnecting
      libp2p.on('peer:disconnect', (peerInfo) => {
        console.log(this.state.p2pNode.registrar.connections.size);
        dispatch('syncNode', libp2p)
        console.log(`Disconnected from ${peerInfo.id.toB58String()}`)
      })

      await libp2p.start()
      console.log(`libp2p id is ${libp2p.peerInfo.id.toB58String()}`)

      // Export libp2p to the window so you can play with the API
      window.libp2p = libp2p
      //
      // this.state.p2pNode = libp2p

      dispatch('syncNode', libp2p)

    },
    syncNode({ commit }, libp2p) {
      commit('syncNode', libp2p)
    },

    connectToGame({ commit }, peerType) {
      commit('inGameChange')
      commit('peerTypeSet', peerType)
    },
    disconnectFromGame({ commit }) {
      commit('inGameChange')
    },
  },

  modules: {
  }

})
