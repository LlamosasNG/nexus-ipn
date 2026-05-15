import {
  getTransversalAxes,
  createOrUpdateTransversalAxes,
} from '@/api/TransversalAxisAPI'
import { LoadingApp } from '@/components/LoadingApp'
import type { TransversalAxisFormValues } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { LearningRelationRow, TransversalAxesRow } from './section2'
import { showOrderedValidationToast } from './utils/validationToast'

function buildDefaultValues(
  transversalAxis?: TransversalAxisFormValues | null
): TransversalAxisFormValues {
  return {
    antecedentes: transversalAxis?.antecedentes || '',
    laterales: transversalAxis?.laterales || '',
    subsecuentes: transversalAxis?.subsecuentes || '',
    socialCommitment: transversalAxis?.socialCommitment || '',
    genderPerspective: transversalAxis?.genderPerspective || '',
    internationalization: transversalAxis?.internationalization || '',
  }
}

type PlanningSection2Props = {
  formId?: string
  showSaveButton?: boolean
}

export function PlanningSection2({
  formId,
  showSaveButton = true,
}: PlanningSection2Props) {
  const fieldOrder = [
    'antecedentes',
    'laterales',
    'subsecuentes',
    'socialCommitment',
    'genderPerspective',
    'internationalization',
  ] as const

  const fieldLabels: Record<string, string> = {
    antecedentes: '2.1.1 Antecedentes',
    laterales: '2.1.2 Laterales',
    subsecuentes: '2.1.3 Subsecuentes',
    socialCommitment: '2.2.1 Compromiso social y sustentabilidad',
    genderPerspective:
      '2.2.2 Perspectiva, inclusión y erradicación de la violencia de género',
    internationalization: '2.2.3 Internacionalización del IPN',
  }

  const params = useParams()
  const planningId = params.planningId!

  const { data: transversalAxis, isLoading } = useQuery({
    queryKey: ['transversal-axes', planningId],
    queryFn: () => getTransversalAxes(planningId),
    retry: false,
  })

  const { mutate } = useMutation({
    mutationFn: createOrUpdateTransversalAxes,
    onSuccess: (data) => {
      toast.success(data)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<TransversalAxisFormValues>({
    defaultValues: buildDefaultValues(null),
  })

  useEffect(() => {
    if (transversalAxis) {
      reset(buildDefaultValues(transversalAxis))
    }
  }, [transversalAxis, reset])

  if (isLoading) return <LoadingApp />

  const handleSend = (formData: TransversalAxisFormValues) => {
    mutate({ planningId, formData })
  }

  const handleInvalid = (errors: FieldErrors<TransversalAxisFormValues>) => {
    showOrderedValidationToast(errors, {
      title: 'Completa los campos obligatorios de la sección 2',
      fieldOrder: [...fieldOrder],
      fieldLabels,
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit(handleSend, handleInvalid)}>
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700">
            2. Relación con otras unidades de aprendizaje y ejes transversales
          </h3>
        </div>

        <LearningRelationRow register={register} />

        <TransversalAxesRow register={register} />
      </div>
      {showSaveButton && (
        <input
          type="submit"
          value="Guardar"
          className="bg-[#7C2855] hover:bg-[#7C2855]/80 w-full p-3 text-white font-black text-xl cursor-pointer mt-5"
        />
      )}
    </form>
  )
}
