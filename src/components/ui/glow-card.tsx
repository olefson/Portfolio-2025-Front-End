"use client"

import { useRef, useState } from "react"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const isPointerInside = useRef(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage position for glow effect
    setPosition({ x, y })
    setOpacity(1)

    // Calculate rotation based on cursor position
    const rotateX = ((y - rect.height / 2) / rect.height) * -10
    const rotateY = ((x - rect.width / 2) / rect.width) * 10
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    isPointerInside.current = false
    setOpacity(0)
    setRotation({ x: 0, y: 0 })
  }

  const handleMouseEnter = () => {
    isPointerInside.current = true
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative">
        {/* Glow effect with transforms applied to visual layer only */}
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16,185,129,0.1), transparent 40%)`,
            border: "1px solid rgba(16,185,129,0.2)",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isPointerInside.current ? "none" : "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Content layer - no transforms applied */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
} 