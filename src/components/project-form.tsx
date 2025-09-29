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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"
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

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      id: project?.id,
      title: project?.title || "",
      description: project?.description || "",
      imagePath: project?.imagePath || "",
      githubUrl: project?.githubUrl || "",
      liveUrl: typeof project?.liveUrl === "string" ? project.liveUrl : "",
      tags: project?.tags || [],
      toolsUsed: project?.toolsUsed || [],
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        liveUrl: typeof project.liveUrl === "string" ? project.liveUrl : "",
      })
      setTags(project.tags)
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

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags,
          toolsUsed: selectedTools,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      toast.success(project?.id ? "Project updated successfully" : "Project created successfully")
      form.reset()
      setTags([])
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
      <CardHeader>
        <CardTitle>{project?.id ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
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
                      <Select
                        onValueChange={(value) => {
                          if (value && !selectedTools.includes(value)) {
                            const newTools = [...selectedTools, value]
                            setSelectedTools(newTools)
                            field.onChange(newTools)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tools used in this project" />
                        </SelectTrigger>
                        <SelectContent>
                          {tools.map((tool) => (
                            <SelectItem key={tool.id} value={tool.id}>
                              {tool.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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