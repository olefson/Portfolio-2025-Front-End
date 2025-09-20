"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, FolderOpen } from "lucide-react"

interface Project {
  id: string | number
  title: string
  description: string
  image?: string
  technologies: string[]
  githubUrl: string
  liveUrl?: string
  category: string
}

interface ProjectCardProps extends Project {
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
  showContent = false,
}: ProjectCardProps) {
  const content = (
    <Card className="h-full min-h-[400px] transition-colors group-hover:bg-muted/50 relative select-none flex flex-col">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold transition-colors group-hover:text-emerald-400">
            {title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {category}
          </Badge>
        </div>
        <div className="aspect-video rounded-lg bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/40" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, showContent ? undefined : 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {!showContent && technologies.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{technologies.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      <div className="p-6 mt-auto border-t space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>
          {liveUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
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
      <Link href={`/projects/${id}`}>
        <GlowCard>{content}</GlowCard>
      </Link>
    </div>
  )
}
