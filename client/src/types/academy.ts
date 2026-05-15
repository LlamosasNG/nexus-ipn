import { z } from 'zod'

export const AcademySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
})
export type Academy = z.infer<typeof AcademySchema>
