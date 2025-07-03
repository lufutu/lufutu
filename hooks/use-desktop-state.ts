"use client"

import { useState, useEffect } from "react"
import type { DesktopIcon, Widget, Window, ContextMenu, Dialog, Settings } from "@/types"
import { getWindowContent, getWindowConfig } from "@/lib/window-content"

export function useDesktopState() {
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(() => {
    const configs = [
      "home", "blog", "work", "about", "contact", 
      "games", "art", "browser", "services", "habits"
    ].map(type => {
      const config = getWindowConfig(type)
      return {
        id: type,
        label: config.desktopIcon?.label || config.title,
        icon: config.icon,
        gridPosition: config.desktopIcon?.gridPosition || { row: 0, column: 0 },
        selected: false
      }
    })
    return configs
  })

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "hit-counter",
      title: "Hit Counter",
      x: 1130,
      y: 80,
      width: 100,
      height: 100,
      type: "hit-counter",
      data: { count: 142799, targetCount: 142799 },
    },
    // {
    //   id: "social",
    //   title: "Social Media",
    //   x: 1340,
    //   y: 180,
    //   width: 180,
    //   height: 140,
    //   type: "social",
    //   data: {
    //     profiles: [
    //       { name: "Email", icon: "/assets/icons/Document_Blue.png", url: "mailto:truongvutu@gmail.com", color: "#d44638" },
    //       { name: "LinkedIn", icon: "/assets/icons/Document_Blue.png", url: "https://www.linkedin.com/in/lufutu/", color: "#0077b5" },
    //       { name: "GitHub", icon: "/assets/icons/Letter G Black_Blue.png", url: "https://github.com/lufutu", color: "#333" },
    //       { name: "Location", icon: "/assets/icons/Circle_Blue.png", url: "https://maps.google.com/?q=Hanoi,Vietnam", color: "#4285f4" },
    //     ],
    //   },
    // },
    {
      id: "weather",
      title: "Weather",
      x: 1090,
      y: 200,
      width: 180,
      height: 150,
      type: "weather",
      data: {
        temp: "Loading...",
        condition: "Loading...",
        location: "Detecting location...",
        humidity: 0,
        windSpeed: 0,
        loading: true,
      },
    },
    {
      id: "system-monitor",
      title: "System Monitor",
      x: 1340,
      y: 340,
      width: 180,
      height: 150,
      type: "system-monitor",
      data: { cpu: 45, ram: 67, disk: 23, targetCpu: 45, targetRam: 67, targetDisk: 23 },
    },
    {
      id: "spotify",
      title: "Spotify Player",
      x: 930,
      y: 490,
      width: 320,
      height: 150,
      type: "spotify",
      data: {},
    },
    {
      id: "notes",
      title: "Sticky Notes",
      x: 1300,
      y: 500,
      width: 200,
      height: 170,
      type: "notes",
      data: {
        content:
          "Welcome to my retro desktop!\n\nFeel free to explore and interact with the widgets.\n\n- Drag widgets around\n- Right-click for settings\n- Edit this note!\n- Play some games!",
      },
    },
    // {
    //   id: "clock",
    //   title: "Digital Clock",
    //   x: 1130,
    //   y: 380,
    //   width: 140,
    //   height: 90,
    //   type: "clock",
    //   data: {},
    // },
    // {
    //   id: "habit-tracker",
    //   title: "Habit Tracker",
    //   x: 990,
    //   y: 670,
    //   width: 280,
    //   height: 300,
    //   type: "habit-tracker",
    //   data: {
    //     habits: [
    //       {
    //         id: "exercise",
    //         identity: "I am someone who exercises daily",
    //         action: "Do 10 pushups",
    //         cue: "After morning coffee",
    //         emoji: "💪",
    //         streak: 0,
    //         lastCompleted: null,
    //         completions: []
    //       },
    //       {
    //         id: "water",
    //         identity: "I am someone who stays hydrated",
    //         action: "Drink a glass of water",
    //         cue: "",
    //         emoji: "💧",
    //         streak: 0,
    //         lastCompleted: null,
    //         completions: []
    //       }
    //     ],
    //     weeklyReflection: {
    //       lastWeek: null,
    //       reflection: ""
    //     }
    //   },
    // },
  ])

  const [windows, setWindows] = useState<Window[]>([])

  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0 })

  const [dialog, setDialog] = useState<Dialog>({
    visible: false,
    type: "",
    title: "",
    content: "",
    inputValue: "",
  })

  const [settings, setSettings] = useState<Settings>(() => {
    // Try to load settings from localStorage
    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('desktop-settings') : null
    const defaultSettings = {
      youtubeUrl: "",
      fontSize: 10,
      theme: "retro-purple",
      spotifyUrl: "https://open.spotify.com/track/1rnMtjOkTgRtV69vH43N0U",
      backgroundImage: "coffee_in_rain_by.webp"
    }

    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) }
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
        return defaultSettings
      }
    }

    return defaultSettings
  })

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('desktop-settings', JSON.stringify(settings))
    }
  }, [settings])

  const [nextZIndex, setNextZIndex] = useState(1001)

  return {
    desktopIcons,
    setDesktopIcons,
    widgets,
    setWidgets,
    windows,
    setWindows,
    contextMenu,
    setContextMenu,
    dialog,
    setDialog,
    settings,
    setSettings,
    nextZIndex,
    setNextZIndex,
  }
}
