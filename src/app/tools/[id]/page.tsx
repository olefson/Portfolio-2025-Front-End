import { Tool } from "@/types"
import { notFound } from "next/navigation"
import ToolDetails from "./ToolDetails"

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`http://localhost:3001/api/tools/${id}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const tool: Tool = await res.json()
  if (!tool) notFound()
  return <ToolDetails tool={tool} />
}

export const revalidate = false // static 