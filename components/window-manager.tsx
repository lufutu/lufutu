"use client"

import React, { useCallback } from "react"
import type { Window, DesktopIcon, GameState } from "@/types"
import { DesktopIcons } from "./desktop-icons"
import { WindowComponent } from "./window"
import { GameManager } from "./game-manager"
import { GamesWindow } from "./games-window"
import { getWindowConfig } from "@/lib/window-content"

interface WindowManagerProps {
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
  gameStates: GameState
  setGameStates: React.Dispatch<React.SetStateAction<GameState>>
  desktopIcons: DesktopIcon[]
  setDesktopIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>
}

export const WindowManager = React.memo(({
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
  handleMouseDown,
  gameStates,
  setGameStates,
  desktopIcons,
  setDesktopIcons,
}: WindowManagerProps) => {
  const openWindow = useCallback((type: string, title?: string) => {
    const config = getWindowConfig(type)
    const windowTitle = title || config.title
    if (windows.some((w) => w.title === windowTitle)) return

    const newWindow: Window = {
      id: `${type}-${Date.now()}`,
      title: windowTitle,
      content: config.content,
      x: Math.random() * 200 + 200,
      y: Math.random() * 150 + 100,
      width: config.defaultSize.width,
      height: config.defaultSize.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      originalBounds: undefined,
    }
    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }, [windows, nextZIndex, setWindows, setNextZIndex])

  const openGameWindow = useCallback((gameType: string) => {
    console.log(`Opening ${gameType} game from window manager...`)

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

    console.log(`Creating window for ${gameTitle}`)
    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)

    // Initialize and auto-start games after window is created
    setTimeout(() => {
      console.log(`Initializing ${gameType} game...`)
      if (gameType === "snake") {
        // Auto-start snake game
        setGameStates((prev) => ({
          ...prev,
          snake: {
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            direction: "RIGHT",
            score: 0,
            gameOver: false,
            isPlaying: true,
          },
        }))
      } else if (gameType === "pong") {
        // Auto-start pong game
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
            isPlaying: true,
          },
        }))
      } else if (gameType === "memory") {
        // Initialize memory game
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
      }
    }, 200)
  }, [windows, nextZIndex, setWindows, setNextZIndex, setGameStates])

  const handleIconDoubleClick = useCallback((iconId: string) => {
    console.log(`Double-clicked icon: ${iconId}`)
    const icon = desktopIcons.find((i) => i.id === iconId)
    if (icon) {
      openWindow(iconId)
    }
  }, [desktopIcons, openWindow])

  const handleIconClick = useCallback((iconId: string) => {
    setDesktopIcons((prev) =>
      prev.map((icon) => ({
        ...icon,
        selected: icon.id === iconId,
      })),
    )
  }, [setDesktopIcons])

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId))
  }, [setWindows])

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w)))
  }, [setWindows])

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          if (w.isMaximized) {
            return {
              ...w,
              isMaximized: false,
              x: w.originalBounds?.x || w.x,
              y: w.originalBounds?.y || w.y,
              width: w.originalBounds?.width || w.width,
              height: w.originalBounds?.height || w.height,
            }
          } else {
            return {
              ...w,
              isMaximized: true,
              originalBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight - 32,
            }
          }
        }
        return w
      }),
    )
  }, [setWindows])

  const bringToFront = useCallback((windowId: string) => {
    setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }, [setWindows, nextZIndex, setNextZIndex])

  return (
    <>
      <DesktopIcons
        desktopIcons={desktopIcons}
        handleIconDoubleClick={handleIconDoubleClick}
        handleMouseDown={handleMouseDown}
      />

      {windows.map((window) => {
        // Special handling for games window
        if (window.title === "Games") {
          return (
            <div
              key={window.id}
              className={`window ${window.isMinimized ? "minimized" : ""}`}
              style={{
                left: window.x,
                top: window.y,
                width: window.width,
                height: window.height,
                zIndex: window.zIndex,
              }}
            >
              <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, "window", window.id)}>
                <div className="window-title">{window.title}</div>
                <div className="window-controls">
                  <div className="window-control" onClick={() => minimizeWindow(window.id)}>
                    <div className="minimize-icon"></div>
                  </div>
                  <div className="window-control" onClick={() => maximizeWindow(window.id)}>
                    <div className={`maximize-icon ${window.isMaximized ? "restore" : ""}`}></div>
                  </div>
                  <div className="window-control" onClick={() => closeWindow(window.id)}>
                    <div className="close-icon"></div>
                  </div>
                </div>
              </div>
              <div className="window-content">
                <GamesWindow onGameSelect={openGameWindow} />
              </div>
            </div>
          )
        }

        return (
          <WindowComponent
            key={window.id}
            window={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onMouseDown={(e) => handleMouseDown(e, "window", window.id)}
          />
        )
      })}

      <GameManager
        gameStates={gameStates}
        setGameStates={setGameStates}
        windows={windows}
        setWindows={setWindows}
        nextZIndex={nextZIndex}
        setNextZIndex={setNextZIndex}
      />
    </>
  )
})


