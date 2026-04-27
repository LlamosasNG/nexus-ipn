import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
            className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.1 Unidad de aprendizaje
          </Label>
          <Input
            id="learningUnit"
            className="rounded-none border-dashed border-black py-12"
            readOnly
            {...register('learningUnit')}
          />
        </div>
        <div>
          <Label
            htmlFor="generalPurpose"
            className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.2 Propósito u objetivo general de la unidad de aprendizaje
          </Label>
          <Input
            id="generalPurpose"
            className="rounded-none border-dashed border-black py-12"
            readOnly
            {...register('generalPurpose')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="learningStrategy"
            className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.3 Estrategia de aprendizaje
          </Label>
          <Input
            id="learningStrategy"
            className="rounded-none border-dashed border-black py-12"
            {...register('learningStrategy')}
          />
        </div>
        <div>
          <Label
            htmlFor="teachingMethods"
            className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white"
          >
            3.4 Métodos de enseñanza
          </Label>
          <Input
            id="teachingMethods"
            className="rounded-none border-dashed border-black py-12"
            {...register('teachingMethods')}
          />
        </div>
      </div>
    </>
  )
}
