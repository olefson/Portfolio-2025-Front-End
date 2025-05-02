"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolForm } from "@/components/tool-form"
import { ProcessForm } from "@/components/process-form"
import { ToolList } from "@/components/tool-list"
import { ProcessList } from "@/components/process-list"

export default function EditPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Content</h1>
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
        </TabsList>
        <TabsContent value="tools" className="space-y-4">
          <ToolForm />
          <ToolList />
        </TabsContent>
        <TabsContent value="processes" className="space-y-4">
          <ProcessForm />
          <ProcessList />
        </TabsContent>
      </Tabs>
    </div>
  )
} 