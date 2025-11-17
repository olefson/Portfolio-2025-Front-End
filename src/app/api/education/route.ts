import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/education`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/education`, {
      method: "POST",
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
    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error("Error creating education:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create education" },
      { status: 500 }
    )
  }
}

