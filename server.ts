// server.ts

import http from 'http'

import express, { Request, Response } from 'express'
import next from 'next'
import { Server } from 'socket.io'

import * as deckUtils from './deck' // Adjust the path if necessary
import { Card, Deck } from './deck/deck.types'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Define the game state interface
interface GameState {
  deck: Deck
  players: Record<string, { hand: Card[] }>
}

// Initialize the game state
const gameState: GameState = {
  deck: [],
  players: {},
}

app.prepare().then(() => {
  const server = express()
  const httpServer = http.createServer(server)
  const io = new Server(httpServer)

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)

    // Initialize the deck if it's empty
    if (gameState.deck.length === 0) {
      gameState.deck = deckUtils.createDeck()
      gameState.deck = deckUtils.shuffleCards(gameState.deck)
    }

    // Add the new player to the game state
    gameState.players[socket.id] = {
      hand: [],
    }

    // Deal cards to the player
    const { playersHands, deck } = deckUtils.dealCards(
      1, // Number of players (1 for this player)
      11, // Number of cards per player
      gameState.deck
    )

    gameState.players[socket.id].hand = playersHands[0]
    gameState.deck = deck

    // Send the player's initial hand
    socket.emit('initialHand', gameState.players[socket.id].hand)

    // Listen for the 'playCard' event from the client
    socket.on('playCard', (card: Card) => {
      const playerHand = gameState.players[socket.id].hand
      const cardIndex = playerHand.findIndex(
        (c) => c.suit === card.suit && c.rank === card.rank
      )

      if (cardIndex > -1) {
        // Remove the card from the player's hand
        playerHand.splice(cardIndex, 1)
        // Broadcast the played card to all clients
        io.emit('cardPlayed', { playerId: socket.id, card })
      } else {
        socket.emit('error', 'Card not found in hand')
      }
    })

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      delete gameState.players[socket.id]
    })
  })

  // Handle all HTTP requests with Next.js
  server.all('*', (req: Request, res: Response) => handle(req, res))

  // Start the server
  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
