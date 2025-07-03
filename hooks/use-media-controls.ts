"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Settings } from "@/types"
import { loadAudioAssets } from "@/lib/lazy-asset-loader"

// Declare YouTube API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface UseMediaControlsProps {
  settings: Settings
  setSettings?: (settings: Settings) => void
}

export const useMediaControls = ({ settings, setSettings }: UseMediaControlsProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(30)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isUsingYoutube, setIsUsingYoutube] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  
  const playerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const apiLoadedRef = useRef(false)
  const hasUserInteracted = useRef(false)

  // Enhanced YouTube URL with maximum UI hiding parameters
  const getYouTubeEmbedUrl = (videoId: string) => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '0',
      loop: '1',
      playlist: videoId,
      controls: '0',
      showinfo: '0',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      fs: '0',
      disablekb: '1',
      cc_load_policy: '0',
      color: 'white',
      playsinline: '1',
      widget_referrer: window?.location.href || '',
      start: '0',
      end: '',
      enablejsapi: '1',
      origin: window?.location.origin || '',
    })
    
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
  }

  // Initialize audio element
  const initializeAudio = useCallback(() => {
    if (!audioRef.current) return
    
    const audio = audioRef.current
    audio.volume = volume / 100
    audio.loop = true
    
    const handleCanPlay = () => {
      console.log('Audio can play - setting ready to true')
      setAudioReady(true)
      // Try to auto-play if not using YouTube mode
      if (!isUsingYoutube && !hasUserInteracted.current) {
        console.log('Attempting auto-play...')
        audio.play()
          .then(() => {
            setIsPlaying(true)
            hasUserInteracted.current = true
            console.log('Auto-play successful')
          })
          .catch((error) => {
            console.log('Auto-play blocked by browser:', error.message)
          })
      }
    }
    
    const handleLoadedData = () => {
      console.log('Audio loaded data - setting ready to true')
      setAudioReady(true)
    }
    
    const handleError = () => {
      console.error('Audio error occurred')
      setHasError(true)
      setAudioReady(false)
    }
    
    const handleLoadStart = () => {
      console.log('Audio load started')
      setAudioReady(false)
    }
    
    // Add event listeners
    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    
    // Load the audio
    audio.load()
    
    return () => {
      if (audio) {
        audio.removeEventListener('canplaythrough', handleCanPlay)
        audio.removeEventListener('loadeddata', handleLoadedData)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('error', handleError)
        audio.removeEventListener('loadstart', handleLoadStart)
      }
    }
  }, [])

  // Create YouTube player function
  const createPlayer = useCallback(() => {
    if (!iframeRef.current || playerRef.current || !window.YT?.Player) {
      return
    }
    
    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true)
            event.target.setVolume(volume)
          },
          onStateChange: (event: any) => {
            const isCurrentlyPlaying = event.data === window.YT.PlayerState.PLAYING
            setIsPlaying(isCurrentlyPlaying)
            
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo()
            }
          },
          onError: () => {
            setHasError(true)
          }
        }
      })
    } catch (error) {
      setHasError(true)
    }
  }, [volume])

  // Initialize YouTube API
  const initializeYouTubeAPI = useCallback(() => {
    if (apiLoadedRef.current) {
      createPlayer()
      return
    }

    if (window.YT && window.YT.Player) {
      apiLoadedRef.current = true
      createPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      
      window.onYouTubeIframeAPIReady = () => {
        apiLoadedRef.current = true
        createPlayer()
      }
    }
  }, [createPlayer])

  // Control functions
  const togglePlayPause = useCallback(() => {
    hasUserInteracted.current = true
    
    // Lazy load audio assets when first interacting with media controls
    loadAudioAssets().catch(error => {
      console.warn('Failed to load audio assets:', error)
    })
    
    console.log('togglePlayPause called', { isUsingYoutube, isPlayerReady, audioReady, isPlaying })
    
    if (isUsingYoutube) {
      console.log('Attempting YouTube control', { playerRef: playerRef.current, isPlayerReady })
      if (!playerRef.current) {
        console.warn('YouTube player ref not available')
        return
      }
      
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo()
          console.log('YouTube video paused')
        } else {
          playerRef.current.playVideo()
          console.log('YouTube video played')
        }
      } catch (error) {
        console.error('Error toggling YouTube play/pause:', error)
      }
    } else {
      console.log('Attempting audio control', { audioRef: audioRef.current, audioReady, currentTime: audioRef.current?.currentTime, paused: audioRef.current?.paused })
      if (!audioRef.current) {
        console.warn('Audio ref not available')
        return
      }
      
      const audio = audioRef.current
      
      try {
        if (audio.paused) {
          // Audio is currently paused, so play it
          console.log('Audio is paused, attempting to play...')
          audio.play()
            .then(() => {
              setIsPlaying(true)
              console.log('Audio played successfully')
            })
            .catch((error) => {
              console.warn('Audio play failed:', error)
              setIsPlaying(false)
            })
        } else {
          // Audio is currently playing, so pause it
          console.log('Audio is playing, pausing...')
          audio.pause()
          setIsPlaying(false)
          console.log('Audio paused')
        }
      } catch (error) {
        console.error('Error toggling audio play/pause:', error)
      }
    }
  }, [isPlaying, isPlayerReady, audioReady, isUsingYoutube])

  const handleVolumeChange = useCallback((newVolume: number) => {
    hasUserInteracted.current = true
    setVolume(newVolume)
    
    if (isUsingYoutube && playerRef.current && isPlayerReady) {
      try {
        playerRef.current.setVolume(newVolume)
      } catch (error) {
        console.error('Error setting YouTube volume:', error)
      }
    } else if (!isUsingYoutube && audioRef.current) {
      try {
        audioRef.current.volume = newVolume / 100
      } catch (error) {
        console.error('Error setting audio volume:', error)
      }
    }
  }, [isPlayerReady, isUsingYoutube])

  const toggleMute = useCallback(() => {
    hasUserInteracted.current = true
    if (isUsingYoutube) {
      if (!playerRef.current || !isPlayerReady) return
      
      try {
        const currentVolume = playerRef.current.getVolume()
        if (currentVolume > 0) {
          playerRef.current.mute()
          setVolume(0)
        } else {
          playerRef.current.unMute()
          playerRef.current.setVolume(50)
          setVolume(50)
        }
      } catch (error) {
        console.error('Error toggling YouTube mute:', error)
      }
    } else {
      if (!audioRef.current) return
      
      try {
        if (audioRef.current.volume > 0) {
          audioRef.current.volume = 0
          setVolume(0)
        } else {
          audioRef.current.volume = 0.5
          setVolume(50)
        }
      } catch (error) {
        console.error('Error toggling audio mute:', error)
      }
    }
  }, [isPlayerReady, isUsingYoutube])

  const toggleMode = useCallback(() => {
    if (!setSettings) return
    
    if (isUsingYoutube) {
      setSettings({
        ...settings,
        youtubeUrl: ""
      })
    } else {
      setSettings({
        ...settings,
        youtubeUrl: "bvrqfCKN8zc"
      })
    }
  }, [isUsingYoutube, settings, setSettings])

  // Effects
  useEffect(() => {
    const shouldUseYoutube = !!(settings.youtubeUrl && settings.youtubeUrl.trim())
    setIsUsingYoutube(shouldUseYoutube)
    setHasError(false)
    setIsPlayerReady(false)
    setAudioReady(false)
    setIsPlaying(false)
  }, [settings.youtubeUrl])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoaded && isUsingYoutube && !hasError) {
      const initTimer = setTimeout(() => {
        initializeYouTubeAPI()
      }, 1000)
      
      return () => clearTimeout(initTimer)
    }
  }, [isLoaded, isUsingYoutube, hasError, initializeYouTubeAPI])

  useEffect(() => {
    if (isLoaded && !isUsingYoutube) {
      const cleanup = initializeAudio()
      return cleanup
    }
  }, [isLoaded, isUsingYoutube, initializeAudio])

  // Separate effect to handle volume changes without reinitializing audio
  useEffect(() => {
    if (!isUsingYoutube && audioRef.current) {
      audioRef.current.volume = volume / 100
      console.log('Audio volume updated to:', volume)
    }
  }, [volume, isUsingYoutube])

  useEffect(() => {
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error('Error destroying player:', error)
        }
        playerRef.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlayerReady(false)
      setAudioReady(false)
      apiLoadedRef.current = false
    }
  }, [])

  const isControlsReady = isUsingYoutube ? isPlayerReady : audioReady

  return {
    // State
    isLoaded,
    hasError,
    isPlaying,
    volume,
    isPlayerReady,
    isUsingYoutube,
    audioReady,
    isControlsReady,
    
    // Refs
    iframeRef,
    audioRef,
    
    // Functions
    togglePlayPause,
    handleVolumeChange,
    toggleMute,
    toggleMode,
    getYouTubeEmbedUrl,
    
    // Event handler
    handleIframeError: () => {
      setHasError(true)
    }
  }
} 