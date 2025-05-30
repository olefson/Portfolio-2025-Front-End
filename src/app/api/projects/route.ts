import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imagePath: data.imagePath,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        tags: data.tags, // Already in JSON format
        acquired: new Date(data.acquired),
        createdBy: "admin", // TODO: Get from auth context
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        imagePath: data.imagePath,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        tags: data.tags, // Already in JSON format
        acquired: new Date(data.acquired),
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    await prisma.project.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
} 