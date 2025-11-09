"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getToolIdByName } from "@/lib/tool-utils"

interface ClickableToolBadgeProps {
  toolName: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

// Cache for tool ID lookups to avoid repeated API calls
const toolIdCache = new Map<string, string | null>()

export function ClickableToolBadge({ 
  toolName, 
  variant = "secondary", 
  className = "text-xs" 
}: ClickableToolBadgeProps) {
  const [toolId, setToolId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Check cache first
    const cachedId = toolIdCache.get(toolName)
    if (cachedId !== undefined) {
      setToolId(cachedId)
      setIsLoading(false)
      return
    }

    const fetchToolId = async () => {
      try {
        const id = await getToolIdByName(toolName)
        // Cache the result
        toolIdCache.set(toolName, id)
        if (mountedRef.current) {
          setToolId(id)
        }
      } catch (error) {
        console.error('Error fetching tool ID:', error)
        // Cache null result to avoid repeated failed requests
        toolIdCache.set(toolName, null)
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    fetchToolId()

    return () => {
      mountedRef.current = false
    }
  }, [toolName])

  if (isLoading) {
    return (
      <Badge variant={variant} className={className}>
        {toolName}
      </Badge>
    )
  }

  if (!toolId) {
    // If no matching tool found, show as regular badge
    return (
      <Badge variant={variant} className={className}>
        {toolName}
      </Badge>
    )
  }

  return (
    <Link href={`/tools/${toolId}`}>
      <Badge 
        variant={variant} 
        className={`${className} cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors`}
      >
        {toolName}
      </Badge>
    </Link>
  )
}
