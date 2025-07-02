"use client"

import React, { useState, useEffect } from "react"
import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface ClockWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: any) => void
  settings: Settings
}

export const ClockWidget = React.memo(({ widget }: ClockWidgetProps) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Set initial time only after hydration
    setIsHydrated(true)
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="widget-content clock-widget-content">
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Clock_Blue.png" 
            alt="Clock" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          Clock</span>
      </div>
      <div className="clock-main">
        <div className="digital-time">
          {isHydrated && currentTime ? (
            currentTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          ) : (
            "--:--:--"
          )}
        </div>
        <div className="digital-date">
          {isHydrated && currentTime ? (
            currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  )
})
