"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolForm } from "@/components/tool-form"
import { ProcessForm } from "@/components/process-form"
import { ProjectForm } from "@/components/project-form"
import { ToolList } from "@/components/tool-list"
import { ProcessList } from "@/components/process-list"
import { ProjectList } from "@/components/project-list"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Wrench, Workflow, Briefcase } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function EditPage() {
  const [activeTab, setActiveTab] = useState("tools")

  const tabs = [
    {
      value: "tools",
      label: "Tools",
      icon: <Wrench className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 shadow-md border bg-card">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Wrench className="w-6 h-6" /> Add or Edit Tool
              </h2>
              <p className="text-muted-foreground mb-2">
                Create a new tool or update an existing one. Add use cases to help others understand how you use each tool.
              </p>
            </div>
            <Separator className="mb-4" />
            <ToolForm />
          </Card>
          <Card className="p-6 shadow-md border bg-card max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Wrench className="w-6 h-6" /> Tool List
              </h2>
              <p className="text-muted-foreground mb-2">
                Browse, edit, or delete your tools. Click a tool to edit its details.
              </p>
            </div>
            <Separator className="mb-4" />
            <ToolList />
          </Card>
        </div>
      ),
    },
    {
      value: "processes",
      label: "Processes",
      icon: <Workflow className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 shadow-md border bg-card">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Workflow className="w-6 h-6" /> Add or Edit Process
              </h2>
              <p className="text-muted-foreground mb-2">
                Create a new process or update an existing one. Document your workflows for easy reference.
              </p>
            </div>
            <Separator className="mb-4" />
            <ProcessForm />
          </Card>
          <Card className="p-6 shadow-md border bg-card max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Workflow className="w-6 h-6" /> Process List
              </h2>
              <p className="text-muted-foreground mb-2">
                Browse, edit, or delete your processes. Click a process to edit its details.
              </p>
            </div>
            <Separator className="mb-4" />
            <ProcessList />
          </Card>
        </div>
      ),
    },
    {
      value: "projects",
      label: "Projects",
      icon: <Briefcase className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <Card className="p-6 shadow-md border bg-card">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Briefcase className="w-6 h-6" /> Add or Edit Project
              </h2>
              <p className="text-muted-foreground mb-2">
                Create a new project or update an existing one. Add details about your work and showcase your skills.
              </p>
            </div>
            <Separator className="mb-4" />
            <ProjectForm />
          </Card>
          <Card className="p-6 shadow-md border bg-card">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                <Briefcase className="w-6 h-6" /> Project List
              </h2>
              <p className="text-muted-foreground mb-2">
                Browse, edit, or delete your projects. Click a project to edit its details.
              </p>
            </div>
            <Separator className="mb-4" />
            <ProjectList />
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">Content Management</h1>
      
      {/* Mobile Navigation */}
      <div className="md:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                {tabs.find(tab => tab.value === activeTab)?.icon}
                {tabs.find(tab => tab.value === activeTab)?.label}
              </span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {tabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(tab.value)
                  }}
                >
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full max-w-5xl mx-auto bg-card rounded-2xl shadow-xl p-6"
      >
        <TabsList className="hidden md:flex w-full mb-6 rounded-lg overflow-hidden bg-muted/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 min-w-0 flex items-center gap-2 text-lg py-4 px-6 font-semibold transition-all duration-200 truncate 
              data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm 
              hover:bg-muted focus-visible:ring-2"
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 