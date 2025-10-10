"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getToolIdByName } from "@/lib/tool-utils"

interface ClickableToolBadgeProps {
  toolName: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export function ClickableToolBadge({ 
  toolName, 
  variant = "secondary", 
  className = "text-xs" 
}: ClickableToolBadgeProps) {
  const [toolId, setToolId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchToolId = async () => {
      try {
        const id = await getToolIdByName(toolName)
        setToolId(id)
      } catch (error) {
        console.error('Error fetching tool ID:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToolId()
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
    <Badge 
      variant={variant} 
      className={`${className} cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/tools/${toolId}`;
      }}
    >
      {toolName}
    </Badge>
  )
}
