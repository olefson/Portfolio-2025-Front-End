import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const response = await fetch(`${BACKEND_URL}/api/processes/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Process not found" },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const process = await response.json()
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/processes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const process = await response.json()
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const response = await fetch(`${BACKEND_URL}/api/processes/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting process:", error)
    return NextResponse.json(
      { error: "Failed to delete process" },
      { status: 500 }
    )
  }
} 