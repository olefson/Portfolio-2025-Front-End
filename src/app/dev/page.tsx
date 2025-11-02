"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tool, Process } from "@/types"

export default function DevPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  // Load data and checked state on mount
  useEffect(() => {
    // Load checked state from localStorage
    const savedState = localStorage.getItem('devPageCheckedItems')
    if (savedState) {
      setCheckedItems(JSON.parse(savedState))
    }

    // Fetch tools and processes
    fetch('/api/dev/content')
      .then(res => res.json())
      .then(data => {
        setTools(data.tools)
        setProcesses(data.processes)
      })
  }, [])

  // Save to localStorage whenever checked state changes
  useEffect(() => {
    localStorage.setItem('devPageCheckedItems', JSON.stringify(checkedItems))
  }, [checkedItems])

  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: checked
    }))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Development Tasks</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Tools to Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-4">
                  <Checkbox 
                    id={`tool-${tool.id}`}
                    checked={checkedItems[`tool-${tool.id}`] || false}
                    onCheckedChange={(checked) => 
                      handleCheckChange(`tool-${tool.id}`, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`tool-${tool.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Link 
                      href={`/tools/${tool.id}`}
                      className="hover:underline text-blue-500"
                    >
                      {tool.name}
                    </Link>
                    <span className="ml-2 text-muted-foreground">
                      ({tool.category})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processes to Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processes.map((process) => (
                <div key={process.id} className="flex items-center space-x-4">
                  <Checkbox 
                    id={`process-${process.id}`}
                    checked={checkedItems[`process-${process.id}`] || false}
                    onCheckedChange={(checked) => 
                      handleCheckChange(`process-${process.id}`, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`process-${process.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Link 
                      href={`/processes/${process.id}`}
                      className="hover:underline text-blue-500"
                    >
                      {process.title}
                    </Link>
                    <span className="ml-2 text-muted-foreground">
                      ({process.category})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 