import { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tool, Process } from "@/types"
import { ToolCard } from "./tool-card"
import { ProcessCard } from "./process-card"

interface TabFilterProps<T> {
  items: T[]
  type: "tool" | "process"
  categories?: string[]
  defaultCategory?: string
  renderItem?: (item: T) => ReactNode
  filterItem?: (item: T, category: string) => boolean
  gridClassName?: string
}

export function TabFilter<T>({
  items,
  type,
  categories = type === "tool" 
    ? ["All", "AI", "Productivity", "Development", "Communication", "Design", "Other"]
    : ["All", "Personal", "Professional", "Development", "Content", "Other"],
  defaultCategory = "All",
  renderItem = (item: T) => {
    if (type === "tool") {
      return <ToolCard tool={item as Tool} />
    }
    return <ProcessCard {...item as Process} />
  },
  filterItem = (item: T, category: string) => {
    const itemCategory = type === "tool" 
      ? (item as Tool).category 
      : (item as Process).category
    return category === "All" || itemCategory === category
  },
  gridClassName = "grid gap-6 sm:grid-cols-2"
}: TabFilterProps<T>) {
  return (
    <div className="relative mt-8">
      <Tabs defaultValue={defaultCategory} className="flex flex-col">
        <div className="sticky top-14 z-10 -mx-2 px-2 md:mx-0 md:px-0">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 rounded-xl">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent min-h-fit h-auto py-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full bg-muted px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="mt-4">
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className={gridClassName}>
                {category === defaultCategory
                  ? items.map((item, index) => (
                      <div key={index}>{renderItem(item)}</div>
                    ))
                  : items
                      .filter((item) => filterItem(item, category))
                      .map((item, index) => (
                        <div key={index}>{renderItem(item)}</div>
                      ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
} 