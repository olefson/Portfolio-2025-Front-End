"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react"
import { Project, getImageUrl } from "@/types/project"
import { ClickableToolBadge } from "@/components/ui/clickable-tool-badge"
import DarkVeil from "@/components/ui/dark-veil"
import GlassSurface from "@/components/GlassSurface"
import Image from "next/image"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) {
        throw new Error('Project not found')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <DarkVeil className="fixed inset-0" />
        <div className="relative z-10 container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/80">Loading project...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="relative min-h-screen">
        <DarkVeil className="fixed inset-0" />
        <div className="relative z-10 container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4 text-white">Project Not Found</h1>
              <p className="text-white/80 mb-6">
                The project you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button onClick={() => router.push('/projects')} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <DarkVeil className="fixed inset-0" />
      <div className="relative z-10 container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/projects')}
            className="mb-6 text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-white">{project.title}</h1>
            {project.date && (
              <div className="flex items-center gap-2 text-white/70 mb-4">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.date).getFullYear()}</span>
              </div>
            )}
          </div>

        {/* Project Image */}
        {project.imagePath && (() => {
          const imageUrl = getImageUrl(project.imagePath);
          return imageUrl ? (
            <div className="mb-8">
              <div className="aspect-video rounded-lg bg-muted relative overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', project.imagePath);
                    const target = e.target as HTMLImageElement;
                    if (target) {
                      target.style.display = 'none';
                    }
                  }}
                />
              </div>
            </div>
          ) : null;
        })()}

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Info */}
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                backgroundOpacity={0.5}
                blur={2}
                displace={0}
              >
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      Project Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </GlassSurface>

              {/* Project Links */}
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                backgroundOpacity={0.5}
                blur={2}
                displace={0}
              >
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-white">Project Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.githubUrl && (
                      <Button asChild className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button asChild variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Live Site
                        </a>
                      </Button>
                    )}
                    {!project.githubUrl && !project.liveUrl && (
                      <p className="text-white/70 text-center py-4">
                        No links available for this project
                      </p>
                    )}
                  </CardContent>
                </Card>
              </GlassSurface>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                backgroundOpacity={0.5}
                blur={2}
                displace={0}
              >
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-white">Tech Stack</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/10 border-white/20 text-white">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Tools Used</h4>
                      <div className="flex flex-wrap gap-1">
                        {(project.toolNames || []).map((tool, index) => (
                          <ClickableToolBadge 
                            key={index} 
                            toolName={tool} 
                            variant="outline" 
                            className="text-xs bg-white/10 border-white/20 text-white"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlassSurface>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
