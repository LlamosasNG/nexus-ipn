import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormRegister } from 'react-hook-form'
import type { ThematicUnitEditorFormValues } from './ThematicUnitCard'

type ThematicUnitFormProps = {
  register: UseFormRegister<ThematicUnitEditorFormValues>
  totalSessions: number
}

export function ThematicUnitForm({
  register,
  totalSessions,
}: ThematicUnitFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.5 Unidad temática
        </Label>
        <Input
          className="rounded-none border-dashed border-gray-400"
          placeholder="Ej: Estructura de un sistema operativo"
          {...register('name')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
            3.6 Unidad de competencia u objetivo
          </Label>
          <Textarea
            className="h-[calc(100%-2.5rem)] rounded-none border-dashed border-gray-400"
            placeholder="Identifica los sistemas operativos actuales y emergentes..."
            {...register('competenceObjective')}
          />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-0">
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <Label className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
                  3.7 Periodo de desarrollo
                </Label>
                <Input
                  className="h-[calc(100%-2.5rem)] min-h-20 rounded-none border-dashed border-gray-400"
                  placeholder="11 al 23 de febrero del 2025"
                  {...register('developmentPeriod')}
                />
              </div>

              <div className="flex-1">
                <Label className="block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
                  3.10 Periodo de registro de evaluación ordinaria
                </Label>
                <Input
                  className="h-[calc(100%-2.5rem)] min-h-20 rounded-none border-dashed border-gray-400"
                  placeholder="21 al 25 de marzo 2025"
                  {...register('evaluationPeriod')}
                />
              </div>
            </div>

            <div>
              <table className="w-full border-dashed border-gray-400">
                <tbody>
                  <tr>
                    <td
                      colSpan={2}
                      className="bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white border border-dashed border-gray-400 text-center"
                    >
                      3.8 Horas a la semana en cada espacio de mediación docente
                    </td>
                    <td className="bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white border border-dashed border-gray-400 text-center">
                      3.9 No. de sesiones totales de la unidad temática
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-semibold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">Aula</Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        min={0}
                        className="w-full h-full text-center border-none outline-none rounded-none"
                        {...register('weeklyHours.classroom', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                    <td
                      rowSpan={6}
                      className="border border-dashed border-gray-400 p-0 align-middle"
                    >
                      <Input
                        value={totalSessions}
                        readOnly
                        className="h-full min-h-62 w-full text-center border-none outline-none rounded-none bg-gray-100 cursor-not-allowed font-semibold"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-semibold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">
                        Laboratorio
                      </Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        min={0}
                        className="w-full h-full text-center border-none outline-none rounded-none"
                        {...register('weeklyHours.laboratory', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-semibold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">Taller</Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        min={0}
                        className="w-full h-full text-center border-none outline-none rounded-none"
                        {...register('weeklyHours.workshop', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-semibold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">Clínica</Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        min={0}
                        className="w-full h-full text-center border-none outline-none rounded-none"
                        {...register('weeklyHours.clinic', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-semibold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">Otro</Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        min={0}
                        className="w-full h-full text-center border-none outline-none rounded-none"
                        {...register('weeklyHours.other', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-400 px-3 text-sm font-bold border border-dashed border-gray-400">
                      <Label className="block text-right w-full">Total</Label>
                    </td>
                    <td className="border border-dashed border-gray-400 p-0">
                      <Input
                        type="number"
                        readOnly
                        className="w-full h-full text-center border-none outline-none rounded-none bg-gray-100 cursor-not-allowed"
                        {...register('weeklyHours.total', {
                          valueAsNumber: true,
                        })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="mt-10 block border border-dashed border-gray-400 bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.11 Aprendizajes esperados
        </Label>
        <Textarea
          rows={3}
          className="rounded-none border-dashed border-gray-400"
          placeholder="Escribe cada aprendizaje esperado en una línea"
          {...register('expectedLearnings')}
        />
      </div>

    </div>
  )
}
