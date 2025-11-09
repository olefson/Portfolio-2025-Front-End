"use client"

import React, { useEffect, useState } from "react"
import { TabFilter } from "@/components/ui/tab-filter"
import { Tool } from "@/types"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import DarkVeil from "@/components/ui/dark-veil"
import CountUp from "@/components/CountUp"
import GradientText from "@/components/GradientText"

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        setTools(data)
      })
      .catch(error => {
        console.error('Error fetching tools:', error)
      })
  }, [])

  // Filter tools based on search term
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <DarkVeil className="fixed inset-0" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white mb-2">Tools</h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              A curated collection of{' '}
              <GradientText className="!inline-flex !max-w-none">
                <CountUp 
                  to={tools.length} 
                  from={0}
                  duration={1.5}
                  startWhen={tools.length > 0}
                />
              </GradientText>
              {' '}tools I use to enhance productivity and creativity.
            </p>
            <div className="pt-2">
              <Link href="/processes">
                <Button variant="outline" className="inline-flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View My Processes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-sm mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input 
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/20"
              />
            </div>
          </div>

          <TabFilter items={filteredTools} type="tool" />
        </div>
      </div>
    </div>
  )
} 