"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Image from "next/image"
import { getHighScores, saveHighScore, isHighScore, formatScore } from "@/lib/high-scores"

interface SnakeGameProps {
  onScore?: (score: number) => void
}

interface Position {
  x: number
  y: number
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

const GAME_NAME = "snake"

export function SnakeGame({ onScore }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScores, setHighScores] = useState(getHighScores(GAME_NAME))
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const CANVAS_SIZE = 400
  const GRID_SIZE = 20

  const generateFood = useCallback(() => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 15 })
    setDirection("RIGHT")
    setIsPlaying(false)
    setGameOver(false)
    setScore(0)
    setIsNewHighScore(false)
  }, [])

  const startGame = useCallback(() => {
    if (gameOver) {
      resetGame()
      setTimeout(() => setIsPlaying(true), 100)
    } else {
      setIsPlaying(true)
    }
  }, [gameOver, resetGame])

  const handleGameOver = useCallback(() => {
    if (isHighScore(GAME_NAME, score)) {
      saveHighScore(GAME_NAME, score)
      setIsNewHighScore(true)
      setHighScores(getHighScores(GAME_NAME))
    }
    setGameOver(true)
    setIsPlaying(false)
  }, [score])

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }

      // Move head based on direction
      switch (direction) {
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
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver()
        return prevSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver()
        return prevSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10
        setScore(newScore)
        setFood(generateFood())
        onScore?.(newScore)
        // Don't remove tail (snake grows)
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, score, generateFood, onScore, handleGameOver])

  // Game loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(moveSnake, 150)
    return () => clearInterval(interval)
  }, [isPlaying, moveSnake])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return

      // Prevent default behavior to avoid scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP")
          break
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN")
          break
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT")
          break
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT")
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, isPlaying])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = (i * CANVAS_SIZE) / GRID_SIZE
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, CANVAS_SIZE)
      ctx.moveTo(0, pos)
      ctx.lineTo(CANVAS_SIZE, pos)
      ctx.stroke()
    }

    // Draw snake
    ctx.fillStyle = "#0f0"
    snake.forEach((segment, index) => {
      const x = (segment.x * CANVAS_SIZE) / GRID_SIZE
      const y = (segment.y * CANVAS_SIZE) / GRID_SIZE
      const size = CANVAS_SIZE / GRID_SIZE - 2
      
      if (index === 0) {
        // Snake head
        ctx.fillStyle = "#0a0"
      } else {
        ctx.fillStyle = "#0f0"
      }
      
      ctx.fillRect(x + 1, y + 1, size, size)
    })

    // Draw food
    ctx.fillStyle = "#f00"
    const foodX = (food.x * CANVAS_SIZE) / GRID_SIZE
    const foodY = (food.y * CANVAS_SIZE) / GRID_SIZE
    const foodSize = CANVAS_SIZE / GRID_SIZE - 2
    ctx.fillRect(foodX + 1, foodY + 1, foodSize, foodSize)

    // Draw game over text
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      
      ctx.fillStyle = "#fff"
      ctx.font = "bold 24px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Game Over!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 40)
      ctx.font = "16px monospace"
      ctx.fillText(`Final Score: ${formatScore(score)}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 10)
      
      if (isNewHighScore) {
        ctx.fillStyle = "#ffd700"
        ctx.font = "bold 18px monospace"
        ctx.fillText("NEW HIGH SCORE!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20)
      }
      
      ctx.fillStyle = "#fff"
      ctx.font = "14px monospace"
      ctx.fillText("Click New Game to restart", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50)
    }
  }, [snake, food, gameOver, score, isNewHighScore])

  const topScore = highScores.length > 0 ? highScores[0].score : 0

  return (
    <div className="retro-content h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-200 border-2 border-gray-400" style={{ borderStyle: 'inset' }}>
        <h3 className="flex items-center gap-2 font-bold">
          <Image 
            src="/assets/icons/Letter S Yellow_Blue.png" 
            alt="Snake" 
            width={20} 
            height={20}
          />
          Snake Game
        </h3>
        <div className="font-mono font-bold text-sm">
          Score: {formatScore(score)} | Hi: {formatScore(topScore)}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center bg-black border-2 border-gray-400" style={{ borderStyle: 'inset' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border border-gray-600"
        />
      </div>
      
      <div className="p-3 bg-gray-200 border-t-2 border-gray-400">
        <div className="flex gap-2 mb-2">
          <button
            onClick={startGame}
            className="px-4 py-1 bg-gray-300 border-2 border-gray-400 hover:bg-gray-100 font-bold"
            style={{ borderStyle: isPlaying ? 'inset' : 'outset' }}
          >
            {isPlaying ? "Playing..." : gameOver ? "New Game" : "Start"}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-1 bg-gray-300 border-2 border-gray-400 hover:bg-gray-100 font-bold"
            style={{ borderStyle: 'outset' }}
          >
            Reset
          </button>
        </div>
        
        {/* High Scores Display */}
        {highScores.length > 0 && (
          <div className="mb-2 text-xs font-mono">
            <div className="font-bold mb-1">HIGH SCORES</div>
            <div className="grid grid-cols-3 gap-2">
              {highScores.slice(0, 3).map((hs, index) => (
                <div key={index} className="text-center">
                  <div>{index + 1}. {hs.initials}</div>
                  <div>{formatScore(hs.score)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-sm font-mono">
          Use arrow keys to move • Eat red food to grow • Avoid walls and yourself!
        </div>
      </div>
    </div>
  )
} 