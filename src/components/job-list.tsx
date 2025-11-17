"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Job } from "@/types"
import { Modal, ModalContent } from "@/components/ui/modal"
import { JobForm } from "@/components/job-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Job | undefined>(undefined)
  const [editingLoading, setEditingLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleJobCreated = () => {
      fetchJobs()
    }
    window.addEventListener('jobCreated', handleJobCreated)
    return () => window.removeEventListener('jobCreated', handleJobCreated)
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleEditClick = async (jobId: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (!response.ok) throw new Error("Failed to fetch job")
      const job = await response.json()
      setEditing(job)
    } catch (error) {
      console.error("Error fetching job:", error)
      setError("Failed to load job details")
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete job")
      await fetchJobs()
    } catch (error) {
      console.error("Error deleting job:", error)
      setError("Failed to delete job")
    }
  }

  const handleEditSave = (updated: Job) => {
    setJobs(jobs.map(j => j.id === updated.id ? updated : j))
    setEditing(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading jobs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchJobs}>
          Try Again
        </Button>
      </Alert>
    )
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  )

  if (filteredJobs.length === 0 && !search) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No jobs found. Create your first job using the form.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-lg px-4 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
        />
      </div>
      <div className="grid gap-4">
        {filteredJobs.map((job) => {
          const startDate = new Date(job.startDate).toLocaleDateString()
          const endDate = job.endDate ? new Date(job.endDate).toLocaleDateString() : "Present"
          return (
            <div
              key={job.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-lg">{job.title}</h3>
                <p className="text-sm font-semibold text-primary">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                <p className="text-sm text-muted-foreground mt-1">{startDate} - {endDate}</p>
                <p className="text-sm mt-2">{job.description}</p>
                {job.responsibilities.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Responsibilities:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {job.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                      {job.responsibilities.length > 3 && (
                        <li className="text-xs">+{job.responsibilities.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                {job.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(job.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredJobs.length === 0 && search && (
        <div className="text-center p-8 text-muted-foreground">
          No jobs match your search.
        </div>
      )}

      <Modal open={!!editing} onOpenChange={open => !open && setEditing(undefined)}>
        <ModalContent>
          {editingLoading ? (
            <div className="p-8 text-center">Loading job details...</div>
          ) : editing && (
            <JobForm
              job={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(undefined)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

