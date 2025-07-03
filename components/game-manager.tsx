"use client"

import React, { useCallback } from "react"
import type { Window } from "@/types"
import { SnakeGame } from "./games/snake-game"
import { PongGame } from "./games/pong-game" 
import { MemoryGame } from "./games/memory-game"
import { BreakoutGame } from "./games/breakout-game"

interface GameManagerProps {
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
}

export function GameManager({
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
}: GameManagerProps) {
  const openGameWindow = useCallback(
    (gameType: string) => {
      console.log(`Opening ${gameType} game...`)

      const gameTitle = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game`

      // Check if window already exists
      if (windows.some((w) => w.title === gameTitle)) {
        console.log(`${gameTitle} already open`)
        return
      }

      let gameComponent: React.ReactNode = null
      let windowWidth = 500
      let windowHeight = 400

      switch (gameType) {
        case "snake":
          windowWidth = 500
          windowHeight = 650
          gameComponent = <SnakeGame />
          break
        case "pong":
          windowWidth = 500
          windowHeight = 550
          gameComponent = <PongGame />
          break
        case "memory":
          windowWidth = 450
          windowHeight = 600
          gameComponent = <MemoryGame />
          break
        case "breakout":
          windowWidth = 500
          windowHeight = 620
          gameComponent = <BreakoutGame />
          break
        default:
          console.warn(`Unknown game type: ${gameType}`)
          return
      }

      const newWindow: Window = {
        id: `${gameType}-game-${Date.now()}`,
        title: gameTitle,
        content: "", // We'll use contentComponent instead
        contentComponent: gameComponent,
        x: Math.random() * 200 + 300,
        y: Math.random() * 150 + 100,
        width: windowWidth,
        height: windowHeight,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        originalBounds: undefined,
      }

      console.log(`Creating window for ${gameTitle}`)
      setWindows((prev) => [...prev, newWindow])
      setNextZIndex((prev) => prev + 1)
    },
    [windows, setWindows, nextZIndex, setNextZIndex],
  )

  // Expose game function to window for backward compatibility
  React.useEffect(() => {
    console.log("GameManager: Setting up window.gameManager")
    const globalWindow = window as typeof window & { gameManager?: { openGame: (gameType: string) => void } }
    globalWindow.gameManager = {
      openGame: openGameWindow,
    }

    return () => {
      console.log("GameManager: Cleaning up window.gameManager")
      delete globalWindow.gameManager
    }
  }, [openGameWindow])

  return null
}
