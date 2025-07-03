"use client"

import { useState } from "react"
import type { DesktopIcon, Widget, Window, ContextMenu, Dialog, Settings } from "@/types"
import { getWindowContent } from "@/lib/window-content"

export function useDesktopState() {
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    { id: "home", label: "Home", icon: "/assets/icons/home.png", x: 20, y: 80, selected: false },
    { id: "work", label: "Work", icon: "/assets/icons/work.png", x: 20, y: 160, selected: false },
    { id: "blog", label: "Blog", icon: "/assets/icons/blog.png", x: 20, y: 240, selected: false },
    { id: "services", label: "Services", icon: "/assets/icons/service.png", x: 20, y: 320, selected: false },
    { id: "art", label: "Art", icon: "/assets/icons/art.png", x: 20, y: 400, selected: false },
    { id: "about", label: "About", icon: "/assets/icons/about.png", x: 20, y: 480, selected: false },
    { id: "contact", label: "Contact", icon: "/assets/icons/contact.png", x: 20, y: 560, selected: false },
    { id: "browser", label: "Browser", icon: "/assets/icons/browser.png", x: 120, y: 160, selected: false },
    { id: "games", label: "Games", icon: "/assets/icons/game.png", x: 120, y: 80, selected: false },
  ])

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
    {
      id: "habit-tracker",
      title: "Habit Tracker",
      x: 990,
      y: 670,
      width: 280,
      height: 300,
      type: "habit-tracker",
      data: {
        habits: [
          {
            id: "exercise",
            identity: "I am someone who exercises daily",
            action: "Do 10 pushups",
            cue: "After morning coffee",
            emoji: "💪",
            streak: 0,
            lastCompleted: null,
            completions: []
          },
          {
            id: "water",
            identity: "I am someone who stays hydrated",
            action: "Drink a glass of water",
            cue: "",
            emoji: "💧",
            streak: 0,
            lastCompleted: null,
            completions: []
          }
        ],
        weeklyReflection: {
          lastWeek: null,
          reflection: ""
        }
      },
    },
  ])

  const [windows, setWindows] = useState<Window[]>([
    {
      id: "home-default",
      title: "Home",
      content: getWindowContent("home"),
      x: 300,
      y: 150,
      width: 600,
      height: 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1001,
      originalBounds: undefined,
    },
  ])

  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0 })

  const [dialog, setDialog] = useState<Dialog>({
    visible: false,
    type: "",
    title: "",
    content: "",
    inputValue: "",
  })

  const [settings, setSettings] = useState<Settings>({
    youtubeUrl: "",
    fontSize: 10,
    theme: "retro-purple",
    spotifyUrl: "https://open.spotify.com/track/1rnMtjOkTgRtV69vH43N0U",
  })

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
