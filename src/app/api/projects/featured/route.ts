import { NextResponse } from "next/server"

// Use environment variable for backend URL, with fallback for dev
// In production, this should be set to your production backend URL
// In dev, it defaults to localhost:3001
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/projects/featured`)
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const projects = await response.json()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/projects/featured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating featured projects:", error)
    return NextResponse.json(
      { error: "Failed to update featured projects" },
      { status: 500 }
    )
  }
}

