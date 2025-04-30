export interface Tool {
  id: string;
  title: string;
  status: 'Using' | 'Plan to Try' | 'Plan to Build' | 'Building' | 'Retired' | 'Trying';
  category: 'AI' | 'Productivity' | 'Development' | 'Communication' | 'Design' | 'Other';
  description: string;
  howToUse: string[];
  caveats: string[];
  url: string;
  useCases: {
    title: string;
    items: string[];
  }[];
  tips: {
    title: string;
    items: string[];
  }[];
  addedOn: string | null;
  recommendedBy: string | null;
}

export interface Process {
  id: string;
  title: string;
  description: string;
  toolsInvolved: string[];
  steps: string[];
  category: 'Personal' | 'Professional' | 'Development' | 'Content' | 'Other';
  status: 'Active' | 'Archived' | 'Draft';
  tips: {
    [key: string]: string[];
  };
  addedOn: string | null;
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