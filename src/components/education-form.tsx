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
import { Education, DegreeType } from "@/types"
import { X } from "lucide-react"

interface EducationFormProps {
  education?: Education
  onSave?: (education: Education) => void
  onCancel?: () => void
}

export function EducationForm({ education, onSave, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    degreeType: "Bachelor" as DegreeType,
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    gpa: "",
    courses: [""],
    activities: [""],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution,
        degree: education.degree,
        degreeType: education.degreeType,
        field: education.field,
        location: education.location,
        startDate: education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : "",
        endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
        gpa: education.gpa?.toString() || "",
        courses: education.courses && education.courses.length > 0 ? education.courses : [""],
        activities: education.activities && education.activities.length > 0 ? education.activities : [""],
      })
    }
  }, [education])

  const handleArrayChange = (field: 'courses' | 'activities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'courses' | 'activities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'courses' | 'activities', index: number) => {
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
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        courses: formData.courses.filter(c => c.trim() !== "").length > 0
          ? formData.courses.filter(c => c.trim() !== "")
          : undefined,
        activities: formData.activities.filter(a => a.trim() !== "").length > 0
          ? formData.activities.filter(a => a.trim() !== "")
          : undefined,
      }

      const url = education ? `/api/education/${education.id}` : `/api/education`
      const method = education ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${education ? 'update' : 'create'} education`)
      }

      const saved = await response.json()
      if (onSave) {
        onSave(saved)
      } else {
        setFormData({
          institution: "",
          degree: "",
          degreeType: "Bachelor",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
          courses: [""],
          activities: [""],
        })
        window.dispatchEvent(new Event('educationCreated'))
      }
    } catch (error) {
      console.error(`Error ${education ? 'updating' : 'creating'} education:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${education ? 'update' : 'create'} education`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{education ? 'Edit Education' : 'Add New Education'}</h2>
        <p className="text-muted-foreground">{education ? 'Update the education details below.' : 'Create a new education entry.'}</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degreeType">Degree Type</Label>
            <Select
              value={formData.degreeType}
              onValueChange={(value) => setFormData({ ...formData, degreeType: value as DegreeType })}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DegreeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
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
            <Label htmlFor="gpa">GPA (0-4 scale, optional)</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              className="h-11 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Courses (Optional)</Label>
          <Button type="button" onClick={() => addArrayItem('courses')} variant="outline" className="rounded-full">
            Add Course
          </Button>
        </div>
        <div className="space-y-2">
          {formData.courses.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange('courses', idx, e.target.value)}
                className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('courses', idx)}
                disabled={formData.courses.length === 1}
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
          <Label className="text-base font-semibold">Activities (Optional)</Label>
          <Button type="button" onClick={() => addArrayItem('activities')} variant="outline" className="rounded-full">
            Add Activity
          </Button>
        </div>
        <div className="space-y-2">
          {formData.activities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange('activities', idx, e.target.value)}
                className="h-9 bg-background border border-border focus:ring-2 focus:ring-primary transition"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('activities', idx)}
                disabled={formData.activities.length === 1}
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
          {saving ? "Saving..." : education ? "Save Changes" : "Add Education"}
        </Button>
      </div>
    </form>
  )
}

