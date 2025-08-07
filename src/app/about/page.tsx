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
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section - Clean and Professional */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-transparent pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Jason Olefson</h1>
          <p className="text-xl md:text-2xl text-white font-light mb-8">Full-stack Developer & UI/UX Enthusiast</p>
          <div className="flex justify-center gap-6">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-[#baff39] text-[#baff39] hover:bg-[#baff39]/20 hover:text-[#0a2342]" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-[#baff39] text-[#baff39] hover:bg-[#baff39]/20 hover:text-[#0a2342]" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-[#baff39] text-[#baff39] hover:bg-[#baff39]/20 hover:text-[#0a2342]" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-[#baff39] text-[#baff39] hover:bg-[#baff39]/20 hover:text-[#0a2342]" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="h-6 w-6" />
              </a>
            </Button>
          </div>
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
            <Card className="relative overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
              <CardContent className="relative p-10">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  About Me
                </h2>
                <p className="text-xl text-white leading-relaxed">
                  I'm a passionate full-stack developer with a keen eye for design and user experience. 
                  With over 5 years of experience in web development, I specialize in building modern, 
                  scalable applications that not only look great but also provide exceptional user experiences.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Section with Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="featured" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <h2 className="text-4xl font-bold text-white">
                  Projects
                </h2>
                <TabsList className="bg-white/10 border border-white/20 backdrop-blur-md">
                  <TabsTrigger value="featured" className="data-[state=active]:bg-[#baff39]/20 data-[state=active]:text-[#baff39]">Featured</TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-[#baff39]/20 data-[state=active]:text-[#baff39]">All Projects</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="featured" className="space-y-8">
                <Card className="group hover:shadow-xl transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="aspect-video rounded-xl bg-white/10 backdrop-blur-md border border-white/10 relative overflow-hidden" />
                      </div>
                      <div className="md:w-2/3 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-3xl font-semibold mb-3 text-white">Portfolio Website</h3>
                            <p className="text-lg text-white">
                              A modern portfolio website showcasing my work and skills. Features a responsive design,
                              dark mode support, and interactive components.
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform text-[#baff39]">
                            <ArrowRight className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-white/10 text-[#baff39] border border-white/20">Next.js</Badge>
                          <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-white/10 text-[#baff39] border border-white/20">TypeScript</Badge>
                          <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-white/10 text-[#baff39] border border-white/20">Tailwind CSS</Badge>
                          <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-white/10 text-[#baff39] border border-white/20">Framer Motion</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Skills Section with Interactive Cards */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-10 text-white">
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
                <Card key={category.title} className="group hover:shadow-xl transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-white">{category.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill) => (
                        <Badge 
                          key={skill}
                          variant="secondary"
                          className="px-4 py-1.5 text-sm bg-white/10 text-[#baff39] border border-white/20 group-hover:scale-105 transition-transform"
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
            <h2 className="text-4xl font-bold mb-10 text-white">
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
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="md:w-1/3">
                        <h3 className="text-2xl font-semibold mb-2 text-white">{job.title}</h3>
                        <p className="text-lg text-white">{job.company}</p>
                        <p className="text-base text-white/70">{job.period}</p>
                      </div>
                      <div className="md:w-2/3">
                        <ul className="space-y-3 pl-0 list-disc">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="text-lg text-white flex gap-2 items-center">
                              <span className="text-[#baff39] text-xl">•</span>
                              <span>{achievement}</span>
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