import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { Tool, Process } from "@/types"

function getTools(): Tool[] {
  const toolsPath = path.join(process.cwd(), "src/data/tools.json")
  const toolsData = JSON.parse(fs.readFileSync(toolsPath, "utf8"))
  return toolsData.tools
}

function getProcesses(): Process[] {
  const processesPath = path.join(process.cwd(), "src/data/processes.json")
  const processesData = JSON.parse(fs.readFileSync(processesPath, "utf8"))
  return processesData.processes
}

export async function GET() {
  const tools = getTools()
  const processes = getProcesses()

  return NextResponse.json({ tools, processes })
} 