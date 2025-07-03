import type React from "react"

interface DitheringPatternProps {
  pattern?: "dots" | "diagonal" | "cross" | "fine" | "coarse" | "animated"
  opacity?: number
  className?: string
  animated?: boolean
}

export const DitheringPattern = ({ 
  pattern = "dots", 
  opacity = 0.2, 
  className = "",
  animated = false 
}: DitheringPatternProps) => {
  const patterns = {
    dots: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3C/svg%3E")`,
    cross: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='1' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='0' y='2' fill='%23000000'/%3E%3Crect width='1' height='1' x='2' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`,
    fine: `url("data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='1' fill='%23000000'/%3E%3C/svg%3E")`,
    coarse: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23000000'/%3E%3Crect width='1' height='1' x='2' y='1' fill='%23000000'/%3E%3Crect width='1' height='1' x='1' y='2' fill='%23000000'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%23000000'/%3E%3C/svg%3E")`,
    animated: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='1' y='1' fill='%2300ff00'/%3E%3Crect width='1' height='1' x='3' y='3' fill='%2300ff00'/%3E%3C/svg%3E")`
  }

  const animationClasses = animated || pattern === 'animated' 
    ? 'animate-pulse' 
    : ''

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className} ${animationClasses}`}
      style={{
        backgroundImage: patterns[pattern],
        backgroundRepeat: 'repeat',
        opacity: opacity,
        animation: animated || pattern === 'animated' 
          ? 'ditheringShift 2s ease-in-out infinite alternate' 
          : undefined
      }}
    >
      {(animated || pattern === 'animated') && (
        <style jsx>{`
          @keyframes ditheringShift {
            0% { transform: translate(0, 0); }
            25% { transform: translate(1px, 0); }
            50% { transform: translate(1px, 1px); }
            75% { transform: translate(0, 1px); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      )}
    </div>
  )
} 