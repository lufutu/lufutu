"use client"

import React, { useCallback } from "react"
import type { Window, DesktopIcon, GameState } from "@/types"
import { DesktopIcons } from "./desktop-icons"
import { WindowComponent } from "./window"
import { GameManager } from "./game-manager"
import { GamesWindow } from "./games-window"
import { PixelBrowser } from "./pixel-browser"
import { getWindowConfig } from "@/lib/window-content"

interface WindowManagerProps {
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
  desktopIcons: DesktopIcon[]
  setDesktopIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>
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
  const openWindow = useCallback((type: string, title?: string) => {
    const config = getWindowConfig(type)
    const windowTitle = title || config.title
    if (windows.some((w) => w.title === windowTitle)) return

    let contentComponent: React.ReactNode = null
    
    // Special handling for browser window
    if (type === "browser") {
      contentComponent = <PixelBrowser />
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
                <GamesWindow onGameSelect={(gameType) => {
                  console.log(`WindowManager: Trying to open game: ${gameType}`)
                  const globalWindow = globalThis as any
                  console.log("GameManager available:", !!globalWindow.gameManager)
                  if (globalWindow.gameManager) {
                    globalWindow.gameManager.openGame(gameType)
                  } else {
                    console.error("GameManager not found on window object")
                  }
                }} />
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
        windows={windows}
        setWindows={setWindows}
        nextZIndex={nextZIndex}
        setNextZIndex={setNextZIndex}
      />
    </>
  )
})


