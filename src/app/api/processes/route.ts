import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processSchema } from "@/lib/validations/process"

export async function GET() {
  try {
    const processes = await prisma.process.findMany({
      orderBy: {
        acquired: 'desc'
      }
    })
    return NextResponse.json(processes)
  } catch (error) {
    console.error('Error fetching processes:', error)
    return NextResponse.json(
      { error: "Failed to fetch processes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate the data
    const validationResult = processSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          errors: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const process = await prisma.process.create({
      data: {
        title: data.title,
        description: data.description,
        steps: data.steps,
        status: data.status,
        category: data.category,
        tools: data.tools,
        createdBy: data.createdBy || "admin",
        acquired: new Date(data.acquired),
      },
    })
    return NextResponse.json(process)
  } catch (error) {
    console.error('Error creating process:', error)
    return NextResponse.json(
      { error: "Failed to create process" },
      { status: 500 }
    )
  }
} 