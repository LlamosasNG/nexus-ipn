export type DigitalResourceType = 'digital-book' | 'interactive-digital-book'

export interface IdentificationSection {
  coverImage: string
  interactiveDescription: string
  title: string
  thematicUnits: string[]
}

export interface PedagogicalSection {
  welcome: string
  generalCompetencies: string[]
  specificCompetencies: string[]
  diagnostic: string
}

export interface MethodologySection {
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

export interface ContentSubtopicSection {
  id: string
  tituloSubtema: string
  contenidoInicio: string
  contenidoDesarrollo: string
  contenidoConclusion: string
}

export interface ContentTopicSection {
  id: string
  tituloTema: string
  contenidoInicio: string
  contenidoDesarrollo: string
  contenidoConclusion: string
  subtemas: ContentSubtopicSection[]
}

export interface ContentUnitSection {
  id: string
  nombreUnidad: string
  objetivoUnidad: string
  temas: ContentTopicSection[]
}

export interface ContentSection {
  unidades: ContentUnitSection[]
}

export interface LearningActivitySectionItem {
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

export interface LearningActivitiesSection {
  activities: LearningActivitySectionItem[]
}

export interface EvaluationSection {
  evaluacionFinal: string
  autoevaluacion: string
  momentosEvaluacion: string
}

export interface SupportResourceSectionItem {
  tituloRecurso: string
  urlRecurso: string
  tipoRecurso: 'tutorial' | 'guia' | 'articulo' | 'video' | 'otro' | ''
}

export interface ReferenceSectionItem {
  referenciaAPA: string
}

export interface GlossarySectionItem {
  termino: string
  definicion: string
}

export interface HelpSection {
  resources: SupportResourceSectionItem[]
  references: ReferenceSectionItem[]
  glossary: GlossarySectionItem[]
}

export interface AuthorSectionItem {
  nombreAutor: string
  semblanzaAutor: string
}

export interface CreditsSection {
  fechaReferencia: string
  authors: AuthorSectionItem[]
}

export interface DigitalBookSections {
  identification: IdentificationSection
  pedagogical: PedagogicalSection
  methodology: MethodologySection
  content: ContentSection
  learningActivities: LearningActivitiesSection
  evaluation: EvaluationSection
  help: HelpSection
  credits: CreditsSection
}

export type DigitalBookUpsertPayload = Partial<DigitalBookSections>
