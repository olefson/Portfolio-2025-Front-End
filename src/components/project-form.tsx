"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

// Predefined project categories
const PROJECT_CATEGORIES = [
  "Web Development",
  "Artificial Intelligence", 
  "Research",
  "Other"
]

const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imagePath: z.string().optional(),
  githubUrl: z.string().url({
    message: "Please enter a valid GitHub URL.",
  }).optional().or(z.literal("")),
  liveUrl: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  toolsUsed: z.array(z.string()).optional(),
  date: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: ProjectFormValues
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [tags, setTags] = useState<string[]>(project?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [selectedTools, setSelectedTools] = useState<string[]>(project?.toolsUsed || [])
  const [tools, setTools] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [originalData, setOriginalData] = useState<ProjectFormValues | null>(null)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  const [toolsSearchTerm, setToolsSearchTerm] = useState("")

  // Filter tools based on search term
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(toolsSearchTerm.toLowerCase())
  )

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      id: project?.id || "",
      title: project?.title || "",
      description: project?.description || "",
      imagePath: project?.imagePath || "",
      githubUrl: project?.githubUrl || "",
      liveUrl: project?.liveUrl || "",
      tags: project?.tags || [],
      toolsUsed: project?.toolsUsed || [],
      date: project?.date || "",
    },
  })

  useEffect(() => {
    if (project) {
      const projectData = {
        id: project.id || "",
        title: project.title || "",
        description: project.description || "",
        imagePath: project.imagePath || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        tags: project.tags || [],
        toolsUsed: project.toolsUsed || [],
        date: project.date || "",
      }
      form.reset(projectData)
      setOriginalData(projectData)
      setTags(project.tags || [])
      setSelectedTools(project.toolsUsed || [])
    }
  }, [project, form])

  useEffect(() => {
    // Load tools data
    const loadTools = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tools')
        if (response.ok) {
          const data = await response.json()
          setTools(data || [])
        }
      } catch (error) {
        console.error('Failed to load tools:', error)
      }
    }
    loadTools()
  }, [])

  async function onSubmit(data: ProjectFormValues) {
    try {
      const url = project?.id ? `http://localhost:3001/api/projects/${project.id}` : 'http://localhost:3001/api/projects'
      const method = project?.id ? "PUT" : "POST"

      // Prepare submit data with proper date handling
      let submitData: any = {
        ...data,
        tags: data.tags,
        toolsUsed: selectedTools,
      }
      
      // For editing, only send changed fields
      if (project?.id && originalData) {
        const changedFields: any = {}
        
        // Check each field for changes
        if (data.title !== originalData.title) changedFields.title = data.title
        if (data.description !== originalData.description) changedFields.description = data.description
        if (data.githubUrl !== originalData.githubUrl) changedFields.githubUrl = data.githubUrl
        if (data.liveUrl !== originalData.liveUrl) changedFields.liveUrl = data.liveUrl
        if (JSON.stringify(data.tags) !== JSON.stringify(originalData.tags)) changedFields.tags = data.tags
        if (JSON.stringify(selectedTools) !== JSON.stringify(originalData.toolsUsed)) changedFields.toolsUsed = selectedTools
        if (data.imagePath !== originalData.imagePath) changedFields.imagePath = data.imagePath
        
        // Handle date field - only include if it has a value and is valid
        if (data.date !== originalData.date) {
          if (data.date && data.date.trim() !== '') {
            const dateValue = new Date(data.date)
            if (!isNaN(dateValue.getTime())) {
              changedFields.date = data.date
            }
          } else {
            changedFields.date = data.date
          }
        }
        
        // If no changes detected, show a message and return early
        if (Object.keys(changedFields).length === 0) {
          toast.info("No changes detected")
          return
        }
        
        submitData = changedFields
      } else {
        // For new projects, handle date field properly
        if (data.date && data.date.trim() !== '') {
          const dateValue = new Date(data.date)
          if (!isNaN(dateValue.getTime())) {
            submitData.date = data.date
          } else {
            delete submitData.date
          }
        } else {
          delete submitData.date
        }
        
        // Don't send id field for new projects
        delete submitData.id
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      toast.success(project?.id ? "Project updated successfully" : "Project created successfully")
      form.reset({
        id: "",
        title: "",
        description: "",
        imagePath: "",
        githubUrl: "",
        liveUrl: "",
        tags: [],
        toolsUsed: [],
        date: "",
      })
      setTags([])
      setSelectedTools([])
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to save project")
      console.error(error)
    }
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      form.setValue("tags", [...tags, newTag])
      setNewTag("") // Clear selection after adding
    } else if (tags.includes(newTag)) {
      toast.error("This category is already selected")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue("tags", newTags)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      form.setValue("imagePath", data.url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload image")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    When was this project completed or started?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Category</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <div className="flex gap-2">
                    <Select
                      value={newTag}
                      onValueChange={setNewTag}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addTag} disabled={!newTag}>
                      Add
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toolsUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools Used</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Popover open={toolsDropdownOpen} onOpenChange={setToolsDropdownOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={toolsDropdownOpen}
                            className="w-full justify-between"
                          >
                            Select tools used in this project
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <div className="p-2">
                            <Input
                              placeholder="Search tools..."
                              value={toolsSearchTerm}
                              onChange={(e) => setToolsSearchTerm(e.target.value)}
                              className="mb-2"
                            />
                            <div className="max-h-[200px] overflow-y-auto">
                              {filteredTools.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  No tools found.
                                </div>
                              ) : (
                                filteredTools.map((tool) => (
                                  <div
                                    key={tool.id}
                                    onClick={() => {
                                      if (!selectedTools.includes(tool.id)) {
                                        const newTools = [...selectedTools, tool.id]
                                        setSelectedTools(newTools)
                                        field.onChange(newTools)
                                      }
                                      setToolsDropdownOpen(false)
                                    }}
                                    className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        selectedTools.includes(tool.id) ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {tool.name}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <div className="flex flex-wrap gap-2">
                        {selectedTools.map((toolId) => {
                          const tool = tools.find(t => t.id === toolId)
                          return (
                            <Badge key={toolId} variant="secondary">
                              {tool?.name || toolId}
                              <button
                                type="button"
                                onClick={() => {
                                  const newTools = selectedTools.filter(id => id !== toolId)
                                  setSelectedTools(newTools)
                                  field.onChange(newTools)
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        {isUploading && <span>Uploading...</span>}
                      </div>
                      {field.value && (
                        <div className="relative w-full aspect-video">
                          <img
                            src={field.value.startsWith('http') ? field.value : `http://localhost:3001${field.value}`}
                            alt="Project preview"
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a project preview image. Recommended size: 1920x1080px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUploading}>
              {project?.id ? "Update Project" : "Create Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 