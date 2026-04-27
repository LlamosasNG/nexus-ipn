import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TransversalAxisFormValues } from '@/types'
import type { UseFormRegister } from 'react-hook-form'

type LearningRelationRowProps = {
  register: UseFormRegister<TransversalAxisFormValues>
}

export function LearningRelationRow({ register }: LearningRelationRowProps) {
  return (
    <>
      <div className="bg-[#7C2855] px-4 py-2 text-center border border-dashed">
        <h4 className="text-sm font-bold text-white">
          2.1 Unidades de aprendizaje con relación directa
        </h4>
      </div>
      <div className="grid grid-cols-[auto_1fr] border border-dashed border-gray-400">
        <Label className="bg-gray-400 px-3 py-2 text-sm border-x border-b border-dashed border-gray-600">
          2.1.1 Antecedentes
        </Label>
        <Input
          className="rounded-none border-b border-dashed"
          {...register('antecedentes', {
            required: '2.1.1 Antecedentes es requerido',
          })}
        />

        <Label className="bg-gray-400 px-3 py-2 text-sm border-x border-b border-dashed border-gray-600">
          2.1.2 Laterales
        </Label>
        <Input
          className="rounded-none border-b border-dashed"
          {...register('laterales', {
            required: '2.1.2 Laterales es requerido',
          })}
        />

        <Label className="bg-gray-400 px-3 py-2 text-sm border-x border-dashed border-gray-600">
          2.1.3 Subsecuentes
        </Label>
        <Input
          className="rounded-none border-none"
          {...register('subsecuentes', {
            required: '2.1.3 Subsecuentes es requerido',
          })}
        />
      </div>
    </>
  )
}