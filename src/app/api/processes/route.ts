import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const processes = await prisma.process.findMany()
    return NextResponse.json(processes)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch processes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const process = await prisma.process.create({
      data: {
        title: data.title,
        description: data.description,
        steps: data.steps,
        status: data.status,
        category: data.category,
        tools: data.tools,
        createdBy: "admin", // TODO: Replace with actual user ID
      },
    })
    return NextResponse.json(process)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create process" },
      { status: 500 }
    )
  }
} 