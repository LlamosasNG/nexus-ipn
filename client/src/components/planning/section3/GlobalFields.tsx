import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PlanningDidacticOrganizationFormValues } from '@/types'
import type { UseFormRegister } from 'react-hook-form'

type GlobalFieldsProps = {
  register: UseFormRegister<PlanningDidacticOrganizationFormValues>
}

export function GlobalFields({ register }: GlobalFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="learningUnit"
            className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.1 Unidad de aprendizaje
          </Label>
          <Input
            id="learningUnit"
            className="min-h-16 rounded-none border-dashed border-gray-400 bg-gray-100 cursor-not-allowed"
            readOnly
            {...register('learningUnit')}
          />
        </div>
        <div>
          <Label
            htmlFor="generalPurpose"
            className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.2 Propósito u objetivo general de la unidad de aprendizaje
          </Label>
          <Textarea
            id="generalPurpose"
            rows={4}
            className="min-h-16 rounded-none border-dashed border-gray-400 bg-gray-100 leading-normal resize-none cursor-not-allowed"
            readOnly
            {...register('generalPurpose')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="learningStrategy"
            className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.3 Estrategia de aprendizaje
          </Label>
          <Input
            id="learningStrategy"
            className="min-h-16 rounded-none border-dashed border-gray-400"
            {...register('learningStrategy', {
              required: 'La estrategia de aprendizaje es obligatoria',
            })}
          />
        </div>
        <div>
          <Label
            htmlFor="teachingMethods"
            className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.4 Métodos de enseñanza
          </Label>
          <Input
            id="teachingMethods"
            className="min-h-16 rounded-none border-dashed border-gray-400"
            {...register('teachingMethods', {
              required: 'Los métodos de enseñanza son obligatorios',
            })}
          />
        </div>
      </div>
    </>
  )
}
