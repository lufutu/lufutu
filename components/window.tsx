"use client"

import React, { useState, useCallback } from "react"
import type { Window } from "@/types"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface WindowProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onClick: () => void
  habitCompletions?: { completed: number, total: number }
}

interface ResizeState {
  isResizing: boolean
  edge: string
  startX: number
  startY: number
  initialWidth: number
  initialHeight: number
  initialX: number
  initialY: number
}

export const WindowComponent: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
  onClick,
  habitCompletions,
}) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    edge: '',
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialX: 0,
    initialY: 0,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent keyboard events from bubbling up from game windows
    if (window.id.includes("game")) {
      e.stopPropagation()
    }
  }

  const handleResizeStart = useCallback((e: React.MouseEvent, edge: string) => {
    e.stopPropagation()
    if (!window.isMaximized) {
      setResizeState({
        isResizing: true,
        edge,
        startX: e.clientX,
        startY: e.clientY,
        initialWidth: window.width,
        initialHeight: window.height,
        initialX: window.x,
        initialY: window.y,
      })
    }
  }, [window])

  React.useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (resizeState.isResizing) {
        const deltaX = e.clientX - resizeState.startX
        const deltaY = e.clientY - resizeState.startY
        const minWidth = 200
        const minHeight = 150

        let newWidth = resizeState.initialWidth
        let newHeight = resizeState.initialHeight
        let newX = resizeState.initialX
        let newY = resizeState.initialY

        if (resizeState.edge.includes('right')) {
          newWidth = Math.max(minWidth, resizeState.initialWidth + deltaX)
        }
        if (resizeState.edge.includes('bottom')) {
          newHeight = Math.max(minHeight, resizeState.initialHeight + deltaY)
        }
        if (resizeState.edge.includes('left')) {
          const possibleWidth = resizeState.initialWidth - deltaX
          if (possibleWidth >= minWidth) {
            newWidth = possibleWidth
            newX = resizeState.initialX + deltaX
          }
        }
        if (resizeState.edge.includes('top')) {
          const possibleHeight = resizeState.initialHeight - deltaY
          if (possibleHeight >= minHeight) {
            newHeight = possibleHeight
            newY = resizeState.initialY + deltaY
          }
        }

        // Update window dimensions through parent component
        window.width = newWidth
        window.height = newHeight
        window.x = newX
        window.y = newY
      }
    }

    const handleResizeEnd = () => {
      if (resizeState.isResizing) {
        setResizeState(prev => ({ ...prev, isResizing: false }))
      }
    }

    if (resizeState.isResizing) {
      globalThis.window.addEventListener('mousemove', handleResizeMove)
      globalThis.window.addEventListener('mouseup', handleResizeEnd)
    }

    return () => {
      globalThis.window.removeEventListener('mousemove', handleResizeMove)
      globalThis.window.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [resizeState, window])

  return (
    <div
      className={cn(
        "fixed flex flex-col bg-gray-100 border-2 border-gray-400 rounded shadow-lg transition-transform",
        window.isMinimized ? "invisible" : "visible",
        "select-none"
      )}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      }}
      onMouseDown={(e) => {
        onMouseDown(e)
        onClick() // Bring window to front when clicking anywhere on it
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby={`window-title-${window.id}`}
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between bg-gray-300 px-2 py-1">
        <div className="flex items-center gap-2">
          {window.icon && (
            <img src={window.icon} alt="" className="w-4 h-4" />
          )}
          <span id={`window-title-${window.id}`} className="text-sm font-semibold">
            {window.title}
            {habitCompletions && ` ${habitCompletions.completed}/${habitCompletions.total}`}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onMinimize}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center text-xs"
            aria-label="Minimize window"
          >
            _
          </button>
          <button
            onClick={onMaximize}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center text-xs"
            aria-label="Maximize window"
          >
            □
          </button>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs"
            aria-label="Close window"
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-white p-4">
        {window.contentComponent || (
          <div dangerouslySetInnerHTML={{ __html: window.content || "" }} />
        )}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}
    </div>
  )
}
