import { z } from 'zod'

export const DepartmentHeadPlanningReviewStatusSchema = z.enum([
  'Pendiente',
  'En revisión',
  'Validada',
  'Rechazada',
])

export const DepartmentHeadActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['planning', 'resource']),
  title: z.string(),
  subjectName: z.string(),
  teacherName: z.string(),
  status: z.string(),
  updatedAt: z.string(),
})

export const DepartmentHeadDashboardSchema = z.object({
  academy: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  metrics: z.object({
    totalTeachers: z.number(),
    totalPlannings: z.number(),
    pendingPlannings: z.number(),
    approvedPlannings: z.number(),
    approvedDigitalResources: z.number(),
    teacherParticipation: z.number(),
    recentActivityCount: z.number(),
  }),
  recentActivity: z.array(DepartmentHeadActivitySchema),
})

export type DepartmentHeadDashboard = z.infer<
  typeof DepartmentHeadDashboardSchema
>

export const DepartmentHeadPlanningFilterOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const DepartmentHeadPlanningSubjectFilterOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
})

export const DepartmentHeadPlanningListItemSchema = z.object({
  id: z.number(),
  period: z.string(),
  status: z.string(),
  reviewStatus: DepartmentHeadPlanningReviewStatusSchema,
  submissionDate: z.string().nullable(),
  feedback: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  teacher: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
  subject: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
  }),
  academy: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
})

export const DepartmentHeadPlanningListResponseSchema = z.object({
  data: z.array(DepartmentHeadPlanningListItemSchema),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  filters: z.object({
    teachers: z.array(DepartmentHeadPlanningFilterOptionSchema),
    subjects: z.array(DepartmentHeadPlanningSubjectFilterOptionSchema),
    academies: z.array(DepartmentHeadPlanningFilterOptionSchema),
    periods: z.array(z.string()),
    statuses: z.array(DepartmentHeadPlanningReviewStatusSchema),
  }),
})

export const DepartmentHeadPlanningDetailSchema = z.object({
  id: z.number(),
  period: z.string(),
  status: z.string(),
  reviewStatus: DepartmentHeadPlanningReviewStatusSchema,
  submissionDate: z.string().nullable(),
  feedback: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  teacher: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
  subject: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    academicUnit: z.string(),
    semester: z.string(),
    areaFormation: z.string(),
    modality: z.string(),
  }),
  academy: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  summary: z.object({
    hasGeneralData: z.boolean(),
    hasTransversalAxis: z.boolean(),
    thematicUnitsCount: z.number(),
    referencesCount: z.number(),
    plagiarismTool: z.string().nullable(),
  }),
})

export type DepartmentHeadPlanningListResponse = z.infer<
  typeof DepartmentHeadPlanningListResponseSchema
>
export type DepartmentHeadPlanningListItem = z.infer<
  typeof DepartmentHeadPlanningListItemSchema
>
export type DepartmentHeadPlanningDetail = z.infer<
  typeof DepartmentHeadPlanningDetailSchema
>
export type DepartmentHeadPlanningReviewStatus = z.infer<
  typeof DepartmentHeadPlanningReviewStatusSchema
>
