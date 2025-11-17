import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetch(`${BACKEND_URL}/api/admin/diary/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Diary entry not found" },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const entry = await response.json()
    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching diary entry:", error)
    return NextResponse.json(
      { error: "Failed to fetch diary entry" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/admin/diary/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }
    
    const entry = await response.json()
    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error updating diary entry:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update diary entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetch(`${BACKEND_URL}/api/admin/diary/${id}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting diary entry:", error)
    return NextResponse.json(
      { error: "Failed to delete diary entry" },
      { status: 500 }
    )
  }
}

