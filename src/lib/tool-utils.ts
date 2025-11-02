import { Tool } from "@/types"

// Cache for tools to avoid repeated API calls
let toolsCache: Tool[] | null = null
let toolsCacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getTools(): Promise<Tool[]> {
  const now = Date.now()
  
  // Return cached data if it's still fresh
  if (toolsCache && (now - toolsCacheTimestamp) < CACHE_DURATION) {
    return toolsCache
  }

  try {
    // Server-side fetch needs full URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
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
  }
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
  const tools = await getTools()
  const mapping: Record<string, string> = {}
  
  for (const toolName of toolNames) {
    const toolId = await getToolIdByName(toolName)
    if (toolId) {
      mapping[toolName] = toolId
    }
  }
  
  return mapping
}
