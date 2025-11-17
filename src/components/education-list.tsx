"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Education } from "@/types"
import { Modal, ModalContent } from "@/components/ui/modal"
import { EducationForm } from "@/components/education-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EducationList() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Education | undefined>(undefined)
  const [editingLoading, setEditingLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchEducation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/education')
      if (!response.ok) throw new Error("Failed to fetch education")
      const data = await response.json()
      setEducation(data)
    } catch (error) {
      console.error("Error fetching education:", error)
      setError("Failed to load education")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleEducationCreated = () => {
      fetchEducation()
    }
    window.addEventListener('educationCreated', handleEducationCreated)
    return () => window.removeEventListener('educationCreated', handleEducationCreated)
  }, [])

  useEffect(() => {
    fetchEducation()
  }, [])

  const handleEditClick = async (educationId: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/education/${educationId}`)
      if (!response.ok) throw new Error("Failed to fetch education")
      const edu = await response.json()
      setEditing(edu)
    } catch (error) {
      console.error("Error fetching education:", error)
      setError("Failed to load education details")
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return
    try {
      const response = await fetch(`/api/education/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete education")
      await fetchEducation()
    } catch (error) {
      console.error("Error deleting education:", error)
      setError("Failed to delete education")
    }
  }

  const handleEditSave = (updated: Education) => {
    setEducation(education.map(e => e.id === updated.id ? updated : e))
    setEditing(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading education...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchEducation}>
          Try Again
        </Button>
      </Alert>
    )
  }

  const filteredEducation = education.filter(edu =>
    edu.institution.toLowerCase().includes(search.toLowerCase()) ||
    edu.degree.toLowerCase().includes(search.toLowerCase()) ||
    edu.field.toLowerCase().includes(search.toLowerCase())
  )

  if (filteredEducation.length === 0 && !search) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No education records found. Create your first education entry using the form.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search education..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-lg px-4 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
        />
      </div>
      <div className="grid gap-4">
        {filteredEducation.map((edu) => {
          const startDate = new Date(edu.startDate).toLocaleDateString()
          const endDate = edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"
          return (
            <div
              key={edu.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-lg">{edu.degree}</h3>
                <p className="text-sm font-semibold text-primary">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.degreeType} in {edu.field}</p>
                <p className="text-sm text-muted-foreground">{edu.location}</p>
                <p className="text-sm text-muted-foreground mt-1">{startDate} - {endDate}</p>
                {edu.gpa && (
                  <p className="text-sm mt-1">GPA: {edu.gpa.toFixed(2)}</p>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Courses:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {edu.courses.slice(0, 5).map((course, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                          {course}
                        </span>
                      ))}
                      {edu.courses.length > 5 && (
                        <span className="text-xs text-muted-foreground">+{edu.courses.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}
                {edu.activities && edu.activities.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Activities:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {edu.activities.slice(0, 3).map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                      {edu.activities.length > 3 && (
                        <li className="text-xs">+{edu.activities.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(edu.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(edu.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredEducation.length === 0 && search && (
        <div className="text-center p-8 text-muted-foreground">
          No education records match your search.
        </div>
      )}

      <Modal open={!!editing} onOpenChange={open => !open && setEditing(undefined)}>
        <ModalContent>
          {editingLoading ? (
            <div className="p-8 text-center">Loading education details...</div>
          ) : editing && (
            <EducationForm
              education={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(undefined)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

