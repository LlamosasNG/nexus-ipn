import { z } from 'zod'
import {
  AcademicPeriodSchema,
  GeneralDataSchema,
  PlanningDidacticOrganizationSchema,
  PlagiarismToolSchema,
  ReferenceSchema,
  ThematicUnitSchema,
  TransversalAxisSchema,
} from './planning'

export const DepartmentHeadPlanningReviewStatusSchema = z.enum([
  'Pendiente',
  'En revisión',
  'Validada',
  'Rechazada',
])

export const DepartmentHeadActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['planning', 'resource', 'teacher']),
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
    activeTeachers: z.number(),
    teachersWithDraftPlannings: z.number(),
    totalPlannings: z.number(),
    draftPlannings: z.number(),
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
  period: AcademicPeriodSchema,
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
    periods: z.array(AcademicPeriodSchema),
    statuses: z.array(DepartmentHeadPlanningReviewStatusSchema),
  }),
})

export const DepartmentHeadPlanningObservationSchema = z.object({
  id: z.number(),
  planningId: z.number(),
  section: z.number(),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    role: z.string(),
  }),
})

export const DepartmentHeadPlanningDetailSchema = z.object({
  id: z.number(),
  period: AcademicPeriodSchema,
  status: z.string(),
  reviewStatus: DepartmentHeadPlanningReviewStatusSchema,
  submissionDate: z.string().nullable(),
  feedback: z.string().nullable(),
  canReview: z.boolean(),
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
  submittedContent: z.object({
    generalData: GeneralDataSchema.nullable(),
    transversalAxis: TransversalAxisSchema.nullable(),
    didacticOrganization: PlanningDidacticOrganizationSchema.nullable(),
    thematicUnits: z.array(ThematicUnitSchema),
    references: z.array(ReferenceSchema),
    plagiarismTool: PlagiarismToolSchema.nullable(),
  }),
  observations: z.array(DepartmentHeadPlanningObservationSchema),
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
export type DepartmentHeadPlanningObservation = z.infer<
  typeof DepartmentHeadPlanningObservationSchema
>
export type DepartmentHeadPlanningReviewStatus = z.infer<
  typeof DepartmentHeadPlanningReviewStatusSchema
>
