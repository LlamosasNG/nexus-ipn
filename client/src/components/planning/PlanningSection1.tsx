import { createGeneralData, getGeneralData } from '@/api/GeneralDataAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { useAuth } from '@/hooks/useAuth'
import type { GeneralDataFormValues, Subject } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import {
  IdentificationRow,
  SemesterModalityRow,
  SessionsHoursRow,
  TeacherRow,
  UnitTypeCreditsRow,
} from './section1'

type PlanningSection1Props = {
  subject?: Subject
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

export function PlanningSection1({ subject }: PlanningSection1Props) {
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

  const handleInvalid = (errors: Record<string, { message?: string }>) => {
    const messages = Object.values(errors)
      .filter(e => e?.message)
      .map(e => e.message)
    if (messages.length) {
      toast.error(messages.join('\n'))
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSend, handleInvalid)}>
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
      <input
        type="submit"
        value="Guardar"
        className="bg-[#7C2855] hover:bg-[#7C2855]/80 w-full p-3  text-white font-black  text-xl cursor-pointer mt-5"
      />
    </form>
  )
}
