"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Process } from "@/types"
import { Modal, ModalContent, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/modal"
import { ProcessForm } from "@/components/process-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Process | undefined>(undefined)
  const [editingLoading, setEditingLoading] = useState(false)

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    try {
      setError(null)
      console.log("Fetching processes from: /api/processes")
      const response = await fetch("/api/processes")
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response data:", errorData)
        throw new Error(errorData.error || "Failed to fetch processes")
      }
      const data = await response.json()
      console.log("Fetched processes:", data)
      setProcesses(data)
    } catch (error) {
      console.error("Error fetching processes:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch processes")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = async (id: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/processes/${id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch process")
      }
      const process = await response.json()
      setEditing(process)
    } catch (error) {
      console.error("Error fetching process:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch process")
    } finally {
      setEditingLoading(false)
    }
  }

  const handleEditSave = (updatedProcess: Process) => {
    setProcesses(processes.map(p => p.id === updatedProcess.id ? updatedProcess : p))
    setEditing(undefined)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/processes/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete process")
      }
      setProcesses(processes.filter((process) => process.id !== id))
    } catch (error) {
      console.error("Error deleting process:", error)
      setError(error instanceof Error ? error.message : "Failed to delete process")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading processes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={fetchProcesses}
        >
          Try Again
        </Button>
      </Alert>
    )
  }

  if (processes.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No processes found. Create your first process using the form.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {processes.map((process) => (
          <div
            key={process.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{process.title}</h3>
              <p className="text-sm text-muted-foreground">{process.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {process.category}
                </span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {process.status}
                </span>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground">
                  {process.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditClick(process.id)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(process.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onOpenChange={open => !open && setEditing(undefined)}>
        <ModalContent>
          {editingLoading ? (
            <div className="p-8 text-center">Loading process details...</div>
          ) : (
            <ProcessForm
              process={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(undefined)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
} 