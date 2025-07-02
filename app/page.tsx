"use client"

import React, { useEffect, useCallback, useMemo } from "react"
import { Desktop } from "@/components/desktop"
import { WindowManager } from "@/components/window-manager"
import { WidgetManager } from "@/components/widget-manager"
import { ContextMenu } from "@/components/context-menu"
import { Dialog } from "@/components/dialog"
import { Taskbar } from "@/components/taskbar"
import { GlobalStyles } from "@/components/global-styles"
import { useDesktopState } from "@/hooks/use-desktop-state"
import { useGameState } from "@/hooks/use-game-state"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { useMediaControls } from "@/hooks/use-media-controls"

export default function RetroPortfolio() {
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

  const { gameStates, setGameStates } = useGameState()
  const { dragState, handleMouseDown } = useDragAndDrop({
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

  // Memoize components that don't change often
  const memoizedGlobalStyles = useMemo(() => <GlobalStyles settings={settings} />, [settings])
  const memoizedDesktop = useMemo(() => (
    <Desktop 
      settings={settings} 
      setSettings={setSettings} 
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
  ), [settings, setSettings, iframeRef, audioRef, getYouTubeEmbedUrl, handleIframeError, isLoaded, hasError, isUsingYoutube])

  return (
    <>
      {memoizedGlobalStyles}

      <div className="retro-desktop" onClick={handleDesktopClick} onContextMenu={handleRightClick}>
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
          settings={settings}
        />

        <WindowManager
          windows={windows}
          setWindows={setWindows}
          nextZIndex={nextZIndex}
          setNextZIndex={setNextZIndex}
          handleMouseDown={handleMouseDown}
          gameStates={gameStates}
          setGameStates={setGameStates}
          desktopIcons={desktopIcons}
          setDesktopIcons={setDesktopIcons}
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
        />
      </div>
    </>
  )
}
