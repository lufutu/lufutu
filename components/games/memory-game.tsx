"use client"

import { useEffect, useCallback, useState } from "react"
import Image from "next/image"
import { getHighScores, saveHighScore, isHighScore, formatScore } from "@/lib/high-scores"

interface MemoryGameProps {
  onScore?: (score: number) => void
}

interface Card {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

const GAME_NAME = "memory"

export function MemoryGame({ onScore }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [highScores, setHighScores] = useState(getHighScores(GAME_NAME))
  const [isNewHighScore, setIsNewHighScore] = useState(false)

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

  const calculateScore = useCallback((moves: number) => {
    // Better score for fewer moves - max score 1000, minimum 16 moves to win
    const baseScore = 1000
    const penalty = Math.max(0, moves - 16) * 10
    return Math.max(100, baseScore - penalty)
  }, [])

  const initializeGame = useCallback(() => {
    const cardPairs = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }))

    setCards(cardPairs)
    setFlippedCards([])
    setMoves(0)
    setScore(0)
    setGameWon(false)
    setIsProcessing(false)
    setIsNewHighScore(false)
  }, [])

  const handleGameWin = useCallback((finalMoves: number) => {
    const finalScore = calculateScore(finalMoves)
    setScore(finalScore)
    onScore?.(finalScore)
    
    if (isHighScore(GAME_NAME, finalScore)) {
      saveHighScore(GAME_NAME, finalScore)
      setIsNewHighScore(true)
      setHighScores(getHighScores(GAME_NAME))
    }
    
    setGameWon(true)
  }, [calculateScore, onScore])

  const flipCard = useCallback((cardId: number) => {
    if (isProcessing || flippedCards.length >= 2) return
    if (cards[cardId].flipped || cards[cardId].matched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ))

    if (newFlippedCards.length === 2) {
      setIsProcessing(true)
      const newMoves = moves + 1
      setMoves(newMoves)

      const [first, second] = newFlippedCards
      const firstCard = cards[first]
      const secondCard = cards[second]

      if (firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true } 
              : card
          ))
          setFlippedCards([])
          setIsProcessing(false)

          // Check if game is won
          const allMatched = cards.every(card => 
            card.id === first || card.id === second || card.matched
          )
          if (allMatched) {
            handleGameWin(newMoves)
          }
        }, 500)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false } 
              : card
          ))
          setFlippedCards([])
          setIsProcessing(false)
        }, 1000)
      }
    }
  }, [cards, flippedCards, isProcessing, moves, handleGameWin])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const topScore = highScores.length > 0 ? highScores[0].score : 0

  return (
    <div className="retro-content h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-200 border-2 border-gray-400" style={{ borderStyle: 'inset' }}>
        <h3 className="flex items-center gap-2 font-bold">
          <Image 
            src="/assets/icons/Letter M Yellow_Blue.png" 
            alt="Memory" 
            width={20} 
            height={20}
          />
          Memory Game
        </h3>
        <div className="font-mono font-bold text-sm">
          Moves: {moves} | Hi: {formatScore(topScore)}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameWon && (
          <div className="mb-4 p-3 bg-yellow-200 border-2 border-yellow-400 rounded font-bold text-center">
            <div className="text-lg">🎉 Congratulations! 🎉</div>
            <div className="text-sm mt-1">Won in {moves} moves!</div>
            <div className="text-lg mt-1">Score: {formatScore(score)}</div>
            {isNewHighScore && (
              <div className="text-yellow-600 font-bold mt-1">NEW HIGH SCORE!</div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-2 max-w-xs">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => flipCard(card.id)}
              className={`
                w-16 h-16 border-2 cursor-pointer flex items-center justify-center
                transition-all duration-200 transform hover:scale-105
                ${card.flipped || card.matched 
                  ? 'bg-white border-gray-400' 
                  : 'bg-gray-300 border-gray-500 hover:bg-gray-200'
                }
                ${card.matched ? 'opacity-60' : ''}
              `}
              style={{ 
                borderStyle: card.flipped || card.matched ? 'inset' : 'outset'
              }}
            >
              {card.flipped || card.matched ? (
                <Image
                  src={card.value}
                  alt="Card"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">?</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-gray-200 border-t-2 border-gray-400">
        <div className="flex gap-2 mb-2">
          <button
            onClick={initializeGame}
            className="px-4 py-1 bg-gray-300 border-2 border-gray-400 hover:bg-gray-100 font-bold"
            style={{ borderStyle: 'outset' }}
          >
            New Game
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
          Click cards to flip • Match all pairs to win • Fewer moves = Higher score!
        </div>
      </div>
    </div>
  )
} 