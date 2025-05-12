"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tool, ToolCategory } from "@/types"
import { Modal, ModalContent, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/modal"
import { ToolForm } from "@/components/tool-form"
import React from "react"
import { X } from "lucide-react"

function parseUseCases(raw: any): { title: string; items?: string[]; description?: string }[] {
  if (!raw) return [{ title: "", items: [""], description: "" }];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [{ title: "", items: [""], description: "" }];
    } catch {
      return [{ title: "", items: [""], description: "" }];
    }
  }
  if (Array.isArray(raw)) return raw;
  return [{ title: "", items: [""], description: "" }];
}

function ToolEditForm({ tool, onSave, onCancel }: { tool: Tool, onSave: (tool: Tool) => void, onCancel: () => void }) {
  console.log('[ToolEditForm] tool.useCases (raw):', tool.useCases);
  const [formData, setFormData] = useState({ ...tool })
  const [useCases, setUseCases] = useState<{ title: string; items?: string[]; description?: string }[]>(
    (() => {
      const parsed = parseUseCases(tool.useCases);
      return parsed;
    })()
  )
  const [saving, setSaving] = useState(false)

  React.useEffect(() => {
    setFormData({ ...tool })
    const parsed = parseUseCases(tool.useCases)
    setUseCases(parsed)
  }, [tool])

  React.useEffect(() => {
  }, [useCases])

  const handleUseCaseChange = (idx: number, field: string, value: string) => {
    setUseCases(prev => prev.map((uc, i) => i === idx ? { ...uc, [field]: value } : uc))
  }
  const handleUseCaseItemChange = (ucIdx: number, itemIdx: number, value: string) => {
    setUseCases(prev => prev.map((uc, i) =>
      i === ucIdx ? { ...uc, items: (uc.items ?? []).map((item, j) => j === itemIdx ? value : item) } : uc
    ))
  }
  const addUseCase = () => setUseCases(prev => [...prev, { title: "", items: [""], description: "" }])
  const removeUseCase = (idx: number) => setUseCases(prev => prev.filter((_, i) => i !== idx))
  const addUseCaseItem = (ucIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: [...(uc.items ?? []), ""] } : uc
  ))
  const removeUseCaseItem = (ucIdx: number, itemIdx: number) => setUseCases(prev => prev.map((uc, i) =>
    i === ucIdx ? { ...uc, items: (uc.items ?? []).filter((_, j) => j !== itemIdx) } : uc
  ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`http://localhost:3001/api/tools/${tool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, useCases }),
      })
      if (!response.ok) throw new Error("Failed to update tool")
      const updated = await response.json()
      onSave(updated)
    } catch (error) {
      console.error("Error updating tool:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Edit Tool</h2>
        <p className="text-muted-foreground">Update the tool details and use cases below.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-base font-semibold">Name</label>
            <input 
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold">Description</label>
            <textarea 
              className="w-full min-h-[100px] rounded-lg px-3 py-2 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition" 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold">Category</label>
            <select
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as ToolCategory })}
              required
            >
              {Object.values(ToolCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-base font-semibold">Icon URL</label>
            <input 
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition" 
              value={formData.iconUrl || ""} 
              onChange={e => setFormData({ ...formData, iconUrl: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold">Link</label>
            <input 
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition" 
              value={formData.link || ""} 
              onChange={e => setFormData({ ...formData, link: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold">Status</label>
            <select
              className="w-full h-11 rounded-lg px-3 bg-muted/40 border-2 border-border focus:ring-2 focus:ring-primary transition"
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
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-base font-semibold">Use Cases</label>
          <button 
            type="button" 
            onClick={addUseCase}
            className="px-4 py-2 rounded-full border border-border hover:bg-muted/50 transition"
          >
            Add Use Case
          </button>
        </div>

        <div className="space-y-4">
          {useCases.map((uc, ucIdx) => (
            <div key={ucIdx} className="p-4 border-2 border-border rounded-xl bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 h-11 rounded-lg px-3 bg-primary/10 border-2 border-primary font-semibold text-primary focus:ring-2 focus:ring-primary transition"
                  placeholder="Use case title"
                  value={uc.title}
                  onChange={e => handleUseCaseChange(ucIdx, "title", e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transition"
                  onClick={() => removeUseCase(ucIdx)} 
                  disabled={useCases.length === 1}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {(uc.items ?? []).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <input
                      className="flex-1 h-9 rounded-lg px-3 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                      placeholder="Use case item"
                      value={item}
                      onChange={e => handleUseCaseItemChange(ucIdx, itemIdx, e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transition"
                      onClick={() => removeUseCaseItem(ucIdx, itemIdx)} 
                      disabled={(uc.items ?? []).length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="px-3 py-1 rounded-full border border-border hover:bg-muted/50 transition"
                  onClick={() => addUseCaseItem(ucIdx)}
                >
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          className="px-6 py-2 text-lg rounded-full border border-border hover:bg-muted/50 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 text-lg rounded-full bg-primary hover:bg-primary/90 transition text-white"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}

export function ToolList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Tool | null>(null)
  const [editingLoading, setEditingLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tools")
      if (!response.ok) throw new Error("Failed to fetch tools")
      const data = await response.json()
      setTools(data)
    } catch (error) {
      console.error("Error fetching tools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = async (toolId: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/tools/${toolId}`)
      if (!response.ok) throw new Error("Failed to fetch tool details")
      const fullTool = await response.json()
      setEditing(fullTool)
    } catch (error) {
      console.error("Error fetching tool details:", error)
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tools/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete tool")
      setTools(tools.filter((tool) => tool.id !== id))
    } catch (error) {
      console.error("Error deleting tool:", error)
    }
  }

  const handleEditSave = (updated: Tool) => {
    setTools(tools.map(t => t.id === updated.id ? updated : t))
    setEditing(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tools List</h2>
      <input
        type="text"
        placeholder="Search tools..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input w-full mb-2 rounded-xl px-4 py-2 bg-muted/40 border border-border focus:ring-2 focus:ring-primary transition"
      />
      <div className="grid gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {tool.category}
                </span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {tool.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEditClick(tool.id)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(tool.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal open={!!editing} onOpenChange={open => !open && setEditing(null)}>
          <ModalContent>
            {editingLoading ? (
              <div className="p-8 text-center">Loading tool details...</div>
            ) : (
              <ToolEditForm
                tool={editing}
                onSave={handleEditSave}
                onCancel={() => setEditing(null)}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
} 