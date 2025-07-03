"use client"

import React, { useState, useCallback } from "react"
import type { Window } from "@/types"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface WindowProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
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

// Helper function to get touch coordinates
const getTouchCoordinates = (e: TouchEvent) => {
  const touch = e.touches[0] || e.changedTouches[0]
  return { clientX: touch.clientX, clientY: touch.clientY }
}

// Helper function to get mouse coordinates
const getMouseCoordinates = (e: MouseEvent) => {
  return { clientX: e.clientX, clientY: e.clientY }
}

// Helper function to normalize coordinates from both mouse and touch events
const getNormalizedCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
  if ('touches' in e) {
    const touch = e.touches[0]
    return { clientX: touch.clientX, clientY: touch.clientY }
  }
  return { clientX: e.clientX, clientY: e.clientY }
}

export const WindowComponent: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
  onTouchStart,
  onClick,
  habitCompletions,
}) => {
  const isMobile = useIsMobile()
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

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, edge: string) => {
    e.stopPropagation()
    
    // Prevent scrolling on touch devices during resize
    if ('touches' in e) {
      document.body.style.overflow = 'hidden'
    }
    
    if (!window.isMaximized) {
      const { clientX, clientY } = getNormalizedCoordinates(e)
      
      setResizeState({
        isResizing: true,
        edge,
        startX: clientX,
        startY: clientY,
        initialWidth: window.width,
        initialHeight: window.height,
        initialX: window.x,
        initialY: window.y,
      })
    }
  }, [window])

  React.useEffect(() => {
    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      if (resizeState.isResizing) {
        const { clientX, clientY } = 'touches' in e ? getTouchCoordinates(e) : getMouseCoordinates(e)
        
        const deltaX = clientX - resizeState.startX
        const deltaY = clientY - resizeState.startY
        
        // Mobile-friendly minimum sizes
        const minWidth = isMobile ? 280 : 200
        const minHeight = isMobile ? 200 : 150

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

        // Ensure window stays within screen bounds
        const screenWidth = globalThis.window.innerWidth
        const screenHeight = globalThis.window.innerHeight
        
        newWidth = Math.min(newWidth, screenWidth - newX)
        newHeight = Math.min(newHeight, screenHeight - newY)

        // Update window dimensions through parent component
        window.width = newWidth
        window.height = newHeight
        window.x = newX
        window.y = newY
      }
    }

    const handleResizeEnd = () => {
      if (resizeState.isResizing) {
        // Re-enable scrolling on touch devices
        document.body.style.overflow = ''
        
        setResizeState(prev => ({ ...prev, isResizing: false }))
      }
    }

    if (resizeState.isResizing) {
      // Mouse events
      globalThis.window.addEventListener('mousemove', handleResizeMove)
      globalThis.window.addEventListener('mouseup', handleResizeEnd)
      
      // Touch events
      globalThis.window.addEventListener('touchmove', handleResizeMove, { passive: false })
      globalThis.window.addEventListener('touchend', handleResizeEnd)
      globalThis.window.addEventListener('touchcancel', handleResizeEnd)
    }

    return () => {
      globalThis.window.removeEventListener('mousemove', handleResizeMove)
      globalThis.window.removeEventListener('mouseup', handleResizeEnd)
      globalThis.window.removeEventListener('touchmove', handleResizeMove)
      globalThis.window.removeEventListener('touchend', handleResizeEnd)
      globalThis.window.removeEventListener('touchcancel', handleResizeEnd)
    }
  }, [resizeState, window, isMobile])

  // Calculate responsive window size for mobile
  const getResponsiveStyles = () => {
    if (!isMobile) {
      return {
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      }
    }

    // Mobile responsive adjustments
    const screenWidth = globalThis.window?.innerWidth || 360
    const screenHeight = globalThis.window?.innerHeight || 640
    
    // For small screens, make windows take up more space
    const maxWidth = Math.min(screenWidth - 20, window.width)
    const maxHeight = Math.min(screenHeight - 100, window.height) // Leave space for taskbar
    
    return {
      left: Math.max(10, Math.min(window.x, screenWidth - maxWidth)),
      top: Math.max(10, Math.min(window.y, screenHeight - maxHeight)),
      width: maxWidth,
      height: maxHeight,
      zIndex: window.zIndex,
    }
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchstart') {
      onTouchStart?.(e as React.TouchEvent)
    } else {
      onMouseDown(e as React.MouseEvent)
    }
    onClick() // Bring window to front when clicking anywhere on it
  }

  return (
    <div
      className={cn(
        "fixed flex flex-col bg-gray-100 border-2 border-gray-400 rounded shadow-lg transition-transform",
        window.isMinimized ? "invisible" : "visible",
        "select-none",
        isMobile && "touch-none" // Prevent default touch behaviors
      )}
      style={getResponsiveStyles()}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby={`window-title-${window.id}`}
    >
      {/* Window Title Bar */}
      <div className={cn(
        "flex items-center justify-between bg-gray-300 px-2 py-1",
        isMobile ? "min-h-[44px]" : "min-h-[24px]" // Touch-friendly height on mobile
      )}>
        <div className="flex items-center gap-2">
          {window.icon && (
            <Image src={window.icon} alt="" width={16} height={16} />
          )}
          <span id={`window-title-${window.id}`} className={cn(
            "font-semibold truncate",
            isMobile ? "text-sm" : "text-sm"
          )}>
            {window.title}
            {habitCompletions && ` ${habitCompletions.completed}/${habitCompletions.total}`}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onMinimize}
            className={cn(
              "bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center text-xs font-bold",
              isMobile ? "w-8 h-8" : "w-4 h-4" // Touch-friendly size on mobile
            )}
            aria-label="Minimize window"
          >
            _
          </button>
          <button
            onClick={onMaximize}
            className={cn(
              "bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center text-xs font-bold",
              isMobile ? "w-8 h-8" : "w-4 h-4" // Touch-friendly size on mobile
            )}
            aria-label="Maximize window"
          >
            □
          </button>
          <button
            onClick={onClose}
            className={cn(
              "bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold",
              isMobile ? "w-8 h-8" : "w-4 h-4" // Touch-friendly size on mobile
            )}
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

      {/* Resize Handles - Only show on desktop or larger mobile devices */}
      {!window.isMaximized && !isMobile && (
        <>
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            onTouchStart={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            onTouchStart={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            onTouchStart={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            onTouchStart={(e) => handleResizeStart(e, 'bottom-right')}
          />
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            onTouchStart={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            onTouchStart={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            onTouchStart={(e) => handleResizeStart(e, 'left')}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            onTouchStart={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}
      
      {/* Mobile-specific resize handle - bottom right corner only */}
      {!window.isMaximized && isMobile && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-gray-400 opacity-50 hover:opacity-75"
          onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          onTouchStart={(e) => handleResizeStart(e, 'bottom-right')}
        >
          <div className="w-full h-full flex items-end justify-end p-1">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}
