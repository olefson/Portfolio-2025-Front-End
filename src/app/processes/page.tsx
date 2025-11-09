"use client"

import { useEffect, useState } from "react"
import { TabFilter } from "@/components/ui/tab-filter"
import { Process } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import DarkVeil from "@/components/ui/dark-veil"
import CountUp from "@/components/CountUp"
import GradientText from "@/components/GradientText"

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([])

  useEffect(() => {
    fetch('/api/processes')
      .then(res => res.json())
      .then(data => {
        setProcesses(data)
      })
      .catch(error => {
        console.error('Error fetching processes:', error)
        // Fallback to static data if database is unavailable
        fetch('/api/dev/content')
          .then(res => res.json())
          .then(data => {
            setProcesses(data.processes)
          })
      })
  }, [])

  return (
    <div className="relative min-h-screen">
      <DarkVeil className="fixed inset-0" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white mb-2">Processes</h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              My systematic approaches to{' '}
              <GradientText className="!inline-flex !max-w-none">
                <CountUp 
                  to={processes.length} 
                  from={0}
                  duration={1.5}
                  startWhen={processes.length > 0}
                />
              </GradientText>
              {' '}common tasks and workflows.
            </p>
            <div className="pt-2">
              <Link href="/tools">
                <Button variant="outline" className="inline-flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View My Tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <TabFilter items={processes} type="process" />
        </div>
      </div>
    </div>
  )
} 