"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolForm } from "@/components/tool-form"
import { ProcessForm } from "@/components/process-form"
import { ToolList } from "@/components/tool-list"
import { ProcessList } from "@/components/process-list"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Wrench, Workflow } from "lucide-react"

export default function EditPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">Content Management</h1>
      <Tabs defaultValue="tools" className="w-full max-w-5xl mx-auto bg-background/80 rounded-2xl shadow-xl p-6">
        <TabsList className="flex w-full mb-6 rounded-lg overflow-hidden bg-muted">
          <TabsTrigger value="tools" className="flex-1 min-w-0 flex items-center gap-2 text-lg py-4 px-6 font-bold transition-all duration-200 truncate data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-primary/5 focus-visible:ring-2">
            <Wrench className="w-5 h-5" /> <span className="truncate">Tools</span>
          </TabsTrigger>
          <TabsTrigger value="processes" className="flex-1 min-w-0 flex items-center gap-2 text-lg py-4 px-6 font-bold transition-all duration-200 truncate data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-primary/5 focus-visible:ring-2">
            <Workflow className="w-5 h-5" /> <span className="truncate">Processes</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tools" className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 shadow-lg border-2 border-primary/10">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1"><Wrench className="w-6 h-6 text-primary" /> Add or Edit Tool</h2>
              <p className="text-muted-foreground mb-2">Create a new tool or update an existing one. Add use cases to help others understand how you use each tool.</p>
            </div>
            <Separator className="mb-4" />
            <ToolForm />
          </Card>
          <Card className="p-6 shadow-lg border-2 border-primary/10 max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1"><Wrench className="w-6 h-6 text-primary" /> Tool List</h2>
              <p className="text-muted-foreground mb-2">Browse, edit, or delete your tools. Click a tool to edit its details.</p>
            </div>
            <Separator className="mb-4" />
            <ToolList />
          </Card>
        </TabsContent>
        <TabsContent value="processes" className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 shadow-lg border-2 border-primary/10">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1"><Workflow className="w-6 h-6 text-primary" /> Add or Edit Process</h2>
              <p className="text-muted-foreground mb-2">Create a new process or update an existing one. Document your workflows for easy reference.</p>
            </div>
            <Separator className="mb-4" />
            <ProcessForm />
          </Card>
          <Card className="p-6 shadow-lg border-2 border-primary/10 max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1"><Workflow className="w-6 h-6 text-primary" /> Process List</h2>
              <p className="text-muted-foreground mb-2">Browse, edit, or delete your processes. Click a process to edit its details.</p>
            </div>
            <Separator className="mb-4" />
            <ProcessList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 