"use client"

import Image from "next/image"
import { useState } from "react"

interface ToolLogoProps {
  src: string
  alt: string
}

export function ToolLogo({ src, alt }: ToolLogoProps) {
  const [error, setError] = useState(false)

  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <Image
        src={error ? "/images/tools/placeholder.svg" : src}
        alt={alt}
        fill
        className="object-contain dark:invert"
        onError={() => setError(true)}
      />
    </div>
  )
} 