/* ─────────────────────────────────────────────────────────────
   Resource form types
   ───────────────────────────────────────────────────────────── */

export interface IdentificationFormValues {
  title: string
  thematicUnits: string[]
}

export interface PedagogicalFormValues {
  welcome: string
  generalCompetencies: string[]
  specificCompetencies: string[]
  diagnostic: string
}

export interface MethodologyFormValues {
  usage: string
  totalPeriod: string
  weeklyHours: string
  advisorWorkMethod: string
  strategies: string[]
  competencies: string
  generalObjectives: string[]
  specificObjectives: string[]
  accompanimentFigures: string
}

export interface ContentSubtemaValues {
  id: string
  tituloSubtema: string
  contenidoInicio: string
  contenidoDesarrollo: string
  contenidoConclusion: string
}

export interface ContentTemaValues {
  id: string
  tituloTema: string
  contenidoInicio: string
  contenidoDesarrollo: string
  contenidoConclusion: string
  subtemas: ContentSubtemaValues[]
}

export interface ContentUnidadValues {
  id: string
  nombreUnidad: string
  objetivoUnidad: string
  temas: ContentTemaValues[]
}

export interface ContentFormValues {
  unidades: ContentUnidadValues[]
}

export interface ActivityValues {
  proposito: string
  modalidad: 'individual' | 'collaborative' | ''
  estrategiaDidactica: 'problemas' | 'proyecto' | 'casos' | 'otro' | ''
  instrucciones: string
  evidenciaEsperada: string
  porcentaje: number
  espacioComunicacion: boolean
  esAutomatizada: boolean
  puntajeProgramado: number
  numeroIntentos: number
  mecanismoRetroalimentacion: string
}

export interface LearningActivitiesFormValues {
  activities: ActivityValues[]
}

export interface EvaluationFormValues {
  evaluacionFinal: string
  autoevaluacion: string
  momentosEvaluacion: string
}

export interface SupportResourceItem {
  tituloRecurso: string
  urlRecurso: string
  tipoRecurso: 'tutorial' | 'guia' | 'articulo' | 'video' | 'otro' | ''
}

export interface ReferenceItem {
  referenciaAPA: string
}

export interface GlossaryItem {
  termino: string
  definicion: string
}

export interface HelpSectionFormValues {
  resources: SupportResourceItem[]
  references: ReferenceItem[]
  glossary: GlossaryItem[]
}

export interface AuthorItem {
  nombreAutor: string
  semblanzaAutor: string
}

export interface CreditsSectionFormValues {
  fechaReferencia: string
  authors: AuthorItem[]
}

export interface DigitalBookSavedSections {
  identification: boolean
  pedagogical: boolean
  methodology: boolean
  content: boolean
  learningActivities: boolean
  evaluation: boolean
  help: boolean
  credits: boolean
}

export interface DigitalBookResource {
  id: number
  userId: number
  subjectId: number
  resourceType: 'digital-book'
  subject: {
    id: number
    name: string
    code: string
  } | null
  identification: IdentificationFormValues | null
  pedagogical: PedagogicalFormValues | null
  methodology: MethodologyFormValues | null
  content: ContentFormValues | null
  learningActivities: LearningActivitiesFormValues | null
  evaluation: EvaluationFormValues | null
  help: HelpSectionFormValues | null
  credits: CreditsSectionFormValues | null
  savedSections: DigitalBookSavedSections
  createdAt: string
  updatedAt: string
}

export interface DigitalBookPayload {
  identification?: IdentificationFormValues
  pedagogical?: PedagogicalFormValues
  methodology?: MethodologyFormValues
  content?: ContentFormValues
  learningActivities?: LearningActivitiesFormValues
  evaluation?: EvaluationFormValues
  help?: HelpSectionFormValues
  credits?: CreditsSectionFormValues
}

