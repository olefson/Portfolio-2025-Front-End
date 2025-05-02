"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tool } from "@/types"

export function ToolList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools")
      if (!response.ok) throw new Error("Failed to fetch tools")
      const data = await response.json()
      setTools(data)
    } catch (error) {
      console.error("Error fetching tools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tools/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete tool")
      setTools(tools.filter((tool) => tool.id !== id))
    } catch (error) {
      console.error("Error deleting tool:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tools List</h2>
      <div className="grid gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {tool.category}
                </span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {tool.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(tool.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 