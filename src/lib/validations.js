import { z } from "zod"

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  description: z.string().min(1, "Description is required").max(5000, "Description cannot exceed 5000 characters"),
  type: z.enum(["ongoing", "completed"], { errorMap: () => ({ message: "Type must be 'ongoing' or 'completed'" }) }),
  // Ongoing project fields
  expectedOutcomes: z.array(z.string()).optional().default([]),
  leadMembers: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  timeline: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  funding: z.string().optional(),
  status: z.string().optional(),
  // Completed project fields
  results: z.array(z.string()).optional().default([]),
  impact: z.string().optional(),
  completionDate: z.string().optional(),
  teamSize: z.number().min(0).optional(),
  publications: z.number().min(0).optional(),
  awards: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  // Common fields
  image: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  isActive: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
})

// Event validation schema
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  description: z.string().optional(),
  type: z.enum(["upcoming", "ongoing", "past"], { errorMap: () => ({ message: "Type must be 'upcoming', 'ongoing', or 'past'" }) }),
  category: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  endDate: z.string().optional(),
  venue: z.string().optional(),
  status: z.string().optional(),
  participants: z.string().optional(),
  teams: z.string().optional(),
  registrations: z.string().optional(),
  year: z.string().optional(),
  outcome: z.string().optional(),
  duration: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
  impact: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  registrationEnabled: z.boolean().optional().default(false),
  registrationForm: z
    .array(
      z.object({
        fieldName: z.string(),
        fieldLabel: z.string(),
        fieldType: z.enum(["text", "email", "tel", "number", "textarea", "select", "checkbox", "radio", "date"]),
        required: z.boolean().optional().default(false),
        options: z.array(z.string()).optional(),
        placeholder: z.string().optional(),
        order: z.number().optional().default(0),
      })
    )
    .optional()
    .default([]),
  isActive: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
})

// Achievement validation schema
export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  impact: z.string().optional(),
  year: z.string().min(1, "Year is required"),
  isActive: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
})

// Helper function to validate and parse request body
export function validateBody(schema, body) {
  const result = schema.safeParse(body)
  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
    return { success: false, error: errors }
  }
  return { success: true, data: result.data }
}
