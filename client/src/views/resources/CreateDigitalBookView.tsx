import { getDigitalResource, saveDigitalBookSection } from '@/api/DigitalResourceAPI'
import { getSubjectById, getUserSubjects } from '@/api/SubjectAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { ContentSection } from '@/components/resources/ContentSection'
import { CreditsSection } from '@/components/resources/CreditsSection'
import { EvaluationSection } from '@/components/resources/EvaluationSection'
import { HelpSection } from '@/components/resources/HelpSection'
import { IdentificationSection } from '@/components/resources/IdentificationSection'
import { LearningActivitiesSection } from '@/components/resources/LearningActivitiesSection'
import { MethodologySection } from '@/components/resources/MethodologySection'
import { PedagogicalFrameworkSection } from '@/components/resources/PedagogicalFrameworkSection'
import { Button } from '@/components/ui/button'
import type { ContentFormValues, CreditsSectionFormValues, DigitalResourceType, EvaluationFormValues, HelpSectionFormValues, IdentificationFormValues, LearningActivitiesFormValues, MethodologyFormValues, PedagogicalFormValues } from '@/types'
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  LifebuoyIcon,
  LightBulbIcon,
  RectangleGroupIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

const supportedResourceTypes: DigitalResourceType[] = [
  'digital-book',
  'interactive-digital-book',
]

const resourceTypeLabels: Record<DigitalResourceType, string> = {
  'digital-book': 'Libro Digital',
  'interactive-digital-book': 'Libro Digital Interactivo',
}

const stepIndexBySection = {
  identification: 0,
  pedagogical: 1,
  methodology: 2,
  content: 3,
  learningActivities: 4,
  evaluation: 5,
  help: 6,
  credits: 7,
} as const

type SavedSectionMap = Record<keyof typeof stepIndexBySection, boolean>

const buildSavedSteps = (savedSections?: Partial<SavedSectionMap>) => {
  const nextSteps = new Set<number>()

  if (!savedSections) return nextSteps

  for (const [section, isSaved] of Object.entries(savedSections)) {
    if (!isSaved) continue

    const index = stepIndexBySection[section as keyof typeof stepIndexBySection]
    if (index !== undefined) {
      nextSteps.add(index)
    }
  }

  return nextSteps
}

/* ─────────────────────────────────────────────────────────────
   Step definitions
   ───────────────────────────────────────────────────────────── */
interface StepDefinition {
  id: string
  title: string
  subtitle: string
  icon: typeof BookOpenIcon
}

const steps: StepDefinition[] = [
  {
    id: 'identification',
    title: 'Datos de Identificación',
    subtitle: 'Información inicial del RDD',
    icon: BookOpenIcon,
  },
  {
    id: 'pedagogical',
    title: 'Encuadre Pedagógico',
    subtitle: 'Finalidad del RDD en el aprendizaje',
    icon: LightBulbIcon,
  },
  {
    id: 'methodology',
    title: 'Metodología',
    subtitle: 'Cómo trabajará y será evaluado el estudiante',
    icon: Cog6ToothIcon,
  },
  {
    id: 'content',
    title: 'Contenido',
    subtitle: 'Información relevante y valiosa para el estudiante',
    icon: RectangleGroupIcon,
  },
  {
    id: 'learning-activities',
    title: 'Actividades de aprendizaje',
    subtitle: 'Desempeño esperado e instrucciones claras',
    icon: ClipboardDocumentListIcon,
  },
  {
    id: 'evaluation',
    title: 'Evaluación',
    subtitle: 'Criterios, valores y momentos de evaluación',
    icon: DocumentChartBarIcon,
  },
  {
    id: 'help',
    title: 'Ayuda',
    subtitle: 'Recursos de apoyo, referencias y glosario',
    icon: LifebuoyIcon,
  },
  {
    id: 'credits',
    title: 'Créditos',
    subtitle: 'Temporalidad, autores y publicación',
    icon: TrophyIcon,
  },
]

export default function CreateDigitalBookView() {
  const { subjectId, resourceType } = useParams()
  const selectedResourceType = supportedResourceTypes.includes(
    resourceType as DigitalResourceType
  )
    ? (resourceType as DigitalResourceType)
    : null
  const isInteractiveResource = selectedResourceType === 'interactive-digital-book'

  /* ── Stepper state ── */
  const [currentStep, setCurrentStep] = useState(0)
  const [savedSteps, setSavedSteps] = useState<Set<number>>(new Set())

  /* ── Form: Step 1 — Identification ── */
  const identificationForm = useForm<IdentificationFormValues>({
    defaultValues: {
      coverImage: '',
      interactiveDescription: '',
      title: '',
      thematicUnits: [],
    },
  })

  /* ── Form: Step 2 — Pedagogical Framework ── */
  const pedagogicalForm = useForm<PedagogicalFormValues>({
    defaultValues: {
      welcome: '',
      generalCompetencies: [],
      specificCompetencies: [],
      diagnostic: '',
    },
  })

  /* ── Form: Step 3 — Methodology ── */
  const methodologyForm = useForm<MethodologyFormValues>({
    defaultValues: {
      usage: '',
      totalPeriod: '',
      weeklyHours: '',
      advisorWorkMethod: '',
      strategies: [],
      competencies: '',
      generalObjectives: [],
      specificObjectives: [],
      accompanimentFigures: '',
    },
  })

  /* ── Form: Step 4 — Content ── */
  const contentForm = useForm<ContentFormValues>({
    defaultValues: {
      unidades: [],
    },
  })

  /* ── Form: Step 5 — Learning Activities ── */
  const learningActivitiesForm = useForm<LearningActivitiesFormValues>({
    defaultValues: {
      activities: [],
    },
  })

  /* ── Form: Step 7 — Help ── */
  const helpForm = useForm<HelpSectionFormValues>({
    defaultValues: {
      resources: [],
      references: [],
      glossary: [],
    },
  })

  /* ── Form: Step 8 — Credits ── */
  const creditsForm = useForm<CreditsSectionFormValues>({
    defaultValues: {
      fechaReferencia: '',
      authors: [],
    },
  })

  /* ── Form: Step 6 — Evaluation ── */
  const evaluationForm = useForm<EvaluationFormValues>({
    defaultValues: {
      evaluacionFinal: '',
      autoevaluacion: '',
      momentosEvaluacion: '',
    },
  })

  /* ── Percentage validation (Step 5) ── */
  const activitiesWatched = learningActivitiesForm.watch('activities')
  const totalPct = activitiesWatched?.reduce((s, a) => s + (Number(a?.porcentaje) || 0), 0) ?? 0
  const isSaveDisabled = currentStep === 4 && totalPct !== 100

  const parsedSubjectId = Number(subjectId)
  const isSupportedType = Boolean(selectedResourceType)

  const { data: userSubjects, isLoading: isLoadingUserSubjects } = useQuery({
    queryKey: ['user-subjects'],
    queryFn: getUserSubjects,
  })

  const { data: subjectDetails, isLoading: isLoadingSubjectDetails } = useQuery({
    queryKey: ['subject', parsedSubjectId],
    queryFn: () => getSubjectById(parsedSubjectId),
    enabled: Number.isFinite(parsedSubjectId) && parsedSubjectId > 0,
  })

  const { data: digitalBook, isLoading: isLoadingDigitalBook } = useQuery({
    queryKey: ['digital-resource', parsedSubjectId, selectedResourceType],
    queryFn: () =>
      getDigitalResource({
        subjectId: parsedSubjectId,
        resourceType: selectedResourceType as DigitalResourceType,
      }),
    enabled: Number.isFinite(parsedSubjectId) && parsedSubjectId > 0 && isSupportedType,
    retry: false,
  })

  const { mutate: saveSection, isPending: isSavingSection } = useMutation({
    mutationFn: saveDigitalBookSection,
    onSuccess: (response) => {
      if (!response) return
      setSavedSteps(buildSavedSteps(response.data.savedSections))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const subjectCard = userSubjects?.find((subject) => subject.id === parsedSubjectId)
  const academicProgram =
    subjectDetails?.studyPlanNames?.join(', ') || 'Sin programa académico asignado'

  useEffect(() => {
    if (!digitalBook) return

    identificationForm.reset({
      coverImage: '',
      interactiveDescription: '',
      title: '',
      thematicUnits: [],
      ...(digitalBook.identification ?? {
        coverImage: '',
        interactiveDescription: '',
        title: '',
        thematicUnits: [],
      }),
    })
    pedagogicalForm.reset(
      digitalBook.pedagogical ?? {
        welcome: '',
        generalCompetencies: [],
        specificCompetencies: [],
        diagnostic: '',
      }
    )
    methodologyForm.reset(
      digitalBook.methodology ?? {
        usage: '',
        totalPeriod: '',
        weeklyHours: '',
        advisorWorkMethod: '',
        strategies: [],
        competencies: '',
        generalObjectives: [],
        specificObjectives: [],
        accompanimentFigures: '',
      }
    )
    contentForm.reset(
      digitalBook.content ?? {
        unidades: [],
      }
    )
    learningActivitiesForm.reset(
      digitalBook.learningActivities ?? {
        activities: [],
      }
    )
    evaluationForm.reset(
      digitalBook.evaluation ?? {
        evaluacionFinal: '',
        autoevaluacion: '',
        momentosEvaluacion: '',
      }
    )
    helpForm.reset(
      digitalBook.help ?? {
        resources: [],
        references: [],
        glossary: [],
      }
    )
    creditsForm.reset(
      digitalBook.credits ?? {
        fechaReferencia: '',
        authors: [],
      }
    )
    setSavedSteps(buildSavedSteps(digitalBook.savedSections))
  }, [
    contentForm,
    creditsForm,
    digitalBook,
    evaluationForm,
    helpForm,
    identificationForm,
    learningActivitiesForm,
    methodologyForm,
    pedagogicalForm,
  ])

  /* ── Navigation helpers ── */
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const goToPrevious = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1)
  }

  const goToNext = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1)
  }

  const persistSection = (
    formData:
      | { identification: IdentificationFormValues }
      | { pedagogical: PedagogicalFormValues }
      | { methodology: MethodologyFormValues }
      | { content: ContentFormValues }
      | { learningActivities: LearningActivitiesFormValues }
      | { evaluation: EvaluationFormValues }
      | { help: HelpSectionFormValues }
      | { credits: CreditsSectionFormValues },
    successMessage: string
  ) => {
    saveSection(
      {
        subjectId: parsedSubjectId,
        resourceType: selectedResourceType as DigitalResourceType,
        formData,
      },
      {
        onSuccess: () => {
          toast.success(successMessage)
        },
      }
    )
  }

  /* ── Save handlers — one per step ── */
  const handleSaveIdentification = identificationForm.handleSubmit(
    (data) => {
      persistSection(
        { identification: data },
        'Datos de identificación guardados correctamente.'
      )
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSavePedagogical = pedagogicalForm.handleSubmit(
    (data) => {
      persistSection(
        { pedagogical: data },
        'Encuadre pedagógico guardado correctamente.'
      )
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveMethodology = methodologyForm.handleSubmit(
    (data) => {
      persistSection({ methodology: data }, 'Metodología guardada correctamente.')
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveContent = contentForm.handleSubmit(
    (data) => {
      persistSection({ content: data }, 'Contenido guardado correctamente.')
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveLearningActivities = learningActivitiesForm.handleSubmit(
    (data) => {
      persistSection(
        { learningActivities: data },
        'Actividades de aprendizaje guardadas correctamente.'
      )
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveEvaluation = evaluationForm.handleSubmit(
    (data) => {
      persistSection({ evaluation: data }, 'Evaluación guardada correctamente.')
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveHelp = helpForm.handleSubmit(
    (data) => {
      persistSection({ help: data }, 'Sección de Ayuda guardada correctamente.')
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handleSaveCredits = creditsForm.handleSubmit(
    (data) => {
      persistSection({ credits: data }, 'Créditos guardados correctamente.')
    },
    () => {
      toast.error('Revisa los campos obligatorios antes de guardar.')
    }
  )

  const handlePublish = () => {
    creditsForm.handleSubmit((data) => {
      persistSection({ credits: data }, 'Créditos guardados correctamente.')
      toast.success('¡El RDD ha sido finalizado! Toda la información será procesada y formateada conforme a los lineamientos institucionales del IPN.')
    })()
  }

  const handleSaveSection = () => {
    if (currentStep === 0) return handleSaveIdentification()
    if (currentStep === 1) return handleSavePedagogical()
    if (currentStep === 2) return handleSaveMethodology()
    if (currentStep === 3) return handleSaveContent()
    if (currentStep === 4) return handleSaveLearningActivities()
    if (currentStep === 5) return handleSaveEvaluation()
    if (currentStep === 6) return handleSaveHelp()
    if (currentStep === 7) return handleSaveCredits()
  }

  /* ── Loading / Error states ── */
  if (isLoadingUserSubjects || isLoadingSubjectDetails || isLoadingDigitalBook) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingApp />
      </div>
    )
  }

  if (!subjectCard || !subjectDetails) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Materia no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          No se encontró información suficiente para construir el recurso didáctico digital.
        </p>
        <Link
          to="/select-subject?type=resources"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C2855] text-white font-medium rounded-lg hover:bg-[#5a1d3f] transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a seleccionar materia
        </Link>
      </div>
    )
  }

  if (!isSupportedType) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <BookOpenIcon className="w-16 h-16 text-[#7C2855] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tipo de RDD en construcción
        </h2>
        <p className="text-gray-600 mb-6">
          Por ahora solo está disponible el flujo para <strong>Libro Digital</strong> y{' '}
          <strong>Libro Digital Interactivo</strong>.
        </p>
        <Link
          to={`/resources/create/${subjectId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C2855] text-white font-medium rounded-lg hover:bg-[#5a1d3f] transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a tipos de recurso
        </Link>
      </div>
    )
  }

  const activeStep = steps[currentStep]

  return (
    <div className="max-w-6xl mx-auto">
      {/* ══════════════════════════════════════════════════════════
          Step Indicator
         ══════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-8 mb-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = savedSteps.has(index)
            const isPast = index < currentStep

            return (
              <div key={step.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`
                    group flex min-h-18 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2 text-center transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? 'border-[#7C2855] bg-[#7C2855]/5 shadow-lg'
                        : isCompleted
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 hover:shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  <span
                    className={`
                      inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all duration-300
                      ${
                        isActive
                          ? 'bg-linear-to-br from-[#7C2855] to-[#5a1d3f] text-white shadow-md'
                          : isCompleted
                            ? 'bg-[#D4AF37] text-[#7C2855]'
                            : 'bg-gray-100 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? <CheckIcon className="w-4 h-4" /> : index + 1}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-bold leading-tight transition-colors sm:text-[11px] ${
                        isActive
                          ? 'text-[#7C2855]'
                          : isPast || isCompleted
                            ? 'text-gray-700'
                            : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 hidden text-[9px] leading-tight text-gray-400 lg:block">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Progress bar (mobile) */}
        <div className="sm:hidden mb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="font-semibold text-[#7C2855]">{activeStep.title}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#7C2855] to-[#D4AF37] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Section Title
         ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-[#D4AF37]">
          <activeStep.icon className="w-8 h-8 text-[#7C2855]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{activeStep.title}</h1>
          <p className="text-gray-600 mt-1">
            {activeStep.subtitle} ·{' '}
            {selectedResourceType
              ? resourceTypeLabels[selectedResourceType]
              : 'Tipo no disponible'}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Card Content
         ══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-[#7C2855] via-[#D4AF37] to-[#7C2855]" />

        <div className="px-8 md:px-12 py-8">
          {/* Step 1: Identification */}
          {currentStep === 0 && (
            <IdentificationSection
              academicUnit={subjectDetails.academicUnit}
              academicProgram={academicProgram}
              subjectName={subjectDetails.name}
              academyName={subjectCard.academy?.name || 'Sin academia asignada'}
              register={identificationForm.register}
              watch={identificationForm.watch}
              setValue={identificationForm.setValue}
              errors={identificationForm.formState.errors}
              isInteractiveResource={isInteractiveResource}
            />
          )}

          {/* Step 2: Pedagogical Framework */}
          {currentStep === 1 && (
            <PedagogicalFrameworkSection
              register={pedagogicalForm.register}
              errors={pedagogicalForm.formState.errors}
              watch={pedagogicalForm.watch}
              setValue={pedagogicalForm.setValue}
              thematicUnits={identificationForm.watch('thematicUnits')}
            />
          )}

          {/* Step 3: Methodology */}
          {currentStep === 2 && (
            <MethodologySection
              register={methodologyForm.register}
              errors={methodologyForm.formState.errors}
              watch={methodologyForm.watch}
              setValue={methodologyForm.setValue}
            />
          )}

          {/* Step 4: Content */}
          {currentStep === 3 && (
            <ContentSection
              errors={contentForm.formState.errors}
              watch={contentForm.watch}
              setValue={contentForm.setValue}
            />
          )}

          {/* Step 5: Learning Activities */}
          {currentStep === 4 && (
            <LearningActivitiesSection
              control={learningActivitiesForm.control}
              register={learningActivitiesForm.register}
              errors={learningActivitiesForm.formState.errors}
              watch={learningActivitiesForm.watch}
              setValue={learningActivitiesForm.setValue}
            />
          )}

          {/* Step 6: Evaluation */}
          {currentStep === 5 && (
            <EvaluationSection
              activities={activitiesWatched ?? []}
              diagnostic={pedagogicalForm.watch('diagnostic')}
              register={evaluationForm.register}
              errors={evaluationForm.formState.errors}
            />
          )}

          {/* Step 7: Help */}
          {currentStep === 6 && (
            <HelpSection
              control={helpForm.control}
              register={helpForm.register}
              errors={helpForm.formState.errors}
            />
          )}

          {/* Step 8: Credits */}
          {currentStep === 7 && (
            <CreditsSection
              control={creditsForm.control}
              register={creditsForm.register}
              errors={creditsForm.formState.errors}
              watch={creditsForm.watch}
              allSectionsSaved={savedSteps.size >= steps.length}
              isSaving={isSavingSection}
              onPublish={handlePublish}
            />
          )}
        </div>

        {/* ── Card Footer with Navigation ── */}
        <div className="border-t border-gray-100 bg-gray-50 px-8 md:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Left — Back */}
            <div>
              {isFirstStep ? (
                <Link
                  to={`/resources/create/${subjectId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Volver
                </Link>
              ) : (
              <Button
                  type="button"
                  onClick={goToPrevious}
                  disabled={isSavingSection}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Anterior
                </Button>
              )}
            </div>

            {/* Center — Save */}
            <Button
              type="button"
              onClick={handleSaveSection}
              disabled={isSaveDisabled || isSavingSection}
              className={`
                inline-flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg transition-all duration-300
                ${
                  isSaveDisabled || isSavingSection
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : savedSteps.has(currentStep)
                      ? 'bg-[#D4AF37] text-[#7C2855] hover:bg-[#e8c96f] cursor-pointer'
                      : 'bg-linear-to-r from-[#7C2855] to-[#5a1d3f] text-white hover:shadow-lg cursor-pointer'
                }
              `}
            >
              {isSavingSection ? (
                'Guardando...'
              ) : savedSteps.has(currentStep) ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Sección guardada
                </>
              ) : (
                'Guardar sección'
              )}
            </Button>

            {/* Right — Next */}
            <div>
              {isLastStep ? (
                <Button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-500 font-medium rounded-lg"
                >
                  Finalizar
                  <CheckIcon className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={goToNext}
                  disabled={isSavingSection}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C2855] text-white font-semibold rounded-lg hover:bg-[#5a1d3f] transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  Siguiente
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4 tracking-wide">
            Formato institucional de material didáctico digital · Instituto Politécnico Nacional
          </p>
        </div>
      </div>
    </div>
  )
}
