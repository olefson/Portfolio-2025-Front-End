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

function getProcesses(): Process[] {
  const processesPath = path.join(process.cwd(), "src/data/processes.json")
  const processesData = JSON.parse(fs.readFileSync(processesPath, "utf8"))
  return processesData.processes
}

async function getProcess(id: string): Promise<Process | null> {
  const processes = getProcesses()
  return processes.find(process => process.id === id) || null
}

export async function generateStaticParams() {
  const processes = getProcesses()
  return processes.map((process) => ({
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
