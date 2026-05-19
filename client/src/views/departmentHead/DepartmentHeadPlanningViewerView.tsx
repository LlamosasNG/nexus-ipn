import {
  addDepartmentHeadPlanningObservation,
  getDepartmentHeadPlanningById,
  reviewDepartmentHeadPlanning,
} from '@/api/DepartmentHeadAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { PlanningFormHeader } from '@/components/planning/PlanningFormHeader'
import PlanningFooter from '@/components/planning/PlanningFooter'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import type {
  DepartmentHeadPlanningDetail,
  DepartmentHeadPlanningObservation,
} from '@/types'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { toast } from 'sonner'

const sections = [
  { id: 1, label: 'Datos' },
  { id: 2, label: 'Ejes' },
  { id: 3, label: 'Organización' },
  { id: 4, label: 'Referencias' },
  { id: 5, label: 'Plagio' },
]

const formatDateTime = (date: string | null) => {
  if (!date) return 'No disponible'

  return new Date(date).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 'Sin registrar'
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'Sin registrar'
  if (typeof value === 'number') return value.toString()
  return String(value)
}

const formatObservationTime = (date: string) =>
  new Date(date).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

function ReadOnlyField({
  label,
  value,
  className = '',
}: {
  label: string
  value: unknown
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4 ${className}`}>
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
        {formatValue(value)}
      </p>
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-700">{children}</h3>
    </div>
  )
}

function PlanningMeta({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ReadOnlyField label="Docente" value={planning.teacher.name} />
      <ReadOnlyField
        label="Unidad de aprendizaje"
        value={`${planning.subject.name} (${planning.subject.code})`}
      />
      <ReadOnlyField label="Periodo escolar" value={planning.period} />
      <ReadOnlyField
        label="Fecha de envío"
        value={formatDateTime(planning.submissionDate)}
      />
      <ReadOnlyField label="Estado de revisión" value={planning.reviewStatus} />
    </div>
  )
}

function ObservationBubble({
  observation,
}: {
  observation: DepartmentHeadPlanningObservation
}) {
  const isGeneral = observation.section === 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-gray-900">
            {observation.author.name}
          </p>
          <p className="text-xs text-gray-500">
            {isGeneral ? 'Observación general' : `Sección ${observation.section}`} ·{' '}
            {formatObservationTime(observation.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-[#7C2855]/10 px-3 py-1 text-xs font-semibold text-[#7C2855]">
          {observation.author.role}
        </span>
      </div>
      <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
        {observation.message}
      </p>
    </div>
  )
}

function ReviewPanel({
  planning,
  currentSection,
  observationDraft,
  isAddingObservation,
  onObservationDraftChange,
  onSubmitObservation,
  onOpenReviewDialog,
}: {
  planning: DepartmentHeadPlanningDetail
  currentSection: number
  observationDraft: string
  isAddingObservation: boolean
  onObservationDraftChange: (value: string) => void
  onSubmitObservation: () => void
  onOpenReviewDialog: (action: 'approve' | 'reject') => void
}) {
  const sectionObservations = planning.observations.filter(
    (observation) => observation.section === currentSection
  )
  const generalObservations = planning.observations.filter(
    (observation) => observation.section === 0
  )

  return (
    <aside className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7C2855]/10">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#7C2855]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Observaciones</h2>
          <p className="text-sm text-gray-600">
            Chat de revisión para la sección {currentSection}.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sectionObservations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
            Sin observaciones para esta sección.
          </p>
        ) : (
          sectionObservations.map((observation) => (
            <ObservationBubble key={observation.id} observation={observation} />
          ))
        )}
      </div>

      {generalObservations.length > 0 && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <p className="text-sm font-bold text-gray-800">
            Observaciones generales
          </p>
          {generalObservations.map((observation) => (
            <ObservationBubble key={observation.id} observation={observation} />
          ))}
        </div>
      )}

      {planning.canReview ? (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <Textarea
            value={observationDraft}
            onChange={(event) => onObservationDraftChange(event.target.value)}
            placeholder="Escribe una observación específica de esta sección..."
            className="min-h-28 rounded-2xl bg-white"
            maxLength={2000}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isAddingObservation}
              onClick={onSubmitObservation}
            >
              {isAddingObservation ? 'Enviando...' : 'Agregar observación'}
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onOpenReviewDialog('approve')}
            >
              <CheckCircleIcon className="h-5 w-5" />
              Aprobar
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-rose-600 hover:bg-rose-700"
              onClick={() => onOpenReviewDialog('reject')}
            >
              <XCircleIcon className="h-5 w-5" />
              Rechazar
            </Button>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Esta planeación ya fue {planning.reviewStatus.toLowerCase()} y no admite
          nuevas acciones de revisión.
        </p>
      )}
    </aside>
  )
}

function Section1({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  const data = planning.submittedContent.generalData

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <SectionTitle>1. Datos generales y de identificación</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ReadOnlyField label="1.1 Unidad Académica" value={data?.academicUnit} />
        <ReadOnlyField
          label="1.2 Programa académico / Plan de estudios"
          value={data?.program}
        />
        <ReadOnlyField label="1.3 Unidad de aprendizaje" value={data?.learningUnit} />
        <ReadOnlyField label="1.4 Semestre / Nivel" value={data?.semester} />
        <ReadOnlyField label="1.5 Área de formación" value={data?.areaFormation} />
        <ReadOnlyField label="1.6 Modalidad" value={data?.modality} />
        <ReadOnlyField label="1.7 Tipo de unidad" value={data?.unitType} />
        <ReadOnlyField label="1.8 Créditos TEPIC" value={data?.creditsTepic} />
        <ReadOnlyField label="1.8 Créditos SATCA" value={data?.creditsSatca} />
        <ReadOnlyField label="1.9 Academia" value={data?.academy} />
        <ReadOnlyField
          label="1.10 Semanas por semestre"
          value={data?.weeksPerSemester}
        />
        <ReadOnlyField label="1.13 Periodo escolar" value={data?.schoolPeriod} />
        <ReadOnlyField label="1.14 Grupo(s)" value={data?.groups} />
        <ReadOnlyField label="1.15 Docente" value={data?.teacherName} />
      </div>
    </div>
  )
}

function Section2({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  const data = planning.submittedContent.transversalAxis

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <SectionTitle>
        2. Relación con otras unidades de aprendizaje y ejes transversales
      </SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="2.1.1 Antecedentes" value={data?.antecedentes} />
        <ReadOnlyField label="2.1.2 Laterales" value={data?.laterales} />
        <ReadOnlyField label="2.1.3 Subsecuentes" value={data?.subsecuentes} />
        <ReadOnlyField
          label="2.2.1 Compromiso social y sustentabilidad"
          value={data?.socialCommitment}
        />
        <ReadOnlyField
          label="2.2.2 Perspectiva, inclusión y erradicación de la violencia de género"
          value={data?.genderPerspective}
        />
        <ReadOnlyField
          label="2.2.3 Internacionalización del IPN"
          value={data?.internationalization}
        />
      </div>
    </div>
  )
}

function Section3({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  const organization = planning.submittedContent.didacticOrganization
  const units = planning.submittedContent.thematicUnits

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <SectionTitle>3. Organización didáctica</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField
          label="3.1 Unidad de aprendizaje"
          value={organization?.learningUnit}
        />
        <ReadOnlyField
          label="3.2 Propósito general"
          value={organization?.generalPurpose}
        />
        <ReadOnlyField
          label="3.3 Estrategia de aprendizaje"
          value={organization?.learningStrategy}
        />
        <ReadOnlyField
          label="3.4 Métodos de enseñanza"
          value={organization?.teachingMethods}
        />
      </div>

      <div className="space-y-5">
        {units.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            Sin unidades temáticas registradas.
          </p>
        ) : (
          units.map((unit) => (
            <article key={unit.id} className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-lg font-bold text-gray-900">
                  {unit.order}. {unit.name}
                </h4>
                <span className="rounded-full bg-[#7C2855]/8 px-3 py-1 text-xs font-semibold text-[#7C2855]">
                  {unit.totalSessions} sesiones
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReadOnlyField
                  label="3.6 Unidad de competencia u objetivo"
                  value={unit.competenceObjective}
                />
                <ReadOnlyField
                  label="3.7 Periodo de desarrollo"
                  value={unit.developmentPeriod}
                />
                <ReadOnlyField
                  label="3.10 Periodo de evaluación ordinaria"
                  value={unit.evaluationPeriod}
                />
                <ReadOnlyField
                  label="3.11 Aprendizajes esperados"
                  value={unit.expectedLearnings}
                />
                <ReadOnlyField
                  label="3.19 Precisiones"
                  value={unit.precisions}
                  className="md:col-span-2"
                />
              </div>

              {unit.sessions && unit.sessions.length > 0 && (
                <div className="mt-5 space-y-4">
                  <p className="text-sm font-bold text-gray-800">
                    Actividades por sesión
                  </p>
                  {unit.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                          Sesión {session.sessionNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          Evaluación: {session.evaluationPercentage}%
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ReadOnlyField label="3.13 Temas" value={session.topics} />
                        <ReadOnlyField label="3.15 Recursos" value={session.resources} />
                        <ReadOnlyField label="3.14 Inicio" value={session.activityStart} />
                        <ReadOnlyField
                          label="3.14 Desarrollo"
                          value={session.activityDevelopment}
                        />
                        <ReadOnlyField label="3.14 Cierre" value={session.activityClosure} />
                        <ReadOnlyField label="3.16 Evidencia" value={session.evidence} />
                        <ReadOnlyField
                          label="3.18 Instrumento de evaluación"
                          value={session.evaluationInstrument}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}

function Section4({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  const references = planning.submittedContent.references

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <SectionTitle>4. Fuentes de información</SectionTitle>
      {references.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Sin referencias registradas.
        </p>
      ) : (
        <div className="space-y-3">
          {references.map((reference) => (
            <ReadOnlyField
              key={reference.id}
              label="Referencia"
              value={reference.text}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Section5({ planning }: { planning: DepartmentHeadPlanningDetail }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <SectionTitle>5. Herramienta de revisión antiplagio</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField
          label="Herramienta seleccionada"
          value={planning.submittedContent.plagiarismTool?.selectedTool}
        />
        <ReadOnlyField
          label="Última actualización"
          value={formatDateTime(planning.updatedAt)}
        />
        <ReadOnlyField
          label="Retroalimentación"
          value={planning.feedback || 'Sin retroalimentación registrada.'}
          className="md:col-span-2"
        />
      </div>
    </div>
  )
}

function renderSection(
  currentSection: number,
  planning: DepartmentHeadPlanningDetail
) {
  if (currentSection === 1) return <Section1 planning={planning} />
  if (currentSection === 2) return <Section2 planning={planning} />
  if (currentSection === 3) return <Section3 planning={planning} />
  if (currentSection === 4) return <Section4 planning={planning} />
  return <Section5 planning={planning} />
}

export default function DepartmentHeadPlanningViewerView() {
  const { data: user, isLoading: isLoadingUser } = useAuth()
  const { planningId } = useParams()
  const queryClient = useQueryClient()
  const [currentSection, setCurrentSection] = useState(1)
  const [observationDraft, setObservationDraft] = useState('')
  const [reviewDialogAction, setReviewDialogAction] = useState<
    'approve' | 'reject' | null
  >(null)
  const [reviewFeedback, setReviewFeedback] = useState('')

  const { data: planning, isLoading, isError, error } = useQuery({
    queryKey: ['department-head-planning-detail', planningId],
    queryFn: () => getDepartmentHeadPlanningById(Number(planningId)),
    enabled: Boolean(planningId) && user?.role === 'Jefe de Departamento',
    retry: false,
  })

  const planningNumberId = Number(planningId)

  const addObservationMutation = useMutation({
    mutationFn: () =>
      addDepartmentHeadPlanningObservation({
        planningId: planningNumberId,
        section: currentSection,
        message: observationDraft.trim(),
      }),
    onSuccess: (message) => {
      setObservationDraft('')
      queryClient.invalidateQueries({
        queryKey: ['department-head-planning-detail', planningId],
      })
      toast.success(message || 'Observación registrada correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewDepartmentHeadPlanning({
        planningId: planningNumberId,
        action: reviewDialogAction || 'reject',
        feedback: reviewFeedback.trim(),
      }),
    onSuccess: (message) => {
      setReviewDialogAction(null)
      setReviewFeedback('')
      queryClient.invalidateQueries({
        queryKey: ['department-head-planning-detail', planningId],
      })
      queryClient.invalidateQueries({ queryKey: ['department-head-plannings'] })
      toast.success(message || 'Estado actualizado correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const handleSubmitObservation = () => {
    if (!observationDraft.trim()) {
      toast.error('Escribe una observación antes de enviarla')
      return
    }

    addObservationMutation.mutate()
  }

  const handleConfirmReview = () => {
    if (!reviewDialogAction) return

    if (reviewDialogAction === 'reject' && !reviewFeedback.trim()) {
      toast.error('Agrega una retroalimentación para rechazar la planeación')
      return
    }

    reviewMutation.mutate()
  }

  if (isLoadingUser || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingApp />
      </div>
    )
  }

  if (!user) return null

  if (user.role !== 'Jefe de Departamento') {
    return <Navigate to="/my-home" replace />
  }

  if (isError || !planning) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <p className="text-lg font-bold text-gray-900">
          No fue posible cargar la planeación
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {error instanceof Error
            ? error.message
            : 'La planeación no está disponible para consulta.'}
        </p>
        <Button asChild className="mt-5 rounded-xl bg-[#7C2855]">
          <Link to="/department-head/plannings">Volver a planeaciones</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-[2rem] bg-[#7C2855] overflow-hidden">
      <div className="px-4 py-8">
        <div className="mx-auto rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/department-head/plannings">
                <ArrowLeftIcon className="h-4 w-4" />
                Volver a planeaciones
              </Link>
            </Button>
          </div>

          <PlanningFormHeader />

          <PlanningMeta planning={planning} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div>{renderSection(currentSection, planning)}</div>
            <ReviewPanel
              planning={planning}
              currentSection={currentSection}
              observationDraft={observationDraft}
              isAddingObservation={addObservationMutation.isPending}
              onObservationDraftChange={setObservationDraft}
              onSubmitObservation={handleSubmitObservation}
              onOpenReviewDialog={setReviewDialogAction}
            />
          </div>

          <PlanningFooter currentPage={currentSection} totalPages={5} />
        </div>

        <div className="mx-auto mt-6 max-w-6xl rounded-3xl bg-white/12 p-4 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Button
              type="button"
              onClick={() => setCurrentSection((section) => Math.max(section - 1, 1))}
              disabled={currentSection === 1}
              className="flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-6 font-semibold text-[#7C2855] shadow-lg transition-all duration-300 hover:bg-white disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Sección anterior
            </Button>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setCurrentSection(section.id)}
                  className={`rounded-2xl border px-3 py-3 text-center transition-all duration-300 ${
                    currentSection === section.id
                      ? 'border-white bg-white text-[#7C2855] shadow-lg'
                      : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-lg font-bold leading-none">{section.id}</div>
                  <div className="mt-1 text-[11px] font-medium leading-tight">
                    {section.label}
                  </div>
                </button>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => setCurrentSection((section) => Math.min(section + 1, 5))}
              disabled={currentSection === 5}
              className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-6 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-cyan-300 disabled:opacity-50"
            >
              Siguiente sección
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={reviewDialogAction !== null}
        onOpenChange={(open) => {
          if (!open) setReviewDialogAction(null)
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 px-6 py-5">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {reviewDialogAction === 'approve'
                ? 'Aprobar planeación'
                : 'Rechazar planeación'}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">
              Esta acción actualizará el estado de la planeación y notificará la
              decisión en la gestión del departamento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-5">
            <label className="text-sm font-semibold text-gray-700">
              Retroalimentación {reviewDialogAction === 'reject' ? 'obligatoria' : 'opcional'}
            </label>
            <Textarea
              value={reviewFeedback}
              onChange={(event) => setReviewFeedback(event.target.value)}
              placeholder="Agrega observaciones generales para el docente..."
              className="min-h-32 rounded-2xl"
              maxLength={2000}
            />
          </div>

          <DialogFooter className="border-t border-gray-200 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={reviewMutation.isPending}
              onClick={() => setReviewDialogAction(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className={`rounded-xl ${
                reviewDialogAction === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
              disabled={reviewMutation.isPending}
              onClick={handleConfirmReview}
            >
              {reviewMutation.isPending ? 'Guardando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
