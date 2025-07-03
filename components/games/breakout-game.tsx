"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { getHighScores, saveHighScore, isHighScore, formatScore } from "@/lib/high-scores"

interface BreakoutGameProps {
  onScore?: (score: number) => void
}

interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  destroyed: boolean
  points: number
}

interface Ball {
  x: number
  y: number
  velX: number
  velY: number
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 60
const PADDLE_HEIGHT = 10
const BALL_SIZE = 8
const BRICK_WIDTH = 38
const BRICK_HEIGHT = 15
const GAME_NAME = "breakout"

export function BreakoutGame({ onScore }: BreakoutGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const ballRef = useRef<Ball>({ x: 200, y: 250, velX: 3, velY: -3 })
  const paddleRef = useRef<number>(170)
  const bricksRef = useRef<Brick[]>([])
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [highScores, setHighScores] = useState(getHighScores(GAME_NAME))
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const initializeBricks = useCallback((): Brick[] => {
    const bricks: Brick[] = []
    const colors = ["#ff4444", "#ff8844", "#ffff44", "#44ff44", "#4488ff"]
    const points = [50, 40, 30, 20, 10]
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + 2) + 10,
          y: row * (BRICK_HEIGHT + 2) + 30,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: colors[row],
          destroyed: false,
          points: points[row]
        })
      }
    }
    return bricks
  }, [])

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: 200,
      y: 250,
      velX: Math.random() > 0.5 ? 3 : -3,
      velY: -3
    }
  }, [])

  const resetGame = useCallback(() => {
    setIsPlaying(false)
    setGameOver(false)
    setGameWon(false)
    setLives(3)
    setScore(0)
    setIsNewHighScore(false)
    bricksRef.current = initializeBricks()
    paddleRef.current = 170
    resetBall()
  }, [initializeBricks, resetBall])

  const startGame = useCallback(() => {
    if (gameOver || gameWon) {
      resetGame()
    }
    setIsPlaying(true)
  }, [gameOver, gameWon, resetGame])

  const handleGameEnd = useCallback((won: boolean) => {
    if (isHighScore(GAME_NAME, score)) {
      saveHighScore(GAME_NAME, score)
      setIsNewHighScore(true)
      setHighScores(getHighScores(GAME_NAME))
    }
    
    if (won) {
      setGameWon(true)
    } else {
      setGameOver(true)
    }
    setIsPlaying(false)
  }, [score])

  // Initialize bricks on mount
  useEffect(() => {
    bricksRef.current = initializeBricks()
  }, [initializeBricks])

  // Game loop with requestAnimationFrame
  useEffect(() => {
    if (!isPlaying || gameOver || gameWon) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const gameLoop = () => {
      const ball = ballRef.current
      const paddle = paddleRef.current
      const bricks = bricksRef.current

      // Update ball position
      ball.x += ball.velX
      ball.y += ball.velY

      // Ball collision with left/right walls
      if (ball.x <= 0) {
        ball.x = 0
        ball.velX = Math.abs(ball.velX)
      } else if (ball.x >= CANVAS_WIDTH - BALL_SIZE) {
        ball.x = CANVAS_WIDTH - BALL_SIZE
        ball.velX = -Math.abs(ball.velX)
      }

      // Ball collision with top wall
      if (ball.y <= 0) {
        ball.y = 0
        ball.velY = Math.abs(ball.velY)
      }

      // Ball collision with paddle
      if (ball.y + BALL_SIZE >= CANVAS_HEIGHT - 30 && 
          ball.y <= CANVAS_HEIGHT - 20 &&
          ball.x + BALL_SIZE >= paddle && 
          ball.x <= paddle + PADDLE_WIDTH) {
        
        ball.y = CANVAS_HEIGHT - 30 - BALL_SIZE
        ball.velY = -Math.abs(ball.velY)
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.x + BALL_SIZE/2 - paddle) / PADDLE_WIDTH
        ball.velX = (hitPos - 0.5) * 6
      }

      // Ball falls below paddle - lose life
      if (ball.y > CANVAS_HEIGHT) {
        setLives(prev => {
          const newLives = prev - 1
          if (newLives <= 0) {
            handleGameEnd(false)
          } else {
            resetBall()
          }
          return newLives
        })
      }

      // Ball collision with bricks
      let hitBrick = false
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i]
        if (brick.destroyed) continue

        if (ball.x + BALL_SIZE >= brick.x &&
            ball.x <= brick.x + brick.width &&
            ball.y + BALL_SIZE >= brick.y &&
            ball.y <= brick.y + brick.height) {
          
          brick.destroyed = true
          hitBrick = true
          
          setScore(prev => {
            const newScore = prev + brick.points
            onScore?.(newScore)
            return newScore
          })

          // Determine bounce direction based on collision side
          const ballCenterX = ball.x + BALL_SIZE / 2
          const ballCenterY = ball.y + BALL_SIZE / 2
          const brickCenterX = brick.x + brick.width / 2
          const brickCenterY = brick.y + brick.height / 2

          const deltaX = Math.abs(ballCenterX - brickCenterX)
          const deltaY = Math.abs(ballCenterY - brickCenterY)

          if (deltaX > deltaY) {
            ball.velX = -ball.velX
          } else {
            ball.velY = -ball.velY
          }
          break
        }
      }

      // Check win condition
      if (bricks.every(brick => brick.destroyed)) {
        handleGameEnd(true)
        return
      }

      // Continue game loop
      if (isPlaying && !gameOver && !gameWon) {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, gameOver, gameWon, onScore, resetBall, handleGameEnd])

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPlaying) return
      
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const newPaddleX = mouseX - PADDLE_WIDTH / 2
      
      paddleRef.current = Math.max(0, Math.min(newPaddleX, CANVAS_WIDTH - PADDLE_WIDTH))
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove)
      return () => canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isPlaying])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return
      
      // Prevent default behavior to avoid scrolling
      if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          paddleRef.current = Math.max(paddleRef.current - 20, 0)
          break
        case "ArrowRight":
        case "d":
        case "D":
          paddleRef.current = Math.min(paddleRef.current + 20, CANVAS_WIDTH - PADDLE_WIDTH)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying])

  // Canvas rendering
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw bricks
      bricksRef.current.forEach(brick => {
        if (!brick.destroyed) {
          ctx.fillStyle = brick.color
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
          
          // Add 3D effect
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 1
          ctx.strokeRect(brick.x + 1, brick.y + 1, brick.width - 2, brick.height - 2)
        }
      })

      // Draw paddle
      ctx.fillStyle = "#fff"
      ctx.fillRect(paddleRef.current, CANVAS_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT)
      
      // Add paddle highlight
      ctx.fillStyle = "#ccc"
      ctx.fillRect(paddleRef.current, CANVAS_HEIGHT - 20, PADDLE_WIDTH, 2)

      // Draw ball
      ctx.fillStyle = "#fff"
      ctx.fillRect(ballRef.current.x, ballRef.current.y, BALL_SIZE, BALL_SIZE)

      // Draw game over text
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        ctx.fillStyle = "#fff"
        ctx.font = "bold 24px monospace"
        ctx.textAlign = "center"
        ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
        ctx.font = "16px monospace"
        ctx.fillText(`Final Score: ${formatScore(score)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
        
        if (isNewHighScore) {
          ctx.fillStyle = "#ffd700"
          ctx.font = "bold 18px monospace"
          ctx.fillText("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
        }
        
        ctx.fillStyle = "#fff"
        ctx.font = "14px monospace"
        ctx.fillText("Click New Game to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50)
      }

      // Draw win text
      if (gameWon) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        ctx.fillStyle = "#00ff00"
        ctx.font = "bold 24px monospace"
        ctx.textAlign = "center"
        ctx.fillText("YOU WIN!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
        ctx.fillStyle = "#fff"
        ctx.font = "16px monospace"
        ctx.fillText(`Final Score: ${formatScore(score)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
        
        if (isNewHighScore) {
          ctx.fillStyle = "#ffd700"
          ctx.font = "bold 18px monospace"
          ctx.fillText("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
        }
        
        ctx.fillStyle = "#fff"
        ctx.font = "14px monospace"
        ctx.fillText("Congratulations!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50)
      }

      // Continue rendering if playing
      if (isPlaying && !gameOver && !gameWon) {
        requestAnimationFrame(render)
      }
    }

    if (isPlaying || gameOver || gameWon) {
      render()
    }
  }, [isPlaying, gameOver, gameWon, score, isNewHighScore])

  const topScore = highScores.length > 0 ? highScores[0].score : 0

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-200 p-4 overflow-hidden">
      <div className="bg-gray-300 p-4 border-2 border-gray-400" style={{ borderStyle: "inset" }}>
        <div className="flex justify-between items-center mb-2 text-sm font-mono">
          <div>Score: {formatScore(score)}</div>
          <div>Lives: {lives}</div>
          <div>Hi: {formatScore(topScore)}</div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-500 block"
          style={{ borderStyle: "inset" }}
        />
        
        <div className="mt-4 text-center">
          {!isPlaying && !gameOver && !gameWon && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-gray-300 border-2 border-gray-400 font-mono text-sm hover:bg-gray-200"
              style={{ borderStyle: "outset" }}
            >
              Start Game
            </button>
          )}
          
          {(gameOver || gameWon) && (
            <div className="space-y-2">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-300 border-2 border-gray-400 font-mono text-sm hover:bg-gray-200"
                style={{ borderStyle: "outset" }}
              >
                New Game
              </button>
            </div>
          )}
        </div>

        {/* High Scores Display */}
        {highScores.length > 0 && (
          <div className="mt-4 text-xs font-mono">
            <div className="text-center font-bold mb-1">HIGH SCORES</div>
            {highScores.slice(0, 3).map((hs, index) => (
              <div key={index} className="flex justify-between">
                <span>{index + 1}. {hs.initials}</span>
                <span>{formatScore(hs.score)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-600 text-center font-mono max-w-md">
        <div>Move paddle: Mouse or A/D keys</div>
        <div>Break all bricks to win!</div>
      </div>
    </div>
  )
} 