import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ActivityValues, LearningActivitiesFormValues } from '@/types'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'

/* ─── Empty activity template ─── */
const emptyActivity = (): ActivityValues => ({
  proposito: '',
  modalidad: '',
  estrategiaDidactica: '',
  instrucciones: '',
  evidenciaEsperada: '',
  porcentaje: 0,
  espacioComunicacion: false,
  esAutomatizada: false,
  puntajeProgramado: 0,
  numeroIntentos: 1,
  mecanismoRetroalimentacion: '',
})

/* ─── Field label ─── */
function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

/* ─── Markdown badge ─── */
function MdBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
      Markdown
    </span>
  )
}

/* ─── Toggle switch ─── */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer group w-full text-left"
    >
      <div
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#7C2855]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </button>
  )
}

/* ─── Percentage bar ─── */
function PercentageBar({ total }: { total: number }) {
  const clamped = Math.min(total, 100)
  const isValid = total === 100
  const isOver = total > 100

  const barColor = isValid ? 'bg-green-500' : isOver ? 'bg-red-500' : 'bg-amber-400'
  const textColor = isValid ? 'text-green-700' : isOver ? 'text-red-600' : 'text-amber-700'
  const bgColor = isValid ? 'bg-green-50 border-green-200' : isOver ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'

  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${textColor}`}>
          {isValid ? '✓ Porcentaje total correcto' : isOver ? '⚠ Porcentaje excede el 100%' : 'Porcentaje acumulado de calificación'}
        </span>
        <span className={`text-lg font-bold ${textColor}`}>{total}%</span>
      </div>
      <div className="h-2.5 bg-white/60 rounded-full overflow-hidden border border-white">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {!isValid && (
        <p className={`text-xs mt-2 ${textColor}`}>
          {isOver
            ? `Reduce ${total - 100}% en tus actividades para poder guardar.`
            : `Faltan ${100 - total}% por asignar para poder guardar esta sección.`}
        </p>
      )}
    </div>
  )
}

/* ─── Automated fields (conditional) ─── */
interface AutomatedFieldsProps {
  index: number
  register: UseFormRegister<LearningActivitiesFormValues>
  errors: FieldErrors<LearningActivitiesFormValues>
}
function AutomatedFields({ index, register, errors }: AutomatedFieldsProps) {
  const errs = errors.activities?.[index]
  return (
    <div className="mt-4 rounded-xl border-2 border-dashed border-[#7C2855]/30 bg-[#7C2855]/3 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <p className="text-xs font-bold uppercase tracking-widest text-[#7C2855]">
        Configuración de actividad automatizada
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Puntaje programado */}
        <div>
          <FieldLabel required>Puntaje programado</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="ej. 10"
            className={`bg-white text-sm ${errs?.puntajeProgramado ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
            {...register(`activities.${index}.puntajeProgramado`, {
              required: 'Requerido',
              min: { value: 0, message: 'Mínimo 0' },
            })}
          />
          {errs?.puntajeProgramado && (
            <p className="text-[11px] text-red-500 mt-1">{errs.puntajeProgramado.message}</p>
          )}
        </div>

        {/* Número de intentos */}
        <div>
          <FieldLabel required>Número de intentos</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="ej. 3"
            className={`bg-white text-sm ${errs?.numeroIntentos ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
            {...register(`activities.${index}.numeroIntentos`, {
              required: 'Requerido',
              min: { value: 1, message: 'Mínimo 1 intento' },
            })}
          />
          {errs?.numeroIntentos && (
            <p className="text-[11px] text-red-500 mt-1">{errs.numeroIntentos.message}</p>
          )}
        </div>
      </div>

      {/* Mecanismo de retroalimentación */}
      <div>
        <FieldLabel required>Mecanismo de retroalimentación</FieldLabel>
        <Textarea
          placeholder="Mensaje o mecanismo de retroalimentación para el estudiante tras enviar sus respuestas..."
          rows={2}
          className={`bg-white text-sm resize-none ${errs?.mecanismoRetroalimentacion ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
          {...register(`activities.${index}.mecanismoRetroalimentacion`, {
            required: 'El mecanismo de retroalimentación es obligatorio.',
          })}
        />
        {errs?.mecanismoRetroalimentacion && (
          <p className="text-[11px] text-red-500 mt-1">{errs.mecanismoRetroalimentacion.message}</p>
        )}
      </div>
    </div>
  )
}

/* ─── Activity card ─── */
interface ActivityCardProps {
  index: number
  register: UseFormRegister<LearningActivitiesFormValues>
  watch: UseFormWatch<LearningActivitiesFormValues>
  setValue: UseFormSetValue<LearningActivitiesFormValues>
  errors: FieldErrors<LearningActivitiesFormValues>
  onRemove: () => void
}
function ActivityCard({ index, register, watch, setValue, errors, onRemove }: ActivityCardProps) {
  const errs = errors.activities?.[index]
  const modalidad = watch(`activities.${index}.modalidad`)
  const esAutomatizada = watch(`activities.${index}.esAutomatizada`)
  const espacioComunicacion = watch(`activities.${index}.espacioComunicacion`)

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-gray-50 to-transparent border-b border-gray-200">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f] text-white text-sm font-bold shrink-0">
          {index + 1}
        </span>
        <span className="font-semibold text-gray-800 flex-1">Actividad {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
          aria-label="Eliminar actividad"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Propósito */}
        <div>
          <FieldLabel required>Propósito de aprendizaje de la actividad</FieldLabel>
          <Textarea
            placeholder="Describe el propósito de aprendizaje que el estudiante alcanzará con esta actividad..."
            rows={2}
            className={`bg-gray-50 text-sm resize-none ${errs?.proposito ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
            {...register(`activities.${index}.proposito`, { required: 'El propósito es obligatorio.' })}
          />
          {errs?.proposito && <p className="text-[11px] text-red-500 mt-1">{errs.proposito.message}</p>}
        </div>

        {/* Modalidad */}
        <div>
          <FieldLabel required>Modalidad de trabajo</FieldLabel>
          <div className="flex gap-2">
            {(['individual', 'collaborative'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setValue(`activities.${index}.modalidad`, opt)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 cursor-pointer ${
                  modalidad === opt
                    ? 'border-[#7C2855] bg-[#7C2855] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#7C2855]/40'
                }`}
              >
                {opt === 'individual' ? 'Trabajo Individual' : 'Trabajo Colaborativo'}
              </button>
            ))}
          </div>
          {errs?.modalidad && <p className="text-[11px] text-red-500 mt-1">Selecciona una modalidad.</p>}
        </div>

        {/* Estrategia didáctica */}
        <div>
          <FieldLabel required>Estrategia didáctica</FieldLabel>
          <select
            className={`w-full h-10 rounded-lg border px-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7C2855]/20 focus:border-[#7C2855] transition-colors ${
              errs?.estrategiaDidactica ? 'border-red-400' : 'border-gray-200'
            }`}
            {...register(`activities.${index}.estrategiaDidactica`, { required: 'Selecciona una estrategia.' })}
          >
            <option value="">Selecciona una estrategia...</option>
            <option value="problemas">Resolución de problemas</option>
            <option value="proyecto">Trabajo por proyecto</option>
            <option value="casos">Análisis de casos</option>
            <option value="otro">Otro</option>
          </select>
          {errs?.estrategiaDidactica && <p className="text-[11px] text-red-500 mt-1">{errs.estrategiaDidactica.message}</p>}
        </div>

        {/* Instrucciones (Markdown) */}
        <div>
          <FieldLabel required>
            Instrucciones claras y precisas
            <MdBadge />
          </FieldLabel>
          <Textarea
            placeholder="Redacta las instrucciones de la actividad de forma clara y precisa. Soporta Markdown."
            rows={3}
            className={`bg-gray-50 text-sm resize-none ${errs?.instrucciones ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
            {...register(`activities.${index}.instrucciones`, { required: 'Las instrucciones son obligatorias.' })}
          />
          {errs?.instrucciones && <p className="text-[11px] text-red-500 mt-1">{errs.instrucciones.message}</p>}
        </div>

        {/* Evidencia + Porcentaje */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FieldLabel required>Evidencia o producto esperado</FieldLabel>
            <Input
              placeholder="ej. Ensayo, Mapa mental, Presentación..."
              className={`bg-gray-50 text-sm ${errs?.evidenciaEsperada ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
              {...register(`activities.${index}.evidenciaEsperada`, { required: 'La evidencia es obligatoria.' })}
            />
            {errs?.evidenciaEsperada && <p className="text-[11px] text-red-500 mt-1">{errs.evidenciaEsperada.message}</p>}
          </div>
          <div>
            <FieldLabel required>Porcentaje (%)</FieldLabel>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="ej. 20"
              className={`bg-gray-50 text-sm ${errs?.porcentaje ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
              {...register(`activities.${index}.porcentaje`, {
                required: 'Requerido',
                min: { value: 0, message: 'Mín. 0' },
                max: { value: 100, message: 'Máx. 100' },
                valueAsNumber: true,
              })}
            />
            {errs?.porcentaje && <p className="text-[11px] text-red-500 mt-1">{errs.porcentaje.message}</p>}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1">
          <Toggle
            checked={!!espacioComunicacion}
            onChange={(v) => setValue(`activities.${index}.espacioComunicacion`, v)}
            label="Habilitar espacio de comunicación (foro/chat) para los participantes en esta actividad"
          />
          <Toggle
            checked={!!esAutomatizada}
            onChange={(v) => setValue(`activities.${index}.esAutomatizada`, v)}
            label="Es una actividad o ejercicio automatizado (ej. cuestionario)"
          />
        </div>

        {/* Conditional: automated block */}
        {esAutomatizada && (
          <AutomatedFields index={index} register={register} errors={errors} />
        )}
      </div>
    </div>
  )
}

/* ─── Main section ─── */
interface LearningActivitiesSectionProps {
  control: Control<LearningActivitiesFormValues>
  register: UseFormRegister<LearningActivitiesFormValues>
  errors: FieldErrors<LearningActivitiesFormValues>
  watch: UseFormWatch<LearningActivitiesFormValues>
  setValue: UseFormSetValue<LearningActivitiesFormValues>
}

export function LearningActivitiesSection({
  control,
  register,
  errors,
  watch,
  setValue,
}: LearningActivitiesSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'activities' })

  const activities = watch('activities') ?? []
  const total = activities.reduce((sum, a) => sum + (Number(a?.porcentaje) || 0), 0)

  return (
    <div className="space-y-6">
      {/* Percentage bar */}
      <PercentageBar total={total} />

      {/* Activities */}
      {fields.length > 0 ? (
        <div className="space-y-5">
          {fields.map((field, index) => (
            <ActivityCard
              key={field.id}
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-400 italic mb-1">Aún no has agregado actividades de aprendizaje.</p>
          <p className="text-xs text-gray-300">La suma de porcentajes de todas las actividades debe ser exactamente 100%.</p>
        </div>
      )}

      {/* Add activity button */}
      <button
        type="button"
        onClick={() => append(emptyActivity())}
        className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border-2 border-dashed border-[#7C2855]/30 text-[#7C2855] font-semibold hover:bg-[#7C2855]/5 hover:border-[#7C2855]/50 transition-all duration-200 cursor-pointer"
      >
        <PlusIcon className="w-5 h-5" />
        Agregar Nueva Actividad
      </button>
    </div>
  )
}
