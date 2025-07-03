"use client"

import Image from "next/image"
import { useEffect } from "react"
import { loadGameAssets } from "@/lib/lazy-asset-loader"

interface GamesWindowProps {
  onGameSelect: (gameType: string) => void
}

export function GamesWindow({ onGameSelect }: GamesWindowProps) {
  const games = [
    {
      id: "snake",
      icon: "/assets/icons/Letter S Yellow_Blue.png",
      title: "Snake",
      description: "Classic snake game",
    },
    {
      id: "pong",
      icon: "/assets/icons/Circle_Blue.png",
      title: "Pong",
      description: "Retro paddle game",
    },
    {
      id: "memory",
      icon: "/assets/icons/Letter M Yellow_Blue.png",
      title: "Memory",
      description: "Match the cards",
    },
    {
      id: "breakout",
      icon: "/assets/icons/Letter B Yellow_Blue.png",
      title: "Breakout",
      description: "Break the bricks",
    },
  ]

  // Lazy load game assets when games window opens
  useEffect(() => {
    loadGameAssets().catch(error => {
      console.warn('Failed to load game assets:', error)
    })
  }, [])

  const handleGameClick = (gameType: string) => {
    console.log(`Game clicked: ${gameType}`)
    console.log("GameManager available:", !!(window as any).gameManager)
    onGameSelect(gameType)
  }

  return (
    <div className="retro-content">
      <h2>
        <Image 
          src="/assets/icons/Controller_Blue.png" 
          alt="Games" 
          width={20} 
          height={20} 
          className="inline mr-2"
        /> 
        Retro Game Center
      </h2>
      <p>Double-click any game to start playing!</p>
      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onDoubleClick={() => handleGameClick(game.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="game-icon">
              <Image 
                src={game.icon} 
                alt={game.title} 
                width={32} 
                height={32}
              />
            </div>
            <div className="game-title">{game.title}</div>
            <div className="game-desc">{game.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
