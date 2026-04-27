import { z } from 'zod'

/** Planning Status */
export const PlanningStatusSchema = z.enum([
  'Borrador',
  'Enviada',
  'Aprobada',
  'Rechazada',
  'Desfasado',
])
export type PlanningStatus = z.infer<typeof PlanningStatusSchema>

/** Planning Creation */
export const CreatePlanningSchema = z.object({
  period: z.string(),
})
export type CreatePlanningData = z.infer<typeof CreatePlanningSchema>

/** Planning Validation (para SubjectCard) */
export const PlanningValidationSchema = z.array(
  z.object({
    id: z.number(),
    status: PlanningStatusSchema,
  })
)

/** Planning Item (planificación completa) */
export const PlanningSchema = z.object({
  id: z.number(),
  userId: z.number(),
  subjectId: z.number(),
  period: z.string(),
  status: PlanningStatusSchema,
  submissionDate: z.string().nullable(),
  feedback: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subject: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
  }),
})
export const PlanningListSchema = z.array(PlanningSchema)
export type PlanningItem = z.infer<typeof PlanningSchema>

export const PlanningSubjectDetailsSchema = z.object({
  id: z.number(),
  userId: z.number(),
  subjectId: z.number(),
  period: z.string(),
  status: PlanningStatusSchema,
  submissionDate: z.string().nullable(),
  feedback: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subject: z.object({
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
  }),
})
/** Planning Form - General Data */
export const modalitiesSchema = z.enum([
  'Escolarizada',
  'No escolarizada',
  'Mixta',
])

const unitTypeValues = [
  'Teórica',
  'Práctica',
  'Teórica-Práctica',
  'Clínica',
  'Obligatoria',
  'Optativa',
  'Tópicos Selectos',
  'Otro',
] as const

export const typesSchema = z.preprocess(
  (val) => {
    if (!Array.isArray(val)) return val
    return val.map((v) => {
      if (typeof v !== 'string') return v
      const match = unitTypeValues.find(
        (expected) => expected.toLowerCase() === v.toLowerCase()
      )
      return match ?? v
    })
  },
  z.array(z.enum(unitTypeValues))
)

export const GeneralDataSchema = z.object({
  id: z.number(),
  academicUnit: z.string(),
  program: z.string(),
  learningUnit: z.string(),
  areaFormation: z.string(),
  semester: z.string(),
  modality: modalitiesSchema,
  unitType: typesSchema,
  creditsTepic: z.coerce.number(),
  creditsSatca: z.coerce.number(),
  academy: z.string(),
  weeksPerSemester: z.coerce.number().int(),
  sessionsPerSemester: z.object({
    classroom: z.coerce.number(),
    laboratory: z.coerce.number(),
    clinic: z.coerce.number(),
    other: z.coerce.number(),
    total: z.coerce.number(),
  }),
  hoursPerSemester: z.object({
    theory: z.coerce.number(),
    practice: z.coerce.number(),
    total1: z.coerce.number(),
    classroom: z.coerce.number(),
    laboratory: z.coerce.number(),
    clinic: z.coerce.number(),
    other: z.coerce.number(),
    total2: z.coerce.number(),
  }),
  schoolPeriod: z.string(),
  groups: z.preprocess(
    (val) => (Array.isArray(val) ? val.join(', ') : val),
    z.string()
  ),
  teacherName: z.string(),
})
export type GeneralData = z.infer<typeof GeneralDataSchema>

/** Formulario de datos generales (sin id, para crear/editar) */
export const GeneralDataFormSchema = GeneralDataSchema.omit({ id: true })
export type GeneralDataFormValues = z.infer<typeof GeneralDataFormSchema>

/** Transversal Axes */
export const TransversalAxisSchema = z.object({
  id: z.number(),
  planningId: z.number(),
  antecedentes: z.string(),
  laterales: z.string(),
  subsecuentes: z.string(),
  socialCommitment: z.string(),
  genderPerspective: z.string(),
  internationalization: z.string(),
})
export type TransversalAxis = z.infer<typeof TransversalAxisSchema>

export const TransversalAxisFormSchema = TransversalAxisSchema.omit({ id: true, planningId: true })
export type TransversalAxisFormValues = z.infer<typeof TransversalAxisFormSchema>

/** Planning Didactic Organization (3.1-3.4) */
export const PlanningDidacticOrganizationSchema = z.object({
  id: z.number(),
  planningId: z.number(),
  learningUnit: z.string(),
  generalPurpose: z.string(),
  learningStrategy: z.string(),
  teachingMethods: z.string(),
})
export type PlanningDidacticOrganization = z.infer<typeof PlanningDidacticOrganizationSchema>

export const PlanningDidacticOrganizationFormSchema = PlanningDidacticOrganizationSchema.omit({ id: true, planningId: true })
export type PlanningDidacticOrganizationFormValues = z.infer<typeof PlanningDidacticOrganizationFormSchema>

/** Weekly Hours (3.8) */
export const WeeklyHoursSchema = z.object({
  classroom: z.coerce.number(),
  laboratory: z.coerce.number(),
  workshop: z.coerce.number(),
  clinic: z.coerce.number(),
  other: z.coerce.number(),
  total: z.coerce.number(),
})
export type WeeklyHours = z.infer<typeof WeeklyHoursSchema>

/** Session Activity (3.12-3.18) */
export const SessionActivitySchema = z.object({
  id: z.number(),
  thematicUnitId: z.number(),
  sessionNumber: z.string(),
  topics: z.array(z.string()),
  activityStart: z.string(),
  activityDevelopment: z.string(),
  activityClosure: z.string(),
  resources: z.array(z.string()),
  evidence: z.string(),
  evaluationPercentage: z.coerce.number(),
  evaluationInstrument: z.string(),
  order: z.number(),
})
export type SessionActivity = z.infer<typeof SessionActivitySchema>

export const SessionActivityFormSchema = SessionActivitySchema.omit({ id: true, thematicUnitId: true })
export type SessionActivityFormValues = z.infer<typeof SessionActivityFormSchema>

/** Thematic Unit (3.5-3.11) */
export const ThematicUnitSchema = z.object({
  id: z.number(),
  planningId: z.number(),
  order: z.number(),
  name: z.string(),
  competenceObjective: z.string(),
  developmentPeriod: z.string(),
  weeklyHours: WeeklyHoursSchema,
  totalSessions: z.coerce.number(),
  evaluationPeriod: z.string(),
  expectedLearnings: z.array(z.string()),
  precisions: z.string(),
  sessions: z.array(SessionActivitySchema).optional(),
})
export type ThematicUnit = z.infer<typeof ThematicUnitSchema>

export const ThematicUnitFormSchema = ThematicUnitSchema.omit({ id: true, planningId: true, totalSessions: true, sessions: true })
export type ThematicUnitFormValues = z.infer<typeof ThematicUnitFormSchema>
