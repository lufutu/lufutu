import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface SocialWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: any) => void
  settings: Settings
}

export function SocialWidget({ widget }: SocialWidgetProps) {
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
        {widget.data.profiles.map((profile: any, index: number) => (
          <div key={index} className="social-profile" style={{ borderLeftColor: profile.color }}>
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
