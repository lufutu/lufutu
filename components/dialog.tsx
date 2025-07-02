"use client"

import type React from "react"

import type { Dialog as DialogType, Settings } from "@/types"

interface DialogProps {
  dialog: DialogType
  setDialog: React.Dispatch<React.SetStateAction<DialogType>>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export function Dialog({ dialog, setDialog, setSettings }: DialogProps) {
  const handleDialogConfirm = () => {
    const { type, inputValue } = dialog

    switch (type) {
      case "change-background":
        if (inputValue.trim()) {
          setSettings((prev) => ({ ...prev, youtubeUrl: inputValue.trim() }))
        }
        break
      case "change-spotify":
        if (inputValue.trim()) {
          setSettings((prev) => ({ ...prev, spotifyUrl: inputValue.trim() }))
        }
        break
    }

    setDialog({ visible: false, type: "", title: "", content: "", inputValue: "" })
  }

  const handleDialogCancel = () => {
    setDialog({ visible: false, type: "", title: "", content: "", inputValue: "" })
  }

  if (!dialog.visible) return null

  return (
    <div className="dialog-overlay" onMouseDown={handleDialogCancel}>
      <div className="dialog" style={{ zIndex: 30000 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="dialog-titlebar">{dialog.title}</div>
        <div className="dialog-content">
          <p className="dialog-text">{dialog.content}</p>

          {dialog.type === "change-background" && (
            <input
              className="dialog-input"
              value={dialog.inputValue}
              onChange={(e) => setDialog((prev) => ({ ...prev, inputValue: e.target.value }))}
              placeholder="YouTube Video ID"
            />
          )}

          {dialog.type === "change-spotify" && (
            <input
              className="dialog-input"
              value={dialog.inputValue}
              onChange={(e) => setDialog((prev) => ({ ...prev, inputValue: e.target.value }))}
              placeholder="https://open.spotify.com/track/..."
            />
          )}

          <div className="dialog-buttons">
            <button className="dialog-button" onClick={handleDialogCancel}>
              Cancel
            </button>
            <button className="dialog-button primary" onClick={handleDialogConfirm}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
