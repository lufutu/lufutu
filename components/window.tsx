"use client"

import React from "react"
import type { Window } from "@/types"

interface WindowProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMouseDown: (e: React.MouseEvent) => void
  habitCompletions?: { completed: number, total: number }
}

export function WindowComponent({ window, onClose, onMinimize, onMaximize, onMouseDown, habitCompletions }: WindowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent keyboard events from bubbling up from game windows
    if (window.contentComponent && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "s", "S", "a", "A", "d", "D"].includes(e.key)) {
      e.stopPropagation()
    }
  }

  // Check if this is a habit tracker window
  const isHabitTracker = window.id.startsWith('habits-')

  return (
    <div
      className={`window ${window.isMinimized ? "minimized" : ""}`}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="window-titlebar" onMouseDown={onMouseDown}>
        {isHabitTracker ? (
          <div className="window-title flex items-center">
            <img src="/assets/icons/Circle_Blue.png" alt="Target" className="inline w-4 h-4 mr-2" />
            <span className="font-semibold">Habits</span>
            <span className="ml-2 text-xs px-2 py-0.5" style={{
              background: '#32CD32',
              border: '1px outset #90EE90',
              color: '#FFFFFF',
            }}>
              {habitCompletions ? `${habitCompletions.completed}/${habitCompletions.total}` : '0/0'}
            </span>
          </div>
        ) : (
          <div className="window-title">{window.title}</div>
        )}
        <div className="window-controls">
          <div className="window-control" onClick={onMinimize}>
            <div className="minimize-icon"></div>
          </div>
          <div className="window-control" onClick={onMaximize}>
            <div className={`maximize-icon ${window.isMaximized ? "restore" : ""}`}></div>
          </div>
          <div className="window-control" onClick={onClose}>
            <div className="close-icon"></div>
          </div>
        </div>
      </div>
      <div className="window-content" style={{ overflow: 'hidden' }}>
        {window.contentComponent ? (
          <div className="h-full" style={{ overflow: 'hidden' }}>
            {window.contentComponent}
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: window.content }} />
        )}
      </div>
    </div>
  )
}
