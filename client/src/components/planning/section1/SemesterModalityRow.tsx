import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Controller } from 'react-hook-form'
import type { Section1ControlProps } from './types'

export function SemesterModalityRow({
  register,
  control,
}: Section1ControlProps) {
  return (
    <div className="flex gap-4">
      <div>
        <Label
          className="block bg-[#7C2855] py-2 text-sm font-semibold text-white text-center w-55 ml-15 border border-dashed"
          htmlFor="semester"
        >
          1.4 Semestre / Nivel
        </Label>
        <Input
          type="text"
          readOnly
          className="border-dashed border-gray-400 rounded-none w-55 ml-15 text-center bg-gray-100 cursor-not-allowed"
          id="semester"
          {...register('semester', {
            required: 'El semestre es obligatorio',
          })}
        />
      </div>
      <div>
        <Label
          htmlFor="areaFormation"
          className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white text-center w-90 border border-dashed"
        >
          1.5 Área de formación
        </Label>
        <Input
          id="areaFormation"
          readOnly
          className="text-center border-dashed border-gray-400 rounded-none w-90 bg-gray-100 cursor-not-allowed"
          {...register('areaFormation', {
            required: 'El área de formación es obligatoria',
          })}
        />
      </div>
      <div>
        <table className="w-full border-dashed border-gray-400">
          <tbody>
            <tr>
              <td className="bg-[#7C2855] px-3 py-1.5 text-sm font-semibold text-white w-1/3 text-center border-r border-gray-400 border border-dashed">
                1.6 Modalidad de la unidad de aprendizaje
              </td>
              <td className="border-gray-400">
                <Controller
                  name="modality"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between border border-dashed border-gray-400 px-3 py-0.5">
                        <span className="text-sm">Escolarizada</span>
                        <input
                          type="checkbox"
                          value="escolarizada"
                          checked={field.value === 'Escolarizada'}
                          onChange={() => field.onChange('Escolarizada')}
                          disabled
                          className="w-4 h-4 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex items-center justify-between border border-dashed border-gray-400 px-3 py-0.5">
                        <span className="text-sm">No escolarizada</span>
                        <input
                          type="checkbox"
                          value="no_escolarizada"
                          checked={field.value === 'No escolarizada'}
                          onChange={() => field.onChange('No escolarizada')}
                          disabled
                          className="w-4 h-4 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex items-center justify-between border border-dashed border-gray-400 px-3 py-0.5">
                        <span className="text-sm">Mixta</span>
                        <input
                          type="checkbox"
                          value="mixta"
                          checked={field.value === 'Mixta'}
                          onChange={() => field.onChange('Mixta')}
                          disabled
                          className="w-4 h-4 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
