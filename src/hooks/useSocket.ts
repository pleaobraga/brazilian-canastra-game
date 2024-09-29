// hooks/useSocket.ts
'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [deck, setDeck] = useState([])
  const [drawnCard, setDrawnCard] = useState(null)

  useEffect(() => {
    const socketIo = io('http://localhost:3000') // Connect to the server

    setSocket(socketIo)

    // Listen for the deck update
    socketIo.on('deckUpdate', (updatedDeck) => {
      setDeck(updatedDeck)
    })

    // Listen for the drawn card
    socketIo.on('cardDrawn', (card) => {
      setDrawnCard(card)
    })

    return () => {
      socketIo.disconnect() // Clean up when component unmounts
    }
  }, [])

  // Function to draw a card
  const drawCard = () => {
    if (socket) {
      socket.emit('drawCard')
    }
  }

  return { deck, drawnCard, drawCard }
}

export default useSocket
