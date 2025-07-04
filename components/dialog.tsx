"use client"

import React from "react"
import Image from "next/image"

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

interface PropertiesDialogProps {
  visible: boolean
  onClose: () => void
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export function PropertiesDialog({ visible, onClose, settings, setSettings }: PropertiesDialogProps) {
  const [activeTab, setActiveTab] = React.useState("background")
  const [position, setPosition] = React.useState({ x: 200, y: 150 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const [selectedBackground, setSelectedBackground] = React.useState<string>(settings.backgroundImage || "coffee_in_rain_by.webp")

  React.useEffect(() => {
    // Update selected background when settings change
    setSelectedBackground(settings.backgroundImage || "coffee_in_rain_by.webp")
  }, [settings.backgroundImage])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.titlebar')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleApply = () => {
    if (activeTab === "background") {
      console.log('Applying background change:', selectedBackground)
      setSettings(prev => {
        console.log('Previous settings:', prev)
        const newSettings = {
          ...prev,
          backgroundImage: selectedBackground
        }
        console.log('New settings:', newSettings)
        return newSettings
      })
    } else if (activeTab === "media") {
      // Media settings are handled through their own inputs
      setSettings(prev => ({
        ...prev
      }))
    } else if (activeTab === "display") {
      // Font size is handled directly in the UI
    }
  }

  const handleSave = () => {
    handleApply()
    onClose()
  }

  // Add effect to log settings changes
  React.useEffect(() => {
    // console.log('Settings changed:', settings)
  }, [settings])

  if (!visible) return null

  const backgrounds = [
    "coffee_in_rain_by.webp",
    "Cozy Room With Plants.gif",
    "Cozy Pixel Art Cafe Interior.gif",
    "Desert Oasis Poolside.gif",
    "Garden Scene With Traffic Cone.gif",
    "Cyberpunk Cityscape Night.gif",
    "Neon Night Street Scene.gif",
    "Pixel Art Gaming Room.gif",
    "Pixel Art Girl And Frog In Rain.gif",
    "Pixel Art Bathroom Scene.gif",
    "Pixel Art Train Station Scene.gif",
    "Pixel Art Urban Scene.gif",
    "Pixel Art Cityscape Food Stall.gif",
    "Train Station Pixel Art.gif",
    "Cherry Blossom Pixel Art.gif",
    "Snowy Train Station Pixel Art.gif",
    "Girl And Dog Under Rainbow.gif",
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[30000]" onMouseDown={onClose}>
      <div 
        className="bg-[#c0c0c0] border-t border-l border-white border-r border-b border-[#424242] w-[800px] shadow-lg"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          handleMouseDown(e)
        }}
      >
        <div 
          className="titlebar bg-[#000080] text-white px-2 py-1 flex items-center justify-between cursor-move"
        >
          <span>Display Properties</span>
          <button 
            onClick={onClose}
            className="px-2 hover:bg-[#c0c0c0] hover:text-black"
          >
            ×
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-[#424242]">
            <button
              className={`px-4 py-1 border-t border-l border-r ${
                activeTab === "background" 
                  ? "bg-[#c0c0c0] border-white border-b-0" 
                  : "bg-[#808080] border-[#424242]"
              }`}
              onClick={() => setActiveTab("background")}
            >
              Background
            </button>
            <button
              className={`px-4 py-1 border-t border-l border-r ${
                activeTab === "media" 
                  ? "bg-[#c0c0c0] border-white border-b-0" 
                  : "bg-[#808080] border-[#424242]"
              }`}
              onClick={() => setActiveTab("media")}
            >
              Media
            </button>
            <button
              className={`px-4 py-1 border-t border-l border-r ${
                activeTab === "display" 
                  ? "bg-[#c0c0c0] border-white border-b-0" 
                  : "bg-[#808080] border-[#424242]"
              }`}
              onClick={() => setActiveTab("display")}
            >
              Display
            </button>
          </div>

          <div className="p-4">
            {activeTab === "background" && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-48 h-36 border-2 border-[#424242] bg-[#008080] overflow-hidden">
                    {selectedBackground && (
                      <Image 
                        src={`/assets/backgrounds/${selectedBackground}`}
                        alt="Preview"
                        width={192}
                        height={144}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-2">Background:</div>
                    <div className="grid grid-cols-3 gap-2 h-[400px] overflow-y-auto border border-[#424242] p-2">
                      {backgrounds.map((bg) => (
                        <div 
                          key={bg}
                          className={`relative cursor-pointer border-2 ${
                            selectedBackground === bg 
                              ? 'border-[#000080]' 
                              : 'border-transparent hover:border-[#000080]'
                          }`}
                          onClick={() => setSelectedBackground(bg)}
                        >
                          <Image 
                            src={`/assets/backgrounds/${bg}`}
                            alt={bg}
                            width={192}
                            height={128}
                            className="w-full h-32 object-cover"
                          />
                          <div className="text-xs p-1 truncate bg-[#c0c0c0]">
                            {bg.replace(/\.(gif|webp)$/, '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">YouTube Background Video:</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-[#424242]"
                    placeholder="Enter YouTube video ID (e.g., 'bvrqfCKN8zc')"
                    value={settings.youtubeUrl || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Spotify Content:</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-[#424242]"
                    placeholder="Enter Spotify URL, URI, or ID"
                    value={settings.spotifyUrl || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">Font Size:</label>
                  <div className="flex items-center gap-4">
                    <button 
                      className="px-4 py-2 border-t border-l border-white border-r border-b border-[#424242]"
                      onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 1, 6) }))}
                    >
                      Decrease Font Size
                    </button>
                    <div className="w-12 text-center">{settings.fontSize}px</div>
                    <button 
                      className="px-4 py-2 border-t border-l border-white border-r border-b border-[#424242]"
                      onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 1, 16) }))}
                    >
                      Increase Font Size
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button 
              className="px-4 py-1 border-t border-l border-white border-r border-b border-[#424242] min-w-[75px]"
              onClick={handleSave}
            >
              OK
            </button>
            <button 
              className="px-4 py-1 border-t border-l border-white border-r border-b border-[#424242] min-w-[75px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-1 border-t border-l border-white border-r border-b border-[#424242] min-w-[75px]"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
