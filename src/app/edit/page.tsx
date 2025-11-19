"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolForm } from "@/components/tool-form"
import { ProcessForm } from "@/components/process-form"
import { ProjectForm } from "@/components/project-form"
import { DiaryForm } from "@/components/diary-form"
import { JobForm } from "@/components/job-form"
import { EducationForm } from "@/components/education-form"
import { ToolList } from "@/components/tool-list"
import { ProcessList } from "@/components/process-list"
import { ProjectList } from "@/components/project-list"
import { DiaryList } from "@/components/diary-list"
import { JobList } from "@/components/job-list"
import { EducationList } from "@/components/education-list"
import { FeaturedProjectsManager } from "@/components/featured-projects-manager"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Wrench, Workflow, Briefcase, BookOpen, GraduationCap } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export default function EditPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tools")

  useEffect(() => {
    // Check for secret key in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const secretKey = urlParams.get('key')
    
    // Your secret key
    const expectedKey = 'F!shyL0ve'
    
    if (secretKey === expectedKey) {
      setIsAuthorized(true)
    }
    
    setIsLoading(false)
  }, [])

  // Show 404 if not authorized
  if (!isLoading && !isAuthorized) {
    notFound()
  }

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      value: "tools",
      label: "Tools",
      icon: <Wrench className="w-5 h-5" />,
      content: (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Tool
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Create a new tool or update an existing one. Add use cases to help others understand how you use each tool.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <ToolForm />
          </Card>
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6" /> Tool List
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Browse, edit, or delete your tools. Click a tool to edit its details.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
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
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Workflow className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Process
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Create a new process or update an existing one. Document your workflows for easy reference.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <ProcessForm />
          </Card>
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Workflow className="w-5 h-5 sm:w-6 sm:h-6" /> Process List
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Browse, edit, or delete your processes. Click a process to edit its details.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
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
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Project Management */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
            <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Project
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-2">
                  Create a new project or update an existing one. GitHub URL is optional, and no dates are required.
                </p>
              </div>
              <Separator className="mb-3 sm:mb-4" />
              <ProjectForm />
            </Card>
            <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> Project List
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-2">
                  Browse, edit, or delete your projects. Click a project to edit its details.
                </p>
              </div>
              <Separator className="mb-3 sm:mb-4" />
              <ProjectList />
            </Card>
          </div>
          
          {/* Featured Projects Management */}
          <div className="order-3">
          <FeaturedProjectsManager />
          </div>
        </div>
      ),
    },
    {
      value: "diary",
      label: "Diary",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Diary Entry
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Create diary entries for chatbot personality. These are private and never shown to visitors.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <DiaryForm />
          </Card>
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" /> Diary List
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Browse, filter, and manage your diary entries with advanced analytics.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <DiaryList />
          </Card>
        </div>
      ),
    },
    {
      value: "jobs",
      label: "Jobs",
      icon: <Briefcase className="w-5 h-5" />,
      content: (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Job
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Create a new job entry or update an existing one. This information is public and visible to visitors.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <JobForm />
          </Card>
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> Job List
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Browse, edit, or delete your job entries. Click a job to edit its details.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <JobList />
          </Card>
        </div>
      ),
    },
    {
      value: "education",
      label: "Education",
      icon: <GraduationCap className="w-5 h-5" />,
      content: (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card order-1">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" /> Add or Edit Education
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Create a new education entry or update an existing one. This information is public and visible to visitors.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <EducationForm />
          </Card>
          <Card className="w-full p-4 sm:p-5 md:p-6 shadow-md border bg-card max-h-[60vh] md:max-h-[70vh] overflow-y-auto order-2">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" /> Education List
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Browse, edit, or delete your education entries. Click an entry to edit its details.
              </p>
            </div>
            <Separator className="mb-3 sm:mb-4" />
            <EducationList />
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="container py-4 sm:py-6 md:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-center tracking-tight">Content Management</h1>
      
      {/* Mobile Navigation - Horizontal Scrollable Tabs */}
      <div className="md:hidden mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {tabs.map((tab) => (
                <Button
                  key={tab.value}
              variant={activeTab === tab.value ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 gap-2 whitespace-nowrap"
              onClick={() => setActiveTab(tab.value)}
                >
                    {tab.icon}
              <span>{tab.label}</span>
                </Button>
              ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full bg-card rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 sm:p-5 md:p-6"
      >
        <TabsList className="hidden md:flex w-full mb-6 rounded-lg overflow-hidden bg-muted/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 min-w-0 flex items-center gap-2 text-base md:text-lg py-3 md:py-4 px-4 md:px-6 font-semibold transition-all duration-200 truncate 
              data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm 
              hover:bg-muted focus-visible:ring-2"
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 