import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Section1FormProps } from './types'

export function IdentificationRow({ register }: Section1FormProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label
          htmlFor="academicUnit"
          className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white text-center border border-dashed"
        >
          1.1 Unidad Académica
        </Label>
        <Input
          id="academicUnit"
          type="text"
          readOnly
          className="text-center border-dashed border-gray-400 rounded-none bg-gray-100 cursor-not-allowed"
          {...register('academicUnit', {
            required: 'La unidad académica es obligatoria',
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="program"
          className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white text-center border border-dashed"
        >
          1.2 Programa académico / Plan de estudios
        </Label>
        <Input
          id="program"
          type="text"
          readOnly
          className="text-center border-dashed border-gray-400 rounded-none bg-gray-100 cursor-not-allowed"
          {...register('program', {
            required: 'El programa académico es obligatorio',
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="learningUnit"
          className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white text-center border border-dashed"
        >
          1.3 Unidad de aprendizaje
        </Label>
        <Input
          id="learningUnit"
          type="text"
          readOnly
          className="text-center border-dashed border-gray-400 rounded-none bg-gray-100 cursor-not-allowed"
          {...register('learningUnit', {
            required: 'La unidad de aprendizaje es obligatoria',
          })}
        />
      </div>
    </div>
  )
}
