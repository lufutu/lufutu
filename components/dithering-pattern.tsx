import type React from "react"

interface DitheringPatternProps {
  pattern?: "dots" | "diagonal" | "cross" | "fine" | "coarse"
  opacity?: number
  className?: string
}

export const DitheringPattern = ({ 
  pattern = "dots", 
  opacity = 0.2, 
  className = "" 
}: DitheringPatternProps) => {
  const patterns = {
    dots: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3C/svg%3E")`,
    cross: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='0' y='2' fill='%23000000'/%3E%3Crect width='1' height='1' x='2' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`,
    fine: `url("data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='1' fill='%23000000'/%3E%3C/svg%3E")`,
    coarse: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='2' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='1' y='2' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`
  }

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: patterns[pattern],
        backgroundRepeat: 'repeat',
        opacity: opacity
      }}
    />
  )
} 