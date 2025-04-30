import fs from "fs"
import path from "path"
import { Tool } from "@/types"
import { notFound } from "next/navigation"
import { ToolCard } from "@/components/ui/tool-card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    id: string
  }>  
}

function getTools(): Tool[] {
  const toolsPath = path.join(process.cwd(), "src/data/tools.json")
  const toolsData = JSON.parse(fs.readFileSync(toolsPath, "utf8"))
  return toolsData.tools
}

async function getTool(id: string): Promise<Tool | null> {
  const tools = getTools()
  return tools.find(tool => tool.id === id) || null
}

export async function generateStaticParams() {
  const tools = getTools()
  return tools.map((tool) => ({
    id: tool.id,
  }))
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params
  const tool = await getTool(id)
  
  if (!tool) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/tools"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Tools
        </Link>
        <ToolCard tool={tool} showContent />
      </div>
    </main>
  )
}

export const revalidate = false // static 