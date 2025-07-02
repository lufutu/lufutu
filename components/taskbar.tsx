"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Window, Settings } from "@/types"
import { DitheringPattern } from "./dithering-pattern"

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
}

export const Taskbar = ({ windows, setWindows, setNextZIndex, mediaControls }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false)
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

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 border-t-2 border-gray-100 shadow-inner z-50 flex items-center px-2">
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
            <div className="w-4 h-4 mr-2 bg-blue-600 border border-gray-400 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-700"></div>
            </div>

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

      {/* Start Menu (if open) */}
      {startMenuOpen && (
        <div
          ref={startMenuRef}
          className="absolute bottom-10 left-0 w-48 bg-gray-200 border-2 border-gray-100 border-r-gray-500 border-b-gray-500 shadow-lg"
        >
          {/* Start Menu Header */}
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold p-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(90deg, #000080 0%, #000040 100%)'
            }}
          >
            <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            </div>
            <span>Windows Lofi</span>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Programs</div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Documents</div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Settings</div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Find</div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Help</div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Run...</div>
            <div className="border-t border-gray-400 my-1"></div>
            <div className="text-xs text-black hover:bg-blue-600 hover:text-white p-1 cursor-pointer">Shut Down...</div>
          </div>
        </div>
      )}
    </div>
  )
}
