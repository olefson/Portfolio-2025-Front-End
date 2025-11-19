"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tool } from "@/types"
import { Modal, ModalContent } from "@/components/ui/modal"
import { ToolForm } from "@/components/tool-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ToolList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Tool | undefined>(undefined)
  const [editingLoading, setEditingLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchTools = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tools')
      if (!response.ok) throw new Error("Failed to fetch tools")
      const data = await response.json()
      console.log("Fetched tools:", data)
      setTools(data)
    } catch (error) {
      console.error("Error fetching tools:", error)
      setError("Failed to load tools")
    } finally {
      setLoading(false)
    }
  }

  // Add event listener for tool creation
  useEffect(() => {
    const handleToolCreated = () => {
      console.log("Tool created, refreshing list...")
      fetchTools()
    }

    window.addEventListener('toolCreated', handleToolCreated)
    return () => window.removeEventListener('toolCreated', handleToolCreated)
  }, [])

  useEffect(() => {
    fetchTools()
  }, [])

  const handleEditClick = async (toolId: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/tools/${toolId}`)
      if (!response.ok) throw new Error("Failed to fetch tool")
      const tool = await response.json()
      setEditing(tool)
    } catch (error) {
      console.error("Error fetching tool:", error)
      setError("Failed to load tool details")
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return
    try {
      const response = await fetch(`/api/tools/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete tool")
      await fetchTools()
    } catch (error) {
      console.error("Error deleting tool:", error)
      setError("Failed to delete tool")
    }
  }

  const handleEditSave = (updated: Tool) => {
    setTools(tools.map(t => t.id === updated.id ? updated : t))
    setEditing(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading tools...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={fetchTools}
        >
          Try Again
        </Button>
      </Alert>
    )
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredTools.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No tools found. Create your first tool using the form.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-lg px-4 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
        />
      </div>
      <div className="grid gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
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
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Use Cases:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {tool.useCases.map((useCase, index) => (
                      <li key={index}>{useCase.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditClick(tool.id)}
              >
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

      <Modal open={!!editing} onOpenChange={open => !open && setEditing(undefined)}>
        <ModalContent>
          {editingLoading ? (
            <div className="p-8 text-center">Loading tool details...</div>
          ) : editing && (
            <ToolForm
              tool={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(undefined)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
} 