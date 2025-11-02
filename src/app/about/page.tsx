"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Github, Linkedin, Mail, Twitter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { AboutProjectCard } from "@/components/ui/about-project-card"
import { GlassButton } from "@/components/ui/glass-button"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { Project, getImageUrl } from "@/types/project"

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

// 3D Coin Component with mouse tracking
function Coin3D({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 150, damping: 15 })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 150, damping: 15 })
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = (event.clientX - centerX) / (rect.width / 2)
    const distanceY = (event.clientY - centerY) / (rect.height / 2)
    
    mouseX.set(distanceX)
    mouseY.set(distanceY)
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={ref}
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <motion.div
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          rotateX,
          rotateY
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority
          style={{
            transform: "translateZ(20px)",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
          }}
        />
        
        {/* Coin ridges - multiple concentric circles */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{
              width: `${100 - i * 2}%`,
              height: `${100 - i * 2}%`,
              top: `${i}%`,
              left: `${i}%`,
              transform: `translateZ(${15 - i * 1.5}px)`,
              background: i % 2 === 0 
                ? "linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))"
                : "linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))"
            }}
          />
        ))}
        
        {/* Outer rim with stronger ridge effect */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-white/30"
          style={{
            transform: "translateZ(5px)",
            background: "linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)"
          }}
        />
      </motion.div>
    </div>
  )
}


export default function AboutPage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/projects/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProjects(data)
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-transparent pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Coin3D
              src="/headshot.jpg"
              alt="Jason Olefson"
              width={200}
              height={200}
              className="rounded-full border-4 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
            />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Jason Olefson
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            
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

      <div className="container py-8 px-4">
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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProjects.map((project) => (
                  <AboutProjectCard 
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    image={getImageUrl(project.imagePath)}
                    technologies={[...project.tags, ...(project.toolNames || [])]}
                    githubUrl={project.githubUrl || undefined}
                    liveUrl={project.liveUrl}
                    category={project.tags[0] || (project.toolNames && project.toolNames[0]) || "Web Development"}
                    date={project.date}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured projects available</p>
              </div>
            )}
            <div className="mt-8 text-center">
              <Button asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Skills Section */}
          {/* <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-10">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[ff
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
          </motion.div> */}

          {/* Experience Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-10">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {[
                {
                  title: "Full-Stack Developer",
                  period: "02/2025 – 08/2025",
                  company: "Impactis Global",
                  achievements: [
                    "Acted as the technical point person for a 3-member team, delegating tasks and leading daily stand-ups to ensure timely sprint delivery",
                    "Built and maintained full-stack features using React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL, integrating Stripe for secure payment processing",
                    "Monitored and managed the company's GitHub repositories, reviewing pull requests, resolving merge conflicts, and maintaining production stability",
                    "Improved UI/UX consistency and overall site performance through responsive design and accessibility updates",
                    "Implemented SEO strategies that enhanced search engine visibility and organic reach",
                    "Collaborated closely with product leads to translate business goals into scalable, high-performance web solutions"
                  ]
                },
                {
                  title: "Web Developer",
                  period: "02/2022 – 11/2024",
                  company: "Olefson Web Designs",
                  achievements: [
                    "Launched and managed websites with Amazon Web Services utilizing S3, Route 53",
                    "Independently performed code maintenance, ensured traffic remained stable",
                    "Implemented SEO strategies to ensure that pages show up on various search engines"
                  ]
                },
                {
                  title: "WordPress Developer",
                  period: "02/2021 – 06/2022",
                  company: "OER4CTE, Remote, CA",
                  achievements: [
                    "Ensured the OER4CTE website was ADA compliant",
                    "Worked collaboratively with copywriters and curriculum developers to evaluate and interpret new content"
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