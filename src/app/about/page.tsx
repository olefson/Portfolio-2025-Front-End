"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

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

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section with Parallax */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="container relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Jason Olefson
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            Full-stack Developer & UI/UX Enthusiast
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="container py-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-5xl mx-auto"
        >
          {/* About Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
              <CardContent className="relative p-8">
                <h2 className="text-3xl font-bold mb-4">About Me</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm a passionate full-stack developer with a keen eye for design and user experience. 
                  With over 5 years of experience in web development, I specialize in building modern, 
                  scalable applications that not only look great but also provide exceptional user experiences.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Section with Tabs */}
          <motion.div variants={itemVariants} className="mb-16">
            <Tabs defaultValue="featured" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Projects</h2>
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="all">All Projects</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="featured" className="space-y-6">
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="aspect-video rounded-lg bg-muted relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                        </div>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-semibold mb-2">Portfolio Website</h3>
                            <p className="text-muted-foreground">
                              A modern portfolio website showcasing my work and skills. Features a responsive design,
                              dark mode support, and interactive components.
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Next.js</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Tailwind CSS</Badge>
                          <Badge variant="secondary">Framer Motion</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Skills Section with Interactive Cards */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Frontend",
                  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
                  color: "from-blue-500/20 to-blue-500/5"
                },
                {
                  title: "Backend",
                  skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
                  color: "from-green-500/20 to-green-500/5"
                },
                {
                  title: "Tools & Others",
                  skills: ["Git", "Docker", "AWS", "CI/CD", "Jest"],
                  color: "from-purple-500/20 to-purple-500/5"
                }
              ].map((category, index) => (
                <Card key={category.title} className={cn(
                  "group hover:shadow-lg transition-all duration-300",
                  "bg-gradient-to-br",
                  category.color
                )}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                    <div className="flex flex-wrap gap-2">
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
              ))}
            </div>
          </motion.div>

          {/* Experience Section with Timeline */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-8">Professional Experience</h2>
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
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="md:w-1/3">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <p className="text-sm text-muted-foreground">{job.period}</p>
                      </div>
                      <div className="md:w-2/3">
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-primary">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 