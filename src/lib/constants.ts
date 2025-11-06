export const SITE_CONFIG = {
  name: "Portfolio",
  description: "My personal portfolio website",
  url: "https://your-portfolio-url.com",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/olefson/Portfolio-2025-Front-End",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = [
  { name: "GitHub", url: SITE_CONFIG.links.github },
  { name: "LinkedIn", url: SITE_CONFIG.links.linkedin },
  { name: "Twitter", url: SITE_CONFIG.links.twitter },
];

export const GITHUB_REPO_URL = SITE_CONFIG.links.github; 