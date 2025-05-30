"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProcessCategory, Process, Tool } from "@/types"
import { X, Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProcessFormProps {
  process?: Process
  onSave?: (process: Process) => void
  onCancel?: () => void
}

export function ProcessForm({ process, onSave, onCancel }: ProcessFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: [""],
    status: "",
    category: "",
    tools: [""],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableTools, setAvailableTools] = useState<Tool[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Fetch available tools
    const fetchTools = async () => {
      try {
        const baseUrl = window.location.origin
        const response = await fetch(`${baseUrl}/api/tools`)
        if (response.ok) {
          const tools = await response.json()
          setAvailableTools(tools)
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error)
      }
    }
    fetchTools()
  }, [])

  useEffect(() => {
    if (process) {
      setFormData({
        title: process.title,
        description: process.description,
        steps: process.steps,
        status: process.status,
        category: process.category,
        tools: process.tools,
      })
    }
  }, [process])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    console.log('Form submission started with data:', formData)
    
    try {
      const url = process ? `http://localhost:3001/api/processes/${process.id}` : "http://localhost:3001/api/processes"
      const method = process ? "PUT" : "POST"
      console.log('Making request to:', url, 'with method:', method)
      
      // Filter out empty steps and tools
      const filteredData = {
        ...formData,
        steps: formData.steps.filter(step => step.trim() !== ""),
        tools: formData.tools.filter(tool => tool.trim() !== ""),
      }
      
      // Validate required fields
      if (!filteredData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!filteredData.description.trim()) {
        throw new Error("Description is required")
      }
      if (filteredData.steps.length === 0) {
        throw new Error("At least one step is required")
      }
      if (filteredData.tools.length === 0) {
        throw new Error("At least one tool is required")
      }
      if (!filteredData.status) {
        throw new Error("Status is required")
      }
      if (!filteredData.category) {
        throw new Error("Category is required")
      }
      
      // Format data according to backend schema
      const submitData = {
        ...filteredData,
        acquired: new Date().toISOString(),
        createdBy: "admin" // TODO: Replace with actual user ID
      }
      
      console.log('Submitting data:', submitData)
      
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(submitData),
      })
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        if (errorData.errors) {
          const errorMessages = errorData.errors.map((err: { path: string; message: string }) => 
            `${err.path}: ${err.message}`
          ).join('\n')
          throw new Error(errorMessages)
        }
        throw new Error(errorData.message || `Failed to ${process ? "update" : "create"} process`)
      }
      
      const savedProcess = await response.json()
      console.log('Successfully saved process:', savedProcess)
      
      if (onSave) {
        onSave(savedProcess)
      } else {
        // Reset form if not in edit mode
        setFormData({
          title: "",
          description: "",
          steps: [""],
          status: "",
          category: "",
          tools: [""],
        })
      }
    } catch (error) {
      console.error(`Error ${process ? "updating" : "creating"} process:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${process ? "update" : "create"} process`)
    } finally {
      setSaving(false)
    }
  }

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ""] })
  }

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
    setFormData({ ...formData, steps: newSteps })
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const addTool = (toolName: string) => {
    if (!formData.tools.includes(toolName)) {
      setFormData({ ...formData, tools: [...formData.tools, toolName] })
    }
  }

  const removeTool = (toolName: string) => {
    setFormData({ ...formData, tools: formData.tools.filter(t => t !== toolName) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{process ? "Edit Process" : "Add New Process"}</h2>
        <p className="text-muted-foreground">
          {process ? "Update the process details and steps below." : "Create a new process and document its steps."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProcessCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-base font-semibold">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tools" className="text-base font-semibold">Tools</Label>
            <Select onValueChange={addTool}>
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue placeholder="Select a tool" />
              </SelectTrigger>
              <SelectContent>
                {availableTools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.title}>
                    {tool.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeTool(tool)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Steps</Label>
          <Button 
            type="button" 
            onClick={addStep}
            variant="outline"
            className="rounded-full"
          >
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {formData.steps.map((step, index) => (
            <div key={index} className="p-4 border-2 border-border rounded-xl bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  className="h-11 bg-primary/10 border-2 border-primary font-semibold text-primary focus:ring-2 focus:ring-primary transition"
                  required
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeStep(index)} 
                  disabled={formData.steps.length === 1}
                  className="text-red-500 hover:text-red-600 hover:bg-red-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button 
            type="button"
            onClick={onCancel}
            variant="outline"
            className="rounded-full px-6 py-2 text-lg"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          className="rounded-full px-6 py-2 text-lg bg-primary hover:bg-primary/90"
          disabled={saving}
        >
          {saving ? "Saving..." : process ? "Save Changes" : "Add Process"}
        </Button>
      </div>
    </form>
  )
} 