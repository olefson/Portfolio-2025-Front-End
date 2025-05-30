import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

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
    console.log("POST /api/tools - Starting request handling")
    const data = await request.json()
    console.log("Received data:", data)
    
    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await prisma.tool.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        url: data.url || null,
        howToUse: data.howToUse || {},
        caveats: data.caveats || {},
        tips: data.tips || {},
        useCases: data.useCases || {},
        addedOn: data.addedOn ? new Date(data.addedOn) : new Date(),
        recommendedBy: data.recommendedBy || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log("Created tool:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/tools:", error)
    return NextResponse.json(
      { 
        error: "Failed to create tool", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 