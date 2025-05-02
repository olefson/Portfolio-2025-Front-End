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
import { ProcessCategory } from "@/types"

export function ProcessForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: [""],
    status: "",
    category: "",
    tools: [""],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to create process")
      // Reset form
      setFormData({
        title: "",
        description: "",
        steps: [""],
        status: "",
        category: "",
        tools: [""],
      })
    } catch (error) {
      console.error("Error creating process:", error)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Add New Process</h2>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <Label>Steps</Label>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeStep(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addStep}>
          Add Step
        </Button>
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
            {Object.values(ProcessCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          placeholder="e.g., Active, Archived, Draft"
        />
      </div>
      <Button type="submit">Add Process</Button>
    </form>
  )
} 