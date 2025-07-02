"use client"

import { useState, useEffect } from "react"
import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface SpotifyWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

const extractSpotifyId = (url: string): { type: string; id: string } | null => {
  // Handle different Spotify URL formats
  const patterns = [
    // open.spotify.com URLs
    /spotify\.com\/(track|album|playlist|show|episode|artist)\/([a-zA-Z0-9]+)/,
    // spotify: URIs
    /spotify:(track|album|playlist|show|episode|artist):([a-zA-Z0-9]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return { type: match[1], id: match[2] }
    }
  }
  
  // If it's just an ID without type, assume it's a track
  if (/^[a-zA-Z0-9]+$/.test(url.trim())) {
    return { type: 'track', id: url.trim() }
  }
  
  return null
}

const getContentTypeLabel = (type: string): string => {
  switch (type) {
    case 'track': return '🎵 Track'
    case 'album': return '💿 Album'
    case 'playlist': return '📋 Playlist'
    case 'show': return '🎙️ Podcast'
    case 'episode': return '🎧 Episode'
    case 'artist': return '👤 Artist'
    default: return '🎵 Content'
  }
}

export function SpotifyWidget({ widget, updateWidgetData, settings }: SpotifyWidgetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputUrl, setInputUrl] = useState(settings.spotifyUrl || "")
  const [contentInfo, setContentInfo] = useState<{ type: string; id: string } | null>(null)
  const [embedUrl, setEmbedUrl] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const info = extractSpotifyId(settings.spotifyUrl || "")
    if (info) {
      setContentInfo(info)
      setEmbedUrl(`https://open.spotify.com/embed/${info.type}/${info.id}?utm_source=generator&theme=0`)
      setError("")
    } else {
      setError("Invalid Spotify URL")
    }
  }, [settings.spotifyUrl])

  const handleSaveUrl = () => {
    const info = extractSpotifyId(inputUrl)
    if (info) {
      updateWidgetData(widget.id, { spotifyUrl: inputUrl })
      setContentInfo(info)
      setEmbedUrl(`https://open.spotify.com/embed/${info.type}/${info.id}?utm_source=generator&theme=0`)
      setError("")
      setIsEditing(false)
    } else {
      setError("Please enter a valid Spotify URL, URI, or ID")
    }
  }

  const handleCancel = () => {
    setInputUrl(settings.spotifyUrl || "")
    setIsEditing(false)
    setError("")
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setInputUrl(settings.spotifyUrl || "")
  }

  return (
    <div className="widget-content spotify-widget-content" onDoubleClick={handleDoubleClick}>
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Spotify.png" 
            alt="Spotify" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          Spotify Player
          {contentInfo && (
            <span className="ml-2 text-xs opacity-75">
              {getContentTypeLabel(contentInfo.type)}
            </span>
          )}
        </span>
      </div>
      
      {isEditing ? (
        <div className="spotify-settings">
          <div className="settings-content">
            <div className="input-section">
              <label className="input-label">Spotify URL/URI/ID:</label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  e.stopPropagation()
                  setInputUrl(e.target.value)
                  setError("")
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                placeholder="https://open.spotify.com/track/..."
                className="url-input"
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="button-group">
              <button 
                className="save-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSaveUrl()
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Save
              </button>
              <button 
                className="cancel-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancel()
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Cancel
              </button>
            </div>
            
            <div className="help-text">
              <div className="help-title">Supported formats:</div>
              <div className="help-item">• https://open.spotify.com/track/...</div>
              <div className="help-item">• https://open.spotify.com/album/...</div>
              <div className="help-item">• https://open.spotify.com/playlist/...</div>
              <div className="help-item">• spotify:track:...</div>
              <div className="help-item">• Track/Album/Playlist ID</div>
              <div className="help-note">Double-click to edit • Supports tracks, albums, playlists, podcasts</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="spotify-player">
          {embedUrl && !error ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="85"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Embed"
              style={{ borderRadius: '12px', border: 'none' }}
            />
          ) : (
            <div className="spotify-error">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                {error || "Invalid Spotify content"}
              </div>
              <div className="error-hint">Double-click to set a new URL</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
