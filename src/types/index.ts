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

export enum JobType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Contract = "Contract",
  Internship = "Internship",
  Freelance = "Freelance",
}

export enum DegreeType {
  Bachelor = "Bachelor",
  Master = "Master",
  Certificate = "Certificate",
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  degreeType: DegreeType;
  field: string;
  location: string;
  startDate: string;
  endDate: string | null;
  gpa?: number | null;
  courses?: string[];
  activities?: string[];
  updatedAt: string;
}

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood?: string | null;
  createdAt: string;
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
    twitter?: string;
    email?: string;
  }
} 