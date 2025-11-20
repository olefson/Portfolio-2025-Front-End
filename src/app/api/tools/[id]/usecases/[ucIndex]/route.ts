import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; ucIndex: string }> }
) {
  try {
    const { id, ucIndex } = await params
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/tools/${id}/usecases/${ucIndex}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const tool = await response.json()
    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error updating use case:", error)
    return NextResponse.json(
      { error: "Failed to update use case" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; ucIndex: string }> }
) {
  try {
    const { id, ucIndex } = await params
    const response = await fetch(`${BACKEND_URL}/api/tools/${id}/usecases/${ucIndex}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const tool = await response.json()
    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error deleting use case:", error)
    return NextResponse.json(
      { error: "Failed to delete use case" },
      { status: 500 }
    )
  }
}












