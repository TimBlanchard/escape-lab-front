import * as Three from 'three'
import { AmbientLight, DirectionalLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Vue from 'vue'
import Vuex from 'vuex'

import { ACTIONS, MUTATIONS, STATE } from '@/store/modules/three/helpers'

Vue.use(Vuex)

export const state = {
  [STATE.camera]: null,
  [STATE.scene]: null,
  [STATE.renderer]: null,
  [STATE.meshGame1]: null,
  [STATE.popup]: null
}

export const mutations = {
  [MUTATIONS.initCam](state) {
    state[STATE.camera] = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
    state[STATE.camera].position.z = 1
  },
  [MUTATIONS.setCamPosition](state, { x, y, z }) {
    if (state.camera) {
      console.log('chaud')
      state.camera.position.set(x, y, z)
    }
  }
}

export const actions = {
  [ACTIONS.initScene]({ state, commit }, { width, height, el }) {
    return new Promise((resolve) => {
      commit(MUTATIONS.initCam)

      state.scene = new Three.Scene()

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
      let material = new Three.MeshNormalMaterial()

      state.meshGame1 = new Three.Mesh(geometry, material)
      state.meshGame1.position.set(-0.5, 0, 0)
      state.scene.add(state.meshGame1)

      let loader = new GLTFLoader()
      loader.load('/assets/models/popup.gltf', (data) => {
        state.popup = data.scene
        state.popup.scale.set(0.1, 0.1, 0.1)
        state.popup.rotation.set(0, 1, 0)
        state.popup.position.set(0, 0, 0)
        state.scene.add(state.popup)
      })

      let lightA = new DirectionalLight(0xffffff)
      lightA.position.set(1, 1, 1)
      state.scene.add(lightA)

      let lightB = new DirectionalLight(0x002288)
      lightB.position.set(-1, -1, -1)
      state.scene.add(lightB)

      let ambientLight = new AmbientLight(0x222222)
      state.scene.add(ambientLight)

      state.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true })
      state.renderer.setSize(width, height)

      el.appendChild(state.renderer.domElement)

      state.renderer.render(state.scene, state.camera)

      resolve()
    })
  },
  [ACTIONS.animate]({ dispatch, state }) {
    window.requestAnimationFrame(() => {
      dispatch(ACTIONS.animate)
    })

    state.meshGame1.rotation.y += 0.001
    if (state.popup) state.popup.rotation.y += 0.01
    state.renderer.render(state.scene, state.camera)
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions
}
