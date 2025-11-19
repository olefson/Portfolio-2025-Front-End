"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Diary } from "@/types"
import { Modal, ModalContent } from "@/components/ui/modal"
import { DiaryForm } from "@/components/diary-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DiaryList() {
  const [entries, setEntries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Diary | undefined>(undefined)
  const [editingLoading, setEditingLoading] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    tags: [] as string[],
    moods: [] as string[],
    dateRange: { from: null as Date | null, to: null as Date | null },
    search: "",
  })
  const [sort, setSort] = useState<{ field: 'date' | 'title'; direction: 'asc' | 'desc' }>({
    field: 'date',
    direction: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/diary')
      if (!response.ok) throw new Error("Failed to fetch diary entries")
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      console.error("Error fetching diary entries:", error)
      setError("Failed to load diary entries")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleDiaryCreated = () => {
      fetchEntries()
    }
    window.addEventListener('diaryCreated', handleDiaryCreated)
    return () => window.removeEventListener('diaryCreated', handleDiaryCreated)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    const moodCounts: Record<string, number> = {}
    const monthlyCounts: Record<string, number> = {}

    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      }
      const month = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1
    })

    return {
      totalEntries: entries.length,
      tagCounts,
      moodCounts,
      monthlyCounts,
    }
  }, [entries])

  // Get all unique tags and moods
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach(entry => entry.tags.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [entries])

  const allMoods = useMemo(() => {
    const moodSet = new Set<string>()
    entries.forEach(entry => entry.mood && moodSet.add(entry.mood))
    return Array.from(moodSet).sort()
  }, [entries])

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    const filtered = entries.filter(entry => {
      // Tag filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => entry.tags.includes(tag))
        if (!hasMatchingTag) return false
      }

      // Mood filter
      if (filters.moods.length > 0) {
        if (!entry.mood || !filters.moods.includes(entry.mood)) return false
      }

      // Date range filter
      if (filters.dateRange.from) {
        const entryDate = new Date(entry.date)
        if (entryDate < filters.dateRange.from) return false
      }
      if (filters.dateRange.to) {
        const entryDate = new Date(entry.date)
        if (entryDate > filters.dateRange.to) return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!entry.title.toLowerCase().includes(searchLower) &&
            !entry.content.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      return true
    })

    // Sort (create new array instead of mutating)
    return [...filtered].sort((a, b) => {
      let comparison = 0
      if (sort.field === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        comparison = a.title.localeCompare(b.title)
      }
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [entries, filters, sort])

  const handleEditClick = async (entryId: string) => {
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/diary/${entryId}`)
      if (!response.ok) throw new Error("Failed to fetch diary entry")
      const entry = await response.json()
      setEditing(entry)
    } catch (error) {
      console.error("Error fetching diary entry:", error)
      setError("Failed to load diary entry details")
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diary entry?")) return
    try {
      const response = await fetch(`/api/diary/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete diary entry")
      await fetchEntries()
    } catch (error) {
      console.error("Error deleting diary entry:", error)
      setError("Failed to delete diary entry")
    }
  }

  const handleEditSave = (updated: Diary) => {
    setEntries(entries.map(e => e.id === updated.id ? updated : e))
    setEditing(undefined)
  }

  const toggleExpanded = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearFilters = () => {
    setFilters({
      tags: [],
      moods: [],
      dateRange: { from: null, to: null },
      search: "",
    })
  }

  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const toggleMoodFilter = (mood: string) => {
    setFilters(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading diary entries...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchEntries}>
          Try Again
        </Button>
      </Alert>
    )
  }

  const hasActiveFilters = filters.tags.length > 0 || filters.moods.length > 0 || 
    filters.dateRange.from || filters.dateRange.to || filters.search

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{stats.totalEntries}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Unique Tags</h3>
          <p className="text-2xl font-bold">{allTags.length}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Unique Moods</h3>
          <p className="text-2xl font-bold">{allMoods.length}</p>
        </div>
      </div>

      {/* Top Tags */}
      {Object.keys(stats.tagCounts).length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Top Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.tagCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([tag, count]) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTagFilter(tag)}>
                  {tag} ({count})
                </Badge>
              ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full"
          >
            {showFilters ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear Filters
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <input
                type="text"
                placeholder="Search in title and content..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full h-10 rounded-lg px-3 bg-background border border-border focus:ring-2 focus:ring-primary transition"
              />
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag} ({stats.tagCounts[tag] || 0})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            {allMoods.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Moods</label>
                <div className="flex flex-wrap gap-2">
                  {allMoods.map(mood => (
                    <Badge
                      key={mood}
                      variant={filters.moods.includes(mood) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleMoodFilter(mood)}
                    >
                      {mood} ({stats.moodCounts[mood] || 0})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <input
                  type="date"
                  value={filters.dateRange.from ? filters.dateRange.from.toISOString().split('T')[0] : ""}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: e.target.value ? new Date(e.target.value) : null }
                  }))}
                  className="w-full h-10 rounded-lg px-3 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <input
                  type="date"
                  value={filters.dateRange.to ? filters.dateRange.to.toISOString().split('T')[0] : ""}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: e.target.value ? new Date(e.target.value) : null }
                  }))}
                  className="w-full h-10 rounded-lg px-3 bg-background border border-border focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.tags.map(tag => (
              <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => toggleTagFilter(tag)}>
                Tag: {tag} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {filters.moods.map(mood => (
              <Badge key={mood} variant="default" className="cursor-pointer" onClick={() => toggleMoodFilter(mood)}>
                Mood: {mood} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {filters.search && (
              <Badge variant="default" className="cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, search: "" }))}>
                Search: {filters.search} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sort.field}
          onChange={(e) => setSort(prev => ({ ...prev, field: e.target.value as 'date' | 'title' }))}
          className="h-9 rounded-lg px-3 bg-background border border-border focus:ring-2 focus:ring-primary transition"
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
          className="rounded-full"
        >
          {sort.direction === 'asc' ? '↑' : '↓'}
        </Button>
        <span className="text-sm text-muted-foreground">
          Showing {filteredEntries.length} of {entries.length} entries
        </span>
      </div>

      {/* Entry List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          {hasActiveFilters ? "No entries match your filters. Try adjusting your search." : "No diary entries found. Create your first entry using the form."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.id)
            const entryDate = new Date(entry.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
            return (
              <div
                key={entry.id}
                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="font-medium text-lg cursor-pointer hover:text-primary"
                        onClick={() => toggleExpanded(entry.id)}
                      >
                        {entry.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{entryDate}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {entry.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {entry.mood && (
                        <Badge
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => toggleMoodFilter(entry.mood!)}
                        >
                          {entry.mood}
                        </Badge>
                      )}
                    </div>
                    {isExpanded ? (
                      <div className="mt-2">
                        <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {entry.content.length} characters
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    )}
                    {!isExpanded && entry.content.length > 100 && (
                      <button
                        onClick={() => toggleExpanded(entry.id)}
                        className="text-sm text-primary mt-1 hover:underline"
                      >
                        Show more
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(entry.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!editing} onOpenChange={open => !open && setEditing(undefined)}>
        <ModalContent>
          {editingLoading ? (
            <div className="p-8 text-center">Loading diary entry details...</div>
          ) : editing && (
            <DiaryForm
              diary={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(undefined)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

