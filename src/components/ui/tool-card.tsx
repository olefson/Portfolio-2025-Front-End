"use client"

import { Badge } from "@/components/ui/badge"
import { ToolLogo } from "@/components/ui/tool-logo"
import { ExternalLink } from "@/components/ui/external-link"
import { Tool } from "@/types"
import Link from "next/link"
import GlassSurface from "@/components/GlassSurface"
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
    'bland-ai': 'bland-ai',
    'anki': 'anki',
    'replit': 'replit',
    'creality-k1': 'creality-k1',
    'snipaste': 'snipaste',
    'raspberry-pi': 'raspberry-pi',
    'audible': 'audible'
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Using':
      return 'bg-green-600 text-white';
    case 'Plan to Try':
      return 'bg-blue-500 text-white';
    case 'Archived':
      return 'bg-gray-500 text-white';
    case 'Building':
      return 'bg-amber-500 text-white animate-pulse shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50';
    case 'Plan to Build':
      return 'bg-purple-500 text-white';
    case 'Trying':
      return 'bg-sky-500 text-white';
    case 'Retired':
      return 'bg-rose-500 text-white';
    default:
      return 'bg-muted text-foreground';
  }
}

export function ToolCard({ tool, showContent = false }: ToolCardProps) {
  console.log('ToolCard render:', { showContent, useCases: tool.useCases });

  const cardContent = (
    <GlassSurface
      width="100%"
      height="auto"
      borderRadius={16}
      backgroundOpacity={0.7}
      blur={2}
      opacity={0.93}
      displace={0}
      className="h-full flex flex-col"
      style={{ minHeight: showContent ? 'auto' : '250px' }}
    >
      <div className="flex flex-col h-full p-4 sm:p-6">
        <div className="flex-none space-y-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <ToolLogo
                src={tool.iconUrl || getToolLogo(tool.id)}
                alt={`${tool.name} logo`}
              />
              <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                {tool.name}
              </h3>
            </div>
            
            <TooltipProvider>
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
                      className={`w-fit badge ${getStatusColor(tool.status)}`}
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
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              {tool.category}
            </Badge>
          </div>
        </div>
        <div className="flex-1 space-y-6 pt-4">
          <p className="text-white/80 text-center">
            {tool.description}
          </p>
          {showContent && tool.useCases && tool.useCases.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-white">Use Cases</h2>
              <div className="space-y-4">
                {tool.useCases.map((useCase, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-md font-medium text-white">{useCase.title}</h3>
                    <ul className="list-disc pl-6">
                      {useCase.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-white/70">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassSurface>
  );

  // If showing content (detail view), don't wrap with Link
  if (showContent) {
    return (
      <div className="group select-none">
        {cardContent}
        {tool.link && (
          <div className="mt-2 px-6 text-center">
            <ExternalLink 
              href={tool.link}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {tool.link} ↗
            </ExternalLink>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, wrap with Link for navigation
  return (
    <div className="group select-none">
      <Link href={`/tools/${tool.id}`} className="block">
        {cardContent}
      </Link>
      {tool.link && (
        <div className="mt-2 px-6 text-center">
          <ExternalLink 
            href={tool.link}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            {tool.link} ↗
          </ExternalLink>
        </div>
      )}
    </div>
  );
} 