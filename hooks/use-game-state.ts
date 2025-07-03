"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { GameState } from "@/types"

export function useGameState() {
  const [gameStates, setGameStates] = useState<GameState>({
    snake: {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: "RIGHT",
      score: 0,
      gameOver: false,
      isPlaying: false,
    },
    tetris: {
      board: Array(20)
        .fill(null)
        .map(() => Array(10).fill(0)),
      currentPiece: null,
      score: 0,
      gameOver: false,
      isPlaying: false,
    },
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
    memory: {
      cards: [],
      flippedCards: [],
      score: 0,
      moves: 0,
      gameWon: false,
    },
  })

  const gameLoopRef = useRef<number | null>(null)

  // Game logic functions
  const moveSnake = useCallback(() => {
    setGameStates((prev) => {
      if (!prev.snake.isPlaying || prev.snake.gameOver) return prev

      const newSnake = [...prev.snake.snake]
      const head = { ...newSnake[0] }

      switch (prev.snake.direction) {
        case "UP":
          head.y -= 1
          break
        case "DOWN":
          head.y += 1
          break
        case "LEFT":
          head.x -= 1
          break
        case "RIGHT":
          head.x += 1
          break
      }

      // Check wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        return { ...prev, snake: { ...prev.snake, gameOver: true, isPlaying: false } }
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, snake: { ...prev.snake, gameOver: true, isPlaying: false } }
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === prev.snake.food.x && head.y === prev.snake.food.y) {
        const newFood = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        }
        return {
          ...prev,
          snake: {
            ...prev.snake,
            snake: newSnake,
            food: newFood,
            score: prev.snake.score + 10,
          },
        }
      } else {
        newSnake.pop()
      }

      return {
        ...prev,
        snake: {
          ...prev.snake,
          snake: newSnake,
        },
      }
    })
  }, [])

  const movePong = useCallback(() => {
    setGameStates((prev) => {
      if (!prev.pong.isPlaying) return prev

      let newBallX = prev.pong.ballX + prev.pong.ballVelX
      let newBallY = prev.pong.ballY + prev.pong.ballVelY
      let newBallVelX = prev.pong.ballVelX
      let newBallVelY = prev.pong.ballVelY
      let newScore1 = prev.pong.score1
      let newScore2 = prev.pong.score2

      // Ball collision with top/bottom walls
      if (newBallY <= 0 || newBallY >= 300) {
        newBallVelY = -newBallVelY
      }

      // Ball collision with paddles
      if (newBallX <= 20 && newBallY >= prev.pong.paddle1Y && newBallY <= prev.pong.paddle1Y + 60) {
        newBallVelX = -newBallVelX
      }
      if (newBallX >= 380 && newBallY >= prev.pong.paddle2Y && newBallY <= prev.pong.paddle2Y + 60) {
        newBallVelX = -newBallVelX
      }

      // Score points
      if (newBallX < 0) {
        newScore2++
        newBallX = 200
        newBallY = 150
        newBallVelX = 3
        newBallVelY = 2
      }
      if (newBallX > 400) {
        newScore1++
        newBallX = 200
        newBallY = 150
        newBallVelX = -3
        newBallVelY = 2
      }

      // AI for paddle2
      const paddle2Center = prev.pong.paddle2Y + 30
      if (newBallY > paddle2Center + 10) {
        prev.pong.paddle2Y = Math.min(prev.pong.paddle2Y + 3, 240)
      } else if (newBallY < paddle2Center - 10) {
        prev.pong.paddle2Y = Math.max(prev.pong.paddle2Y - 3, 0)
      }

      return {
        ...prev,
        pong: {
          ...prev.pong,
          ballX: newBallX,
          ballY: newBallY,
          ballVelX: newBallVelX,
          ballVelY: newBallVelY,
          score1: newScore1,
          score2: newScore2,
        },
      }
    })
  }, [])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      moveSnake()
      movePong()
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [moveSnake, movePong])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Snake controls
      setGameStates((prev) => {
        if (prev.snake.isPlaying) {
          switch (e.key) {
            case "ArrowUp":
              if (prev.snake.direction !== "DOWN") {
                return { ...prev, snake: { ...prev.snake, direction: "UP" } }
              }
              break
            case "ArrowDown":
              if (prev.snake.direction !== "UP") {
                return { ...prev, snake: { ...prev.snake, direction: "DOWN" } }
              }
              break
            case "ArrowLeft":
              if (prev.snake.direction !== "RIGHT") {
                return { ...prev, snake: { ...prev.snake, direction: "LEFT" } }
              }
              break
            case "ArrowRight":
              if (prev.snake.direction !== "LEFT") {
                return { ...prev, snake: { ...prev.snake, direction: "RIGHT" } }
              }
              break
          }
        }

        // Pong controls
        if (prev.pong.isPlaying) {
          switch (e.key) {
            case "w":
            case "W":
              return {
                ...prev,
                pong: { ...prev.pong, paddle1Y: Math.max(prev.pong.paddle1Y - 20, 0) },
              }
            case "s":
            case "S":
              return {
                ...prev,
                pong: { ...prev.pong, paddle1Y: Math.min(prev.pong.paddle1Y + 20, 240) },
              }
          }
        }

        return prev
      })
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return { gameStates, setGameStates }
}
