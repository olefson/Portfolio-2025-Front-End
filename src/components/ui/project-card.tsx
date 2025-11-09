"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, FolderOpen } from "lucide-react"
import { ClickableToolBadge } from "@/components/ui/clickable-tool-badge"
import GlassSurface from "@/components/GlassSurface"

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
    <GlassSurface
      width={"100%" as any}
      height={"100%" as any}
      borderRadius={16}
      backgroundOpacity={0.5}
      blur={2}
      opacity={0.93}
      displace={0}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="p-4 sm:p-6 space-y-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
              <h3 
                className="text-xl font-bold text-white transition-colors group-hover:text-emerald-400 cursor-pointer hover:underline"
              onClick={handleProjectNavigation}
            >
              {title}
              </h3>
            {date && (
                <p className="text-sm text-white/70 mt-1">
                {new Date(date).getFullYear()}
              </p>
            )}
          </div>
            <Badge variant="outline" className="text-xs sm:text-sm bg-white/10 border-white/20 text-white shrink-0">
            {category}
          </Badge>
        </div>
          
          {/* Image Section */}
        <div 
            className="aspect-video rounded-lg bg-white/5 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
          onClick={handleProjectNavigation}
        >
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
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
            {/* Fallback icon */}
          <div 
              className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-transparent ${image ? 'hidden' : ''} fallback-icon`}
            style={{ display: image ? 'none' : 'flex' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 flex-1 flex flex-col min-h-0">
          <div className="min-h-[60px] overflow-hidden">
        <p 
              className="text-sm text-white/80 line-clamp-3"
        >
          {description}
        </p>
          </div>
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {technologies
            .filter(tech => tech !== category) // Remove the category tag to avoid duplication
            .slice(0, showContent ? undefined : 5)
            .map((tech) => (
              <ClickableToolBadge 
                key={tech} 
                toolName={tech} 
                variant="secondary" 
                  className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
              />
            ))}
          {!showContent && technologies.filter(tech => tech !== category).length > 5 && (
              <Badge variant="secondary" className="text-xs bg-white/10 border-white/20 text-white">
              +{technologies.filter(tech => tech !== category).length - 5} more
            </Badge>
          )}
        </div>
        </div>

        {/* Footer Section with Buttons */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 mt-auto flex-shrink-0">
        <div className="flex gap-2 w-full">
          {hasGitHub && (
              <Button variant="outline" size="sm" asChild className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
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
              <Button variant="outline" size="sm" asChild className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
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
      </div>
    </GlassSurface>
  )

  return (
    <div className="group relative h-full">
      {content}
    </div>
  )
}
