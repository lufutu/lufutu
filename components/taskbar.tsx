"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import type { Window, Settings } from "@/types"
import { DitheringPattern } from "./dithering-pattern"
import { APP_CONTENT } from "@/lib/window-content"
import { PropertiesDialog } from "./dialog"
import Image from "next/image"

interface MenuItem {
  id?: string;
  label?: string;
  icon?: string;
  type: "app" | "submenu" | "action" | "separator" | "shortcut";
  items?: MenuItem[];
}

// Menu structure with proper OS-like categorization
const START_MENU_ITEMS: MenuItem[] = [
  {
    id: "programs",
    label: "Programs",
    icon: "/assets/icons/programs.png",
    type: "submenu",
    items: Object.entries(APP_CONTENT)
      .filter(([, config]) => config.type === "program")
      .map(([key, config]) => ({
        id: key,
        label: config.title,
        icon: config.icon,
        type: "app"
      }))
  },
  {
    type: "separator"
  },  
  {
    id: "browser",
    label: "Web Browser",
    icon: "/assets/icons/browser.png",
    type: "app"
  },
  {
    id: "games",
    label: "Games",
    icon: "/assets/icons/game.png",
    type: "app"
  },
  {
    type: "separator"
  },
  {
    id: "settings",
    label: "Settings",
    icon: "/assets/icons/settings.png",
    type: "shortcut"
  },
  {
    type: "separator"
  },
  {
    id: "restart",
    label: "Restart System",
    icon: "/assets/icons/reset.png",
    type: "action"
  }
]

interface MediaControlProps {
  isPlaying: boolean
  volume: number
  isControlsReady: boolean
  isUsingYoutube: boolean
  onTogglePlayPause: () => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleMode: () => void
}

interface TaskbarProps {
  windows: Window[]
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>
  setNextZIndex: React.Dispatch<React.SetStateAction<number>>
  mediaControls?: MediaControlProps
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export const Taskbar = ({ windows, setWindows, setNextZIndex, mediaControls, settings, setSettings }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [showProperties, setShowProperties] = useState(false)
  const startMenuRef = useRef<HTMLDivElement>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const volumeButtonRef = useRef<HTMLButtonElement>(null)

  // Initialize clock on client side only to prevent hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle click outside to close start menu and volume slider
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startMenuOpen &&
        startMenuRef.current &&
        startButtonRef.current &&
        !startMenuRef.current.contains(event.target as Node) &&
        !startButtonRef.current.contains(event.target as Node)
      ) {
        setStartMenuOpen(false)
      }

      if (
        volumeSliderOpen &&
        volumeRef.current &&
        volumeButtonRef.current &&
        !volumeRef.current.contains(event.target as Node) &&
        !volumeButtonRef.current.contains(event.target as Node)
      ) {
        setVolumeSliderOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [startMenuOpen, volumeSliderOpen])

  const handleMinimizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
      )
    )
  }

  const handleBringToFront = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: Date.now() } : w
      )
    )
    setNextZIndex((prev) => prev + 1)
  }

  const handleTaskbarItemClick = (windowId: string) => {
    handleMinimizeWindow(windowId)
    handleBringToFront(windowId)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    })
  }

  const handleStartMenuItem = useCallback((item: MenuItem) => {
    if (item.type === "app" && item.id) {
      const windowConfig = APP_CONTENT[item.id]
      if (windowConfig) {
        const existingWindow = windows.find(w => w.id === windowConfig.windowId)
        if (existingWindow) {
          if (existingWindow.isMinimized) {
            setWindows(prev => prev.map(w => 
              w.id === windowConfig.windowId 
                ? { ...w, isMinimized: false, zIndex: Date.now() } 
                : w
            ))
          } else {
            setWindows(prev => prev.map(w => 
              w.id === windowConfig.windowId 
                ? { ...w, zIndex: Date.now() } 
                : w
            ))
          }
        } else {
          const newWindow = {
            id: windowConfig.windowId,
            title: windowConfig.title,
            icon: windowConfig.icon,
            content: windowConfig.content,
            x: Math.random() * 200 + 100,
            y: Math.random() * 150 + 50,
            width: windowConfig.defaultSize.width,
            height: windowConfig.defaultSize.height,
            isMinimized: false,
            isMaximized: false,
            zIndex: Date.now()
          }
          setWindows(prev => [...prev, newWindow])
        }
        setNextZIndex(prev => prev + 1)
      }
    } else if (item.type === "action" && item.id === "restart") {
      if (confirm('Are you sure you want to restart the system?')) {
        window.location.reload()
      }
    } else if (item.type === "shortcut" && item.id === "settings") {
      setShowProperties(true)
    }
    setStartMenuOpen(false)
  }, [windows, setWindows, setNextZIndex])

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 border-t-2 border-gray-100 shadow-inner z-[9999] flex items-center px-2">
        {/* Multiple Dithering Pattern Overlays for authentic retro effect */}
        <DitheringPattern pattern="coarse" opacity={0.3} />
        <DitheringPattern pattern="fine" opacity={0.2} />
        <DitheringPattern pattern="dots" opacity={0.15} />

        {/* Start Button */}
        <button
          ref={startButtonRef}
          className={`h-7 px-3 mr-2 text-sm font-bold text-black flex items-center gap-2 relative transition-all
            ${startMenuOpen
              ? 'bg-gray-400 border-t border-l border-gray-500 border-r border-b border-gray-100 shadow-inner'
              : 'bg-gray-200 border-t border-l border-gray-100 border-r border-b border-gray-500 shadow-sm hover:bg-gray-100'
            }`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          style={{
            background: startMenuOpen
              ? 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)'
              : 'linear-gradient(135deg, #dfdfdf 0%, #c0c0c0 50%, #808080 100%)'
          }}
        >
          {/* Windows Logo */}
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 bg-red-500 rounded-sm">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-600"></div>
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-400"></div>
            </div>
          </div>
          <span className="select-none">Start</span>
        </button>

        {/* Window Task Items */}
        <div className="flex-1 flex gap-0.5 overflow-hidden">
          {windows.map((window) => (
            <button
              key={window.id}
              className={`h-7 px-3 min-w-0 max-w-40 text-sm text-black flex items-center truncate relative transition-all
                ${window.isMinimized
                  ? 'bg-gray-200 border-t border-l border-gray-100 border-r border-b border-gray-500 shadow-sm hover:bg-gray-100'
                  : 'bg-gray-400 border-t border-l border-gray-500 border-r border-b border-gray-100 shadow-inner'
                }`}
              onClick={() => handleTaskbarItemClick(window.id)}
              title={window.title}
              style={{
                background: window.isMinimized
                  ? 'linear-gradient(135deg, #dfdfdf 0%, #c0c0c0 50%, #808080 100%)'
                  : 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)'
              }}
            >
              {/* Dithering overlay for pressed state */}
              {!window.isMinimized && (
                <DitheringPattern pattern="diagonal" opacity={0.5} />
              )}

              {/* Window Icon */}
              {window.icon ? (
                <Image
                  src={window.icon}
                  alt={`${window.title} icon`}
                  width={16}
                  height={16}
                  className="w-4 h-4 mr-2 flex-shrink-0 object-contain"
                />
              ) : (
                <div className="w-4 h-4 mr-2 bg-blue-600 border border-gray-400 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-700"></div>
                </div>
              )}

              <span className="truncate select-none">{window.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 ml-2 h-7">
          {/* Media Controls */}
          {mediaControls && (
            <div className="flex items-center gap-1 relative">
              {/* Play/Pause Button */}
              <button
                className="w-6 h-6 bg-gray-200 border border-gray-400 flex items-center justify-center hover:bg-gray-100 text-sm relative"
                onClick={() => {
                  console.log('Play/Pause button clicked', {
                    isControlsReady: mediaControls.isControlsReady,
                    isPlaying: mediaControls.isPlaying,
                    isUsingYoutube: mediaControls.isUsingYoutube
                  })
                  mediaControls.onTogglePlayPause()
                }}
                disabled={false}
                title={mediaControls.isPlaying ? `Pause ${mediaControls.isUsingYoutube ? 'Video' : 'Music'}` : `Play ${mediaControls.isUsingYoutube ? 'Video' : 'Music'}`}
              >
                <DitheringPattern pattern="fine" opacity={0.1} />
                <div className="text-black text-sm leading-none">
                  {mediaControls.isPlaying ? "⏸" : "▶"}
                </div>
              </button>

              {/* Volume Control */}
              <div className="relative">
                <button
                  ref={volumeButtonRef}
                  className="w-6 h-6 bg-gray-200 border border-gray-400 flex items-center justify-center hover:bg-gray-100 text-sm relative"
                  onClick={() => setVolumeSliderOpen(!volumeSliderOpen)}
                  disabled={!mediaControls.isControlsReady}
                  title={`Volume: ${mediaControls.volume}%`}
                >
                  <DitheringPattern pattern="fine" opacity={0.1} />
                  <div className="text-black text-sm leading-none">
                    {mediaControls.volume === 0 ? "🔇" : mediaControls.volume < 50 ? "🔉" : "🔊"}
                  </div>
                </button>

                {/* Volume Slider Popup */}
                {volumeSliderOpen && (
                  <div
                    ref={volumeRef}
                    className="absolute bottom-8 left-0 w-32 bg-gray-200 border-2 border-gray-100 border-r-gray-500 border-b-gray-500 shadow-lg p-2 z-50"
                  >
                    <DitheringPattern pattern="fine" opacity={0.1} />
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs text-black font-bold">Volume</div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mediaControls.volume}
                        onChange={(e) => mediaControls.onVolumeChange(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-300 appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #008080 0%, #008080 ${mediaControls.volume}%, #c0c0c0 ${mediaControls.volume}%, #c0c0c0 100%)`
                        }}
                      />
                      <div className="text-xs text-black">{mediaControls.volume}%</div>
                      <div className="flex gap-1">
                        <button
                          className="text-xs bg-gray-300 border border-gray-400 px-2 py-1 hover:bg-gray-100"
                          onClick={mediaControls.onToggleMute}
                        >
                          {mediaControls.volume === 0 ? "Unmute" : "Mute"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Toggle */}
              <button
                className="w-6 h-6 bg-gray-200 border border-gray-400 flex items-center justify-center hover:bg-gray-100 text-sm relative"
                onClick={mediaControls.onToggleMode}
                title={`Switch to ${mediaControls.isUsingYoutube ? 'Music' : 'Video'} Mode`}
              >
                <DitheringPattern pattern="fine" opacity={0.1} />
                <div className="text-black text-sm leading-none">
                  {mediaControls.isUsingYoutube ? "📺" : "🎵"}
                </div>
              </button>
            </div>
          )}

          {/* Clock */}
          <div
            className="bg-gray-200 border-t border-l border-gray-500 border-r border-b border-gray-100 px-3 h-7 flex flex-col items-center justify-center text-sm text-black font-mono shadow-inner relative"
            style={{
              background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)'
            }}
          >
            {/* Dithering overlay for clock */}
            <DitheringPattern pattern="cross" opacity={0.2} />
            <div className="text-xs leading-none">{currentTime ? formatTime(currentTime) : '--:--'}</div>
            <div className="text-xs leading-none">{currentTime ? formatDate(currentTime) : '--/--/--'}</div>
          </div>
        </div>
      </div>

      {/* Start Menu (if open) */}
      {startMenuOpen && (
        <div
          ref={startMenuRef}
          className="absolute bottom-10 left-0 w-64 bg-gray-200 border-2 border-gray-100 border-r-gray-500 border-b-gray-500 shadow-lg z-[10000]"
          style={{
            boxShadow: '4px 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          {/* Start Menu Header */}
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold p-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(90deg, #000080 0%, #000040 100%)'
            }}
          >
            <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center p-1">
              <Image
                src="/assets/icons/lufutu.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg">Lufutu OS</span>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {START_MENU_ITEMS.map((item, index) => {
              if (item.type === "separator") {
                return <div key={index} className="h-[1px] bg-gray-400 my-1" />
              }

              const isSubmenuOpen = item.id ? activeSubmenu === item.id : false
              const hasSubmenu = item.type === "submenu" && item.items && item.items.length > 0

              return (
                <div
                  key={item.id || index}
                  className="relative"
                  onMouseEnter={() => hasSubmenu && item.id ? setActiveSubmenu(item.id) : setActiveSubmenu(null)}
                  onMouseLeave={() => hasSubmenu ? setActiveSubmenu(null) : null}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-1 cursor-pointer text-sm hover:bg-blue-600 hover:text-white"
                    onClick={() => !hasSubmenu && handleStartMenuItem(item)}
                  >
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.label || ""}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="flex-grow">{item.label}</span>
                    {hasSubmenu && (
                      <span className="text-xs">▶</span>
                    )}
                  </div>

                  {/* Submenu */}
                  {hasSubmenu && isSubmenuOpen && item.items && (
                    <div 
                      className="absolute left-full top-0 w-48 bg-gray-200 border-2 border-gray-100 border-r-gray-500 border-b-gray-500 shadow-lg"
                      style={{
                        boxShadow: '4px 4px 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      {item.items.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="flex items-center gap-2 px-4 py-1 cursor-pointer text-sm hover:bg-blue-600 hover:text-white"
                          onClick={() => handleStartMenuItem(subItem)}
                        >
                          {subItem.icon && (
                            <Image
                              src={subItem.icon}
                              alt={subItem.label || ""}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <span>{subItem.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Properties Dialog */}
      <PropertiesDialog 
        visible={showProperties}
        onClose={() => setShowProperties(false)}
        settings={settings}
        setSettings={setSettings}
      />
    </>
  )
}
