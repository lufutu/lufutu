import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface SocialWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

export function SocialWidget({ widget }: SocialWidgetProps) {
  const handleProfileClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleProfileKeyDown = (event: React.KeyboardEvent, url: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleProfileClick(url)
    }
  }

  return (
    <div className="widget-content social-widget-content">
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Circle_Blue.png" 
            alt="Social" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          Social Media
        </span>
      </div>
      <div className="social-main">
        {widget.data.profiles.map((profile: { name: string; url: string; icon: string; color: string; }, index: number) => (
          <div 
            key={index} 
            className="social-profile cursor-pointer hover:bg-gray-100" 
            style={{ borderLeftColor: profile.color }}
            onClick={() => handleProfileClick(profile.url)}
            onKeyDown={(e) => handleProfileKeyDown(e, profile.url)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${profile.name} profile`}
          >
            <div className="social-icon">
              <Image 
                src={profile.icon} 
                alt={profile.name} 
                width={16} 
                height={16}
              />
            </div>
            <div className="social-info">
              <div className="social-name">{profile.name}</div>
              <div className="social-url">{profile.url}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
