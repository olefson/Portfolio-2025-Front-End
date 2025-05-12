import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { id: params.id },
    }) as any;
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      )
    }
    let useCases = [];
    if (tool['useCases']) {
      try {
        useCases = typeof tool['useCases'] === 'string'
          ? JSON.parse(tool['useCases'])
          : tool['useCases'];
      } catch (e) {
        useCases = [];
      }
    }
    return NextResponse.json({ ...tool, useCases })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tool" },
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
    let useCases = Array.isArray(data.useCases) ? data.useCases : [];
    const tool = await prisma.tool.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        iconUrl: data.iconUrl,
        link: data.link,
        status: data.status,
        useCases,
      } as any,
    })
    return NextResponse.json(tool)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tool.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: "Tool deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    )
  }
} 