"use client"

import React, { useEffect, useState } from "react"
import { TabFilter } from "@/components/ui/tab-filter"
import { Tool } from "@/types"
import { Input } from "@/components/ui/input"

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch('/api/dev/content')
      .then(res => res.json())
      .then(data => {
        setTools(data.tools)
      })
  }, [])

  // Filter tools based on search term
  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Tools</h1>
          <p className="text-lg text-muted-foreground">A curated collection of 101 tools I use to enhance productivity and creativity.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-sm mx-auto">
          <Input 
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <TabFilter items={filteredTools} type="tool" />
      </div>
    </main>
  )
} 