export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds'

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'

export type Card = {
  rank: Rank
  suit: Suit
}

export type Deck = Card[]

export type PlayerHands = {
  [player: string]: Deck
}
