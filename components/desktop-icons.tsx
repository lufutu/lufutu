"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import type { DesktopIcon } from "@/types"
import { getDesktopIcons } from "@/lib/window-content"
import Image from "next/image"

interface DesktopIconsProps {
  handleIconDoubleClick: (iconId: string) => void
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
  handleTouchStart?: (e: React.TouchEvent, type: "window" | "icon" | "widget", targetId: string) => void
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  handleIconDoubleClick,
  handleMouseDown,
  handleTouchStart,
}) => {
  const [icons, setIcons] = useState<DesktopIcon[]>(() => 
    getDesktopIcons().map(icon => ({
      ...icon,
      selected: false
    }))
  )
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const desktopRef = useRef<HTMLDivElement>(null)

  // Double tap handling
  const [lastTap, setLastTap] = useState<{ id: string; time: number } | null>(null)
  const DOUBLE_TAP_DELAY = 300 // milliseconds

  // Grid settings
  const GRID_CELL_SIZE = 100 // Size of each grid cell
  const GRID_CELL_SPACING = 20 // Horizontal spacing between grid cells
  const GRID_CELL_VERTICAL_SPACING = 40 // Vertical spacing between grid cells
  const GRID_MARGIN_LEFT = 10 // Left margin from screen edge
  const GRID_MARGIN_TOP = 40 // Top margin from screen edge
  const TASKBAR_HEIGHT = 40 // Height of the taskbar

  const snapToGrid = React.useCallback((x: number, y: number) => {
    // Get desktop bounds
    const desktop = desktopRef.current?.getBoundingClientRect()
    if (!desktop) return { row: 0, column: 0 }

    // Calculate grid position with spacing and margins
    const adjustedX = x - GRID_MARGIN_LEFT
    const adjustedY = y - GRID_MARGIN_TOP
    const column = Math.max(0, Math.min(Math.floor(adjustedX / (GRID_CELL_SIZE + GRID_CELL_SPACING)), 7))
    const row = Math.max(0, Math.floor(adjustedY / (GRID_CELL_SIZE + GRID_CELL_VERTICAL_SPACING)))

    return { row, column }
  }, [])

  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault()
    const iconElement = e.currentTarget as HTMLDivElement
    const rect = iconElement.getBoundingClientRect()
    
    // Handle double tap on mobile
    const now = Date.now()
    if (lastTap && lastTap.id === icon.id && now - lastTap.time < DOUBLE_TAP_DELAY) {
      handleIconDoubleClick(icon.id)
      setLastTap(null)
      return
    }
    setLastTap({ id: icon.id, time: now })
    
    setDraggingIcon(icon.id)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })

    // Update selected state
    setIcons(prev => prev.map(i => ({
      ...i,
      selected: i.id === icon.id
    })))

    handleMouseDown(e, "icon", icon.id)
  }

  const handleIconTouchStart = (e: React.TouchEvent, icon: DesktopIcon) => {
    e.preventDefault()
    const touch = e.touches[0]
    const iconElement = e.currentTarget as HTMLDivElement
    const rect = iconElement.getBoundingClientRect()

    // Handle double tap
    const now = Date.now()
    if (lastTap && lastTap.id === icon.id && now - lastTap.time < DOUBLE_TAP_DELAY) {
      handleIconDoubleClick(icon.id)
      setLastTap(null)
      return
    }
    setLastTap({ id: icon.id, time: now })

    setDraggingIcon(icon.id)
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    })

    // Update selected state
    setIcons(prev => prev.map(i => ({
      ...i,
      selected: i.id === icon.id
    })))

    // Use the shared drag system if available, otherwise fallback to mouse handler
    if (handleTouchStart) {
      handleTouchStart(e, "icon", icon.id)
    } else {
    handleMouseDown(e as unknown as React.MouseEvent, "icon", icon.id)
    }
  }

  const handleMouseMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingIcon || !desktopRef.current) return

    const desktop = desktopRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = clientX - desktop.left - dragOffset.x + GRID_CELL_SIZE / 2
    const y = clientY - desktop.top - dragOffset.y + GRID_CELL_SIZE / 2

    // Update icon position
    const { row, column } = snapToGrid(x, y)
    setIcons(prev => prev.map(icon => {
      if (icon.id === draggingIcon) {
        return {
          ...icon,
          gridPosition: { row, column }
        }
      }
      return icon
    }))
  }, [draggingIcon, dragOffset, snapToGrid])

  const handleMouseUp = React.useCallback(() => {
    setDraggingIcon(null)
  }, [])

  // Handle clicking outside icons to deselect
  const handleDesktopClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('desktop-icons')) {
      setIcons(prev => prev.map(icon => ({ ...icon, selected: false })))
    }
  }

  const lastClickTime = useRef<number>(0)

  const handleDoubleClick = useCallback((iconId: string) => {
    // Prevent rapid double-clicks from triggering multiple times
    const now = Date.now()
    if (now - lastClickTime.current < 300) {
      return
    }
    lastClickTime.current = now
    handleIconDoubleClick(iconId)
  }, [handleIconDoubleClick])

  useEffect(() => {
    if (draggingIcon) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove)
      window.addEventListener('touchend', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleMouseMove)
        window.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [draggingIcon, dragOffset, handleMouseMove, handleMouseUp])

  return (
    <div 
      ref={desktopRef}
      className="desktop-icons absolute inset-0 overflow-hidden select-none"
      style={{ paddingBottom: TASKBAR_HEIGHT }}
      onClick={handleDesktopClick}
    >
      {icons.map((icon) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          left: GRID_MARGIN_LEFT + icon.gridPosition.column * (GRID_CELL_SIZE + GRID_CELL_SPACING),
          top: GRID_MARGIN_TOP + icon.gridPosition.row * (GRID_CELL_SIZE + GRID_CELL_VERTICAL_SPACING),
          width: GRID_CELL_SIZE,
          height: GRID_CELL_SIZE,
          transform: draggingIcon === icon.id ? 'scale(1.05)' : undefined,
          zIndex: draggingIcon === icon.id ? 100 : 1,
          transition: draggingIcon === icon.id ? 'none' : 'all 0.2s ease'
        }

        return (
          <div
            key={icon.id}
            className={`
              desktop-icon flex flex-col items-center justify-center
              cursor-move rounded p-2 touch-none
              ${icon.selected ? 'bg-blue-500/20' : 'hover:bg-white/5'}
            `}
            style={style}
            onDoubleClick={() => handleDoubleClick(icon.id)}
            onMouseDown={(e) => handleIconMouseDown(e, icon)}
            onTouchStart={(e) => handleIconTouchStart(e, icon)}
            tabIndex={0}
            role="button"
            aria-label={icon.label}
          >
            <Image
              src={icon.icon}
              alt={icon.label}
              width={64}
              height={64}
              className="w-16 h-16 mb-1"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
            <span className={`
              icon-label text-center text-white text-shadow px-1 text-xs sm:text-sm
              break-words w-full min-h-[2.5em] flex items-center justify-center
              ${icon.selected ? 'bg-blue-500/40' : ''}
            `}>
              {icon.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
