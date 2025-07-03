"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Image from "next/image"
import { getHighScores, saveHighScore, isHighScore, formatScore } from "@/lib/high-scores"

interface PongGameProps {
  onScore?: (player1Score: number, player2Score: number) => void
}

const GAME_NAME = "pong"
const WINNING_SCORE = 10

export function PongGame({ onScore }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [paddle1Y, setPaddle1Y] = useState(120)
  const [paddle2Y, setPaddle2Y] = useState(120)
  const [ballX, setBallX] = useState(200)
  const [ballY, setBallY] = useState(150)
  const [ballVelX, setBallVelX] = useState(3)
  const [ballVelY, setBallVelY] = useState(2)
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null)
  const [highScores, setHighScores] = useState(getHighScores(GAME_NAME))
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 300
  const PADDLE_WIDTH = 10
  const PADDLE_HEIGHT = 60
  const BALL_SIZE = 10

  const resetBall = useCallback(() => {
    setBallX(CANVAS_WIDTH / 2)
    setBallY(CANVAS_HEIGHT / 2)
    setBallVelX(Math.random() > 0.5 ? 3 : -3)
    setBallVelY((Math.random() - 0.5) * 4)
  }, [])

  const resetGame = useCallback(() => {
    setPaddle1Y(120)
    setPaddle2Y(120)
    setScore1(0)
    setScore2(0)
    setIsPlaying(false)
    setGameWon(false)
    setWinner(null)
    setIsNewHighScore(false)
    resetBall()
  }, [resetBall])

  const startGame = useCallback(() => {
    if (gameWon) {
      resetGame()
    }
    setIsPlaying(true)
  }, [gameWon, resetGame])

  const handleGameWin = useCallback((playerWon: boolean) => {
    const finalScore = playerWon ? score1 : 0 // Only player wins count as high score
    
    if (playerWon && isHighScore(GAME_NAME, finalScore)) {
      saveHighScore(GAME_NAME, finalScore)
      setIsNewHighScore(true)
      setHighScores(getHighScores(GAME_NAME))
    }
    
    setWinner(playerWon ? 'player' : 'ai')
    setGameWon(true)
    setIsPlaying(false)
  }, [score1])

  // Game logic
  useEffect(() => {
    if (!isPlaying || gameWon) return

    const interval = setInterval(() => {
      setBallX(prevX => prevX + ballVelX)
      setBallY(prevY => prevY + ballVelY)

      // Ball collision with top/bottom walls
      if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        setBallVelY(prev => -prev)
      }

      // Ball collision with left paddle
      if (ballX <= PADDLE_WIDTH + 10 && 
          ballY + BALL_SIZE >= paddle1Y && 
          ballY <= paddle1Y + PADDLE_HEIGHT && 
          ballVelX < 0) {
        setBallVelX(prev => Math.abs(prev))
      }

      // Ball collision with right paddle
      if (ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 10 && 
          ballY + BALL_SIZE >= paddle2Y && 
          ballY <= paddle2Y + PADDLE_HEIGHT && 
          ballVelX > 0) {
        setBallVelX(prev => -Math.abs(prev))
      }

      // Score points
      if (ballX < -BALL_SIZE) {
        setScore2(prev => {
          const newScore = prev + 1
          onScore?.(score1, newScore)
          if (newScore >= WINNING_SCORE) {
            handleGameWin(false)
          }
          return newScore
        })
        resetBall()
      }
      if (ballX > CANVAS_WIDTH) {
        setScore1(prev => {
          const newScore = prev + 1
          onScore?.(newScore, score2)
          if (newScore >= WINNING_SCORE) {
            handleGameWin(true)
          }
          return newScore
        })
        resetBall()
      }

      // AI for right paddle
      setPaddle2Y(prevY => {
        const paddleCenter = prevY + PADDLE_HEIGHT / 2
        const ballCenter = ballY + BALL_SIZE / 2
        
        if (ballCenter > paddleCenter + 10) {
          return Math.min(prevY + 4, CANVAS_HEIGHT - PADDLE_HEIGHT)
        } else if (ballCenter < paddleCenter - 10) {
          return Math.max(prevY - 4, 0)
        }
        return prevY
      })
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [isPlaying, gameWon, paddle1Y, paddle2Y, ballX, ballY, ballVelX, ballVelY, resetBall, score1, score2, onScore, handleGameWin])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return

      // Prevent default behavior to avoid scrolling
      if (["w", "W", "s", "S", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setPaddle1Y(prev => Math.max(prev - 20, 0))
          break
        case "s":
        case "arrowdown":
          setPaddle1Y(prev => Math.min(prev + 20, CANVAS_HEIGHT - PADDLE_HEIGHT))
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = "#555"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = "#fff"
    ctx.fillRect(10, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillRect(CANVAS_WIDTH - 20, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE)

    // Draw game over/win text
    if (gameWon) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      if (winner === 'player') {
        ctx.fillStyle = "#00ff00"
        ctx.font = "bold 24px monospace"
        ctx.textAlign = "center"
        ctx.fillText("YOU WIN!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30)
        ctx.fillStyle = "#fff"
        ctx.font = "16px monospace"
        ctx.fillText(`Final Score: ${formatScore(score1)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        
        if (isNewHighScore) {
          ctx.fillStyle = "#ffd700"
          ctx.font = "bold 18px monospace"
          ctx.fillText("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
        }
      } else {
        ctx.fillStyle = "#ff0000"
        ctx.font = "bold 24px monospace"
        ctx.textAlign = "center"
        ctx.fillText("AI WINS!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15)
        ctx.fillStyle = "#fff"
        ctx.font = "14px monospace"
        ctx.fillText("Better luck next time!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15)
      }
    }

    // Draw game instructions if not playing
    if (!isPlaying && !gameWon) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "20px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Click Start to Play!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.font = "14px monospace"
      ctx.fillText(`First to ${WINNING_SCORE} wins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25)
    }
  }, [paddle1Y, paddle2Y, ballX, ballY, isPlaying, gameWon, winner, score1, isNewHighScore])

  const topScore = highScores.length > 0 ? highScores[0].score : 0

  return (
    <div className="retro-content h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-200 border-2 border-gray-400" style={{ borderStyle: 'inset' }}>
        <h3 className="flex items-center gap-2 font-bold">
          <Image 
            src="/assets/icons/Circle_Blue.png" 
            alt="Pong" 
            width={20} 
            height={20}
          />
          Pong Game
        </h3>
        <div className="font-mono font-bold text-sm">
          Player: {score1} | AI: {score2} | Hi: {formatScore(topScore)}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center bg-black border-2 border-gray-400" style={{ borderStyle: 'inset' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
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
            {isPlaying ? "Playing..." : gameWon ? "New Game" : "Start"}
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
          Use W/S keys to move your paddle • First to {WINNING_SCORE} wins • Beat the AI!
        </div>
      </div>
    </div>
  )
} 