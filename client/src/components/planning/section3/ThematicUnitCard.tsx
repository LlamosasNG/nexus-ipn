import { Button } from '@/components/ui/button'
import type { ThematicUnit, WeeklyHours } from '@/types'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { SessionTable } from './SessionTable'
import { ThematicUnitForm } from './ThematicUnitForm'

export type SessionEditorFormValues = {
  id: number
  sessionNumber: string
  topics: string
  activityStart: string
  activityDevelopment: string
  activityClosure: string
  resources: string
  evidence: string
  evaluationPercentage: number
  evaluationInstrument: string
  order: number
}

export type ThematicUnitEditorFormValues = {
  name: string
  competenceObjective: string
  developmentPeriod: string
  weeklyHours: WeeklyHours
  evaluationPeriod: string
  expectedLearnings: string
  precisions: string
  sessions: SessionEditorFormValues[]
}

function mapUnitToEditorValues(unit: ThematicUnit): ThematicUnitEditorFormValues {
  return {
    name: unit.name || '',
    competenceObjective: unit.competenceObjective || '',
    developmentPeriod: unit.developmentPeriod || '',
    weeklyHours: unit.weeklyHours || {
      classroom: 0,
      laboratory: 0,
      workshop: 0,
      clinic: 0,
      other: 0,
      total: 0,
    },
    evaluationPeriod: unit.evaluationPeriod || '',
    expectedLearnings: (unit.expectedLearnings || []).join('\n'),
    precisions: unit.precisions || '',
    sessions: (unit.sessions || []).map((session) => ({
      id: session.id,
      sessionNumber: session.sessionNumber || '',
      topics: (session.topics || []).join('\n'),
      activityStart: session.activityStart || '',
      activityDevelopment: session.activityDevelopment || '',
      activityClosure: session.activityClosure || '',
      resources: (session.resources || []).join('\n'),
      evidence: session.evidence || '',
      evaluationPercentage: session.evaluationPercentage || 0,
      evaluationInstrument: session.evaluationInstrument || '',
      order: session.order,
    })),
  }
}

type ThematicUnitCardProps = {
  unit: ThematicUnit
  unitIndex: number
  isSaving: boolean
  onSave: (unitId: number, values: ThematicUnitEditorFormValues) => void
  onDeleteUnit: (unitId: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  onAddSession: (unitId: number) => void
  onDeleteSession: (unitId: number, sessionId: number) => void
}

export function ThematicUnitCard({
  unit,
  unitIndex,
  isSaving,
  onSave,
  onDeleteUnit,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onAddSession,
  onDeleteSession,
}: ThematicUnitCardProps) {
  const { register, handleSubmit, control, watch, setValue, reset, getValues } =
    useForm<ThematicUnitEditorFormValues>({
      defaultValues: mapUnitToEditorValues(unit),
    })

  const { fields: sessionFields } = useFieldArray({
    control,
    name: 'sessions',
  })

  useEffect(() => {
    reset(mapUnitToEditorValues(unit))
  }, [unit, reset])

  const classroom = watch('weeklyHours.classroom') || 0
  const laboratory = watch('weeklyHours.laboratory') || 0
  const workshop = watch('weeklyHours.workshop') || 0
  const clinic = watch('weeklyHours.clinic') || 0
  const other = watch('weeklyHours.other') || 0
  const total = watch('weeklyHours.total') || 0

  useEffect(() => {
    const nextTotal = classroom + laboratory + workshop + clinic + other
    if (total !== nextTotal) {
      setValue('weeklyHours.total', nextTotal)
    }
  }, [classroom, laboratory, workshop, clinic, other, total, setValue])

  const unitRoman = useMemo(
    () =>
      [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
        'XIII',
        'XIV',
        'XV',
      ][unitIndex] || `Unidad ${unitIndex + 1}`,
    [unitIndex]
  )

  return (
    <form
      onSubmit={handleSubmit((values) => onSave(unit.id, values))}
      className="space-y-4 rounded-lg border border-dashed border-gray-400 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Unidad temática {unitRoman}
        </h4>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            Subir
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            Bajar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDeleteUnit(unit.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ThematicUnitForm register={register} />

      <SessionTable
        register={register}
        getValues={getValues}
        sessionFields={sessionFields}
        onAddSession={() => onAddSession(unit.id)}
        onDeleteSession={(sessionId) => onDeleteSession(unit.id, sessionId)}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#7C2855] hover:bg-[#7C2855]/80"
          disabled={isSaving}
        >
          Guardar unidad temática
        </Button>
      </div>
    </form>
  )
}
