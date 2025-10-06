import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/processes`)
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const processes = await response.json()
    return NextResponse.json(processes)
  } catch (error) {
    console.error("Error fetching processes:", error)
    return NextResponse.json(
      { error: "Failed to fetch processes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const response = await fetch(`${BACKEND_URL}/api/processes`, {
      method: 'POST',
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
    console.error("Error creating process:", error)
    return NextResponse.json(
      { error: "Failed to create process" },
      { status: 500 }
    )
  }
}
