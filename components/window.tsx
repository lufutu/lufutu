"use client"

import type React from "react"

import type { Window } from "@/types"

interface WindowProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMouseDown: (e: React.MouseEvent) => void
}

export function WindowComponent({ window, onClose, onMinimize, onMaximize, onMouseDown }: WindowProps) {
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
      <div className="window-content" dangerouslySetInnerHTML={{ __html: window.content }} />
    </div>
  )
}
