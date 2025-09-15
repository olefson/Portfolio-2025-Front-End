'use client'

import { Tool } from "@/types"
import Link from "next/link"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

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
    <motion.main 
      className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-background to-muted/20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div variants={itemVariants}>
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Tools
          </Link>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-[1fr,2fr]"
          variants={itemVariants}
        >
          {/* Tool Header */}
          <div className="space-y-4">
            <motion.div 
              className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {tool.iconUrl && (
                <Image
                  src={tool.iconUrl}
                  alt={tool.name}
                  fill
                  className="object-contain dark:invert"
                />
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {tool.category}
                </Badge>
                <Badge variant={tool.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {tool.status}
                </Badge>
              </div>
              
              {tool.link && (
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visit Website <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </motion.div>
          </div>

          {/* Tool Details */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
              <p className="mt-2 text-muted-foreground">{tool.description}</p>
            </div>

            {tool.useCases && tool.useCases.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                <div className="grid gap-4">
                  {tool.useCases.map((useCase: any, index: number) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg border bg-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="font-medium mb-1">{useCase.title}</div>
                      {useCase.description && (
                        <div className="text-sm text-muted-foreground mb-1">{useCase.description}</div>
                      )}
                      {useCase.items && Array.isArray(useCase.items) && (
                        <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
                          {useCase.items.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div 
              className="flex items-center gap-4 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              {/* <span>Created by {tool.createdBy}</span>
              <span>•</span> */}
              {/* <span>Last updated {new Date(tool.updatedAt).toLocaleDateString()}</span> */}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  )
} 