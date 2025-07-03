import type { Settings } from "@/types"

interface DesktopProps {
  settings: Settings
  setSettings?: (settings: Settings) => void
  mediaControlsRefs?: {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
    audioRef: React.RefObject<HTMLAudioElement | null>
    getYouTubeEmbedUrl: (videoId: string) => string
    handleIframeError: () => void
    isLoaded: boolean
    hasError: boolean
    isUsingYoutube: boolean
  }
}

export function Desktop({ settings, setSettings, mediaControlsRefs }: DesktopProps) {
  if (!mediaControlsRefs) {
    return <div className="video-background">Loading...</div>
  }

  const {
    isLoaded,
    hasError,
    isUsingYoutube,
    iframeRef,
    audioRef,
    getYouTubeEmbedUrl,
    handleIframeError
  } = mediaControlsRefs

  return (
    <div className="video-background">
      {/* YouTube Video Background */}
      {isUsingYoutube && !hasError && isLoaded && (
        <iframe
          ref={iframeRef}
          id={`youtube-player-${settings.youtubeUrl}`}
          src={getYouTubeEmbedUrl(settings.youtubeUrl)}
          title="Background Video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          onError={handleIframeError}
          onLoad={() => console.log('YouTube video background loaded successfully')}
        />
      )}
      
      {/* Default Background Image */}
      {!isUsingYoutube && (
        <div 
          className="default-background"
          style={{
            backgroundImage: 'url(/assets/backgrounds/coffee_in_rain_by.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1
          }}
        />
      )}
      
      {/* Background Audio for Default Mode */}
      {!isUsingYoutube && (
        <audio
          ref={audioRef}
          src="/assets/sounds/lofi-girl.mp3"
          preload="metadata"
          playsInline
          loop
          crossOrigin="anonymous"
          onLoadStart={() => console.log('Audio loading started')}
          onLoadedMetadata={() => console.log('Audio metadata loaded')}
          onCanPlay={() => console.log('Audio can play event')}
          onError={(e) => console.error('Audio element error:', e)}
        />
      )}
      
      {/* Fallback for errors */}
      {(hasError && isUsingYoutube) && (
        <div className="fallback-background" />
      )}
      
      <div className="video-overlay"></div>
    </div>
  )
}
