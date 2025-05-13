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
import { Tool, ToolCategory, UseCase } from "@/types"
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
    category: "",
    iconUrl: "",
    link: "",
    status: "",
    acquired: new Date().toISOString().slice(0, 10), // default to today, format YYYY-MM-DD
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
        iconUrl: tool.iconUrl || "",
        link: tool.link || "",
        status: tool.status,
        acquired: new Date(tool.acquired).toISOString().slice(0, 10),
      })
      setUseCases(tool.useCases?.map(uc => ({
        title: uc.title,
        description: uc.description || "",
        items: (uc as any).items || [""]
      })) || [{ title: "", description: "", items: [""] }])
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
      // Convert the date to ISO-8601 format with time
      const acquiredDate = new Date(formData.acquired + 'T00:00:00.000Z').toISOString()
      const requestBody = { 
        ...formData, 
        acquired: acquiredDate,
        useCases: useCases.map(uc => ({
          title: uc.title,
          description: uc.description,
          items: uc.items
        })), 
        createdBy: "Jason" 
      }

      const url = tool ? `/api/tools/${tool.id}` : "/api/tools"
      const method = tool ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error(`Failed to ${tool ? 'update' : 'create'} tool`)
      const updated = await response.json()

      if (onSave) {
        onSave(updated)
      } else {
        // Reset form if creating new tool
        setFormData({
          name: "",
          description: "",
          category: "",
          iconUrl: "",
          link: "",
          status: "",
          acquired: new Date().toISOString().slice(0, 10),
        })
        setUseCases([{ title: "", description: "", items: [""] }])
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
            <Label htmlFor="iconUrl" className="text-base font-semibold">Icon URL</Label>
            <Input
              id="iconUrl"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-base font-semibold">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
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

          <div className="space-y-2">
            <Label htmlFor="acquired" className="text-base font-semibold">Acquired Date</Label>
            <Input
              id="acquired"
              type="date"
              value={formData.acquired}
              onChange={e => setFormData({ ...formData, acquired: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
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