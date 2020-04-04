import Vue from 'vue'
import Vuex from 'vuex'
import Libp2p from 'libp2p'
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    p2pNode: null, // the libp2p node instance and API access
    peerType: false, //false for pc, true for dm
    placeholderIP: '', // If using P2P and no IP is provided use this one
    remoteIP: '',
    remoteAddr: `/ip4/45.32.229.107/tcp/9090/wss/p2p-webrtc-star/p2p/`,
    localAddr: '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
    usingLocalAddr: null
  },

  mutations: {
    connect(state, lan) {
      // First update the usingLocalAddr state
      if(lan == true) {
        state.usingLocalAddr = true
      } else {
        state.usingLocalAddr = false
      }
    },
    setRemoteIP(state, value) {
      state.reomteIP = value
    },
    disconnect(state) {
      state.p2pNode.stop()
      state.usingLocalAddr = null
      state.remoteIP = ''
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
      if(this.state.usingLocalAddr == false) {
        if(this.state.remoteIP == '') {
          webrtcAddr = `/ip4/${this.state.placeholderIP}/tcp/9090/wss/p2p-webrtc-star/p2p/${libp2p.peerInfo.id._idB58String}`
        } else {
          webrtcAddr = `/ip4/${this.state.remoteIP}/tcp/9090/wss/p2p-webrtc-star/p2p/${libp2p.peerInfo.id._idB58String}`
        }
      } else {
        webrtcAddr = this.state.localAddr
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
        dispatch('syncNode', libp2p)
        console.log(this.state.p2pNode.registrar.connections.size);
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
    connect({ commit }, lan) {
      commit('connect', lan)
    },
    setRemoteIP({ commit }, value) {
      commit('setRemoteIP', value)
    },
    disconnect({ commit }) {
      commit('disconnect')
    },
  },

  modules: {
  }

})
