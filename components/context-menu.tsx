"use client"

import type React from "react"

import type { ContextMenu as ContextMenuType, Settings, Widget } from "@/types"

interface ContextMenuProps {
  contextMenu: ContextMenuType
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuType>>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
  setDialog: React.Dispatch<React.SetStateAction<any>>
}

export function ContextMenu({
  contextMenu,
  setContextMenu,
  settings,
  setSettings,
  setWidgets,
  setDialog,
}: ContextMenuProps) {
  const showDialog = (type: string, title: string, content: string, initialValue = "") => {
    setDialog({
      visible: true,
      type,
      title,
      content,
      inputValue: initialValue,
    })
  }

  const handleContextMenuClick = (action: string) => {
    setContextMenu({ visible: false, x: 0, y: 0 })

    switch (action) {
      case "change-background":
        showDialog(
          "change-background",
          "Change Background Video",
          "Enter YouTube video ID (e.g., 'bvrqfCKN8zc'):",
          settings.youtubeUrl,
        )
        break
      case "change-spotify":
        showDialog(
          "change-spotify",
          "Change Spotify Content",
          "Enter Spotify URL, URI, or ID:",
          settings.spotifyUrl,
        )
        break
      case "increase-font":
        setSettings((prev) => ({ ...prev, fontSize: Math.min(prev.fontSize + 1, 16) }))
        break
      case "decrease-font":
        setSettings((prev) => ({ ...prev, fontSize: Math.max(prev.fontSize - 1, 6) }))
        break
      case "refresh-widgets":
        setWidgets((prev) =>
          prev.map((w) => {
            if (w.id === "hit-counter") {
              return { ...w, data: { ...w.data, targetCount: w.data.targetCount + Math.floor(Math.random() * 100) } }
            }
            return w
          }),
        )
        break
    }
  }

  if (!contextMenu.visible) return null

  return (
    <div
      className="context-menu"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
      }}
    >
      <div className="context-menu-item" onClick={() => handleContextMenuClick("change-background")}>
        🎥 Change Background Video
      </div>
      <div className="context-menu-item" onClick={() => handleContextMenuClick("change-spotify")}>
        🎵 Change Spotify Content
      </div>
      <div className="context-menu-item" onClick={() => handleContextMenuClick("increase-font")}>
        🔍 Increase Font Size
      </div>
      <div className="context-menu-item" onClick={() => handleContextMenuClick("decrease-font")}>
        🔍 Decrease Font Size
      </div>
      <div className="context-menu-item" onClick={() => handleContextMenuClick("refresh-widgets")}>
        🔄 Refresh Widgets
      </div>
    </div>
  )
}
