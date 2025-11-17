import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetch(`${BACKEND_URL}/api/education/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Education record not found" },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const education = await response.json()
    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json(
      { error: "Failed to fetch education" },
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
    
    const response = await fetch(`${BACKEND_URL}/api/education/${id}`, {
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
    
    const education = await response.json()
    return NextResponse.json(education)
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update education" },
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
    const response = await fetch(`${BACKEND_URL}/api/education/${id}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    )
  }
}

