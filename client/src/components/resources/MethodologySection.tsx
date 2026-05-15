import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { MethodologyFormValues } from '@/types'
import {
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid'
import type { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { useState } from 'react'

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
   Reusable section header
   ───────────────────────────────────────────────────────────── */
interface SectionHeaderProps {
  icon: typeof ClockIcon
  iconVariant: 'guinda' | 'dorado'
  title: string
  subtitle: string
}

function SectionHeader({ icon: Icon, iconVariant, title, subtitle }: SectionHeaderProps) {
  const isGuinda = iconVariant === 'guinda'
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
          isGuinda
            ? 'bg-linear-to-br from-[#7C2855] to-[#5a1d3f]'
            : 'bg-linear-to-br from-[#D4AF37] to-[#e8c96f]'
        }`}
      >
        <Icon className={`w-5 h-5 ${isGuinda ? 'text-white' : 'text-[#7C2855]'}`} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sub-field label used inside the schedule card
   ───────────────────────────────────────────────────────────── */
function SubLabel({ children }: { children: string }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1.5">
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Strategies numbered-list field
   ───────────────────────────────────────────────────────────── */
interface StrategiesFieldProps {
  watch: UseFormWatch<MethodologyFormValues>
  setValue: UseFormSetValue<MethodologyFormValues>
  error?: string
}

function StrategiesField({ watch, setValue, error }: StrategiesFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const strategies = watch('strategies')

  const add = () => {
    const normalized = inputValue.trim()
    if (!normalized) return
    if (strategies.some((s) => s.toLowerCase() === normalized.toLowerCase())) {
      setInputValue('')
      return
    }
    setValue('strategies', [...strategies, normalized], { shouldValidate: true })
    setInputValue('')
  }

  const remove = (index: number) => {
    setValue(
      'strategies',
      strategies.filter((_, i) => i !== index),
      { shouldValidate: true }
    )
  }

  return (
    <div className="space-y-4">
      {/* Input row */}
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
          placeholder="Escribe una estrategia y presiona Enter o Agregar"
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

      {/* Numbered list */}
      {strategies.length > 0 ? (
        <ol className="space-y-2">
          {strategies.map((strategy, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 group hover:border-[#7C2855]/30 hover:shadow-sm transition-all duration-200"
            >
              {/* Number badge */}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7C2855] text-white text-[11px] font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              {/* Text */}
              <span className="flex-1 text-sm text-gray-800 leading-relaxed">{strategy}</span>
              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-gray-300 hover:text-red-400 font-bold text-lg leading-none transition-colors cursor-pointer shrink-0 mt-0.5"
                aria-label={`Eliminar estrategia ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex items-center justify-center py-3">
          <p className="text-sm text-gray-400 italic">
            Aún no has agregado estrategias de aprendizaje.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Generic numbered-list field (reusable for any string[] in MethodologyFormValues)
   ───────────────────────────────────────────────────────────── */
type ArrayField = Extract<
  keyof MethodologyFormValues,
  { [K in keyof MethodologyFormValues]: MethodologyFormValues[K] extends string[] ? K : never }[keyof MethodologyFormValues]
>

interface NumberedListFieldProps {
  fieldName: ArrayField
  placeholder: string
  emptyMessage: string
  watch: UseFormWatch<MethodologyFormValues>
  setValue: UseFormSetValue<MethodologyFormValues>
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
interface MethodologySectionProps {
  register: UseFormRegister<MethodologyFormValues>
  errors: FieldErrors<MethodologyFormValues>
  watch: UseFormWatch<MethodologyFormValues>
  setValue: UseFormSetValue<MethodologyFormValues>
}

export function MethodologySection({ register, errors, watch, setValue }: MethodologySectionProps) {
  return (
    <div className="space-y-8">
      {/* ── 1. Utilización del RDD ── */}
      <section>
        <SectionHeader
          icon={DocumentMagnifyingGlassIcon}
          iconVariant="guinda"
          title="Utilización del RDD"
          subtitle="Explica claramente la manera en la que se utilizará el RDD, el contexto del programa académico y los elementos que contribuirán a un seguimiento claro y puntual de los participantes."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Textarea
            id="methodology-usage"
            placeholder="Describe cómo se utilizará el RDD, en qué contexto del programa académico y cómo se dará seguimiento a los participantes..."
            rows={3}
            className={`bg-white text-sm resize-none ${
              errors.usage
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('usage', { required: 'El campo "Utilización del RDD" es obligatorio.' })}
          />
          {errors.usage && <p className="text-xs text-red-500 mt-2">{errors.usage.message}</p>}
        </div>
      </section>

      <Divider />

      {/* ── 2. Periodo de trabajo y horas sugeridas ── */}
      <section>
        <SectionHeader
          icon={ClockIcon}
          iconVariant="dorado"
          title="Periodo de trabajo y horas sugeridas"
          subtitle="Establece el periodo de tiempo total, las horas por semana sugeridas y la forma de trabajo con el asesor."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-5">

          {/* ── Periodo total ── */}
          <div>
            <SubLabel>Periodo total de trabajo</SubLabel>
            <Input
              id="methodology-totalPeriod"
              placeholder="Ej. Semestre 2025-1, del 4 de agosto al 5 de diciembre"
              className={`bg-white h-10 text-sm ${
                errors.totalPeriod
                  ? 'border-red-400 focus-visible:border-red-400'
                  : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
              }`}
              {...register('totalPeriod', {
                required: 'El campo "Periodo total de trabajo" es obligatorio.',
              })}
            />
            {errors.totalPeriod && (
              <p className="text-xs text-red-500 mt-1.5">{errors.totalPeriod.message}</p>
            )}
          </div>

          {/* ── Sub-divider ── */}
          <div className="h-px bg-gray-200" />

          {/* ── Horas por semana ── */}
          <div>
            <SubLabel>Horas por semana sugeridas</SubLabel>
            <Input
              id="methodology-weeklyHours"
              type="number"
              min={1}
              max={40}
              placeholder="Ej. 4"
              className={`bg-white h-10 text-sm w-40 ${
                errors.weeklyHours
                  ? 'border-red-400 focus-visible:border-red-400'
                  : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
              }`}
              {...register('weeklyHours', {
                required: 'El campo "Horas por semana sugeridas" es obligatorio.',
                min: { value: 1, message: 'El mínimo es 1 hora por semana.' },
              })}
            />
            {errors.weeklyHours && (
              <p className="text-xs text-red-500 mt-1.5">{errors.weeklyHours.message}</p>
            )}
          </div>

          {/* ── Sub-divider ── */}
          <div className="h-px bg-gray-200" />

          {/* ── Forma de trabajo con el asesor ── */}
          <div>
            <SubLabel>Forma de trabajo con el asesor</SubLabel>
            <Textarea
              id="methodology-advisorWorkMethod"
              placeholder="Describe la dinámica de trabajo con el asesor (frecuencia de reuniones, modalidad presencial/virtual, canales de comunicación, etc.)..."
              rows={3}
              className={`bg-white text-sm resize-none ${
                errors.advisorWorkMethod
                  ? 'border-red-400 focus-visible:border-red-400'
                  : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
              }`}
              {...register('advisorWorkMethod', {
                required: 'El campo "Forma de trabajo con el asesor" es obligatorio.',
              })}
            />
            {errors.advisorWorkMethod && (
              <p className="text-xs text-red-500 mt-1.5">{errors.advisorWorkMethod.message}</p>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 3. Estrategias de aprendizaje ── */}
      <section>
        <SectionHeader
          icon={PuzzlePieceIcon}
          iconVariant="guinda"
          title="Estrategias de aprendizaje"
          subtitle="Describe las estrategias de aprendizaje del RDD (ejercicios, recursos de aprendizaje, metodologías, etapas o fases para el desarrollo de competencias), así como la forma de trabajo."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <StrategiesField
            watch={watch}
            setValue={setValue}
            error={errors.strategies?.message}
          />
        </div>
      </section>

      <Divider />

      {/* ── 4. Competencias y objetivos ── */}
      <section>
        <SectionHeader
          icon={TrophyIcon}
          iconVariant="dorado"
          title="Competencias y objetivos"
          subtitle="Presenta las competencias, objetivos generales y específicos con base en la estrategia didáctica y la modalidad."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-5">

          {/* ── Competencias ── */}
          <div>
            <SubLabel>Competencias</SubLabel>
            <Textarea
              id="methodology-competencies"
              placeholder="Describe las competencias a desarrollar alineadas a la estrategia didáctica y modalidad de trabajo..."
              rows={3}
              className={`bg-white text-sm resize-none ${
                errors.competencies
                  ? 'border-red-400 focus-visible:border-red-400'
                  : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
              }`}
              {...register('competencies', {
                required: 'El campo "Competencias" es obligatorio.',
              })}
            />
            {errors.competencies && (
              <p className="text-xs text-red-500 mt-1.5">{errors.competencies.message}</p>
            )}
          </div>

          <div className="h-px bg-gray-200" />

          {/* ── Objetivos generales ── */}
          <div>
            <SubLabel>Objetivos generales</SubLabel>
            <NumberedListField
              fieldName="generalObjectives"
              placeholder="Escribe un objetivo general y presiona Enter o Agregar"
              emptyMessage="Aún no has agregado objetivos generales."
              watch={watch}
              setValue={setValue}
              error={errors.generalObjectives?.message}
            />
          </div>

          <div className="h-px bg-gray-200" />

          {/* ── Objetivos específicos ── */}
          <div>
            <SubLabel>Objetivos específicos</SubLabel>
            <NumberedListField
              fieldName="specificObjectives"
              placeholder="Escribe un objetivo específico y presiona Enter o Agregar"
              emptyMessage="Aún no has agregado objetivos específicos."
              watch={watch}
              setValue={setValue}
              error={errors.specificObjectives?.message}
            />
          </div>

        </div>
      </section>

      <Divider />

      {/* ── 5. Figuras de acompañamiento ── */}
      <section>
        <SectionHeader
          icon={UserGroupIcon}
          iconVariant="guinda"
          title="Figuras de acompañamiento"
          subtitle="Presenta las figuras de acompañamiento en el trabajo con el RDD."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Textarea
            id="methodology-accompanimentFigures"
            placeholder="Describe los roles de acompañamiento (asesor, tutor, pares, etc.) y cómo participarán en el proceso de aprendizaje del estudiante..."
            rows={3}
            className={`bg-white text-sm resize-none ${
              errors.accompanimentFigures
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('accompanimentFigures', {
              required: 'El campo "Figuras de acompañamiento" es obligatorio.',
            })}
          />
          {errors.accompanimentFigures && (
            <p className="text-xs text-red-500 mt-2">{errors.accompanimentFigures.message}</p>
          )}
        </div>
      </section>
    </div>
  )
}
