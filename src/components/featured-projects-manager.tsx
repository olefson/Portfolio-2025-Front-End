"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { Project } from "@/types/project"

interface FeaturedProjectsManagerProps {
  onUpdate?: () => void
}

export function FeaturedProjectsManager({ onUpdate }: FeaturedProjectsManagerProps) {
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [selectedProject1, setSelectedProject1] = useState<string>("none")
  const [selectedProject2, setSelectedProject2] = useState<string>("none")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsResponse, featuredResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/projects/featured')
      ])

      if (projectsResponse.ok) {
        const projects = await projectsResponse.json()
        setAllProjects(projects)
      }

      if (featuredResponse.ok) {
        const featured = await featuredResponse.json()
        setFeaturedProjects(featured)
        
        // Set selected values for dropdowns
        if (featured.length > 0) {
          const projectId = featured[0]?.id || "none"
          console.log("Setting selectedProject1 to:", projectId)
          setSelectedProject1(projectId)
        }
        if (featured.length > 1) {
          const projectId = featured[1]?.id || "none"
          console.log("Setting selectedProject2 to:", projectId)
          setSelectedProject2(projectId)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const featuredIds = [selectedProject1, selectedProject2].filter(id => id && id !== "clear" && id !== "none")
      
      const response = await fetch('/api/projects/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featuredProjectIds: featuredIds }),
      })

      if (response.ok) {
        await fetchData() // Refresh data
        onUpdate?.()
      } else {
        console.error('Failed to update featured projects')
      }
    } catch (error) {
      console.error('Error updating featured projects:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getAvailableProjects = (excludeId?: string) => {
    return allProjects.filter(project => 
      project.id && 
      project.id !== "" && 
      project.id !== excludeId
    )
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Featured Projects Management
        </CardTitle>
        <p className="text-muted-foreground">
          Select up to 2 projects to feature on your about page. These will be displayed prominently to showcase your best work.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Featured Projects */}
        {featuredProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Currently Featured</h3>
            <div className="space-y-2">
              {featuredProjects.map((project, index) => (
                <div key={project.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured {index + 1}
                  </Badge>
                  <span className="font-medium">{project.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selection Dropdowns */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Featured Project 1</label>
            <Select 
              value={selectedProject1 || "none"} 
              onValueChange={(value) => {
                console.log("Project 1 value changed to:", value)
                setSelectedProject1(value === "clear" ? "none" : value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select first featured project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="clear">Clear selection</SelectItem>
                {getAvailableProjects(selectedProject2).map((project) => {
                  // Ensure we never pass empty strings
                  if (!project.id || project.id === "") {
                    console.warn("Project with empty ID found:", project);
                    return null;
                  }
                  return (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  );
                }).filter(Boolean)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Featured Project 2</label>
            <Select 
              value={selectedProject2 || "none"} 
              onValueChange={(value) => {
                console.log("Project 2 value changed to:", value)
                setSelectedProject2(value === "clear" ? "none" : value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select second featured project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="clear">Clear selection</SelectItem>
                {getAvailableProjects(selectedProject1).map((project) => {
                  // Ensure we never pass empty strings
                  if (!project.id || project.id === "") {
                    console.warn("Project with empty ID found:", project);
                    return null;
                  }
                  return (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  );
                }).filter(Boolean)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Featured Projects'
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p><strong>Tip:</strong> Choose your most impressive or recent projects to showcase on your about page. You can select 1 or 2 projects, or leave both empty to show no featured projects.</p>
        </div>
      </CardContent>
    </Card>
  )
}
