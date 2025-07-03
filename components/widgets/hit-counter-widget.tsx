import React from "react"
import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface HitCounterWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

export const HitCounterWidget = React.memo(({ widget }: HitCounterWidgetProps) => {
  return (
    <div className="widget-content hit-counter-widget-content">
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Calculator_Blue.png" 
            alt="Hit Counter" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          Hit Counter
        </span>
      </div>
      <div className="counter-main">
        <div className="counter-display">{widget.data.count.toLocaleString()}</div>
        <div className="counter-label">visitors since 1995</div>
        <div className="counter-decoration">
          <Image 
            src="/assets/icons/Apple_Blue.png" 
            alt="" 
            width={12} 
            height={12} 
            className="inline mx-1"
          />
          <Image 
            src="/assets/icons/Apple_Blue.png" 
            alt="" 
            width={12} 
            height={12} 
            className="inline mx-1"
          />
          <Image 
            src="/assets/icons/Apple_Blue.png" 
            alt="" 
            width={12} 
            height={12} 
            className="inline mx-1"
          />
        </div>
      </div>
    </div>
  )
})

HitCounterWidget.displayName = "HitCounterWidget"
