"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, FolderOpen } from "lucide-react"
import { ClickableToolBadge } from "@/components/ui/clickable-tool-badge"

interface ProjectCardProps {
  id: string | number
  title: string
  description: string
  image?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  category: string
  date?: string
  showContent?: boolean
}

export type { ProjectCardProps }

export function ProjectCard({
  id,
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  category,
  date,
  showContent = false,
}: ProjectCardProps) {
  const handleProjectNavigation = () => {
    window.location.href = `/projects/${id}`;
  };

  const hasGitHub = githubUrl && githubUrl !== "#";
  const hasLive = !!liveUrl;

  const content = (
    <Card className="h-[500px] transition-colors group-hover:bg-muted/50 relative flex flex-col overflow-hidden">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle 
              className="text-xl font-bold transition-colors group-hover:text-emerald-400 cursor-pointer hover:underline"
              onClick={handleProjectNavigation}
            >
              {title}
            </CardTitle>
            {date && (
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(date).getFullYear()}
              </p>
            )}
          </div>
          <Badge variant="outline" className="shrink-0">
            {category}
          </Badge>
        </div>
        <div 
          className="aspect-video rounded-lg bg-muted relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleProjectNavigation}
        >
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Silently handle image loading errors without console spam
                e.currentTarget.style.display = 'none';
                // Show the fallback folder icon
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.fallback-icon');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }
              }}
            />
          ) : null}
          {/* Always render fallback, but hide if image loads successfully */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent ${image ? 'hidden' : ''} fallback-icon`}
            style={{ display: image ? 'none' : 'flex' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground/40" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 flex-1 flex flex-col min-h-0 py-3 overflow-hidden">
        <p 
          className="text-sm text-muted-foreground line-clamp-3"
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {technologies
            .filter(tech => tech !== category) // Remove the category tag to avoid duplication
            .slice(0, showContent ? undefined : 5)
            .map((tech) => (
              <ClickableToolBadge 
                key={tech} 
                toolName={tech} 
                variant="secondary" 
                className="text-xs"
              />
            ))}
          {!showContent && technologies.filter(tech => tech !== category).length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{technologies.filter(tech => tech !== category).length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
      <div className="px-4 pb-4 pt-2 mt-auto flex-shrink-0">
        <div className="flex gap-2 w-full">
          {hasGitHub && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {hasLive && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )

  if (showContent) {
    return <GlowCard>{content}</GlowCard>
  }

  return (
    <div className="group relative">
      <GlowCard>{content}</GlowCard>
    </div>
  )
}
