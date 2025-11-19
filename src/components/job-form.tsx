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
import { Job, JobType } from "@/types"
import { X } from "lucide-react"

interface JobFormProps {
  job?: Job
  onSave?: (job: Job) => void
  onCancel?: () => void
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: JobType.FullTime,
    startDate: "",
    endDate: "",
    description: "",
    responsibilities: [""],
    technologies: [""],
    achievements: [""],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : "",
        endDate: job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : "",
        description: job.description,
        responsibilities: job.responsibilities.length > 0 ? job.responsibilities : [""],
        technologies: job.technologies.length > 0 ? job.technologies : [""],
        achievements: job.achievements && job.achievements.length > 0 ? job.achievements : [""],
      })
    }
  }, [job])

  const handleArrayChange = (field: 'responsibilities' | 'technologies' | 'achievements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'responsibilities' | 'technologies' | 'achievements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'responsibilities' | 'technologies' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const requestBody = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        responsibilities: formData.responsibilities.filter(r => r.trim() !== ""),
        technologies: formData.technologies.filter(t => t.trim() !== ""),
        achievements: formData.achievements.filter(a => a.trim() !== "").length > 0 
          ? formData.achievements.filter(a => a.trim() !== "") 
          : undefined,
      }

      const url = job ? `/api/jobs/${job.id}` : `/api/jobs`
      const method = job ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${job ? 'update' : 'create'} job`)
      }

      const saved = await response.json()
      if (onSave) {
        onSave(saved)
      } else {
        setFormData({
          title: "",
          company: "",
          location: "",
          type: JobType.FullTime,
          startDate: "",
          endDate: "",
          description: "",
          responsibilities: [""],
          technologies: [""],
          achievements: [""],
        })
        window.dispatchEvent(new Event('jobCreated'))
      }
    } catch (error) {
      console.error(`Error ${job ? 'updating' : 'creating'} job:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${job ? 'update' : 'create'} job`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{job ? 'Edit Job' : 'Add New Job'}</h2>
        <p className="text-muted-foreground">{job ? 'Update the job details below.' : 'Create a new job entry.'}</p>
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
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as JobType })}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(JobType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (leave empty if current)</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Responsibilities</Label>
          <Button type="button" onClick={() => addArrayItem('responsibilities')} variant="outline" className="rounded-full">
            Add Responsibility
          </Button>
        </div>
        <div className="space-y-2">
          {formData.responsibilities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange('responsibilities', idx, e.target.value)}
                className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('responsibilities', idx)}
                disabled={formData.responsibilities.length === 1}
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Technologies</Label>
          <Button type="button" onClick={() => addArrayItem('technologies')} variant="outline" className="rounded-full">
            Add Technology
          </Button>
        </div>
        <div className="space-y-2">
          {formData.technologies.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange('technologies', idx, e.target.value)}
                className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('technologies', idx)}
                disabled={formData.technologies.length === 1}
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Achievements (Optional)</Label>
          <Button type="button" onClick={() => addArrayItem('achievements')} variant="outline" className="rounded-full">
            Add Achievement
          </Button>
        </div>
        <div className="space-y-2">
          {formData.achievements.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange('achievements', idx, e.target.value)}
                className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('achievements', idx)}
                disabled={formData.achievements.length === 1}
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 md:pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-full px-4 sm:px-6 py-2 text-base sm:text-lg w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" className="rounded-full px-4 sm:px-6 py-2 text-base sm:text-lg bg-primary hover:bg-primary/90 disabled:opacity-50" disabled={saving}>
          {saving ? "Saving..." : job ? "Save Changes" : "Add Job"}
        </Button>
      </div>
    </form>
  )
}

