"use client"

import React, { useEffect, useState } from "react"
import { TabFilter } from "@/components/ui/tab-filter"
import { Tool } from "@/types"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch('http://localhost:3001/api/tools')
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
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Tools</h1>
          <p className="text-lg text-muted-foreground">A curated collection of 101 tools I use to enhance productivity and creativity.</p>
          <Link href="/processes">
            <Button variant="outline" className="inline-flex items-center gap-2">
              View My Processes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-sm mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        <TabFilter items={filteredTools} type="tool" />
      </div>
    </main>
  )
} 