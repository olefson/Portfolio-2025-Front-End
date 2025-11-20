import { NextResponse } from "next/server"

// Use environment variable for backend URL, with fallback for dev
// In production, this should be set to your production backend URL
// In dev, it defaults to localhost:3001
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/tools`, {
      // Add cache control for production
      cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const tools = await response.json()
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/tools`, {
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
    console.error("Error creating tool:", error)
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    )
  }
}












