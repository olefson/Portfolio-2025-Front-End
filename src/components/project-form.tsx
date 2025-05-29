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

const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  technologies: z.array(z.string()).min(1, {
    message: "Please add at least one technology.",
  }),
  githubUrl: z.string().url({
    message: "Please enter a valid GitHub URL.",
  }),
  liveUrl: z.string().url({
    message: "Please enter a valid live URL.",
  }),
  image: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: ProjectFormValues
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || [])
  const [newTech, setNewTech] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      id: project?.id,
      title: project?.title || "",
      description: project?.description || "",
      category: project?.category || "",
      technologies: project?.technologies || [],
      githubUrl: project?.githubUrl || "",
      liveUrl: project?.liveUrl || "",
      image: project?.image || "",
    },
  })

  useEffect(() => {
    if (project) {
      form.reset(project)
      setTechnologies(project.technologies)
    }
  }, [project, form])

  async function onSubmit(data: ProjectFormValues) {
    try {
      const url = project?.id ? "/api/projects" : "/api/projects"
      const method = project?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      toast.success(project?.id ? "Project updated successfully" : "Project created successfully")
      form.reset()
      setTechnologies([])
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to save project")
      console.error(error)
    }
  }

  const addTechnology = () => {
    if (newTech && !technologies.includes(newTech)) {
      setTechnologies([...technologies, newTech])
      form.setValue("technologies", [...technologies, newTech])
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    const updatedTechs = technologies.filter((t) => t !== tech)
    setTechnologies(updatedTechs)
    form.setValue("technologies", updatedTechs)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      form.setValue("image", data.url)
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologies"
              render={() => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add technology"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTechnology()
                            }
                          }}
                        />
                        <Button type="button" onClick={addTechnology}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                  <FormLabel>GitHub URL</FormLabel>
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
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
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
                            src={field.value}
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
              {project?.id ? "Update Project" : "Add Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 