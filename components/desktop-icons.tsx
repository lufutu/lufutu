"use client"

import type React from "react"
import Image from "next/image"
import type { DesktopIcon } from "@/types"

interface DesktopIconsProps {
  desktopIcons: DesktopIcon[]
  handleIconDoubleClick: (iconId: string) => void
  handleMouseDown: (e: React.MouseEvent, type: "window" | "icon" | "widget", targetId: string) => void
}

export function DesktopIcons({ desktopIcons, handleIconDoubleClick, handleMouseDown }: DesktopIconsProps) {
  return (
    <>
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className={`desktop-icon ${icon.selected ? "selected" : ""}`}
          style={{
            left: icon.x,
            top: icon.y,
          }}
          onDoubleClick={() => handleIconDoubleClick(icon.id)}
          onMouseDown={(e) => handleMouseDown(e, "icon", icon.id)}
        >
          <div className="icon">
            <Image 
              src={icon.icon} 
              alt={icon.label} 
              width={32} 
              height={32}
              style={{ filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.9))' }}
            />
          </div>
          <div className="label">{icon.label}</div>
        </div>
      ))}
    </>
  )
}
