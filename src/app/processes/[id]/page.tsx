import fs from "fs"
import path from "path"
import { Process } from "@/types"
import { notFound } from "next/navigation"
import { ProcessCard } from "@/components/ui/process-card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    id: string
  }>  
}

async function getProcess(id: string): Promise<Process | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:3001"}/api/processes/${id}`)
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching process from database:', error)
    // Fallback to static data
    const processesPath = path.join(process.cwd(), "src/data/processes.json")
    const processesData = JSON.parse(fs.readFileSync(processesPath, "utf8"))
    return processesData.processes.find((process: Process) => process.id === id) || null
  }
}

export async function generateStaticParams() {
  try {
    // Try to get processes from database
    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:3001"}/api/processes`)
    if (response.ok) {
      const processes = await response.json()
      return processes.map((process: Process) => ({
        id: process.id,
      }))
    }
  } catch (error) {
    console.error('Error fetching processes for static params:', error)
  }
  
  // Fallback to static data
  const processesPath = path.join(process.cwd(), "src/data/processes.json")
  const processesData = JSON.parse(fs.readFileSync(processesPath, "utf8"))
  return processesData.processes.map((process: Process) => ({
    id: process.id,
  }))
}

export default async function ProcessPage({ params }: PageProps) {
  const { id } = await params
  const process = await getProcess(id)
  
  if (!process) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/processes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Processes
        </Link>
        <ProcessCard {...process} showContent />
      </div>
    </main>
  )
}

export const revalidate = false // static 