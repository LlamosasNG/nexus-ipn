import { createGeneralData, getGeneralData } from '@/api/GeneralDataAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { useAuth } from '@/hooks/useAuth'
import type { GeneralDataFormValues, Subject } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { showOrderedValidationToast } from './utils/validationToast'
import {
  IdentificationRow,
  SemesterModalityRow,
  SessionsHoursRow,
  TeacherRow,
  UnitTypeCreditsRow,
} from './section1'

type PlanningSection1Props = {
  subject?: Subject
  formId?: string
  showSaveButton?: boolean
}

function buildDefaultValues(
  subject?: Subject,
  generalData?: GeneralDataFormValues | null,
  userName?: string,
  academyName?: string
): GeneralDataFormValues {
  return {
    academicUnit: generalData?.academicUnit || subject?.academicUnit || '',
    program: generalData?.program || subject?.studyPlanNames?.[0] || '',
    learningUnit: generalData?.learningUnit || subject?.name || '',
    semester: generalData?.semester || subject?.semester || '',
    areaFormation: generalData?.areaFormation || subject?.areaFormation || '',
    modality:
      (generalData?.modality as GeneralDataFormValues['modality']) ||
      (subject?.modality as GeneralDataFormValues['modality']) ||
      'Escolarizada',
    unitType: (generalData?.unitType as GeneralDataFormValues['unitType']) ||
      (subject?.type as GeneralDataFormValues['unitType']) || ['Teórica'],
    creditsTepic: generalData?.creditsTepic || subject?.creditsTepic || 0,
    creditsSatca: generalData?.creditsSatca || 0,
    academy: generalData?.academy || academyName || '',
    weeksPerSemester:
      generalData?.weeksPerSemester || subject?.weeksPerSemester || 0,
    sessionsPerSemester: generalData?.sessionsPerSemester || {
      classroom: 0,
      laboratory: 0,
      clinic: 0,
      other: 0,
      total: 0,
    },
    hoursPerSemester: generalData?.hoursPerSemester ||
      subject?.hoursPerSemester || {
        theory: 0,
        practice: 0,
        total1: 0,
        classroom: 0,
        laboratory: 0,
        clinic: 0,
        other: 0,
        total2: 0,
      },
    schoolPeriod: generalData?.schoolPeriod || '',
    groups: generalData?.groups || '',
    teacherName: generalData?.teacherName || userName || '',
  }
}

export function PlanningSection1({
  subject,
  formId,
  showSaveButton = true,
}: PlanningSection1Props) {
  const fieldOrder = [
    'academicUnit',
    'program',
    'learningUnit',
    'semester',
    'areaFormation',
    'creditsTepic',
    'creditsSatca',
    'weeksPerSemester',
    'hoursPerSemester.theory',
    'hoursPerSemester.classroom',
    'hoursPerSemester.practice',
    'hoursPerSemester.laboratory',
    'hoursPerSemester.total1',
    'hoursPerSemester.clinic',
    'hoursPerSemester.other',
    'hoursPerSemester.total2',
    'schoolPeriod',
    'groups',
  ] as const

  const fieldLabels: Record<string, string> = {
    academicUnit: '1.1 Unidad Académica',
    program: '1.2 Programa académico / Plan de estudios',
    learningUnit: '1.3 Unidad de aprendizaje',
    semester: '1.4 Semestre / Nivel',
    areaFormation: '1.5 Área de formación',
    creditsTepic: '1.8 Créditos Tepic',
    creditsSatca: '1.8 Créditos SATCA',
    weeksPerSemester: '1.10 No. de semanas por semestre',
    'hoursPerSemester.theory': '1.12 Horas por semestre - Teoría',
    'hoursPerSemester.classroom': '1.12 Horas por semestre - Aula',
    'hoursPerSemester.practice': '1.12 Horas por semestre - Práctica',
    'hoursPerSemester.laboratory': '1.12 Horas por semestre - Laboratorio',
    'hoursPerSemester.total1': '1.12 Horas por semestre - Total 1',
    'hoursPerSemester.clinic': '1.12 Horas por semestre - Clínica',
    'hoursPerSemester.other': '1.12 Horas por semestre - Otro',
    'hoursPerSemester.total2': '1.12 Horas por semestre - Total 2',
    schoolPeriod: '1.13 Periodo escolar',
    groups: '1.14 Grupo(s)',
  }

  const params = useParams()
  const planningId = params.planningId!
  const { data: user } = useAuth()

  const { data: generalData, isLoading } = useQuery({
    queryKey: ['general-data', planningId],
    queryFn: () => getGeneralData(planningId),
    retry: false
  })

  const { mutate } = useMutation({
    mutationFn: createGeneralData,
    onSuccess: (data) => {
      toast.success(data)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GeneralDataFormValues>({
    defaultValues: buildDefaultValues(subject, null, user?.name, user?.academy?.name),
  })

  // Cuando generalData llega del servidor, actualiza el formulario
  useEffect(() => {
    if (generalData) {
      reset(buildDefaultValues(subject, generalData, user?.name, user?.academy?.name))
    }
  }, [generalData, reset, subject, user?.name, user?.academy?.name])

  if (isLoading) return <LoadingApp />

  const handleSend = (formData: GeneralDataFormValues) => {
    console.log(formData)
    mutate({ planningId, formData })
  }

  const handleInvalid = (errors: FieldErrors<GeneralDataFormValues>) => {
    showOrderedValidationToast(errors, {
      title: 'Completa los campos obligatorios de la sección 1',
      fieldOrder: [...fieldOrder],
      fieldLabels,
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit(handleSend, handleInvalid)}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700">
            1. Datos generales y de identificación
          </h3>
        </div>

        {/* Row 1: 1.1-1.3 */}
        <IdentificationRow register={register} errors={errors} />

        {/* Row 2: 1.4-1.6 */}
        <SemesterModalityRow
          register={register}
          control={control}
          errors={errors}
        />

        {/* Row 3: 1.7-1.9 */}
        <UnitTypeCreditsRow
          register={register}
          control={control}
          errors={errors}
          academyName={user?.academy?.name || ''}
        />

        {/* Row 4: 1.10-1.14 */}
        <SessionsHoursRow register={register} watch={watch} setValue={setValue} errors={errors} />

        {/* Row 5: 1.15 */}
        <TeacherRow userName={user?.name || ''} />
      </div>
      {showSaveButton && (
        <input
          type="submit"
          value="Guardar"
          className="bg-[#7C2855] hover:bg-[#7C2855]/80 w-full p-3  text-white font-black  text-xl cursor-pointer mt-5"
        />
      )}
    </form>
  )
}
