"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { ProjectCard } from "@/components/ui/project-card"
import { Project, getImageUrl } from "@/types/project"

// Predefined project categories (should match the form)
const PROJECT_CATEGORIES = [
  "Web Development",
  "Artificial Intelligence", 
  "Research",
  "Other"
]

const defaultCategories = ["All", ...PROJECT_CATEGORIES]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState(defaultCategories)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
      
      // Use predefined categories instead of dynamic extraction
      setCategories(defaultCategories)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const toolNames = project.toolNames || project.toolsUsed
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         toolNames.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || 
                           project.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground text-lg">
            A collection of my work and personal projects
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-sm mx-auto mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <Tabs
            defaultValue="All"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="flex flex-wrap justify-center gap-1 bg-transparent min-h-fit h-auto py-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full bg-muted px-3 py-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-destructive">Error</h3>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProjectCard 
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  image={getImageUrl(project.imagePath)}
                  technologies={[...project.tags, ...(project.toolNames || project.toolsUsed)]}
                  githubUrl={project.githubUrl || "#"}
                  liveUrl={project.liveUrl}
                  category={project.tags[0] || project.toolsUsed[0] || "Web Development"}
                  date={project.date}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
} 