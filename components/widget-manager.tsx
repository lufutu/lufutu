"use client"

import React, { useEffect, useRef, useCallback, useMemo } from "react"
import type { Widget, Settings } from "@/types"
import { HitCounterWidget } from "./widgets/hit-counter-widget"
import { WeatherWidget } from "./widgets/weather-widget"
import { SpotifyWidget } from "./widgets/spotify-widget"
import { ClockWidget } from "./widgets/clock-widget"
import { SystemWidget } from "./widgets/system-widget"
import { NotesWidget } from "./widgets/notes-widget"
import { SocialWidget } from "./widgets/social-widget"
import { HabitTrackerWidget } from "./widgets/habit-tracker-widget"

interface WidgetManagerProps {
  widgets: Widget[]
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
  handleTouchStart?: (e: React.TouchEvent, type: "window" | "icon" | "widget", targetId: string) => void
  settings: Settings
}

export const WidgetManager = React.memo(({ widgets, setWidgets, handleMouseDown, handleTouchStart, settings }: WidgetManagerProps) => {
  const animationFrameRef = useRef<number>(0)
  const lastUpdateTimeRef = useRef<number>(Date.now())
  const systemDataTimeRef = useRef<number>(0)
  const hitCounterTimeRef = useRef<number>(0)
  const isDocumentVisibleRef = useRef<boolean>(true)

  const updateWidgetData = useCallback((widgetId: string, newData: Record<string, unknown>) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, data: { ...w.data, ...newData } } : w)))
  }, [setWidgets])

  const renderWidget = useCallback((widget: Widget) => {
    const commonProps = {
      widget,
      updateWidgetData,
      settings,
    }

    switch (widget.type) {
      case "hit-counter":
        return <HitCounterWidget {...commonProps} />
      case "weather":
        return <WeatherWidget {...commonProps} />
      case "spotify":
        return <SpotifyWidget {...commonProps} />
      case "clock":
        return <ClockWidget {...commonProps} />
      case "system-monitor":
        return <SystemWidget {...commonProps} />
      case "notes":
        return <NotesWidget {...commonProps} />
      case "social":
        return <SocialWidget {...commonProps} />
      case "habit-tracker":
        return <HabitTrackerWidget {...commonProps} />
      default:
        return <div className="widget-content">Unknown widget</div>
    }
  }, [updateWidgetData, settings])

  // Fetch system data from API - throttled
  const fetchSystemData = useCallback(async () => {
    try {
      const response = await fetch('/api/system')
      const result = await response.json()
      
      if (result.success) {
        setWidgets((prev) =>
          prev.map((w) => {
            if (w.id === "system-monitor") {
              return {
                ...w,
                data: {
                  ...w.data,
                  targetCpu: result.data.cpu,
                  targetRam: result.data.ram,
                  targetDisk: result.data.disk,
                },
              }
            }
            return w
          }),
        )
      } else {
        // Fallback to random data if API fails
        setWidgets((prev) =>
          prev.map((w) => {
            if (w.id === "system-monitor") {
              const newTargetCpu = Math.floor(Math.random() * 100)
              const newTargetRam = Math.floor(Math.random() * 100)
              const newTargetDisk = Math.floor(Math.random() * 100)
              return {
                ...w,
                data: {
                  ...w.data,
                  targetCpu: newTargetCpu,
                  targetRam: newTargetRam,
                  targetDisk: newTargetDisk,
                },
              }
            }
            return w
          }),
        )
      }
    } catch (error) {
      console.error('Error fetching system data:', error)
      // Fallback to random data on error
      setWidgets((prev) =>
        prev.map((w) => {
          if (w.id === "system-monitor") {
            const newTargetCpu = Math.floor(Math.random() * 100)
            const newTargetRam = Math.floor(Math.random() * 100)
            const newTargetDisk = Math.floor(Math.random() * 100)
            return {
              ...w,
              data: {
                ...w.data,
                targetCpu: newTargetCpu,
                targetRam: newTargetRam,
                targetDisk: newTargetDisk,
              },
            }
          }
          return w
        }),
      )
    }
  }, [setWidgets])

  // Single optimized animation loop to replace multiple intervals
  const startAnimationLoop = useCallback(() => {
    const animate = () => {
      // Only animate if document is visible
      if (!isDocumentVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const now = Date.now()
      const deltaTime = now - lastUpdateTimeRef.current

      // Throttle updates to 10fps instead of 60fps
      if (deltaTime < 100) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      lastUpdateTimeRef.current = now

      // Handle system data fetching (every 5 seconds instead of 3)
      if (now - systemDataTimeRef.current >= 5000) {
        systemDataTimeRef.current = now
        fetchSystemData()
      }

      // Handle hit counter updates (every 10 seconds instead of 7)
      if (now - hitCounterTimeRef.current >= 10000) {
        hitCounterTimeRef.current = now
        setWidgets((prev) =>
          prev.map((w) => {
            if (w.id === "hit-counter") {
              const increment = Math.floor(Math.random() * 3) + 1 // Smaller increments
              return {
                ...w,
                data: {
                  ...w.data,
                  targetCount: w.data.targetCount + increment,
                },
              }
            }
            return w
          }),
        )
      }

      // Batch all animation updates together
      setWidgets((prev) => {
        return prev.map((w) => {
          if (w.id === "hit-counter") {
            const current = w.data.count
            const target = w.data.targetCount
            if (current !== target) {
              const diff = target - current
              const step = Math.ceil(Math.abs(diff) / 8) // Slower animation
              const newCount = current + (diff > 0 ? step : -step)
              return {
                ...w,
                data: {
                  ...w.data,
                  count: Math.abs(newCount - target) < step ? target : newCount,
                },
              }
            }
          } else if (w.id === "system-monitor") {
            const { cpu, ram, disk, targetCpu, targetRam, targetDisk } = w.data
            const animateValue = (current: number, target: number) => {
              if (current !== target) {
                const diff = target - current
                const step = Math.ceil(Math.abs(diff) / 12) // Slower animation
                const newValue = current + (diff > 0 ? step : -step)
                return Math.abs(newValue - target) < step ? target : newValue
              }
              return current
            }

            const newCpu = animateValue(cpu, targetCpu)
            const newRam = animateValue(ram, targetRam)
            const newDisk = animateValue(disk, targetDisk)

            if (newCpu !== cpu || newRam !== ram || newDisk !== disk) {
              return {
                ...w,
                data: {
                  ...w.data,
                  cpu: newCpu,
                  ram: newRam,
                  disk: newDisk,
                },
              }
            }
          }
          return w
        })
      })

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [fetchSystemData, setWidgets])

  // Visibility API check for performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = !document.hidden
      if (!document.hidden) {
        // Resume animations when page becomes visible
        const resume = () => startAnimationLoop()
        resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [startAnimationLoop])

  // Start animation loop on mount
  useEffect(() => {
    const start = () => startAnimationLoop()
    start()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [startAnimationLoop])

  const memoizedWidgets = useMemo(() => {
    return widgets.map((widget, index) => (
      <div
        key={widget.id}
        className={`widget widget-${widget.type} widget-index-${index}`}
        style={{
          left: widget.x,
          top: widget.y,
          width: widget.width,
          height: widget.height,
        }}
        onMouseDown={(e) => handleMouseDown(e, "widget", widget.id)}
        onTouchStart={(e) => handleTouchStart?.(e, "widget", widget.id)}
      >
        {renderWidget(widget)}
      </div>
    ))
  }, [widgets, handleMouseDown, handleTouchStart, renderWidget])

  return <>{memoizedWidgets}</>
})

WidgetManager.displayName = "WidgetManager"
