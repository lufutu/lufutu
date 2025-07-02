"use client"

import type React from "react"

import { useEffect, useCallback } from "react"
import type { GameState, Window } from "@/types"

interface GameManagerProps {
  gameStates: GameState
  setGameStates: React.Dispatch<React.SetStateAction<GameState>>
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
}

export function GameManager({
  gameStates,
  setGameStates,
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
}: GameManagerProps) {
  const initializeMemoryGame = useCallback(() => {
    const symbols = [
      "/assets/icons/Controller_Blue.png",
      "/assets/icons/Circle_Blue.png", 
      "/assets/icons/Letter D Yellow_Blue.png",
      "/assets/icons/Letter C_Blue.png",
      "/assets/icons/Letter A_Blue.png",
      "/assets/icons/Letter M Yellow_Blue.png",
      "/assets/icons/Letter G Black_Blue.png",
      "/assets/icons/Letter S Yellow_Blue.png"
    ]
    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }))

    setGameStates((prev) => ({
      ...prev,
      memory: {
        cards,
        flippedCards: [],
        score: 0,
        moves: 0,
        gameWon: false,
      },
    }))
  }, [setGameStates])

  const openGameWindow = useCallback(
    (gameType: string) => {
      console.log(`Opening ${gameType} game...`) // Debug log

      const gameTitle = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game`

      // Check if window already exists
      if (windows.some((w) => w.title === gameTitle)) {
        console.log(`${gameTitle} already open`)
        return
      }

      let gameContent = ""
      let windowWidth = 500
      let windowHeight = 400

      switch (gameType) {
        case "snake":
          windowWidth = 450
          windowHeight = 500
          gameContent = `
          <div class="game-container">
            <div class="game-header">
              <h3><img src="/assets/icons/Letter S Yellow_Blue.png" alt="Snake" width="20" height="20" style="display: inline; vertical-align: middle; margin-right: 8px;"> Snake Game</h3>
              <div class="game-score">Score: <span id="snake-score">0</span></div>
            </div>
            <div class="game-canvas-container">
              <canvas id="snake-canvas" width="400" height="400"></canvas>
            </div>
            <div class="game-controls">
              <button onclick="window.gameManager.resetSnake()" class="game-btn">New Game</button>
              <div class="game-instructions">Use arrow keys to move • Game starts automatically!</div>
            </div>
          </div>
        `
          break
        case "pong":
          windowWidth = 450
          windowHeight = 400
          gameContent = `
          <div class="game-container">
            <div class="game-header">
              <h3><img src="/assets/icons/Circle_Blue.png" alt="Pong" width="20" height="20" style="display: inline; vertical-align: middle; margin-right: 8px;"> Pong Game</h3>
              <div class="game-score">Player: <span id="pong-score1">0</span> | AI: <span id="pong-score2">0</span></div>
            </div>
            <div class="game-canvas-container">
              <canvas id="pong-canvas" width="400" height="300"></canvas>
            </div>
            <div class="game-controls">
              <button onclick="window.gameManager.resetPong()" class="game-btn">New Game</button>
              <div class="game-instructions">Use W/S keys to move paddle • Game starts automatically!</div>
            </div>
          </div>
        `
          break
        case "memory":
          windowWidth = 400
          windowHeight = 500
          gameContent = `
          <div class="game-container">
            <div class="game-header">
              <h3><img src="/assets/icons/Letter M Yellow_Blue.png" alt="Memory" width="20" height="20" style="display: inline; vertical-align: middle; margin-right: 8px;"> Memory Game</h3>
              <div class="game-score">Moves: <span id="memory-moves">0</span></div>
            </div>
            <div class="memory-grid" id="memory-grid">
              <!-- Cards will be generated here -->
            </div>
            <div class="game-controls">
              <button onclick="window.gameManager.startMemory()" class="game-btn">New Game</button>
              <div class="game-instructions">Match all pairs to win! • Click cards to flip</div>
            </div>
          </div>
        `
          break
        case "breakout":
          windowWidth = 450
          windowHeight = 500
          gameContent = `
          <div class="game-container">
            <div class="game-header">
              <h3><img src="/assets/icons/Letter B Yellow_Blue.png" alt="Breakout" width="20" height="20" style="display: inline; vertical-align: middle; margin-right: 8px;"> Breakout Game</h3>
              <div class="game-score">Score: <span id="breakout-score">0</span></div>
            </div>
            <div class="game-canvas-container">
              <canvas id="breakout-canvas" width="400" height="400"></canvas>
            </div>
            <div class="game-controls">
              <button onclick="window.gameManager.resetBreakout()" class="game-btn">Reset</button>
              <div class="game-instructions">Coming Soon! • Use mouse to move paddle</div>
            </div>
          </div>
        `
          break
      }

      const newWindow: Window = {
        id: `${gameType}-game-${Date.now()}`,
        title: gameTitle,
        content: gameContent,
        x: Math.random() * 200 + 300,
        y: Math.random() * 150 + 100,
        width: windowWidth,
        height: windowHeight,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        originalBounds: undefined,
      }

      console.log(`Creating window for ${gameTitle}`) // Debug log
      setWindows((prev) => [...prev, newWindow])
      setNextZIndex((prev) => prev + 1)

      // Initialize and auto-start games after window is created
      setTimeout(() => {
        console.log(`Initializing ${gameType} game...`) // Debug log
        if (gameType === "snake") {
          resetSnake()
          setTimeout(() => startSnake(), 100)
        } else if (gameType === "pong") {
          resetPong()
          setTimeout(() => startPong(), 100)
        } else if (gameType === "memory") {
          initializeMemoryGame()
          setTimeout(() => renderMemoryGame(), 100)
        }
      }, 200)
    },
    [windows, setWindows, nextZIndex, setNextZIndex, initializeMemoryGame],
  )

  const startSnake = useCallback(() => {
    setGameStates((prev) => ({
      ...prev,
      snake: {
        ...prev.snake,
        isPlaying: true,
        gameOver: false,
      },
    }))
  }, [setGameStates])

  const resetSnake = useCallback(() => {
    setGameStates((prev) => ({
      ...prev,
      snake: {
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        direction: "RIGHT",
        score: 0,
        gameOver: false,
        isPlaying: false,
      },
    }))
  }, [setGameStates])

  const startPong = useCallback(() => {
    setGameStates((prev) => ({
      ...prev,
      pong: {
        ...prev.pong,
        isPlaying: true,
      },
    }))
  }, [setGameStates])

  const resetPong = useCallback(() => {
    setGameStates((prev) => ({
      ...prev,
      pong: {
        paddle1Y: 150,
        paddle2Y: 150,
        ballX: 200,
        ballY: 150,
        ballVelX: 3,
        ballVelY: 2,
        score1: 0,
        score2: 0,
        isPlaying: false,
      },
    }))
  }, [setGameStates])

  const startMemory = useCallback(() => {
    initializeMemoryGame()
    setTimeout(() => renderMemoryGame(), 100)
  }, [initializeMemoryGame])

  const renderMemoryGame = useCallback(() => {
    const grid = document.getElementById("memory-grid")
    if (!grid) return

    grid.innerHTML = ""
    gameStates.memory.cards.forEach((card, index) => {
      const cardElement = document.createElement("div")
      cardElement.className = `memory-card ${card.flipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`
      cardElement.innerHTML = card.flipped || card.matched ? card.value : "?"
      cardElement.onclick = () => (window as any).gameManager.flipCard(index)
      grid.appendChild(cardElement)
    })

    // Update moves counter
    const movesElement = document.getElementById("memory-moves")
    if (movesElement) {
      movesElement.textContent = gameStates.memory.moves.toString()
    }
  }, [gameStates.memory])

  const flipCard = useCallback(
    (index: number) => {
      if (gameStates.memory.flippedCards.length >= 2) return
      if (gameStates.memory.cards[index].flipped || gameStates.memory.cards[index].matched) return

      const newCards = [...gameStates.memory.cards]
      newCards[index].flipped = true
      const newFlippedCards = [...gameStates.memory.flippedCards, index]

      setGameStates((prev) => ({
        ...prev,
        memory: {
          ...prev.memory,
          cards: newCards,
          flippedCards: newFlippedCards,
          moves: prev.memory.moves + (newFlippedCards.length === 1 ? 1 : 0),
        },
      }))

      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards
        if (newCards[first].value === newCards[second].value) {
          // Match found
          setTimeout(() => {
            const matchedCards = [...newCards]
            matchedCards[first].matched = true
            matchedCards[second].matched = true
            setGameStates((prev) => ({
              ...prev,
              memory: {
                ...prev.memory,
                cards: matchedCards,
                flippedCards: [],
                score: prev.memory.score + 10,
              },
            }))
            renderMemoryGame()
          }, 500)
        } else {
          // No match
          setTimeout(() => {
            const resetCards = [...newCards]
            resetCards[first].flipped = false
            resetCards[second].flipped = false
            setGameStates((prev) => ({
              ...prev,
              memory: {
                ...prev.memory,
                cards: resetCards,
                flippedCards: [],
              },
            }))
            renderMemoryGame()
          }, 1000)
        }
      }

      renderMemoryGame()
    },
    [gameStates.memory, setGameStates, renderMemoryGame],
  )

  // Expose game functions to window - This is the key fix!
  useEffect(() => {
    console.log("Setting up game manager on window object") // Debug log
    ;(window as any).gameManager = {
      openGame: (gameType: string) => {
        console.log(`Window.gameManager.openGame called with: ${gameType}`) // Debug log
        openGameWindow(gameType)
      },
      resetSnake: () => {
        resetSnake()
        setTimeout(() => startSnake(), 100)
      },
      resetPong: () => {
        resetPong()
        setTimeout(() => startPong(), 100)
      },
      startMemory: () => {
        initializeMemoryGame()
        setTimeout(() => renderMemoryGame(), 100)
      },
      resetBreakout: () => {
        console.log("Breakout coming soon!")
      },
      flipCard,
    }

    // Cleanup function
    return () => {
      delete (window as any).gameManager
    }
  }, [openGameWindow, resetSnake, startSnake, resetPong, startPong, initializeMemoryGame, renderMemoryGame, flipCard])

  // Render game canvases
  useEffect(() => {
    const renderSnake = () => {
      const canvas = document.getElementById("snake-canvas") as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, 400, 400)

      // Draw snake
      ctx.fillStyle = "#0f0"
      gameStates.snake.snake.forEach((segment) => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18)
      })

      // Draw food
      ctx.fillStyle = "#f00"
      ctx.fillRect(gameStates.snake.food.x * 20, gameStates.snake.food.y * 20, 18, 18)

      // Update score
      const scoreElement = document.getElementById("snake-score")
      if (scoreElement) {
        scoreElement.textContent = gameStates.snake.score.toString()
      }

      // Game over text
      if (gameStates.snake.gameOver) {
        ctx.fillStyle = "#fff"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over!", 200, 200)
      }
    }

    const renderPong = () => {
      const canvas = document.getElementById("pong-canvas") as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, 400, 300)

      // Draw paddles
      ctx.fillStyle = "#fff"
      ctx.fillRect(10, gameStates.pong.paddle1Y, 10, 60)
      ctx.fillRect(380, gameStates.pong.paddle2Y, 10, 60)

      // Draw ball
      ctx.fillRect(gameStates.pong.ballX - 5, gameStates.pong.ballY - 5, 10, 10)

      // Draw center line
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(200, 0)
      ctx.lineTo(200, 300)
      ctx.stroke()

      // Update scores
      const score1Element = document.getElementById("pong-score1")
      const score2Element = document.getElementById("pong-score2")
      if (score1Element) score1Element.textContent = gameStates.pong.score1.toString()
      if (score2Element) score2Element.textContent = gameStates.pong.score2.toString()
    }

    renderSnake()
    renderPong()
  }, [gameStates])

  return null
}
