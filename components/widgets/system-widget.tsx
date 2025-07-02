import React from "react"
import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface SystemWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: any) => void
  settings: Settings
}

export const SystemWidget = React.memo(({ widget }: SystemWidgetProps) => {
  return (
    <div className="widget-content system-widget-content">
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Chip_Blue.png" 
            alt="System" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          System Monitor
          <span className="ml-2 text-green-400 animate-pulse">●</span>
        </span>
      </div>
      <div className="system-main">
        <div className="system-stat">
          <span className="stat-label">CPU:</span>
          <div className="stat-bar">
            <div className="stat-fill animated" style={{ width: `${widget.data.cpu}%` }}></div>
          </div>
          <span className="stat-value">{widget.data.cpu}%</span>
        </div>
        <div className="system-stat">
          <span className="stat-label">RAM:</span>
          <div className="stat-bar">
            <div className="stat-fill animated" style={{ width: `${widget.data.ram}%` }}></div>
          </div>
          <span className="stat-value">{widget.data.ram}%</span>
        </div>
        <div className="system-stat">
          <span className="stat-label">DISK:</span>
          <div className="stat-bar">
            <div className="stat-fill animated" style={{ width: `${widget.data.disk}%` }}></div>
          </div>
          <span className="stat-value">{widget.data.disk}%</span>
        </div>
        <div className="system-footer">
          <span className="system-info">Live Data • 10s refresh</span>
        </div>
      </div>
    </div>
  )
})
