"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { Process } from "@/types"
import { CalendarCheck2, FileEdit, Goal, HeartHandshake, Lightbulb, ListTodo } from "lucide-react"

interface ProcessCardProps extends Process {
  showContent?: boolean
  toolsInvolved?: string[]
  tips?: Record<string, string[]>
}

export type { ProcessCardProps }

const getProcessIcon = (id: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'annual-review': <Goal className="w-6 h-6" />,
    'blog-post-workflow': <FileEdit className="w-6 h-6" />,
    'daily-task-management': <ListTodo className="w-6 h-6" />,
    'project-evaluation': <Lightbulb className="w-6 h-6" />,
    'relationship-management': <HeartHandshake className="w-6 h-6" />,
    'staying-open': <CalendarCheck2 className="w-6 h-6" />,
  }
  return iconMap[id] || <Lightbulb className="w-6 h-6" />
}

export function ProcessCard({
  id,
  title,
  description,
  tools,
  toolsInvolved,
  steps,
  category,
  status,
  tips,
  showContent = false,
}: ProcessCardProps) {
  const content = (
    <Card className="h-full min-h-[300px] transition-colors group-hover:bg-muted/50 relative select-none flex flex-col">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold transition-colors group-hover:text-emerald-400">
            {title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {(toolsInvolved || tools || []).slice(0, showContent ? undefined : 3).map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs">
              {tool}
            </Badge>
          ))}
          {!showContent && (toolsInvolved || tools) && (toolsInvolved || tools).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{(toolsInvolved || tools).length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        <p className="text-sm text-muted-foreground">{description}</p>
        {showContent && (
          <>
            <div className="space-y-2">
              <h3 className="font-semibold">Key Steps</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <li key={index} className="mb-1">{step}</li>
                ))}
              </ol>
            </div>
            {tips && Object.entries(tips).map(([section, items]) => (
              <div key={section} className="space-y-2">
                <h3 className="font-semibold">{section}</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {items.map((item, index) => (
                    <li key={index} className="mb-1">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </CardContent>
      <div className="p-6 mt-auto border-t flex justify-between items-center">
        <div className="text-muted-foreground/40">
          {getProcessIcon(id)}
        </div>
        <Badge variant="outline" className="shrink-0">
          {category}
        </Badge>
      </div>
    </Card>
  )

  if (showContent) {
    return <GlowCard>{content}</GlowCard>
  }

  return (
    <div className="group relative">
      <Link href={`/processes/${id}`}>
        <GlowCard>{content}</GlowCard>
      </Link>
    </div>
  )
} 