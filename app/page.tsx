"use client"

import React, { useEffect, useCallback, useMemo, useState } from "react"
import { Desktop } from "@/components/desktop"
import { WindowManager } from "@/components/window-manager"
import { WidgetManager } from "@/components/widget-manager"
import { ContextMenu } from "@/components/context-menu"
import { Dialog } from "@/components/dialog"
import { Taskbar } from "@/components/taskbar"
import { GlobalStyles } from "@/components/global-styles"
import { PixelLoader } from "@/components/pixel-loader"
import { useDesktopState } from "@/hooks/use-desktop-state"

import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { useMediaControls } from "@/hooks/use-media-controls"
import { preemptivelyLoadCommonAssets } from "@/lib/lazy-asset-loader"

export default function RetroPortfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [showTransition, setShowTransition] = useState(false)
  const {
    desktopIcons,
    setDesktopIcons,
    widgets,
    setWidgets,
    windows,
    setWindows,
    contextMenu,
    setContextMenu,
    dialog,
    setDialog,
    settings,
    setSettings,
    nextZIndex,
    setNextZIndex,
  } = useDesktopState()


  const { handleMouseDown, handleTouchStart } = useDragAndDrop({
    desktopIcons,
    setDesktopIcons,
    widgets,
    setWidgets,
    windows,
    setWindows,
    nextZIndex,
    setNextZIndex,
  })

  // Media Controls for unified audio/video management
  const {
    isPlaying,
    volume,
    isControlsReady,
    isUsingYoutube,
    togglePlayPause,
    handleVolumeChange,
    toggleMute,
    toggleMode,
    isLoaded,
    hasError,
    iframeRef,
    audioRef,
    getYouTubeEmbedUrl,
    handleIframeError
  } = useMediaControls({ settings, setSettings })

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setDesktopIcons((prev) => prev.map((icon) => ({ ...icon, selected: false })))
    }
  }, [setDesktopIcons])

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    })
  }, [setContextMenu])

  // Close context menu on click - optimized with useCallback
  const handleGlobalClick = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 })
  }, [setContextMenu])

  useEffect(() => {
    document.addEventListener("click", handleGlobalClick)
    return () => document.removeEventListener("click", handleGlobalClick)
  }, [handleGlobalClick])

  // Handle loading completion with smooth transition
  const handleLoadingComplete = useCallback(() => {
    setShowTransition(true)
    // Add a brief transition delay for visual smoothness
    setTimeout(() => {
      setIsLoading(false)
      // Start preemptively loading commonly used assets in the background
      preemptivelyLoadCommonAssets()
    }, 300)
  }, [])

  // Memoize components that don't change often
  const memoizedGlobalStyles = useMemo(() => <GlobalStyles settings={settings} />, [settings])
  const memoizedDesktop = useMemo(() => (
    <Desktop 
      settings={settings} 
      mediaControlsRefs={{
        iframeRef,
        audioRef,
        getYouTubeEmbedUrl,
        handleIframeError,
        isLoaded,
        hasError,
        isUsingYoutube
      }}
    />
  ), [settings, iframeRef, audioRef, getYouTubeEmbedUrl, handleIframeError, isLoaded, hasError, isUsingYoutube])

  // Show loader during initial load
  if (isLoading) {
    return <PixelLoader onComplete={handleLoadingComplete} />
  }

  return (
    <>
      {memoizedGlobalStyles}

      <div 
        className={`retro-desktop transition-opacity duration-300 ${
          showTransition ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={handleDesktopClick} 
        onContextMenu={handleRightClick}
      >
        {memoizedDesktop}

        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          settings={settings}
          setSettings={setSettings}
          setWidgets={setWidgets}
          setDialog={setDialog}
        />

        <Dialog dialog={dialog} setDialog={setDialog} settings={settings} setSettings={setSettings} />

        <WidgetManager
          widgets={widgets}
          setWidgets={setWidgets}
          handleMouseDown={handleMouseDown}
          handleTouchStart={handleTouchStart}
          settings={settings}
        />

        <WindowManager
          windows={windows}
          setWindows={setWindows}
          nextZIndex={nextZIndex}
          setNextZIndex={setNextZIndex}
        />

        <Taskbar 
          windows={windows} 
          setWindows={setWindows} 
          setNextZIndex={setNextZIndex}
          mediaControls={{
            isPlaying,
            volume,
            isControlsReady,
            isUsingYoutube,
            onTogglePlayPause: togglePlayPause,
            onVolumeChange: handleVolumeChange,
            onToggleMute: toggleMute,
            onToggleMode: toggleMode
          }}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </>
  )
}
