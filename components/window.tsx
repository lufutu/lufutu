"use client"

import React from "react"
import type { Window } from "@/types"

interface WindowProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

export function WindowComponent({ window, onClose, onMinimize, onMaximize, onMouseDown }: WindowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent keyboard events from bubbling up from game windows
    if (window.contentComponent && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "s", "S", "a", "A", "d", "D"].includes(e.key)) {
      e.stopPropagation()
    }
  }

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
        <div className="window-title">{window.title}</div>
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
