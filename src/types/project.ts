export interface Project {
  id: string
  title: string
  description: string
  imagePath?: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  toolsUsed: string[]
  toolNames?: string[] // Added for displaying tool names instead of IDs
  date?: string // Added for displaying project year
}

// Helper function to construct full image URL
export const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
  if (!imagePath) return undefined
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  // Otherwise, construct the full URL
  return `http://localhost:3001${imagePath}`
}
