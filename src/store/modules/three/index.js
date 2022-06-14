import Anime from 'animejs'
import * as Three from 'three'
import { AmbientLight, DirectionalLight, PointLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Text } from 'troika-three-text'
import Vue from 'vue'
import Vuex from 'vuex'

import Sound from '@/helpers/Sound'
import { ACTIONS, GETTERS, MUTATIONS, STATE } from '@/store/modules/three/helpers'

Vue.use(Vuex)

export const state = {
  [STATE.camera]: null,
  [STATE.scene]: null,
  [STATE.renderer]: null,
  [STATE.popup]: null,
  [STATE.popups]: []
}

export const mutations = {
  [MUTATIONS.initCam](state) {
    state[STATE.camera] = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000)
    state[STATE.camera].position.z = 7.5
  },
  [MUTATIONS.setCamPosition](state, { x, y, z }) {
    if (state.camera) {
      state.camera.position.set(x, y, z)
    }
  },
  [MUTATIONS.triggerPopup](state, id) {
    state[STATE.popups][id].isTriggered = true
  },
  [MUTATIONS.resetPopup](state) {
    state[STATE.popups] = []
  },
  [MUTATIONS.resizeScene](state, { width, height }) {
    state.camera.aspect = width / height
    state.camera.updateProjectionMatrix()
    state.renderer.setSize(width, height)
    state.renderer.render(state.scene, state.camera)
  }
}

export const getters = {
  [GETTERS.getPopupArrayIndex]: (state) => (triggeredId) =>
    state.popups.findIndex((obj) => {
      return obj.triggerId === triggeredId
    })
}

export const actions = {
  [ACTIONS.initScene]({ state, commit /*, dispatch*/ }, { width, height, el }) {
    return new Promise((resolve) => {
      commit(MUTATIONS.initCam)

      state.scene = new Three.Scene()

      let lightA = new DirectionalLight(0xffffff, 0.15)
      lightA.position.set(0, 0, 8)
      state.scene.add(lightA)

      let lightB = new PointLight(0xffffff, 0.9)
      lightB.position.set(0, 5, 3)
      state.scene.add(lightB)

      let lightC = new PointLight(0xffffff, 0.8)
      lightC.position.set(-1, -4, -2.5)
      state.scene.add(lightC)

      let ambientLight = new AmbientLight(0xffffff, 0.3)
      state.scene.add(ambientLight)

      const plane = new Three.Mesh(
        new Three.PlaneBufferGeometry(17, 8.7, 1, 1),
        new Three.MeshPhongMaterial({
          colorWrite: false
        })
      )
      plane.position.set(0, 5, 0)
      state.scene.add(plane)

      state.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true })
      state.renderer.setSize(width, height)

      el.appendChild(state.renderer.domElement)

      state.renderer.render(state.scene, state.camera)

      //dispatch(ACTIONS.initPopup)

      resolve()
    })
  },
  [ACTIONS.initPopup]({ state /*, dispatch*/ }, props) {
    let loader = new GLTFLoader()
    const popup = new Three.Group()
    loader.load('/assets/models/popup.gltf', (data) => {
      // HANDLE MODEL
      let obj = data.scene
      obj.rotation.set(0, -Math.PI * 0.5, 0)
      obj.position.set(0, 0, 0)
      /*console.log(obj.children[0], 'children')*/

      const FONTS = {
        regular: '/fonts/grenadine-regular.otf',
        medium: '/fonts/grenadine-medium.otf',
        bold: '/fonts/grenadine-bold.otf'
      }

      // HANDLE TEXTS
      const from = new Text()
      const subject = new Text()
      const text = new Text()
      state.scene.add(from)
      state.scene.add(subject)
      state.scene.add(text)

      //from.text = 'Caf de Paris (noreply@emailing.caf.fr)'
      from.text = props.content.from
      from.font = FONTS['medium']
      from.fontSize = 0.3
      from.anchorX = 'left'
      from.position.x = -4
      from.position.z = 0.2
      from.position.y = 1.5
      from.color = 0x000000

      //subject.text = 'Déclarez vos revenus trimestriels'
      subject.text = props.content.subject
      subject.font = FONTS['medium']
      subject.fontSize = 0.3
      subject.maxWidth = 8
      subject.anchorX = 'left'
      subject.position.x = -4
      subject.position.z = 0.2
      subject.position.y = 0.9
      subject.color = 0x000000

      text.text = props.content.text
      /*text.text =
        'Pour lire ce message en ligne, rendez-vous sur cette page. Ceci est un message automatique, merci de ne pas y répondre…'*/
      text.font = FONTS['regular']
      text.fontSize = 0.35
      text.anchorX = 'left'
      text.anchorY = 'top'
      text.lineHeight = 1.5
      text.position.x = -4
      text.maxWidth = 8
      text.position.z = 0.2
      text.position.y = 0
      text.color = 0x000000

      // Update the rendering:
      from.sync()
      subject.sync()
      text.sync()

      popup.add(obj)
      popup.add(from)
      popup.add(subject)
      popup.add(text)

      popup.isTriggered = false
      popup.triggerId = props.content.id
      /*popup.position.set(0, 0, 0)
      popup.rotation.set(0, 0, 0)*/
      popup.position.set(0.2, 3, -8)
      popup.rotation.set(-Math.PI * 0.5, 0, 0)

      state.popups.push(popup)
      state.scene.add(popup)

      /*dispatch({
        type: ACTIONS.animatePopup,
        id: 0
      })*/
    })
    state.renderer.render(state.scene, state.camera)
  },
  [ACTIONS.animatePopup]({ state }, props) {
    let duration = 5000

    const tlPosition = Anime.timeline({
      targets: state.popups[props.id].position,
      duration: duration
    })

    tlPosition
      .add({
        y: -2.3,
        duration: duration * 0.1,
        easing: 'easeInOutCubic',
        begin: () => {
          new Sound('swoosh-enter', { volume: 0.5 })
        }
      })
      .add({
        z: -3,
        y: -2.5,
        x: 0.8,
        duration: duration * 0.6,
        easing: 'easeOutQuart'
      })
      .add({
        y: -13,
        duration: duration * 0.3,
        begin: () => {
          setTimeout(() => new Sound('swoosh-1', { volume: 0.2 }), 150)
        }
      })
    Anime({
      targets: [state.popups[props.id].rotation],
      keyframes: [
        // popup descend
        { duration: duration * 0.1 },
        { x: 0, y: 0.02, duration: duration * 0.5, easing: 'easeInOutCubic' },
        // popup float et descend
        { duration: duration * 0.4 }
      ],
      easing: 'linear',
      duration: duration
    })
  },
  [ACTIONS.animate]({ dispatch, state }) {
    window.requestAnimationFrame(() => {
      dispatch(ACTIONS.animate)
    })
    state.renderer.render(state.scene, state.camera)
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}