"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/ui/glow-card"
import { ToolLogo } from "@/components/ui/tool-logo"
import { ExternalLink } from "@/components/ui/external-link"
import { Tool } from "@/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ToolCardProps {
  tool: Tool
  showContent?: boolean
}

const getToolLogo = (slug: string): string => {
  const logoMap: { [key: string]: string } = {
    'chatgpt': 'openai',
    'notion': 'notion',
    'apple-notes': 'apple',
    'telegram': 'telegram',
    'x-twitter': 'x',
    'google-calendar': 'google-calendar',
    'microsoft-todo': 'microsoft-todo',
    'canva': 'canva',
    'perplexity': 'perplexity',
    'google': 'google',
    'linear': 'linear',
    'cursor': 'cursor',
    'super-so': 'super-so',
  }

  return `/images/tools/${logoMap[slug] || slug}.svg`
}

const getStatusTooltip = (status: Tool['status']): string => {
  switch (status) {
    case 'Using':
      return 'I actively use this tool in my workflow'
    case 'Plan to Try':
      return 'I plan to evaluate this tool in the future'
    case 'Building':
      return 'I am currently developing this app and it is currently in an alpha or later stage'
    case 'Plan to Build':
      return 'I plan to develop this tool in the future'
    case 'Retired':
      return 'I no longer use this tool but it was once part of my workflow'
    case 'Trying':
      return 'I am currently evaluating this tool'
    default:
      return ''
  }
}

export function ToolCard({ tool, showContent = false }: ToolCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking the badge, don't navigate
    if (e.target instanceof Element && e.target.closest('.badge')) {
      return;
    }
    
    // Don't navigate if showing content (detail view)
    if (showContent) {
      return;
    }
    
    // Otherwise, navigate to the tool page
    window.location.href = `/tools/${tool.id}`;
  };

  return (
    <div className="group select-none">
      <GlowCard onClick={handleCardClick}>
        <Card className={`flex flex-col transition-colors group-hover:bg-muted/50 ${showContent ? '' : 'h-[250px]'}`}>
          <CardHeader className="flex-none space-y-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <ToolLogo
                  src={getToolLogo(tool.id)}
                  alt={`${tool.title} logo`}
                />
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors truncate">
                  {tool.title}
                </CardTitle>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="touch-manipulation"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Badge
                        variant={
                          tool.status === "Using"
                            ? "default"
                            : tool.status === "Plan to Try"
                            ? "secondary"
                            : tool.status === "Building"
                            ? "gold"
                            : tool.status === "Plan to Build"
                            ? "monochrome"
                            : tool.status === "Trying"
                            ? "default"
                            : "destructive"
                        }
                        className={`w-fit badge ${
                          tool.status === "Building"
                            ? "bg-amber-500 hover:bg-amber-600 animate-pulse shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50"
                            : tool.status === "Trying"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : ""
                        }`}
                      >
                        {tool.status}
                      </Badge>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="text-center">
                    <p>{getStatusTooltip(tool.status)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Badge variant="outline">{tool.category}</Badge>
              {tool.addedOn && (
                <Badge variant="outline" className="text-xs">
                  Added {new Date(tool.addedOn).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <p className="text-muted-foreground text-center">
              {tool.description}
            </p>
            {showContent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Use Cases Section */}
                  {tool.useCases && tool.useCases.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold">Use Cases</h2>
                      {tool.useCases.map((useCase, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">{useCase.title}</h3>
                          <ul className="list-disc pl-4 space-y-1">
                            {useCase.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-muted-foreground">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {/* Pro Tips Section */}
                  {tool.tips && tool.tips.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold">Pro Tips</h2>
                      {tool.tips.map((tip, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">{tip.title}</h3>
                          <ul className="list-disc pl-4 space-y-1">
                            {tip.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-muted-foreground">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </GlowCard>
      {tool.url && (
        <div className="mt-2 px-6 text-center">
          <ExternalLink 
            href={tool.url}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {tool.url} ↗
          </ExternalLink>
        </div>
      )}
    </div>
  )
} 