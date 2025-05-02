"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Process } from "@/types"

export function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    try {
      const response = await fetch("/api/processes")
      if (!response.ok) throw new Error("Failed to fetch processes")
      const data = await response.json()
      setProcesses(data)
    } catch (error) {
      console.error("Error fetching processes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/processes/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete process")
      setProcesses(processes.filter((process) => process.id !== id))
    } catch (error) {
      console.error("Error deleting process:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Processes List</h2>
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
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {process.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
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
    </div>
  )
} 