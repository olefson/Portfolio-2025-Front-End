import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Process } from '@/types'

function extractTipsFromContent(content: string): { [key: string]: string[] } {
  const tips: { [key: string]: string[] } = {}
  const lines = content.split('\n')
  
  let currentSection = ''
  let inTipsSection = false
  
  for (const line of lines) {
    if (line.startsWith('## Tips for Success')) {
      inTipsSection = true
      continue
    } else if (line.startsWith('##') && inTipsSection) {
      break
    }
    
    if (inTipsSection) {
      // New numbered section
      if (line.match(/^\d+\.\s+\*\*([^*]+)\*\*/)) {
        currentSection = line.match(/^\d+\.\s+\*\*([^*]+)\*\*/)?.[1] || ''
        tips[currentSection] = []
      }
      // List item
      else if (line.trim().startsWith('- ') && currentSection) {
        tips[currentSection].push(line.trim().replace('- ', ''))
      }
    }
  }
  
  return tips
}

function convertMarkdownToJson(mdContent: string, filename: string): Process {
  const { data, content } = matter(mdContent)
  
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
  
  // Extract tips sections
  const tips = extractTipsFromContent(content)
  
  return {
    id: path.basename(filename, '.md'),
    title: data.title || '',
    category: data.category || 'Other',
    description: data.description || '',
    toolsInvolved: data.toolsInvolved || [],
    steps: data.steps || [],
    status: data.status || 'Active',
    tips,
    addedOn
  }
}

// Main conversion process
const processesDir = path.join(process.cwd(), 'src/content/processes')
const outputFile = path.join(process.cwd(), 'src/data/processes.json')

const processes = fs
  .readdirSync(processesDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    console.log(`Converting ${file}...`)
    const content = fs.readFileSync(path.join(processesDir, file), 'utf-8')
    return convertMarkdownToJson(content, file)
  })

const output = {
  processes: processes.sort((a, b) => {
    if (!a.addedOn || !b.addedOn) return 0
    return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
  })
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))
console.log(`Converted ${processes.length} processes to JSON format`) 