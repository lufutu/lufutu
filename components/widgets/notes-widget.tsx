"use client"

import type { Widget, Settings } from "@/types"
import Image from "next/image"

interface NotesWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

export function NotesWidget({ widget, updateWidgetData }: NotesWidgetProps) {
  return (
    <div className="widget-content notes-widget-content">
      <div className="widget-title-bar">
        <span className="widget-title">
          <Image 
            src="/assets/icons/Writing_Blue.png" 
            alt="Notes" 
            width={16} 
            height={16} 
            className="inline mr-1"
          /> 
          Notes
        </span>
      </div>
      <div className="notes-main">
        <textarea
          className="notes-textarea"
          value={widget.data.content}
          onChange={(e) => {
            e.stopPropagation()
            updateWidgetData(widget.id, { content: e.target.value })
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  )
}
