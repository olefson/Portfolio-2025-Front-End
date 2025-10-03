"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Twitter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { ProjectCard } from "@/components/ui/project-card"

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Mock featured projects data
const featuredProjects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern portfolio website showcasing my work and skills. Features a responsive design, dark mode support, and interactive components.",
    image: "/placeholder.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Web Development"
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with product management, shopping cart, and payment integration.",
    image: "/placeholder.png",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Web Development"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-transparent pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Jason Olefson
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Full-stack Developer & UI/UX Enthusiast
          </motion.p>
          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="h-6 w-6" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="container py-16 px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-6xl mx-auto space-y-20"
        >
          {/* About Section */}
          <motion.div variants={itemVariants}>
            <GlowCard>
              <Card className="relative overflow-hidden">
                <CardContent className="relative p-10">
                  <h2 className="text-4xl font-bold mb-6">
                    About Me
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                  I’m a Master’s student in Computer Science with a focus on machine learning, combining hands-on experience in AI development and full-stack web engineering. My work spans from building real-world web applications for freelance clients and international EdTech companies, to academic projects tackling hospital NICU monitoring, optimized image generation, and cutting-edge NLP innovations using GAZE modules.
                  </p>
                  <br/>
                  <p className="text-xl text-muted-foreground leading-relaxed">
Alongside my technical expertise, I bring a background in business and leadership, giving me the ability to translate complex technical work into solutions that serve organizations and end users effectively. I’m seeking opportunities in machine learning engineering, AI-driven applications, or full-stack software development, with a particular interest in joining well-funded startups where I can apply both technical depth and creative problem-solving to drive real-world impact.
                  </p>
                </CardContent>
              </Card>
            </GlowCard>
          </motion.div>

          {/* Featured Projects Section */}
          <motion.div variants={itemVariants}>
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-muted-foreground text-lg">
                A selection of my most impactful work
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} showContent={true} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild>
                <a href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-10">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Frontend",
                  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
                },
                {
                  title: "Backend",
                  skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
                },
                {
                  title: "Tools & Others",
                  skills: ["Git", "Docker", "AWS", "CI/CD", "Jest"],
                }
              ].map((category, index) => (
                <GlowCard key={category.title}>
                  <Card className="group h-full">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-semibold mb-6">{category.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        {category.skills.map((skill) => (
                          <Badge 
                            key={skill}
                            variant="secondary"
                            className="group-hover:scale-105 transition-transform"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </GlowCard>
              ))}
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-10">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {[
                {
                  title: "Senior Full Stack Developer",
                  period: "2020 - Present",
                  company: "Tech Innovations Inc.",
                  achievements: [
                    "Led development of multiple web applications using React and Node.js",
                    "Implemented CI/CD pipelines reducing deployment time by 50%",
                    "Mentored junior developers and conducted code reviews"
                  ]
                },
                {
                  title: "Full Stack Developer",
                  period: "2018 - 2020",
                  company: "Digital Solutions Ltd.",
                  achievements: [
                    "Developed and maintained RESTful APIs using Express.js",
                    "Built responsive user interfaces with React and Material-UI",
                    "Optimized database queries improving application performance"
                  ]
                }
              ].map((job, index) => (
                <GlowCard key={index}>
                  <Card className="group">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="md:w-1/3">
                          <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
                          <p className="text-lg text-muted-foreground">{job.company}</p>
                          <p className="text-base text-muted-foreground">{job.period}</p>
                        </div>
                        <div className="md:w-2/3">
                          <ul className="space-y-3">
                            {job.achievements.map((achievement, i) => (
                              <li key={i} className="text-lg flex gap-2 items-start">
                                <span className="text-emerald-500 text-xl mt-1">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowCard>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 