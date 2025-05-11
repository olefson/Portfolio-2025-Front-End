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

export interface UseCase {
  title: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconUrl: string | null;
  link: string | null;
  status: string;
  acquired: Date;
  createdBy: string;
  updatedAt: Date;
  useCases?: UseCase[];
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