"use client"

import React from "react"

import type { ContextMenu as ContextMenuType, Settings, Widget, Dialog } from "@/types"
import { PropertiesDialog } from "./dialog"

interface ContextMenuProps {
  contextMenu: ContextMenuType
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuType>>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
  setDialog: React.Dispatch<React.SetStateAction<Dialog>>
}

export function ContextMenu({
  contextMenu,
  setContextMenu,
  settings,
  setSettings,
  setWidgets,
  setDialog,
}: ContextMenuProps) {
  const [showProperties, setShowProperties] = React.useState(false)

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
      case "properties":
        setShowProperties(true)
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

  const handleCloseProperties = () => {
    setShowProperties(false)
  }

  if (!contextMenu.visible && !showProperties) return null

  return (
    <>
      {contextMenu.visible && (
        <div
          className="fixed bg-[#c0c0c0] border border-white shadow-md py-1 min-w-[200px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 30000,
          }}
        >
          <div 
            className="px-8 py-1 hover:bg-[#000080] hover:text-white cursor-default"
            onClick={() => handleContextMenuClick("refresh-widgets")}
          >
            Arrange Icons
          </div>
          <div 
            className="px-8 py-1 hover:bg-[#000080] hover:text-white cursor-default"
            onClick={() => handleContextMenuClick("refresh-widgets")}
          >
            Line up Icons
          </div>
          <div className="border-t border-[#808080] my-1" />
          <div 
            className="px-8 py-1 hover:bg-[#000080] hover:text-white cursor-default"
            onClick={() => handleContextMenuClick("properties")}
          >
            Properties
          </div>
        </div>
      )}

      <PropertiesDialog 
        visible={showProperties}
        onClose={handleCloseProperties}
        settings={settings}
        setSettings={setSettings}
      />
    </>
  )
}
