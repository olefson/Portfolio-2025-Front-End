import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Tool } from "@prisma/client"

export async function GET() {
  try {
    console.log("Attempting to fetch tools...")
    const tools = await prisma.tool.findMany()
    console.log("Successfully fetched tools:", tools)
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error in GET /api/tools:", error)
    return NextResponse.json(
      { error: "Failed to fetch tools", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await prisma.$queryRaw<Tool[]>`
      INSERT INTO "Tool" (
        id, name, description, category, "iconUrl", link, status, acquired, "createdBy", "updatedAt", "useCases"
      ) VALUES (
        gen_random_uuid(),
        ${data.name},
        ${data.description},
        ${data.category}::"ToolCategory",
        ${data.iconUrl},
        ${data.link},
        ${data.status},
        ${new Date()},
        'admin',
        ${new Date()},
        ${data.useCases ? JSON.stringify(data.useCases) : null}::jsonb
      )
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error in POST /api/tools:", error)
    return NextResponse.json(
      { error: "Failed to create tool", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 