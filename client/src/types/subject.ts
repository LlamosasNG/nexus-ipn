import { AcademicPeriodSchema, PlanningValidationSchema } from '@/types/planning'
import { z } from 'zod'

/** Subjects */
export const UserSubjectSchema = z.object({
  period: AcademicPeriodSchema,
  active: z.boolean(),
})

export const SubjectRelationSchema = z.object({
  id: z.number(),
  name: z.string(),
  UserSubject: UserSubjectSchema,
})

export const SubjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  academicUnit: z.string(),
  studyPlanNames: z.array(z.string()).nullable(),
  semester: z.string(),
  areaFormation: z.string(),
  modality: z.string(),
  type: z.array(z.string()),
  creditsTepic: z.number(),
  weeksPerSemester: z.number(),
  hoursPerSemester: z
    .object({
      theory: z.number(),
      practice: z.number(),
      total1: z.number(),
      classroom: z.number(),
      laboratory: z.number(),
      clinic: z.number(),
      other: z.number(),
      total2: z.number(),
    })
    .nullable(),
  generalObjective: z.string().nullable(),
  units: z
    .array(
      z.object({
        name: z.string(),
        competency: z.string(),
      })
    )
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Subject = z.infer<typeof SubjectSchema>

/** Subject Card (vista de selección de materia) */
export const SubjectCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  academy: z.object({
    id: z.number(),
    name: z.string(),
  }),
  plannings: PlanningValidationSchema,
  UserSubject: UserSubjectSchema,
})
export const SubjectCardListSchema = z.array(SubjectCardSchema)
export type SubjectCard = z.infer<typeof SubjectCardSchema>
