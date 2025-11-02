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
  Academic = "Academic",
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
  status: string;
  url: string | null;
  iconUrl?: string;
  link?: string;
  howToUse: any;
  caveats: any;
  tips: any;
  useCases: {
    title: string;
    items: string[];
    description?: string;
  }[];
}

export interface Process {
  id: string;
  title: string;
  description: string;
  steps: string[];
  status: string;
  category: ProcessCategory;
  tools: string[];
  tips?: { [key: string]: string[] };
  addedOn?: string;
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