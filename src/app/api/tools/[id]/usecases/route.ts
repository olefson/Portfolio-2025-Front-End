import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/tools/${id}/usecases`, {
      method: 'POST',
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
    console.error("Error adding use case:", error)
    return NextResponse.json(
      { error: "Failed to add use case" },
      { status: 500 }
    )
  }
}











