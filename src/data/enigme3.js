import { getPriceAnswer } from '@/helpers/enigme3Rules'

export const noticeData = () => [
  {
    name: 'La règle 1',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 2',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 3',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 4',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 5',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 6',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 7',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 8',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 9',
    description: 'Description de la règle'
  },
  {
    name: 'La règle 10',
    description: 'Description de la règle'
  }
]

export const questionsData = (product) => [
  {
    slug: 'price',
    question: 'Quel est le prix du produit ?',
    normalAnswer: getPriceAnswer(product, false),
    botAnswer: getPriceAnswer(product, true)
  },
  {
    slug: '6',
    question: 'La question 6',
    normalAnswer: 'La bonne réponse',
    botAnswer: 'La réponse qui montre le bot'
  },
  {
    slug: '7',
    question: 'La question 7',
    normalAnswer: 'La bonne réponse',
    botAnswer: 'La réponse qui montre le bot'
  },
  {
    slug: '8',
    question: 'La question 8',
    normalAnswer: 'La bonne réponse',
    botAnswer: 'La réponse qui montre le bot'
  },
  {
    slug: '9',
    question: 'La question 9',
    normalAnswer: 'La bonne réponse',
    botAnswer: 'La réponse qui montre le bot'
  },
  {
    slug: '10',
    question: 'La question 10',
    normalAnswer: 'La bonne réponse',
    botAnswer: 'La réponse qui montre le bot'
  }
]

export const finalAnswer = {
  bot: 'Non, je vois clair dans ton jeu, t’es le bot arnaqueur !',
  normal: 'Oui, je vous fais confiance, on y va !'
}

export const prices = () => ({
  clothing: [10, 500],
  vehicle: [1000, 200000],
  housing: [40000, 500000]
})
