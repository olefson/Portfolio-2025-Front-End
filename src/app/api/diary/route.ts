import { NextResponse } from "next/server"

// Use environment variable for backend URL, with fallback for dev
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/diary`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const entries = await response.json()
    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching diary entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch diary entries" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/admin/diary`, {
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
    
    const entry = await response.json()
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error creating diary entry:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create diary entry" },
      { status: 500 }
    )
  }
}

