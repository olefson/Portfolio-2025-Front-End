'use client';

import Link from "next/link"
import Image from "next/image"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { WarpBackground } from "@/components/ui/warp-background"
import { GITHUB_REPO_URL } from "@/lib/constants"

export default function ToolkitPage() {
  return (
    <WarpBackground className="min-h-screen">
      <main className="relative grid place-items-center min-h-screen w-full px-2 py-4 md:px-24 md:py-12 overflow-hidden">
        <div className="relative flex flex-col items-center justify-center gap-1 md:gap-4 text-center">
          {/* Content Section with higher z-index */}
          <div className="relative z-50 flex flex-col items-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl relative">
              <span className="absolute inset-0 blur-2xl opacity-30 dark:opacity-20 animate-pulse tracking-normal text-white dark:text-black">
                Jason&apos;s Stack
              </span>
              <span className="relative tracking-normal text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                Jason&apos;s Stack
              </span>
            </h1>
            <p className="max-w-[300px] mt-2 md:max-w-[400px] text-sm text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4 relative">
              <span className="absolute inset-0 blur-2xl opacity-40 dark:opacity-30 animate-pulse tracking-normal text-white dark:text-black">
                A curated collection of tools and processes I use to build, learn, and grow.
              </span>
              <span className="relative text-gray-900 dark:text-gray-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                A curated collection of tools and processes I use to build, learn, and grow.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto sm:justify-center">
              <Link
                href="/tools"
                className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50"
              >
                View My Tools
              </Link>
              <Link
                href="/processes"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              >
                View My Processes
              </Link>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Fork this template to showcase your own stack!
              </p>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
              >
                View on GitHub ↗
              </a>
            </div>
          </div>

          {/* Orbiting Circles with lower z-index */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[150vw] h-[150vh] md:w-[120vw] md:h-[120vh]">
                {/* Middle Circle Layer */}

                {/* Extra Outer Layer */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[40px] border-none bg-transparent"
                  radius={260}
                  duration={35}
                  delay={0}
                  path={false}
                >
                  <Image
                    src="/images/tools/telegram.svg"
                    alt="Discord"
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </OrbitingCircles>
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[40px] border-none bg-transparent"
                  radius={260}
                  duration={35}
                  delay={17.5}
                  path={false}
                >
                  <Image
                    src="/images/tools/canva.svg"
                    alt="Canva"
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </OrbitingCircles>

                {/* Widest Layer */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[40px] border-none bg-transparent"
                  radius={320}
                  duration={40}
                  delay={10}
                  path={false}
                >
                  <Image
                    src="/images/tools/perplexity.svg"
                    alt="Perplexity"
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </OrbitingCircles>
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[40px] border-none bg-transparent"
                  radius={320}
                  duration={40}
                  delay={30}
                  path={false}
                >
                  <Image
                    src="/images/tools/descript.svg"
                    alt="Descript"
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </OrbitingCircles>

                {/* Widest Layer 2 */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50px] border-none bg-transparent"
                  radius={380}
                  duration={45}
                  delay={5}
                  path={false}
                >
                  <Image
                    src="/images/tools/cursor.svg"
                    alt="Cursor"
                    width={50}
                    height={50}
                    className="dark:invert"
                  />
                </OrbitingCircles>
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50px] border-none bg-transparent"
                  radius={380}
                  duration={45}
                  delay={27.5}
                  path={false}
                >
                  <Image
                    src="/images/tools/firebase.svg"
                    alt="Firebase"
                    width={50}
                    height={50}
                    className="dark:invert"
                  />
                </OrbitingCircles>

                {/* Furthest Layer */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50px] border-none bg-transparent"
                  radius={620}
                  duration={65}
                  delay={15}
                  path={false}
                >
                  <Image
                    src="/images/tools/github.svg"
                    alt="GitHub"
                    width={50}
                    height={50}
                    className="dark:invert"
                  />
                </OrbitingCircles>

                {/* Ultimate Layer */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50px] border-none bg-transparent"
                  radius={500}
                  duration={55}
                  delay={20}
                  path={false}
                  reverse
                >
                  <Image
                    src="/images/tools/chatgpt.svg"
                    alt="ChatGPT"
                    width={50}
                    height={50}
                    className="dark:invert"
                  />
                </OrbitingCircles>

                {/* Final Layer */}
                <OrbitingCircles
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50px] border-none bg-transparent"
                  radius={560}
                  duration={60}
                  delay={25}
                  path={false}
                >
                  <Image
                    src="/images/tools/notion.svg"
                    alt="Notion"
                    width={50}
                    height={50}
                    className="dark:invert"
                  />
                </OrbitingCircles>
              </div>
            </div>
          </div>
        </div>
      </main>
    </WarpBackground>
  )
} 