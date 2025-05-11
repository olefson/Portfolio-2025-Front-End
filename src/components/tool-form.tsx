"use client"

import { useState } from "react"
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
import { ToolCategory } from "@/types"

export function ToolForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    iconUrl: "",
    link: "",
    status: "",
    acquired: new Date().toISOString().slice(0, 10), // default to today, format YYYY-MM-DD
  })
  const [useCases, setUseCases] = useState([
    { title: "", items: [""] }
  ])

  const handleUseCaseChange = (idx: number, field: string, value: string) => {
    setUseCases(prev => prev.map((uc, i) => i === idx ? { ...uc, [field]: value } : uc))
  }

  const handleUseCaseItemChange = (ucIdx: number, itemIdx: number, value: string) => {
    setUseCases(prev => prev.map((uc, i) =>
      i === ucIdx ? { ...uc, items: uc.items.map((item, j) => j === itemIdx ? value : item) } : uc
    ))
  }

  const addUseCase = () => setUseCases(prev => [...prev, { title: "", items: [""] }])
  const removeUseCase = (idx: number) => setUseCases(prev => prev.filter((_, i) => i !== idx))
  const addUseCaseItem = (ucIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: [...uc.items, ""] } : uc
  ))
  const removeUseCaseItem = (ucIdx: number, itemIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: uc.items.filter((_, j) => j !== itemIdx) } : uc
  ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const requestBody = { ...formData, useCases }
    console.log('Submitting tool:', requestBody)
    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) throw new Error("Failed to create tool")
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        iconUrl: "",
        link: "",
        status: "",
        acquired: new Date().toISOString().slice(0, 10),
      })
      setUseCases([{ title: "", items: [""] }])
    } catch (error) {
      console.error("Error creating tool:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Add New Tool</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
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
      <div className="space-y-2">
        <Label htmlFor="iconUrl">Icon URL</Label>
        <Input
          id="iconUrl"
          value={formData.iconUrl}
          onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="input w-full rounded-xl px-4 py-2 bg-muted/40 border border-border focus:ring-2 focus:ring-primary transition"
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
        <Label htmlFor="acquired">Acquired Date</Label>
        <Input
          id="acquired"
          type="date"
          value={formData.acquired}
          onChange={e => setFormData({ ...formData, acquired: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Use Cases</Label>
        {useCases.map((uc, ucIdx) => (
          <div key={ucIdx} className="border p-2 mb-2 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Use case title"
                value={uc.title}
                onChange={e => handleUseCaseChange(ucIdx, "title", e.target.value)}
                className="flex-1"
                required
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => removeUseCase(ucIdx)} disabled={useCases.length === 1}>Remove</Button>
            </div>
            {uc.items.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center gap-2 mb-1">
                <Input
                  placeholder="Use case item"
                  value={item}
                  onChange={e => handleUseCaseItemChange(ucIdx, itemIdx, e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeUseCaseItem(ucIdx, itemIdx)} disabled={uc.items.length === 1}>Remove</Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={() => addUseCaseItem(ucIdx)}>Add Item</Button>
          </div>
        ))}
        <Button type="button" onClick={addUseCase}>Add Use Case</Button>
      </div>
      <Button type="submit">Add Tool</Button>
    </form>
  )
} 