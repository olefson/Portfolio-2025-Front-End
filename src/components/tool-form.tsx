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
import { Tool, ToolCategory } from "@/types"
import { X } from "lucide-react"

interface ToolFormProps {
  tool?: Tool
  onSave?: (tool: Tool) => void
  onCancel?: () => void
}

interface FormUseCase {
  title: string
  description: string
  items: string[]
}

export function ToolForm({ tool, onSave, onCancel }: ToolFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Other",
    status: "Plan to Try",
    url: "",
    iconUrl: "",
    howToUse: {},
    caveats: {},
    tips: {},
    useCases: {}
  })
  const [useCases, setUseCases] = useState<FormUseCase[]>([
    { title: "", description: "", items: [""] }
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        status: tool.status,
        url: tool.link || "",
        iconUrl: tool.iconUrl || "",
        howToUse: tool.howToUse || {},
        caveats: tool.caveats || {},
        tips: tool.tips || {},
        useCases: tool.useCases || {}
      })
      setUseCases(tool.useCases ? JSON.parse(JSON.stringify(tool.useCases)) : [{ title: "", description: "", items: [""] }])
    }
  }, [tool])

  const handleUseCaseChange = (idx: number, field: string, value: string) => {
    setUseCases(prev => prev.map((uc, i) => i === idx ? { ...uc, [field]: value } : uc))
  }

  const handleUseCaseItemChange = (ucIdx: number, itemIdx: number, value: string) => {
    setUseCases(prev => prev.map((uc, i) =>
      i === ucIdx ? { ...uc, items: uc.items.map((item, j) => j === itemIdx ? value : item) } : uc
    ))
  }

  const addUseCase = () => setUseCases(prev => [...prev, { title: "", description: "", items: [""] }])
  const removeUseCase = (idx: number) => setUseCases(prev => prev.filter((_, i) => i !== idx))
  const addUseCaseItem = (ucIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: [...uc.items, ""] } : uc
  ))
  const removeUseCaseItem = (ucIdx: number, itemIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: uc.items.filter((_, j) => j !== itemIdx) } : uc
  ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      console.log("Form submission started")
      const requestBody = { 
        ...formData,
        useCases: useCases,
        howToUse: {},
        caveats: {},
        tips: {}
      }
      console.log("Request body:", requestBody)

      const url = tool ? `/api/tools/${tool.id}` : `/api/tools`
      const method = tool ? "PUT" : "POST"
      console.log("Making request to:", url, "with method:", method)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || `Failed to ${tool ? 'update' : 'create'} tool`)
      }
      const updated = await response.json()
      console.log("Success response:", updated)

      if (onSave) {
        onSave(updated)
      } else {
        // Reset form if creating new tool
        setFormData({
          name: "",
          description: "",
          category: "Other",
          status: "Plan to Try",
          url: "",
          iconUrl: "",
          howToUse: {},
          caveats: {},
          tips: {},
          useCases: {}
        })
        setUseCases([{ title: "", description: "", items: [""] }])
        // Dispatch event to notify tool list
        window.dispatchEvent(new Event('toolCreated'))
      }
    } catch (error) {
      console.error(`Error ${tool ? 'updating' : 'creating'} tool:`, error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{tool ? 'Edit Tool' : 'Add New Tool'}</h2>
        <p className="text-muted-foreground">{tool ? 'Update the tool details and use cases below.' : 'Create a new tool and add its use cases.'}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {Object.values(ToolCategory).map((category) => (
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
            <Label htmlFor="url" className="text-base font-semibold">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconUrl" className="text-base font-semibold">Icon URL</Label>
            <Input
              id="iconUrl"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              placeholder="https://icons8.com/icon/example"
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
            <p className="text-sm text-muted-foreground">
              Optional: Link to an icon for this tool (e.g., from icons8.com)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-base font-semibold">Status</Label>
            <select
              id="status"
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="Plan to Try">Plan to Try</option>
              <option value="Using">Using</option>
              <option value="Archived">Archived</option>
              <option value="Building">Building</option>
              <option value="Plan to Build">Plan to Build</option>
              <option value="Trying">Trying</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Use Cases</Label>
          <Button 
            type="button" 
            onClick={addUseCase}
            variant="outline"
            className="rounded-full"
          >
            Add Use Case
          </Button>
        </div>

        <div className="space-y-4">
          {useCases.map((uc, ucIdx) => (
            <div key={ucIdx} className="p-4 border-2 border-border rounded-xl bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Use case title"
                  value={uc.title}
                  onChange={e => handleUseCaseChange(ucIdx, "title", e.target.value)}
                  className="h-11 bg-primary/10 border-2 border-primary font-semibold text-primary focus:ring-2 focus:ring-primary transition"
                  required
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeUseCase(ucIdx)} 
                  disabled={useCases.length === 1}
                  className="text-red-500 hover:text-red-600 hover:bg-red-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Use case description"
                  value={uc.description}
                  onChange={e => handleUseCaseChange(ucIdx, "description", e.target.value)}
                  className="min-h-[60px] bg-background border border-border focus:ring-2 focus:ring-primary transition"
                />
                {uc.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <Input
                      placeholder="Use case item"
                      value={item}
                      onChange={e => handleUseCaseItemChange(ucIdx, itemIdx, e.target.value)}
                      className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeUseCaseItem(ucIdx, itemIdx)} 
                      disabled={uc.items.length === 1}
                      className="text-red-500 hover:text-red-600 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addUseCaseItem(ucIdx)}
                  className="rounded-full"
                >
                  Add Item
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
            variant="outline"
            onClick={onCancel}
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
          {saving ? "Saving..." : tool ? "Save Changes" : "Add Tool"}
        </Button>
      </div>
    </form>
  )
} 