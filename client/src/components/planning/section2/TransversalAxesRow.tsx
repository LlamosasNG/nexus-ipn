import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { TransversalAxisFormValues } from '@/types'
import type { UseFormRegister } from 'react-hook-form'

type TransversalAxesRowProps = {
  register: UseFormRegister<TransversalAxisFormValues>
}

export function TransversalAxesRow({ register }: TransversalAxesRowProps) {
  return (
    <div>
      <div className="mt-8 bg-[#7C2855] px-4 py-2 text-center border border-dashed">
        <h4 className="text-sm font-bold text-white">
          2.2 Descripción de cómo se fomenta cada eje transversal institucional
          en la unidad de aprendizaje
        </h4>
      </div>

      <div>
        <div className="grid grid-cols-[300px_1fr] border border-dashed border-gray-600">
          <div className="bg-gray-400 px-4 flex items-center h-30 border-r border-gray-600 border-dashed">
            <Label className="text-sm">
              2.2.1 Compromiso social y sustentabilidad
            </Label>
          </div>
          <Textarea rows={6} className="rounded-none" {...register('socialCommitment', {
            required: '2.2.1 Compromiso social y sustentabilidad es requerido',
          })} />
        </div>

        <div className="grid grid-cols-[300px_1fr] border-dashed border-x border-b border-gray-600">
          <div className="bg-gray-400 px-4 flex items-center h-30 border-r border-gray-600 border-dashed">
            <Label className="text-sm">
              2.2.2 Perspectiva, inclusión y erradicación de la violencia de género
            </Label>
          </div>
          <Textarea rows={6} className="rounded-none" {...register('genderPerspective', {
            required: '2.2.2 Perspectiva, inclusión y erradicación de la violencia de género es requerido',
          })} />
        </div>

        <div className="grid grid-cols-[300px_1fr] border-dashed border-x border-b border-gray-600">
          <div className="bg-gray-400 px-4 py-3 flex items-center h-30 border-r border-gray-600 border-dashed">
            <Label className="text-sm">
              2.2.3 Internacionalización del IPN
            </Label>
          </div>
          <Textarea rows={6} className="rounded-none" {...register('internationalization', {
            required: '2.2.3 Internacionalización del IPN es requerido',
          })} />
        </div>
      </div>
    </div>
  )
}