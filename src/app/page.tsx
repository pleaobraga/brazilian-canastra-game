/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

import { Card } from '../../deck/deck.types'

let socket: Socket

export default function Home() {
  const [hand, setHand] = useState<Card[]>([])

  useEffect(() => {
    // Initialize socket connection
    socket = io()

    // Listen for the initial hand from the server
    socket.on('initialHand', (initialHand: Card[]) => {
      console.log('Received initial hand:', initialHand)
      setHand(initialHand)
    })

    // Listen for cards played by any player
    socket.on(
      'cardPlayed',
      ({ playerId, card }: { playerId: string; card: Card }) => {
        console.log(`Player ${playerId} played:`, card)
        // Update game state as needed
      }
    )

    // Handle errors from the server
    socket.on('error', (errorMessage: string) => {
      console.error('Error from server:', errorMessage)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  // Function to play a card
  const playCard = (card: Card) => {
    socket.emit('playCard', card)
    // Optimistically update the local state
    setHand((prevHand) =>
      prevHand.filter((c) => !(c.suit === card.suit && c.rank === card.rank))
    )
  }

  return (
    <div>
      <h1>Your Hand</h1>
      <ul>
        {hand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}{' '}
            <button onClick={() => playCard(card)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
