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
  const requestRef = useRef<number>()
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

  const handleMouseDown = useCallback((e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => {
    e.preventDefault()

    if (type === "window") {
      const window = windows.find((w) => w.id === targetId)
      if (!window) return
      bringToFront(targetId)
      setDragState({
        isDragging: true,
        dragType: "window",
        targetId,
        startX: e.clientX,
        startY: e.clientY,
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
        startX: e.clientX,
        startY: e.clientY,
        startTargetX: icon.x,
        startTargetY: icon.y,
      })
    } else if (type === "widget") {
      const widget = widgets.find((w) => w.id === targetId)
      if (!widget) return
      setDragState({
        isDragging: true,
        dragType: "widget",
        targetId,
        startX: e.clientX,
        startY: e.clientY,
        startTargetX: widget.x,
        startTargetY: widget.y,
      })
    }
  }, [windows, desktopIcons, widgets, bringToFront, handleIconClick])

  // Optimized update function using requestAnimationFrame
  const applyPendingUpdate = useCallback(() => {
    if (!pendingUpdateRef.current || !dragState.isDragging || !dragState.targetId) {
      return
    }

    const { deltaX, deltaY } = pendingUpdateRef.current
    pendingUpdateRef.current = null

    if (dragState.dragType === "window") {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === dragState.targetId
            ? {
                ...w,
                x: Math.max(0, Math.min(window.innerWidth - 200, dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 100, dragState.startTargetY + deltaY)),
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
                x: Math.max(0, Math.min(window.innerWidth - 80, dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 80, dragState.startTargetY + deltaY)),
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
                x: Math.max(0, Math.min(window.innerWidth - w.width, dragState.startTargetX + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - w.height, dragState.startTargetY + deltaY)),
              }
            : w,
        ),
      )
    }
  }, [dragState, setWindows, setDesktopIcons, setWidgets])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.targetId) return

    // Throttle mouse move updates more aggressively
    const now = Date.now()
    if (now - lastMoveTime.current < THROTTLE_MS) return
    lastMoveTime.current = now

    const deltaX = e.clientX - dragState.startX
    const deltaY = e.clientY - dragState.startY

    // Store pending update instead of applying immediately
    pendingUpdateRef.current = { deltaX, deltaY }

    // Cancel any pending animation frame and request new one
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame(applyPendingUpdate)
  }, [dragState, applyPendingUpdate])

  const handleMouseUp = useCallback(() => {
    // Apply any final pending update
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      applyPendingUpdate()
    }
    
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
      document.addEventListener("mousemove", handleMouseMove, { passive: true })
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  return { dragState, handleMouseDown }
}
