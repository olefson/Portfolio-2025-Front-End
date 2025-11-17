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
import { Diary } from "@/types"
import { X } from "lucide-react"

interface DiaryFormProps {
  diary?: Diary
  onSave?: (diary: Diary) => void
  onCancel?: () => void
}

const commonTags = [
  "leisure", "work", "learning", "travel", "technology", "personal",
  "hobbies", "recreation", "entertainment", "professional", "career",
  "education", "study", "academic", "adventure", "food", "culture"
]

const commonMoods = [
  "excited", "reflective", "challenged", "grateful", "curious",
  "inspired", "accomplished", "motivated", "peaceful", "energetic"
]

export function DiaryForm({ diary, onSave, onCancel }: DiaryFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    tags: [] as string[],
    mood: "",
  })
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (diary) {
      setFormData({
        title: diary.title,
        content: diary.content,
        date: diary.date ? new Date(diary.date).toISOString().split('T')[0] : "",
        tags: diary.tags || [],
        mood: diary.mood || "",
      })
    }
  }, [diary])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) })
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (formData.tags.length === 0) {
        alert("Please add at least one tag")
        setSaving(false)
        return
      }

      const requestBody = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        mood: formData.mood || null,
      }

      const url = diary ? `/api/diary/${diary.id}` : `/api/diary`
      const method = diary ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${diary ? 'update' : 'create'} diary entry`)
      }

      const saved = await response.json()
      if (onSave) {
        onSave(saved)
      } else {
        setFormData({
          title: "",
          content: "",
          date: "",
          tags: [],
          mood: "",
        })
        setTagInput("")
        window.dispatchEvent(new Event('diaryCreated'))
      }
    } catch (error) {
      console.error(`Error ${diary ? 'updating' : 'creating'} diary entry:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${diary ? 'update' : 'create'} diary entry`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{diary ? 'Edit Diary Entry' : 'Add New Diary Entry'}</h2>
        <p className="text-muted-foreground">{diary ? 'Update the diary entry below.' : 'Create a new diary entry for chatbot personality.'}</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood (Optional)</Label>
            <Select
              value={formData.mood || undefined}
              onValueChange={(value) => setFormData({ ...formData, mood: value || "" })}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue placeholder="Select a mood (optional)" />
              </SelectTrigger>
              <SelectContent>
                {commonMoods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[150px] sm:min-h-[200px] bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Tags (Required - at least one)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
            <Button
              type="button"
              onClick={() => addTag(tagInput)}
              variant="outline"
              className="rounded-full"
            >
              Add Tag
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Click a tag below to add it quickly</p>
          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={formData.tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (formData.tags.includes(tag)) {
                    removeTag(tag)
                  } else {
                    addTag(tag)
                  }
                }}
                className="rounded-full"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {formData.tags.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Tags</Label>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 md:pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-full px-4 sm:px-6 py-2 text-base sm:text-lg w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" className="rounded-full px-4 sm:px-6 py-2 text-base sm:text-lg bg-primary hover:bg-primary/90 disabled:opacity-50" disabled={saving}>
          {saving ? "Saving..." : diary ? "Save Changes" : "Add Entry"}
        </Button>
      </div>
    </form>
  )
}

