import {
  createOrUpdateDidacticOrganization,
  getDidacticOrganization,
} from '@/api/DidacticOrganizationAPI'
import { getPlanningById } from '@/api/PlanningAPI'
import { createSession, deleteSession, updateSession } from '@/api/SessionActivityAPI'
import {
  createThematicUnit,
  deleteThematicUnit,
  getThematicUnits,
  reorderThematicUnits,
  updateThematicUnit,
} from '@/api/ThematicUnitAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { Button } from '@/components/ui/button'
import type {
  PlanningDidacticOrganizationFormValues,
  SessionActivityFormValues,
  ThematicUnit,
} from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { GlobalFields, ThematicUnitCard } from './section3'
import type { ThematicUnitEditorFormValues } from './section3/ThematicUnitCard'
import { showOrderedValidationToast } from './utils/validationToast'

function buildDefaultDidacticOrganization(): PlanningDidacticOrganizationFormValues {
  return {
    learningUnit: '',
    generalPurpose: '',
    learningStrategy: '',
    teachingMethods: '',
  }
}

function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

type PlanningSection3Props = {
  formId?: string
  showSaveButton?: boolean
}

export function PlanningSection3({
  formId,
  showSaveButton = true,
}: PlanningSection3Props) {
  const fieldOrder = [
    'learningStrategy',
    'teachingMethods',
  ] as const

  const fieldLabels: Record<string, string> = {
    learningStrategy: '3.3 Estrategia de aprendizaje',
    teachingMethods: '3.4 Métodos de enseñanza',
  }

  const params = useParams()
  const planningId = params.planningId!
  const queryClient = useQueryClient()
  const [thematicUnits, setThematicUnits] = useState<ThematicUnit[]>([])

  const { data: didacticOrg, isLoading: isLoadingDidactic } = useQuery({
    queryKey: ['didactic-organization', planningId],
    queryFn: () => getDidacticOrganization(planningId),
    retry: false,
  })

  const { data: planning, isLoading: isLoadingPlanning } = useQuery({
    queryKey: ['planning', planningId],
    queryFn: () => getPlanningById(Number(planningId)),
    enabled: !!planningId,
    retry: false,
  })

  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ['thematic-units', planningId],
    queryFn: () => getThematicUnits(planningId),
    retry: false,
  })

  const { register, handleSubmit, reset } =
    useForm<PlanningDidacticOrganizationFormValues>({
      defaultValues: buildDefaultDidacticOrganization(),
    })

  const mutationDidactic = useMutation({
    mutationFn: createOrUpdateDidacticOrganization,
    onSuccess: (data) => toast.success(data),
    onError: (error) => toast.error(error.message),
  })

  const mutationUnit = useMutation({
    mutationFn: createThematicUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
      toast.success('Unidad temática creada')
    },
    onError: (error) => toast.error(error.message),
  })

  const mutationSaveUnit = useMutation({
    mutationFn: async ({
      unitId,
      values,
    }: {
      unitId: number
      values: ThematicUnitEditorFormValues
    }) => {
      await updateThematicUnit({
        planningId,
        unitId,
        formData: {
          name: values.name,
          competenceObjective: values.competenceObjective,
          developmentPeriod: values.developmentPeriod,
          weeklyHours: values.weeklyHours,
          evaluationPeriod: values.evaluationPeriod,
          expectedLearnings: parseLines(values.expectedLearnings),
          precisions: values.precisions,
          order: thematicUnits.find((u) => u.id === unitId)?.order || 0,
        },
      })

      await Promise.all(
        values.sessions.map((session) =>
          updateSession({
            planningId,
            unitId,
            sessionId: session.id,
            formData: {
              sessionNumber: session.sessionNumber,
              topics: parseLines(session.topics),
              activityStart: session.activityStart,
              activityDevelopment: session.activityDevelopment,
              activityClosure: session.activityClosure,
              resources: parseLines(session.resources),
              evidence: session.evidence,
              evaluationPercentage: session.evaluationPercentage || 0,
              evaluationInstrument: session.evaluationInstrument,
              order: session.order,
            },
          })
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
      toast.success('Unidad temática guardada')
    },
    onError: (error) => toast.error(error.message),
  })

  const mutationDeleteUnit = useMutation({
    mutationFn: (unitId: number) => deleteThematicUnit(planningId, unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
      toast.success('Unidad temática eliminada')
    },
    onError: (error) => toast.error(error.message),
  })

  const mutationReorder = useMutation({
    mutationFn: (orderedIds: number[]) =>
      reorderThematicUnits(planningId, orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
    },
    onError: (error) => toast.error(error.message),
  })

  const mutationSession = useMutation({
    mutationFn: ({
      unitId,
      formData,
    }: {
      unitId: number
      formData: SessionActivityFormValues
    }) => createSession({ planningId, unitId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
      toast.success('Sesión agregada')
    },
    onError: (error) => toast.error(error.message),
  })

  const mutationDeleteSession = useMutation({
    mutationFn: ({ unitId, sessionId }: { unitId: number; sessionId: number }) =>
      deleteSession(planningId, unitId, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thematic-units', planningId] })
      toast.success('Sesión eliminada')
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (didacticOrg) {
      reset({
        learningUnit: didacticOrg.learningUnit || '',
        generalPurpose: didacticOrg.generalPurpose || '',
        learningStrategy: didacticOrg.learningStrategy || '',
        teachingMethods: didacticOrg.teachingMethods || '',
      })
      return
    }

    if (planning?.subject) {
      reset({
        learningUnit: planning.subject.name || '',
        generalPurpose: planning.subject.generalObjective || '',
        learningStrategy: '',
        teachingMethods: '',
      })
    }
  }, [didacticOrg, planning, reset])

  useEffect(() => {
    if (units) {
      setThematicUnits(units)
    }
  }, [units])

  const handleDidacticSubmit = (formData: PlanningDidacticOrganizationFormValues) => {
    mutationDidactic.mutate({ planningId, formData })
  }

  const handleDidacticInvalid = (
    errors: FieldErrors<PlanningDidacticOrganizationFormValues>
  ) => {
    showOrderedValidationToast(errors, {
      title: 'Completa los campos obligatorios de la sección 3',
      fieldOrder: [...fieldOrder],
      fieldLabels,
    })
  }

  const handleAddUnit = () => {
    if (thematicUnits.length >= 15) {
      toast.error('Máximo 15 unidades temáticas permitidas')
      return
    }

    mutationUnit.mutate({
      planningId,
      formData: {
        name: '',
        competenceObjective: '',
        developmentPeriod: '',
        weeklyHours: {
          classroom: 0,
          laboratory: 0,
          workshop: 0,
          clinic: 0,
          other: 0,
          total: 0,
        },
        evaluationPeriod: '',
        expectedLearnings: [],
        precisions: '',
        order: thematicUnits.length,
      },
    })
  }

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return
      const newUnits = [...thematicUnits]
      ;[newUnits[index - 1], newUnits[index]] = [
        newUnits[index],
        newUnits[index - 1],
      ]
      setThematicUnits(newUnits)
      mutationReorder.mutate(newUnits.map((u) => u.id))
    },
    [thematicUnits, mutationReorder]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === thematicUnits.length - 1) return
      const newUnits = [...thematicUnits]
      ;[newUnits[index], newUnits[index + 1]] = [
        newUnits[index + 1],
        newUnits[index],
      ]
      setThematicUnits(newUnits)
      mutationReorder.mutate(newUnits.map((u) => u.id))
    },
    [thematicUnits, mutationReorder]
  )

  const handleAddSession = (unitId: number) => {
    mutationSession.mutate({
      unitId,
      formData: {
        sessionNumber: '1',
        topics: [],
        activityStart: '',
        activityDevelopment: '',
        activityClosure: '',
        resources: [],
        evidence: '',
        evaluationPercentage: 0,
        evaluationInstrument: '',
        order: 0,
      },
    })
  }

  if (isLoadingDidactic || isLoadingPlanning || isLoadingUnits) return <LoadingApp />

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleDidacticSubmit, handleDidacticInvalid)}
    >
      <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-500">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700">
            3. Organización didáctica
          </h3>
        </div>

        <GlobalFields register={register} />

        {showSaveButton && (
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#7C2855] hover:bg-[#7C2855]/80">
              Guardar 3.1-3.4
            </Button>
          </div>
        )}

        <div className="my-6 border-t border-gray-300" />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-700">Unidades temáticas</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUnit}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Agregar unidad
          </Button>
        </div>

        {thematicUnits.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-gray-600">
              No hay unidades temáticas
              <br />
              <span className="text-sm text-gray-500">
                Haz clic en &quot;Agregar unidad&quot; para comenzar
              </span>
            </p>
          </div>
        )}

        {thematicUnits.map((unit, index) => (
          <ThematicUnitCard
            key={unit.id}
            unit={unit}
            unitIndex={index}
            isSaving={mutationSaveUnit.isPending}
            onSave={(unitId, values) => mutationSaveUnit.mutate({ unitId, values })}
            onDeleteUnit={(unitId) => mutationDeleteUnit.mutate(unitId)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            canMoveUp={index > 0}
            canMoveDown={index < thematicUnits.length - 1}
            onAddSession={handleAddSession}
            onDeleteSession={(unitId, sessionId) =>
              mutationDeleteSession.mutate({ unitId, sessionId })
            }
          />
        ))}
      </div>
    </form>
  )
}
