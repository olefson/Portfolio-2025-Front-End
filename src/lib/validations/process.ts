import { z } from "zod"
import { ProcessCategory } from "@/types"

export const processSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  steps: z.array(z.string().min(1)).min(1, 'At least one step is required'),
  status: z.enum(['Active', 'Archived', 'Draft'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be Active, Archived, or Draft'
  }),
  category: z.nativeEnum(ProcessCategory, {
    required_error: 'Category is required',
    invalid_type_error: 'Invalid category'
  }),
  tools: z.array(z.string().min(1)).min(1, 'At least one tool is required')
}) 