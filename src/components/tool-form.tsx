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
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      })
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
        <Input
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          placeholder="e.g., Plan to Try, Using, Archived"
        />
      </div>
      <Button type="submit">Add Tool</Button>
    </form>
  )
} 