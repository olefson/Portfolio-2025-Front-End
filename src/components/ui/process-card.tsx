"use client"

import { Badge } from "@/components/ui/badge"
import { Process } from "@/types"
import GlassSurface from "@/components/GlassSurface"

interface ProcessCardProps extends Process {
  showContent?: boolean
  toolsInvolved?: string[]
  tips?: Record<string, string[]>
}

export type { ProcessCardProps }

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
    <GlassSurface
      width={"100%" as any}
      height={"auto" as any}
      borderRadius={16}
      backgroundOpacity={0.7}
      blur={2}
      opacity={0.93}
      displace={0}
      className="h-full flex flex-col"
      style={{ minHeight: showContent ? 'auto' : '280px' }}
    >
      <div className="flex flex-col h-full p-4 sm:p-5 md:p-6">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white transition-colors group-hover:text-emerald-400 leading-tight pr-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs px-2 py-0.5">
                {status}
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs px-2 py-0.5 capitalize">
                {category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex-1 mb-3 sm:mb-4 min-h-0">
          <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tools Section */}
        {(toolsInvolved || tools || []).length > 0 && (
          <div className="flex-shrink-0 mb-3 sm:mb-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(toolsInvolved || tools || []).slice(0, showContent ? undefined : 4).map((tool) => (
                <Badge 
                  key={tool} 
                  variant="secondary" 
                  className="text-xs sm:text-sm bg-white/10 border-white/20 text-white px-2 py-0.5"
                >
                  {tool}
                </Badge>
              ))}
              {!showContent && (toolsInvolved || tools) && (toolsInvolved || tools).length > 4 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs sm:text-sm bg-white/10 border-white/20 text-white px-2 py-0.5"
                >
                  +{(toolsInvolved || tools).length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Expanded Content Section */}
        {showContent && (
          <div className="flex-shrink-0 space-y-4 sm:space-y-6 pt-3 sm:pt-4 border-t border-white/20">
            {steps && steps.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg">Key Steps</h3>
                <ol className="space-y-1.5 sm:space-y-2">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-emerald-400 font-semibold flex-shrink-0 mt-0.5 text-sm sm:text-base">
                        {index + 1}.
                      </span>
                      <span className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed flex-1">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {tips && Object.entries(tips).map(([section, items]) => (
              <div key={section} className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg">{section}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-emerald-400 mt-1.5 flex-shrink-0 text-sm sm:text-base">•</span>
                      <span className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed flex-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassSurface>
  )

  return (
    <div className="group relative h-full">
      {content}
    </div>
  )
} 