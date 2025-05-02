export enum ToolCategory {
  AI = "AI",
  Productivity = "Productivity",
  Development = "Development",
  Communication = "Communication",
  Design = "Design",
  Other = "Other",
}

export enum ProcessCategory {
  Personal = "Personal",
  Professional = "Professional",
  Development = "Development",
  Content = "Content",
  Other = "Other",
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconUrl?: string;
  link?: string;
  status: string;
  createdBy: string;
  updatedAt: string;
}

export interface Process {
  id: string;
  title: string;
  description: string;
  steps: string[];
  status: string;
  category: ProcessCategory;
  tools: string[];
  createdBy: string;
  updatedAt: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    linkedin: string;
    github: string;
  }
} 