"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react"
import { Project, getImageUrl } from "@/types/project"
import { ClickableToolBadge } from "@/components/ui/clickable-tool-badge"

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
      const response = await fetch(`http://localhost:3001/api/projects/${id}`)
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
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
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
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        </div>

        {/* Project Image */}
        {project.imagePath && (
          <div className="mb-8">
            <div className="aspect-video rounded-lg bg-muted relative overflow-hidden">
              <img
                src={getImageUrl(project.imagePath)}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', project.imagePath);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Project Links */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.githubUrl && (
                  <Button asChild className="w-full">
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
                  <Button asChild variant="outline" className="w-full">
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
                  <p className="text-muted-foreground text-center py-4">
                    No links available for this project
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tools Used</h4>
                  <div className="flex flex-wrap gap-1">
                    {(project.toolNames || project.toolsUsed).map((tool, index) => (
                      <ClickableToolBadge 
                        key={index} 
                        toolName={tool} 
                        variant="outline" 
                        className="text-xs"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
