'use client'

import { Tool } from "@/types"
import Link from "next/link"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import DarkVeil from "@/components/ui/dark-veil"
import customImageLoader from "@/lib/image-loader"
import GlassSurface from "@/components/GlassSurface"

interface ToolDetailsProps {
  tool: Tool
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
}

export default function ToolDetails({ tool }: ToolDetailsProps) {
  return (
    <div className="relative min-h-screen">
      <DarkVeil className="fixed inset-0" />
      <motion.main 
        className="relative z-10 container mx-auto px-4 py-8 min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto space-y-8">
        <motion.div variants={itemVariants}>
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors group mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Tools
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {tool.iconUrl && (
              <Image
                src={tool.iconUrl}
                alt={tool.name}
                fill
                className="object-contain dark:invert"
                loader={customImageLoader}
              />
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{tool.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize bg-white/10 border-white/20 text-white text-xs">
                  {tool.category}
                </Badge>
                <Badge variant={tool.status === 'ACTIVE' ? 'default' : 'secondary'} className="bg-white/10 border-white/20 text-white text-xs">
                  {tool.status}
                </Badge>
              </div>
            </div>
            <p className="text-lg text-white/80 leading-relaxed mb-4">{tool.description}</p>
            {tool.link && (
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors group/link"
              >
                Visit Website <ExternalLink className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Tool Details */}
        <motion.div className="space-y-6" variants={itemVariants}>

            {tool.useCases && tool.useCases.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mb-6 text-white">Use Cases</h2>
                <div className="grid gap-4 md:gap-5">
                  {tool.useCases.map((useCase: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="transition-all duration-200"
                    >
                      <GlassSurface
                        width="100%"
                        height="auto"
                        borderRadius={12}
                        backgroundOpacity={0.5}
                        blur={2}
                        opacity={0.93}
                        displace={0}
                      >
                        <div className="p-5 md:p-6">
                          <div className="font-semibold text-lg mb-2 text-white">{useCase.title}</div>
                          {useCase.description && (
                            <div className="text-sm md:text-base text-white/80 mb-3 leading-relaxed">{useCase.description}</div>
                          )}
                          {useCase.items && Array.isArray(useCase.items) && (
                            <ul className="space-y-1.5 text-sm md:text-base text-white/70">
                              {useCase.items.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-emerald-400 mt-1.5 flex-shrink-0">•</span>
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </GlassSurface>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

        </motion.div>
        </div>
      </motion.main>
    </div>
  )
} 