"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import type { DragState, DesktopIcon, Widget, Window } from "@/types"

interface UseDragAndDropProps {
  desktopIcons: DesktopIcon[]
  setDesktopIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>
  widgets: Widget[]
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  nextZIndex: number
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
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

export function useDragAndDrop({
  desktopIcons,
  setDesktopIcons,
  widgets,
  setWidgets,
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
}: UseDragAndDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    targetId: null,
    startX: 0,
    startY: 0,
    startTargetX: 0,
    startTargetY: 0,
  })

  const lastMoveTime = useRef<number>(0)
  const requestRef = useRef<number | null>(null)
  const pendingUpdateRef = useRef<{deltaX: number, deltaY: number} | null>(null)
  const THROTTLE_MS = 32 // ~30fps instead of 60fps for better performance

  const bringToFront = useCallback((windowId: string) => {
    setWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }, [setWindows, nextZIndex, setNextZIndex])

  const handleIconClick = useCallback((iconId: string) => {
    setDesktopIcons((prev) =>
      prev.map((icon) => ({
        ...icon,
        selected: icon.id === iconId,
      })),
    )
  }, [setDesktopIcons])

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, type: "window" | "icon" | "widget", targetId: string) => {
    e.preventDefault()
    
    // Prevent scrolling on touch devices
    if ('touches' in e) {
      document.body.style.overflow = 'hidden'
    }

    const { clientX, clientY } = getNormalizedCoordinates(e)

    if (type === "window") {
      const window = windows.find((w) => w.id === targetId)
      if (!window) return
      bringToFront(targetId)
      setDragState({
        isDragging: true,
        dragType: "window",
        targetId,
        startX: clientX,
        startY: clientY,
        startTargetX: window.x,
        startTargetY: window.y,
      })
    } else if (type === "icon") {
      const icon = desktopIcons.find((i) => i.id === targetId)
      if (!icon) return
      handleIconClick(targetId)
      setDragState({
        isDragging: true,
        dragType: "icon",
        targetId,
        startX: clientX,
        startY: clientY,
        startTargetX: icon.x || 0,
        startTargetY: icon.y || 0,
      })
    } else if (type === "widget") {
      const widget = widgets.find((w) => w.id === targetId)
      if (!widget) return
      setDragState({
        isDragging: true,
        dragType: "widget",
        targetId,
        startX: clientX,
        startY: clientY,
        startTargetX: widget.x,
        startTargetY: widget.y,
      })
    }
  }, [windows, desktopIcons, widgets, bringToFront, handleIconClick])

  // Legacy mouse handler for backward compatibility
  const handleMouseDown = useCallback((e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => {
    handleDragStart(e, type, targetId)
  }, [handleDragStart])

  // New touch handler
  const handleTouchStart = useCallback((e: React.TouchEvent, type: "window" | "icon" | "widget", targetId: string) => {
    handleDragStart(e, type, targetId)
  }, [handleDragStart])

  // Optimized update function using requestAnimationFrame
  const applyPendingUpdate = useCallback(() => {
    if (!pendingUpdateRef.current || !dragState.isDragging || !dragState.targetId) {
      return
    }

    const { deltaX, deltaY } = pendingUpdateRef.current
    pendingUpdateRef.current = null

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    if (dragState.dragType === "window") {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === dragState.targetId
            ? {
                ...w,
                x: Math.max(0, Math.min(screenWidth - Math.min(w.width, 200), dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(screenHeight - Math.min(w.height, 100), dragState.startTargetY + deltaY)),
              }
            : w,
        ),
      )
    } else if (dragState.dragType === "icon") {
      setDesktopIcons((prev) =>
        prev.map((i) =>
          i.id === dragState.targetId
            ? {
                ...i,
                x: Math.max(0, Math.min(screenWidth - 80, dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(screenHeight - 80, dragState.startTargetY + deltaY)),
              }
            : i,
        ),
      )
    } else if (dragState.dragType === "widget") {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === dragState.targetId
            ? {
                ...w,
                x: Math.max(0, Math.min(screenWidth - w.width, dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(screenHeight - w.height, dragState.startTargetY + deltaY)),
              }
            : w,
        ),
      )
    }
  }, [dragState, setWindows, setDesktopIcons, setWidgets])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || !dragState.targetId) return

    // Throttle mouse move updates more aggressively
    const now = Date.now()
    if (now - lastMoveTime.current < THROTTLE_MS) return
    lastMoveTime.current = now

    const { clientX, clientY } = 'touches' in e ? getTouchCoordinates(e) : getMouseCoordinates(e)

    const deltaX = clientX - dragState.startX
    const deltaY = clientY - dragState.startY

    // Store pending update instead of applying immediately
    pendingUpdateRef.current = { deltaX, deltaY }

    // Cancel any pending animation frame and request new one
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame(applyPendingUpdate)
  }, [dragState, applyPendingUpdate])

  const handleEnd = useCallback(() => {
    // Apply any final pending update
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      applyPendingUpdate()
    }
    
    // Re-enable scrolling on touch devices
    document.body.style.overflow = ''
    
    setDragState({
      isDragging: false,
      dragType: null,
      targetId: null,
      startX: 0,
      startY: 0,
      startTargetX: 0,
      startTargetY: 0,
    })
    
    pendingUpdateRef.current = null
  }, [applyPendingUpdate])

  useEffect(() => {
    if (dragState.isDragging) {
      // Mouse events
      document.addEventListener("mousemove", handleMove, { passive: false })
      document.addEventListener("mouseup", handleEnd)
      
      // Touch events
      document.addEventListener("touchmove", handleMove, { passive: false })
      document.addEventListener("touchend", handleEnd)
      document.addEventListener("touchcancel", handleEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchmove", handleMove)
      document.removeEventListener("touchend", handleEnd)
      document.removeEventListener("touchcancel", handleEnd)
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [dragState.isDragging, handleMove, handleEnd])

  return { 
    dragState, 
    handleMouseDown, // Keep for backward compatibility
    handleTouchStart, // New touch handler
    handleDragStart // Universal handler
  }
}
