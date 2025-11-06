import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

// Helper function to fetch data from backend
async function fetchFromBackend(endpoint: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const response = await fetch(`${backendUrl}${endpoint}`, {
      // Revalidate every hour for sitemap generation
      next: { revalidate: 3600 }
    })
    if (!response.ok) {
      console.warn(`Failed to fetch ${endpoint}: ${response.status}`)
      return []
    }
    return await response.json()
  } catch (error) {
    console.warn(`Error fetching ${endpoint}:`, error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/processes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Fetch dynamic content
  const [projects, tools, processes] = await Promise.all([
    fetchFromBackend('/api/projects'),
    fetchFromBackend('/api/tools'),
    fetchFromBackend('/api/processes'),
  ])

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = Array.isArray(projects)
    ? projects.map((project: { id: string; date?: string; updatedAt?: string }) => {
        // Use date field if available, otherwise current date
        let lastModified = new Date()
        if (project.date) {
          const date = new Date(project.date)
          if (!isNaN(date.getTime())) lastModified = date
        } else if (project.updatedAt) {
          const date = new Date(project.updatedAt)
          if (!isNaN(date.getTime())) lastModified = date
        }
        return {
          url: `${baseUrl}/projects/${project.id}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }
      })
    : []

  // Dynamic tool pages
  const toolPages: MetadataRoute.Sitemap = Array.isArray(tools)
    ? tools.map((tool: { id: string; updatedAt?: string }) => {
        let lastModified = new Date()
        if (tool.updatedAt) {
          const date = new Date(tool.updatedAt)
          if (!isNaN(date.getTime())) lastModified = date
        }
        return {
          url: `${baseUrl}/tools/${tool.id}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }
      })
    : []

  // Dynamic process pages
  const processPages: MetadataRoute.Sitemap = Array.isArray(processes)
    ? processes.map((process: { id: string; updatedAt?: string; addedOn?: string }) => {
        let lastModified = new Date()
        if (process.updatedAt) {
          const date = new Date(process.updatedAt)
          if (!isNaN(date.getTime())) lastModified = date
        } else if (process.addedOn) {
          const date = new Date(process.addedOn)
          if (!isNaN(date.getTime())) lastModified = date
        }
        return {
          url: `${baseUrl}/processes/${process.id}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }
      })
    : []

  return [...staticPages, ...projectPages, ...toolPages, ...processPages]
}

