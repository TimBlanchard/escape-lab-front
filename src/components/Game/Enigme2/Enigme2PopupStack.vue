<template>
  <div class="cards">
    <Enigme2Card
      v-for="(card, index) in cards"
      ref="stack"
      :key="`enigme2${index}`"
      :card="card"
      :is-current="card.owner === typeScreen"
      :is-end-sort="isEndSort"
      :is-first-player="isFirstPlayer"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Enigme2Card from '@/components/Game/Enigme2/Enigme2Card.vue'
import { STATE as S } from '@/store/helpers'

export default {
  name: 'Enigme2PopupStack',
  components: {
    Enigme2Card
  },
  props: {
    cards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFirstPlayer: this.$store.state[S.typeScreen] === 'Player1',
      isEndSort: false
    }
  },
  computed: mapState({
    typeScreen: (state) => state[S.typeScreen] // Player1 ; Player2 ; MainScreen
  }),
  sockets: {
    'enigme2-endSort': function () {
      this.$data.isEndSort = true

      this.$nextTick(() => {
        const wrongCard = document.querySelector('.card.-isWrong')

        if (wrongCard) {
          const scroll = wrongCard.parentElement.offsetTop
          this.$el.scrollTo(0, scroll)
        }
      })
    }
  }
}
</script>

<style scoped>
.cards {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 60px 20px 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
