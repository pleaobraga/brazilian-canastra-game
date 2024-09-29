import { RANKS, SUITS } from './deck.constants'
import { Card, Deck, PlayerHands } from './deck.types'

export const createDeck = (): Deck => {
  return SUITS.flatMap((suit) => {
    return RANKS.map((rank) => ({
      rank,
      suit,
    }))
  })
}

export const shuffleCards = (deck: Deck): Deck => {
  const newDeck = [...deck]

  let currentIndex = newDeck.length
  let randomIndex: number

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    const temp = newDeck[currentIndex]

    deck[currentIndex] = newDeck[randomIndex]
    deck[randomIndex] = temp
  }

  return newDeck
}

export const drawCard = (deck: Deck): { topCard?: Card; deck: Deck } => {
  const newDeck = [...deck]
  const topCard = newDeck.shift()

  return { topCard, deck: newDeck }
}

export const dealCards = (
  numPlayers: number,
  handCardNumber: number,
  deck: Deck
): { playersHands: PlayerHands; deck: Deck } => {
  const totaldealedCards = numPlayers * handCardNumber

  const playersHands = {} as PlayerHands

  for (let i = 0; i < totaldealedCards; i++) {
    const player = i % numPlayers

    if (!playersHands?.[player]) {
      playersHands[player] = []
    }

    playersHands[player].push(deck[i])
  }

  const newDeck = [...deck].slice(totaldealedCards, deck.length)

  return { playersHands, deck: newDeck }
}

export const isEmptyDeck = (deck: Deck) => {
  return deck.length === 0
}

export const mergeDecks = (...decks: Deck[]): Deck => {
  const mergedDecks = decks.reduce(
    (mergedDeck, currentDeck) => [...mergedDeck, ...currentDeck],
    []
  )

  return shuffleCards(mergedDecks)
}
