import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const process = await prisma.process.findUnique({
      where: { id: params.id },
    })
    if (!process) {
      return NextResponse.json(
        { error: "Process not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(process)
  } catch (error) {
    console.error("Error fetching process:", error)
    return NextResponse.json(
      { error: "Failed to fetch process" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const process = await prisma.process.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        steps: data.steps,
        status: data.status,
        category: data.category,
        tools: data.tools,
      },
    })
    return NextResponse.json(process)
  } catch (error) {
    console.error("Error updating process:", error)
    return NextResponse.json(
      { error: "Failed to update process" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.process.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: "Process deleted successfully" })
  } catch (error) {
    console.error("Error deleting process:", error)
    return NextResponse.json(
      { error: "Failed to delete process" },
      { status: 500 }
    )
  }
} 