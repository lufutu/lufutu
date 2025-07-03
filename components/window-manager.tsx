"use client"

import React, { useCallback, useState } from "react"
import type { Window, DesktopIcon } from "@/types"
import { DesktopIcons } from "./desktop-icons"
import { WindowComponent } from "./window"
import { GameManager } from "./game-manager"
import { GamesWindow } from "./games-window"
import { PixelBrowser } from "./pixel-browser"
import { HabitTrackerWindow } from "./habit-tracker-window"
import { getWindowConfig } from "@/lib/window-content"

interface WindowManagerProps {
  windows: Window[]
  setWindows: (windows: Window[]) => void
  nextZIndex: number
  setNextZIndex: (zIndex: number) => void
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
  desktopIcons: DesktopIcon[]
  setDesktopIcons: (icons: DesktopIcon[]) => void
}

export const WindowManager = React.memo(({
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
  handleMouseDown,
  desktopIcons,
  setDesktopIcons,
}: WindowManagerProps) => {
  const [habitCompletions, setHabitCompletions] = useState<Record<string, { completed: number, total: number }>>({})

  const handleIconDoubleClick = useCallback((iconId: string) => {
    openWindow(iconId)
  }, [])

  const openWindow = useCallback((type: string, title?: string) => {
    const config = getWindowConfig(type)
    const windowTitle = title || config.title
    if (windows.some((w) => w.title === windowTitle)) return

    let contentComponent: React.ReactNode = null
    
    // Special handling for browser window
    if (type === "browser") {
      contentComponent = <PixelBrowser />
    }
    // Special handling for habit tracker window
    else if (type === "habits") {
      const windowId = `${type}-${Date.now()}`
      contentComponent = (
        <HabitTrackerWindow 
          onCompletionChange={(completed, total) => {
            setHabitCompletions(prev => ({
              ...prev,
              [windowId]: { completed, total }
            }))
          }} 
        />
      )
    }

    const newWindow: Window = {
      id: `${type}-${Date.now()}`,
      title: windowTitle,
      content: config.content,
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
    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }, [windows, nextZIndex, setWindows, setNextZIndex])

  return (
    <>
      <DesktopIcons 
        desktopIcons={desktopIcons}
        handleIconDoubleClick={handleIconDoubleClick}
        handleMouseDown={handleMouseDown}
      />
      {windows.map((window) => (
        <WindowComponent
          key={window.id}
          window={window}
          onClose={() => {
            setWindows(windows.filter((w) => w.id !== window.id))
            if (window.id.startsWith('habits-')) {
              setHabitCompletions(prev => {
                const { [window.id]: _, ...rest } = prev
                return rest
              })
            }
          }}
          onMinimize={() => {
            setWindows(
              windows.map((w) =>
                w.id === window.id ? { ...w, isMinimized: true } : w
              )
            )
          }}
          onMaximize={() => {
            setWindows(
              windows.map((w) =>
                w.id === window.id
                  ? {
                      ...w,
                      isMaximized: !w.isMaximized,
                      originalBounds: !w.isMaximized
                        ? { x: w.x, y: w.y, width: w.width, height: w.height }
                        : w.originalBounds,
                    }
                  : w
              )
            )
          }}
          onMouseDown={(e) => handleMouseDown(e, "window", window.id)}
          habitCompletions={window.id.startsWith('habits-') ? habitCompletions[window.id] : undefined}
        />
      ))}
    </>
  )
})


