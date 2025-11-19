import { Tool } from "@/types"

// Cache for tools to avoid repeated API calls
let toolsCache: Tool[] | null = null
let toolsCacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Request deduplication - prevent multiple concurrent requests
let pendingRequest: Promise<Tool[]> | null = null

export async function getTools(): Promise<Tool[]> {
  const now = Date.now()
  
  // Return cached data if it's still fresh
  if (toolsCache && (now - toolsCacheTimestamp) < CACHE_DURATION) {
    return toolsCache
  }

  // If there's already a pending request, wait for it instead of making a new one
  if (pendingRequest) {
    try {
      return await pendingRequest
    } catch {
      // If pending request fails, fall through to make a new request
      pendingRequest = null
    }
  }

  // Create a new request and store it
  pendingRequest = (async () => {
    try {
      // Use relative URLs in browser (client-side), full URL in server-side
      const backendUrl = typeof window !== 'undefined' 
        ? '' // Empty string means relative URLs (nginx handles routing)
        : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
      const response = await fetch(`${backendUrl}/api/tools`, { 
        cache: 'no-store' 
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tools')
      }
      const tools = await response.json()
      
      // Update cache
      toolsCache = tools
      toolsCacheTimestamp = now
      
      return tools
    } catch (error) {
      console.error('Error fetching tools:', error)
      // Return cached data if available, even if stale
      return toolsCache || []
    } finally {
      // Clear pending request after completion
      pendingRequest = null
    }
  })()

  return pendingRequest
}

export async function getToolIdByName(toolName: string): Promise<string | null> {
  const tools = await getTools()
  
  // Try exact match first
  const exactMatch = tools.find(tool => 
    tool.name.toLowerCase() === toolName.toLowerCase()
  )
  if (exactMatch) return exactMatch.id
  
  // Try partial match
  const partialMatch = tools.find(tool => 
    tool.name.toLowerCase().includes(toolName.toLowerCase()) ||
    toolName.toLowerCase().includes(tool.name.toLowerCase())
  )
  if (partialMatch) return partialMatch.id
  
  return null
}

export async function getToolIdsByNames(toolNames: string[]): Promise<Record<string, string>> {
  await getTools()
  const mapping: Record<string, string> = {}
  
  for (const toolName of toolNames) {
    const toolId = await getToolIdByName(toolName)
    if (toolId) {
      mapping[toolName] = toolId
    }
  }
  
  return mapping
}
