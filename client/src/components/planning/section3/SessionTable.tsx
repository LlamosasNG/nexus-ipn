import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import type {
  FieldArrayWithId,
  UseFormGetValues,
  UseFormRegister,
} from 'react-hook-form'
import type { ThematicUnitEditorFormValues } from './ThematicUnitCard'

type SessionTableProps = {
  register: UseFormRegister<ThematicUnitEditorFormValues>
  getValues: UseFormGetValues<ThematicUnitEditorFormValues>
  sessionFields: FieldArrayWithId<ThematicUnitEditorFormValues, 'sessions'>[]
  onAddSession: () => void
  onDeleteSession: (sessionId: number) => void
}

export function SessionTable({
  register,
  getValues,
  sessionFields,
  onAddSession,
  onDeleteSession,
}: SessionTableProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="bg-[#7C2855] px-3 py-2 text-sm font-semibold text-white">
          3.12-3.18 Sesiones
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddSession}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Agregar sesión
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 text-left font-semibold">No.</th>
              <th className="px-2 py-1 text-left font-semibold">3.13 Temas y subtemas</th>
              <th className="px-2 py-1 text-left font-semibold">
                3.14 Descripción secuencial
              </th>
              <th className="px-2 py-1 text-left font-semibold">3.15 Recursos</th>
              <th className="px-2 py-1 text-left font-semibold">3.16 Evidencias</th>
              <th className="px-2 py-1 text-center font-semibold">3.17 %</th>
              <th className="px-2 py-1 text-left font-semibold">3.18 Instrumentos</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {sessionFields.map((session, index) => (
              <tr key={session.id} className="border-b border-dashed border-gray-400">
                <td className="px-2 py-1">
                  <Input
                    className="w-16 border-dashed text-center"
                    {...register(`sessions.${index}.sessionNumber`)}
                  />
                </td>
                <td className="px-2 py-1">
                  <Textarea
                    rows={4}
                    className="border-dashed text-sm"
                    placeholder="1.1 Aspectos básicos del SO"
                    {...register(`sessions.${index}.topics`)}
                  />
                </td>
                <td className="px-2 py-1">
                  <div className="space-y-1 text-sm">
                    <div>
                      <Label className="text-xs font-semibold">Inicio:</Label>
                      <Textarea
                        rows={2}
                        className="border-dashed text-xs"
                        {...register(`sessions.${index}.activityStart`)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Desarrollo:</Label>
                      <Textarea
                        rows={3}
                        className="border-dashed text-xs"
                        {...register(`sessions.${index}.activityDevelopment`)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Cierre:</Label>
                      <Textarea
                        rows={2}
                        className="border-dashed text-xs"
                        {...register(`sessions.${index}.activityClosure`)}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-1">
                  <Textarea
                    rows={2}
                    className="border-dashed text-sm"
                    {...register(`sessions.${index}.resources`)}
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    className="border-dashed text-sm"
                    {...register(`sessions.${index}.evidence`)}
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-16 border-dashed text-center"
                    {...register(`sessions.${index}.evaluationPercentage`, {
                      valueAsNumber: true,
                    })}
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    className="border-dashed text-sm"
                    {...register(`sessions.${index}.evaluationInstrument`)}
                  />
                </td>
                <td className="px-2 py-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onDeleteSession(getValues(`sessions.${index}.id`))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sessionFields.length === 0 && (
        <p className="py-4 text-center text-gray-500">
          No hay sesiones. Haz clic en &quot;Agregar sesión&quot; para comenzar.
        </p>
      )}
    </div>
  )
}
