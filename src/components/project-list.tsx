"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ProjectForm } from "./project-form"

interface Project {
  id: string
  title: string
  description: string
  imagePath?: string
  githubUrl: string
  liveUrl?: string
  tags: string[]
  acquired: Date
  createdBy: string
  updatedAt: string
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data.map((project: any) => ({
        ...project,
        acquired: new Date(project.acquired),
        tags: typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags
      })))
    } catch (error) {
      toast.error("Failed to fetch projects")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast.success("Project deleted successfully")
      fetchProjects()
    } catch (error) {
      toast.error("Failed to delete project")
      console.error(error)
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setSelectedProject(null)}>Add New Project</Button>
      </div>

      {selectedProject ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm project={selectedProject} onSuccess={() => {
              setSelectedProject(null)
              fetchProjects()
            }} />
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>GitHub</TableHead>
              <TableHead>Live URL</TableHead>
              <TableHead>Date Acquired</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View on GitHub
                  </a>
                </TableCell>
                <TableCell>
                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Visit Site
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not available</span>
                  )}
                </TableCell>
                <TableCell>{project.acquired.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
} 