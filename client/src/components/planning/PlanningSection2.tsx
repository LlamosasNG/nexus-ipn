import {
  getTransversalAxes,
  createOrUpdateTransversalAxes,
} from '@/api/TransversalAxisAPI'
import { LoadingApp } from '@/components/LoadingApp'
import type { TransversalAxisFormValues } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { LearningRelationRow, TransversalAxesRow } from './section2'

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

export function PlanningSection2() {
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
            2. Relación con otras unidades de aprendizaje y ejes transversales
          </h3>
        </div>

        <LearningRelationRow register={register} />

        <TransversalAxesRow register={register} />
      </div>
      <input
        type="submit"
        value="Guardar"
        className="bg-[#7C2855] hover:bg-[#7C2855]/80 w-full p-3 text-white font-black text-xl cursor-pointer mt-5"
      />
    </form>
  )
}