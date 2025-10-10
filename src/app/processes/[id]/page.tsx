"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Process } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarCheck2, FileEdit, Goal, HeartHandshake, Lightbulb, ListTodo } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const getProcessIcon = (id: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'annual-review': <Goal className="w-8 h-8" />,
    'blog-post-workflow': <FileEdit className="w-8 h-8" />,
    'daily-task-management': <ListTodo className="w-8 h-8" />,
    'project-evaluation': <Lightbulb className="w-8 h-8" />,
    'relationship-management': <HeartHandshake className="w-8 h-8" />,
    'staying-open': <CalendarCheck2 className="w-8 h-8" />,
  }
  return iconMap[id] || <Lightbulb className="w-8 h-8" />
}

export default function ProcessDetailPage() {
  const params = useParams()
  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProcess(params.id as string)
    }
  }, [params.id])

  const fetchProcess = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`http://localhost:3001/api/processes/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch process")
      }
      
      const data = await response.json()
      setProcess(data)
    } catch (error) {
      console.error("Error fetching process:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch process")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading process...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => fetchProcess(params.id as string)}
            >
              Try Again
            </Button>
          </Alert>
        </div>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Process Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The process you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/processes">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Processes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/processes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Processes
            </Button>
          </Link>
        </div>

        {/* Process Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="text-muted-foreground/40">
              {getProcessIcon(process.id)}
            </div>
          </div>
          <h1 className="text-4xl font-bold">{process.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {process.description}
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              {process.category}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {process.status}
            </Badge>
          </div>
        </div>

        {/* Process Details */}
        <GlowCard>
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* Tools Involved */}
              {(process.toolsInvolved || process.tools || []).length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Tools & Resources</h2>
                  <div className="flex flex-wrap gap-2">
                    {(process.toolsInvolved || process.tools || []).map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-sm">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Process Steps</h2>
                <ol className="space-y-3">
                  {process.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {process.tips && Object.keys(process.tips).length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Tips & Best Practices</h2>
                  <div className="space-y-6">
                    {Object.entries(process.tips).map(([section, items]) => (
                      <div key={section} className="space-y-3">
                        <h3 className="text-lg font-medium">{section}</h3>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </GlowCard>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/processes">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Processes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}