import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { PedagogicalFormValues } from '@/types'
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

/* ─────────────────────────────────────────────────────────────
   Reusable divider
   ───────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-4 mt-8">
      <div className="flex-1 h-px bg-gray-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sub-field label
   ───────────────────────────────────────────────────────────── */
function SubLabel({ children }: { children: string }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1.5">
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Generic numbered-list field for any string[] in PedagogicalFormValues
   ───────────────────────────────────────────────────────────── */
type PedagogicalArrayField = Extract<
  keyof PedagogicalFormValues,
  {
    [K in keyof PedagogicalFormValues]: PedagogicalFormValues[K] extends string[] ? K : never
  }[keyof PedagogicalFormValues]
>

interface NumberedListFieldProps {
  fieldName: PedagogicalArrayField
  placeholder: string
  emptyMessage: string
  watch: UseFormWatch<PedagogicalFormValues>
  setValue: UseFormSetValue<PedagogicalFormValues>
  error?: string
}

function NumberedListField({
  fieldName,
  placeholder,
  emptyMessage,
  watch,
  setValue,
  error,
}: NumberedListFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const items = watch(fieldName) as string[]

  const add = () => {
    const normalized = inputValue.trim()
    if (!normalized) return
    if (items.some((s) => s.toLowerCase() === normalized.toLowerCase())) {
      setInputValue('')
      return
    }
    setValue(fieldName, [...items, normalized] as never, { shouldValidate: true })
    setInputValue('')
  }

  const remove = (index: number) => {
    setValue(fieldName, items.filter((_, i) => i !== index) as never, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="bg-white border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20 h-10 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 px-4 h-10 bg-[#7C2855] hover:bg-[#5a1d3f] text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer"
        >
          Agregar
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {items.length > 0 ? (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#7C2855]/30 hover:shadow-sm transition-all duration-200"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7C2855] text-white text-[11px] font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-gray-800 leading-relaxed">{item}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-gray-300 hover:text-red-400 font-bold text-lg leading-none transition-colors cursor-pointer shrink-0 mt-0.5"
                aria-label={`Eliminar ítem ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex items-center justify-center py-3">
          <p className="text-sm text-gray-400 italic">{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Props
   ───────────────────────────────────────────────────────────── */
interface PedagogicalFrameworkSectionProps {
  register: UseFormRegister<PedagogicalFormValues>
  errors: FieldErrors<PedagogicalFormValues>
  watch: UseFormWatch<PedagogicalFormValues>
  setValue: UseFormSetValue<PedagogicalFormValues>
  thematicUnits: string[]
}

export function PedagogicalFrameworkSection({
  register,
  errors,
  watch,
  setValue,
  thematicUnits,
}: PedagogicalFrameworkSectionProps) {
  return (
    <div className="space-y-8">
      {/* ── 1. Bienvenida al RDD ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f]">
            <HandRaisedIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bienvenida al RDD</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Incluye una bienvenida al RDD en la cual menciona su propósito y su relevancia e
              impacto dentro de su proceso formativo.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Textarea
            id="pedagogical-welcome"
            placeholder="Describe la bienvenida del RDD, su propósito y la relevancia dentro del proceso formativo del estudiante..."
            rows={3}
            className={`bg-white text-sm resize-none ${
              errors.welcome
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('welcome', { required: 'El campo "Bienvenida al RDD" es obligatorio.' })}
          />
          {errors.welcome && (
            <p className="text-xs text-red-500 mt-2">{errors.welcome.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* ── 2. Competencias generales y específicas ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-[#D4AF37] to-[#e8c96f]">
            <AcademicCapIcon className="w-5 h-5 text-[#7C2855]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Competencias generales y específicas
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Presenta las competencias generales y específicas de la unidad de aprendizaje que
              aborda el RDD.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-5">
          {/* Generales */}
          <div>
            <SubLabel>Competencias generales</SubLabel>
            <NumberedListField
              fieldName="generalCompetencies"
              placeholder="Escribe una competencia general y presiona Enter o Agregar"
              emptyMessage="Aún no has agregado competencias generales."
              watch={watch}
              setValue={setValue}
              error={errors.generalCompetencies?.message}
            />
          </div>

          <div className="h-px bg-gray-200" />

          {/* Específicas */}
          <div>
            <SubLabel>Competencias específicas</SubLabel>
            <NumberedListField
              fieldName="specificCompetencies"
              placeholder="Escribe una competencia específica y presiona Enter o Agregar"
              emptyMessage="Aún no has agregado competencias específicas."
              watch={watch}
              setValue={setValue}
              error={errors.specificCompetencies?.message}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 3. Actividad diagnóstica ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f]">
            <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Actividad diagnóstica</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Incluye una actividad diagnóstica para identificar los conocimientos iniciales previos
              al desarrollo del curso y describe su finalidad.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Textarea
            id="pedagogical-diagnostic"
            placeholder="Describe la actividad diagnóstica que se utilizará y su finalidad para identificar conocimientos previos..."
            rows={3}
            className={`bg-white text-sm resize-none ${
              errors.diagnostic
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('diagnostic', {
              required: 'El campo "Actividad diagnóstica" es obligatorio.',
            })}
          />
          {errors.diagnostic && (
            <p className="text-xs text-red-500 mt-2">{errors.diagnostic.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* ── 4. Consistencia (auto-populated, read-only) ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f]">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Consistencia de nombres de unidades temáticas
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#7C2855] text-[10px] font-bold uppercase tracking-wide">
                Auto
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Los nombres de los módulos coinciden en la página principal, agenda, evaluación,
              banner y contenidos. Generado a partir de las unidades temáticas del paso anterior.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          {thematicUnits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {thematicUnits.map((unit, index) => (
                <span
                  key={unit}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7C2855]/20 text-[#7C2855] text-sm font-medium shadow-sm"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7C2855] text-white text-[10px] font-bold">
                    {index + 1}
                  </span>
                  {unit}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2">
              <CheckCircleIcon className="w-5 h-5 text-gray-300 shrink-0" />
              <p className="text-sm text-gray-400 italic">
                Aún no se han registrado unidades temáticas en Datos de Identificación.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
