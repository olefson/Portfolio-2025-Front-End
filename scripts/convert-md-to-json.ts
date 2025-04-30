import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Tool {
  id: string
  title: string
  status: string
  category: string
  description: string
  howToUse: string[]
  caveats: string[]
  url: string
  useCases: {
    title: string
    items: string[]
  }[]
  tips: {
    title: string
    items: string[]
  }[]
  addedOn: string | null
  recommendedBy: string | null
}

function extractListItems(content: string, startMarker: string): { title: string; items: string[] }[] {
  const sections: { title: string; items: string[] }[] = []
  const lines = content.split('\n')
  
  let currentSection: { title: string; items: string[] } | null = null
  let inSection = false
  
  for (const line of lines) {
    if (line.startsWith('## ' + startMarker)) {
      inSection = true
      continue
    } else if (line.startsWith('## ') && inSection) {
      inSection = false
      continue
    }
    
    if (inSection) {
      // New numbered section
      if (line.match(/^\d+\.\s+\*\*([^*]+)\*\*/)) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: line.match(/^\d+\.\s+\*\*([^*]+)\*\*/)?.[1] || '',
          items: []
        }
      }
      // List item
      else if (line.trim().startsWith('- ') && currentSection) {
        currentSection.items.push(line.trim().replace('- ', ''))
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}

function parseListString(str: unknown): string[] {
  if (!str) return []
  if (typeof str !== 'string') return []
  
  // Handle both \n and actual newlines
  const lines = str.includes('\\n') ? str.split('\\n') : str.split('\n')
  
  return lines
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => item.replace(/^-\s*/, ''))
}

function convertMarkdownToJson(mdContent: string, filename: string): Tool {
  const { data, content } = matter(mdContent)
  
  // Convert howToUse and caveats from string to array
  const howToUse = parseListString(data.howToUse || '')
  const caveats = parseListString(data.caveats || '')
  
  // Extract use cases and tips
  const useCases = extractListItems(content, 'Primary Use Cases')
  const tips = extractListItems(content, 'Pro Tips')
  
  // Get date from cursorlog.txt if available
  let addedOn = '2025-01-01' // Default date
  try {
    const cursorlog = fs.readFileSync(path.join(process.cwd(), 'cursorlog.txt'), 'utf-8')
    const dateMatch = cursorlog.match(new RegExp(`Added ${data.title}.*?(\\d{4}-\\d{2}-\\d{2})`))
    if (dateMatch) {
      addedOn = dateMatch[1]
    }
  } catch (error) {
    console.warn('Could not read cursorlog.txt, using default date')
  }
  
  return {
    id: path.basename(filename, '.md'),
    title: data.title || '',
    status: data.status || 'Plan to Try',
    category: data.category || 'Other',
    description: data.description || '',
    howToUse,
    caveats,
    url: data.url || '',
    useCases,
    tips,
    addedOn,
    recommendedBy: null // We'll need to add this manually or extract from content if possible
  }
}

// Main conversion process
const toolsDir = path.join(process.cwd(), 'src/content/tools')
const outputFile = path.join(process.cwd(), 'src/data/tools.json')

const tools = fs
  .readdirSync(toolsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    console.log(`Converting ${file}...`)
    const content = fs.readFileSync(path.join(toolsDir, file), 'utf-8')
    return convertMarkdownToJson(content, file)
  })

const output = {
  tools: tools.sort((a, b) => {
    if (!a.addedOn || !b.addedOn) return 0
    return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
  })
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))
console.log(`Converted ${tools.length} tools to JSON format`) 