"use client"

import React, { useCallback, useState, useEffect, useRef } from "react"
import type { Window } from "@/types"
import { DesktopIcons } from "./desktop-icons"
import { WindowComponent } from "./window"
import { PixelBrowser } from "./pixel-browser"
import { HabitTrackerWindow } from "./habit-tracker-window"
import { GamesWindow } from "./games-window"
import { SnakeGame } from "./games/snake-game"
import { PongGame } from "./games/pong-game"
import { MemoryGame } from "./games/memory-game"
import { BreakoutGame } from "./games/breakout-game"
import { getWindowConfig, getWindowContent } from "@/lib/window-content"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"

interface WindowManagerProps {
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
}) => {
  const [habitCompletions, setHabitCompletions] = useState<Record<string, { completed: number; total: number }>>({})
  const openWindowRef = useRef<((type: string, title?: string) => void) | null>(null)
  const isInitialMount = useRef(true)

  // Use shared drag and drop system
  const { handleMouseDown, handleTouchStart, handleDragStart } = useDragAndDrop({
    desktopIcons: [], // Windows don't interact with desktop icons
    setDesktopIcons: () => {}, // No-op
    widgets: [], // Windows don't interact with widgets
    setWidgets: () => {}, // No-op
    windows,
    setWindows,
    nextZIndex,
    setNextZIndex,
  })

  const openWindow = useCallback((type: string, title?: string) => {
    const config = getWindowConfig(type)
    const windowTitle = title || config.title
    
    // Check if window exists using the fixed windowId from config
    const existingWindow = windows.find((w) => w.id === config.windowId)
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        // If window exists and is minimized, restore it
        setWindows(prev => prev.map(w => 
          w.id === config.windowId 
            ? { ...w, isMinimized: false, zIndex: nextZIndex } 
            : w
        ))
        setNextZIndex(prev => prev + 1)
      } else {
        // If window exists and is not minimized, bring it to front
        setWindows(prev => prev.map(w => 
          w.id === config.windowId 
            ? { ...w, zIndex: nextZIndex } 
            : w
        ))
        setNextZIndex(prev => prev + 1)
      }
      return
    }

    let contentComponent: React.ReactNode = null

    // Special handling for browser window
    if (type === "browser") {
      contentComponent = <PixelBrowser />
    }
    // Special handling for habit tracker window
    else if (type === "habits") {
      contentComponent = (
        <HabitTrackerWindow
          onCompletionChange={(completed, total) => {
            setHabitCompletions(prev => ({
              ...prev,
              [config.windowId]: { completed, total }
            }))
          }}
        />
      )
    }
    // Special handling for games window
    else if (type === "games") {
      contentComponent = <GamesWindow onGameSelect={handleGameSelect} />
    }
    // Special handling for individual games
    else if (type === "snake") {
      contentComponent = <SnakeGame />
    }
    else if (type === "pong") {
      contentComponent = <PongGame />
    }
    else if (type === "memory") {
      contentComponent = <MemoryGame />
    }
    else if (type === "breakout") {
      contentComponent = <BreakoutGame />
    }

    const newWindow: Window = {
      id: config.windowId,
      title: windowTitle,
      icon: config.icon,
      content: getWindowContent(type),
      contentComponent,
      x: Math.random() * 200 + 200,
      y: Math.random() * 150 + 100,
      width: config.defaultSize.width,
      height: config.defaultSize.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      originalBounds: undefined,
    }
    setWindows(prev => [...prev, newWindow])
    setNextZIndex(prev => prev + 1)
  }, [windows, nextZIndex, setWindows, setNextZIndex])

  // Store openWindow in ref to avoid dependency cycles
  useEffect(() => {
    openWindowRef.current = openWindow
  }, [openWindow])

  const handleGameSelect = useCallback((gameType: string) => {
    openWindowRef.current?.(gameType)
  }, [])

  // Open Home window on mount
  useEffect(() => {
    if (isInitialMount.current && windows.length === 0) {
      openWindow("home")
      isInitialMount.current = false
    }
  }, [openWindow, windows.length])

  const handleIconDoubleClick = useCallback((iconId: string) => {
    openWindow(iconId)
  }, [openWindow])

  const handleIconMouseDown = useCallback((e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => {
    handleMouseDown(e, type, targetId)
  }, [handleMouseDown])

  const handleIconTouchStart = useCallback((e: React.TouchEvent, type: "window" | "icon" | "widget", targetId: string) => {
    handleTouchStart(e, type, targetId)
  }, [handleTouchStart])

  const bringWindowToFront = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ))
    setNextZIndex(prev => prev + 1)
  }, [nextZIndex, setNextZIndex, setWindows])

  return (
    <>
      <DesktopIcons
        handleIconDoubleClick={handleIconDoubleClick}
        handleMouseDown={handleIconMouseDown}
        handleTouchStart={handleIconTouchStart}
      />
      {windows.map((window) => (
        <WindowComponent
          key={window.id}
          window={window}
          onClose={() => {
            setWindows(prev => prev.filter(w => w.id !== window.id))
          }}
          onMinimize={() => {
            setWindows(prev => prev.map(w =>
              w.id === window.id ? { ...w, isMinimized: true } : w
            ))
          }}
          onMaximize={() => {
            setWindows(prev => prev.map(w =>
              w.id === window.id
                ? {
                    ...w,
                    isMaximized: !w.isMaximized,
                    originalBounds: !w.isMaximized
                      ? { x: w.x, y: w.y, width: w.width, height: w.height }
                      : w.originalBounds,
                    x: !w.isMaximized ? 0 : (w.originalBounds?.x || w.x),
                    y: !w.isMaximized ? 0 : (w.originalBounds?.y || w.y),
                    width: !w.isMaximized ? globalThis.window.innerWidth : (w.originalBounds?.width || w.width),
                    height: !w.isMaximized ? globalThis.window.innerHeight - 40 : (w.originalBounds?.height || w.height),
                  }
                : w
            ))
          }}
          onMouseDown={(e) => handleMouseDown(e, "window", window.id)}
          onTouchStart={(e) => handleTouchStart(e, "window", window.id)}
          onClick={() => bringWindowToFront(window.id)}
          habitCompletions={habitCompletions[window.id]}
        />
      ))}
    </>
  )
}


