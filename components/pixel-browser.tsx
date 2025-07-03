"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { DitheringPattern } from "./dithering-pattern"

interface Tab {
  id: string
  url: string
  title: string
}

interface PixelBrowserProps {
  className?: string
}

export const PixelBrowser: React.FC<PixelBrowserProps> = ({ className = "" }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", url: "https://example.com", title: "New Tab" }
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [addressBarValue, setAddressBarValue] = useState("https://example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [pixelationLevel, setPixelationLevel] = useState(2)
  const [retroMode, setRetroMode] = useState(true)
  const [frameError, setFrameError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  const handleNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      url: "https://example.com",
      title: "New Tab"
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
    setAddressBarValue(newTab.url)
    setHistory([])
    setHistoryIndex(0)
    setFrameError(null)
  }

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return // Don't close last tab
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    if (tabId === activeTabId) {
      // Activate the tab to the left, or the last tab if closing the leftmost
      const index = tabs.findIndex(tab => tab.id === tabId)
      const newActiveTab = newTabs[Math.max(0, index - 1)]
      setActiveTabId(newActiveTab.id)
      setAddressBarValue(newActiveTab.url)
    }
  }

  const handleNavigate = (url: string) => {
    if (!activeTab) return
    
    // Ensure URL has protocol
    let processedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url
    }
    
    setIsLoading(true)
    setAddressBarValue(url)
    setFrameError(null)
    
    // Update tab URL and history
    setTabs(tabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: processedUrl, title: url } 
        : tab
    ))
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(processedUrl)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleAddressBarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleNavigate(addressBarValue)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevUrl = history[prevIndex]
      setAddressBarValue(prevUrl)
      setTabs(tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, url: prevUrl } 
          : tab
      ))
      setHistoryIndex(prevIndex)
      setFrameError(null)
    }
  }

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      const nextUrl = history[nextIndex]
      setAddressBarValue(nextUrl)
      setTabs(tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, url: nextUrl } 
          : tab
      ))
      setHistoryIndex(nextIndex)
      setFrameError(null)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setFrameError(null)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleIframeError = () => {
    const domain = addressBarValue.replace(/^https?:\/\//, '').split('/')[0]
    setFrameError(`${domain} blocks iframe embedding due to security policies`)
  }

  const handleOpenExternal = useCallback(() => {
    const originalUrl = addressBarValue.startsWith('http') ? addressBarValue : `https://${addressBarValue}`
    window.open(originalUrl, '_blank', 'noopener,noreferrer')
  }, [addressBarValue])

  const getPixelationStyle = () => {
    const scale = pixelationLevel
    return {
      filter: retroMode 
        ? `url(#pixelate) brightness(0.9) contrast(1.2) saturate(1.2) sepia(0.2)` 
        : 'url(#pixelate)',
      transform: `scale(${1/scale})`,
      transformOrigin: 'top left',
      width: `${100 * scale}%`,
      height: `${100 * scale}%`,
      imageRendering: 'pixelated' as const,
    }
  }

  const quickLinks = [
    { name: "DuckDuckGo", url: "duckduckgo.com" },
    { name: "Wikipedia", url: "wikipedia.org" },
    { name: "Archive.org", url: "archive.org" },
    { name: "HTML5Test", url: "html5test.com" },
    { name: "CodePen", url: "codepen.io" },
  ]

  return (
    <div className={`flex flex-col w-full h-full bg-gray-100 ${className}`}>
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="pixelate">
            <feGaussianBlur stdDeviation={pixelationLevel * 0.5} />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140" />
            <image preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <filter id="crt">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.001" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-gray-200 border-b border-gray-400">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-t cursor-pointer
              ${tab.id === activeTabId 
                ? 'bg-white border-t border-l border-r border-gray-400' 
                : 'bg-gray-100 hover:bg-gray-50'}`}
            onClick={() => {
              setActiveTabId(tab.id)
              setAddressBarValue(tab.url)
            }}
          >
            <Image 
              src="/assets/icons/browser.png" 
              alt="Tab" 
              width={16} 
              height={16} 
              className="opacity-75"
            />
            <span className="max-w-[120px] truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                className="text-gray-500 hover:text-gray-700 flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseTab(tab.id)
                }}
              >
                <Image 
                  src="/assets/icons/Circle_Blue.png" 
                  alt="Close" 
                  width={16} 
                  height={16} 
                />
              </button>
            )}
          </div>
        ))}
        <button
          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-50 rounded flex items-center gap-1"
          onClick={handleNewTab}
        >
          <Image 
            src="/assets/icons/Square Open_Blue.png" 
            alt="New Tab" 
            width={16} 
            height={16} 
          />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 bg-gray-200 border-b border-gray-400">
        <button
          onClick={handleBack}
          disabled={historyIndex <= 0}
          className="px-2 py-1 bg-gray-100 border border-gray-400 rounded disabled:opacity-50 flex items-center"
        >
          <Image 
            src="/assets/icons/Arrow Left_Blue.png" 
            alt="Back" 
            width={16} 
            height={16} 
          />
        </button>
        <button
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className="px-2 py-1 bg-gray-100 border border-gray-400 rounded disabled:opacity-50 flex items-center"
        >
          <Image 
            src="/assets/icons/Arrow Right_Blue.png" 
            alt="Forward" 
            width={16} 
            height={16} 
          />
        </button>
        <button
          onClick={handleRefresh}
          className="px-2 py-1 bg-gray-100 border border-gray-400 rounded flex items-center"
        >
          <Image 
            src="/assets/icons/Circle Quarter_Blue.png" 
            alt="Refresh" 
            width={16} 
            height={16} 
          />
        </button>
        <form onSubmit={handleAddressBarSubmit} className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <Image 
              src="/assets/icons/Location_Blue.png" 
              alt="URL" 
              width={16} 
              height={16} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-75"
            />
            <input
              type="text"
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              className="w-full px-2 py-1 pl-8 bg-white border border-gray-400 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-2 py-1 bg-gray-100 border border-gray-400 rounded flex items-center"
          >
            <Image 
              src="/assets/icons/Arrow Right_Blue.png" 
              alt="Go" 
              width={16} 
              height={16} 
            />
          </button>
        </form>
        <button
          onClick={handleOpenExternal}
          className="px-2 py-1 bg-gray-100 border border-gray-400 rounded flex items-center"
          title="Open in new window"
        >
          <Image 
            src="/assets/icons/Square Frame_Blue.png" 
            alt="Open External" 
            width={16} 
            height={16} 
          />
        </button>
      </div>

      {/* Quick Links */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-300">
        {quickLinks.map(link => (
          <button
            key={link.url}
            onClick={() => handleNavigate(link.url)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <Image 
              src="/assets/icons/browser.png" 
              alt={link.name} 
              width={16} 
              height={16} 
              className="opacity-75"
            />
            {link.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {activeTab && (
          <div style={getPixelationStyle()}>
            <iframe
              ref={iframeRef}
              src={activeTab.url}
              className="w-full h-full border-none"
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            {retroMode && (
              <>
                <DitheringPattern 
                  pattern="dots" 
                  opacity={0.1} 
                  animated={true} 
                  className="mix-blend-overlay"
                />
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ filter: 'url(#crt)' }}
                />
              </>
            )}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90">
            <Image 
              src="/assets/icons/Circle Quarter_Blue.png" 
              alt="Loading" 
              width={32} 
              height={32} 
              className="animate-spin"
            />
            <div className="mt-4 text-sm">Loading pixelated website...</div>
          </div>
        )}

        {frameError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gray-900 text-green-400 font-mono">
            <Image 
              src="/assets/icons/Exclamation_Blue.png" 
              alt="Error" 
              width={64} 
              height={64} 
              className="mb-4"
            />
            <div className="mt-4 text-xl font-bold text-center">FRAME BLOCKED</div>
            <div className="mt-4 text-sm text-center max-w-lg">
              <p className="mb-4">{frameError}</p>
              <p className="text-cyan-400">
                This website uses Content Security Policy (CSP) to prevent embedding in iframes for security reasons.
              </p>
            </div>
            <button
              onClick={handleOpenExternal}
              className="mt-4 px-4 py-2 bg-blue-800 border-2 border-blue-400 hover:bg-blue-400 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <Image 
                src="/assets/icons/Square Frame_Blue.png" 
                alt="Open External" 
                width={16} 
                height={16} 
              />
              Open in New Window
            </button>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4 p-2 bg-gray-200 border-t border-gray-400">
        <label className="flex items-center gap-2">
          <Image 
            src="/assets/icons/Square Quarter 2_Blue.png" 
            alt="Pixelation" 
            width={16} 
            height={16} 
          />
          <span className="text-sm">Pixelation:</span>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={pixelationLevel}
            onChange={(e) => setPixelationLevel(Number(e.target.value))}
            className="w-24"
          />
        </label>
        <label className="flex items-center gap-2">
          <Image 
            src="/assets/icons/Controller Retro_Blue.png" 
            alt="Retro Mode" 
            width={16} 
            height={16} 
          />
          <span className="text-sm">Retro Mode:</span>
          <input
            type="checkbox"
            checked={retroMode}
            onChange={(e) => setRetroMode(e.target.checked)}
          />
        </label>
      </div>
    </div>
  )
} 