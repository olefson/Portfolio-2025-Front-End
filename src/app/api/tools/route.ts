import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        iconUrl: data.iconUrl,
        link: data.link,
        status: data.status,
        acquired: new Date(), // Set to current date/time
        createdBy: "admin", // TODO: Replace with actual user ID
      },
    })
    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error in POST /api/tools:", error)
    return NextResponse.json(
      { error: "Failed to create tool", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 