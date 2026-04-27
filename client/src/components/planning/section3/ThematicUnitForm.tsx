import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormRegister } from 'react-hook-form'
import type { ThematicUnitEditorFormValues } from './ThematicUnitCard'

type ThematicUnitFormProps = {
  register: UseFormRegister<ThematicUnitEditorFormValues>
}

export function ThematicUnitForm({ register }: ThematicUnitFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.5 Unidad temática
        </Label>
        <Input
          className="border-gray-400"
          placeholder="Ej: Estructura de un sistema operativo"
          {...register('name')}
        />
      </div>

      <div>
        <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.6 Unidad de competencia u objetivo
        </Label>
        <Textarea
          rows={3}
          className="border-gray-400"
          placeholder="Identifica los sistemas operativos actuales y emergentes..."
          {...register('competenceObjective')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
            3.7 Periodo de desarrollo
          </Label>
          <Input
            className="border-gray-400"
            placeholder="11 al 23 de febrero del 2025"
            {...register('developmentPeriod')}
          />
        </div>
        <div>
          <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
            3.10 Periodo de registro de evaluación ordinaria
          </Label>
          <Input
            className="border-gray-400"
            placeholder="21 al 25 de marzo 2025"
            {...register('evaluationPeriod')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.8 Horas a la semana en cada espacio de mediación docente
        </Label>
        <div className="grid grid-cols-6 gap-2">
          <div>
            <Label className="text-xs">Aula</Label>
            <Input
              type="number"
              min={0}
              className="border-gray-400"
              {...register('weeklyHours.classroom', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Laboratorio</Label>
            <Input
              type="number"
              min={0}
              className="border-gray-400"
              {...register('weeklyHours.laboratory', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Taller</Label>
            <Input
              type="number"
              min={0}
              className="border-gray-400"
              {...register('weeklyHours.workshop', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Clínica</Label>
            <Input
              type="number"
              min={0}
              className="border-gray-400"
              {...register('weeklyHours.clinic', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Otro</Label>
            <Input
              type="number"
              min={0}
              className="border-gray-400"
              {...register('weeklyHours.other', { valueAsNumber: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Total</Label>
            <Input
              type="number"
              readOnly
              className="border-gray-400 bg-gray-100"
              {...register('weeklyHours.total', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.11 Aprendizajes esperados
        </Label>
        <Textarea
          rows={3}
          className="border-gray-400"
          placeholder="Escribe cada aprendizaje esperado en una línea"
          {...register('expectedLearnings')}
        />
      </div>

      <div>
        <Label className="mb-2 block bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.19 Precisiones de la unidad temática
        </Label>
        <Textarea
          rows={4}
          className="border-gray-400"
          placeholder="Ingrese las precisiones de la unidad temática..."
          {...register('precisions')}
        />
      </div>
    </div>
  )
}
