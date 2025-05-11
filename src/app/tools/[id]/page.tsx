import { Tool, UseCase } from "@/types"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ToolDetails from "./ToolDetails"

interface PageProps {
  params: {
    id: string
  }  
}

async function getTool(id: string): Promise<Tool | null> {
  try {
    // Use raw query to get all fields including the JSON field
    const tool = await prisma.$queryRaw`
      SELECT 
        id, name, description, category, "iconUrl", link, status, acquired, "createdBy", "updatedAt", "useCases"
      FROM "Tool"
      WHERE id = ${id}
    `;

    if (!tool || !Array.isArray(tool) || tool.length === 0) return null;

    const toolData = tool[0];

    // Handle useCases - it might be a string or already an object
    let useCases = [];
    if (toolData.useCases) {
      try {
        // If it's a string, parse it
        useCases = typeof toolData.useCases === 'string' 
          ? JSON.parse(toolData.useCases)
          : toolData.useCases;
      } catch (e) {
        console.error('Error parsing useCases:', e);
        useCases = [];
      }
    }

    return {
      id: toolData.id,
      name: toolData.name,
      description: toolData.description,
      category: toolData.category as any, // typecast to match frontend enum
      iconUrl: toolData.iconUrl,
      link: toolData.link,
      status: toolData.status,
      acquired: toolData.acquired,
      createdBy: toolData.createdBy,
      updatedAt: toolData.updatedAt,
      useCases,
    } as Tool;
  } catch (error) {
    console.error('Error fetching tool:', error)
    return null
  }
}

export default async function ToolPage({ params }: PageProps) {
  const tool = await getTool(params.id)
  
  if (!tool) {
    notFound()
  }

  return <ToolDetails tool={tool} />
}

export const revalidate = false // static 