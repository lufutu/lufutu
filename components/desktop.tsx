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

export function Desktop({ settings, mediaControlsRefs }: DesktopProps) {
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

  // Ensure background image path is correct
  const backgroundImageUrl = settings.backgroundImage 
    ? `/assets/backgrounds/${settings.backgroundImage}`
    : '/assets/backgrounds/coffee_in_rain_by.webp'

  console.log('Using background image:', backgroundImageUrl)

  return (
    <div className="video-background">
      {/* Background Image Layer (Always Present) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -2
        }}
        onError={(e: React.SyntheticEvent<HTMLDivElement>) => {
          console.error('Failed to load background:', backgroundImageUrl)
          const target = e.currentTarget as HTMLDivElement
          target.style.backgroundImage = "url('/assets/backgrounds/coffee_in_rain_by.webp')"
        }}
      />

      {/* YouTube Video Layer */}
      {isUsingYoutube && !hasError && isLoaded && (
        <div className="absolute inset-0" style={{ zIndex: -1 }}>
          <iframe
            ref={iframeRef}
            id={`youtube-player-${settings.youtubeUrl}`}
            src={getYouTubeEmbedUrl(settings.youtubeUrl)}
            title="Background Video"
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            onError={handleIframeError}
            onLoad={() => console.log('YouTube video background loaded successfully')}
          />
        </div>
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
