import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CreditsSectionFormValues } from '@/types'
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid'
import type { Control, FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'

/* ─── Constants ─── */
const MAX_WORDS = 500

/* ─── Shared helpers ─── */
function Divider() {
  return (
    <div className="flex items-center gap-4 mt-8">
      <div className="flex-1 h-px bg-gray-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  iconVariant,
  title,
  subtitle,
}: {
  icon: typeof CalendarDaysIcon
  iconVariant: 'guinda' | 'dorado'
  title: string
  subtitle: string
}) {
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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

/* ─── Word counter ─── */
function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function WordCounter({ text }: { text: string }) {
  const count = countWords(text)
  const isOver = count > MAX_WORDS
  const pct = Math.min((count / MAX_WORDS) * 100, 100)

  return (
    <div className="mt-2 space-y-1.5">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : count > MAX_WORDS * 0.9 ? 'bg-amber-400' : 'bg-[#7C2855]'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Count label */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-medium ${isOver ? 'text-red-600' : 'text-gray-400'}`}>
          {count} / {MAX_WORDS} palabras
        </span>
        {isOver && (
          <span className="flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <ExclamationTriangleIcon className="w-3 h-3" />
            Excede el límite por {count - MAX_WORDS} palabras
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Author card ─── */
interface AuthorCardProps {
  index: number
  register: UseFormRegister<CreditsSectionFormValues>
  watch: UseFormWatch<CreditsSectionFormValues>
  errors: FieldErrors<CreditsSectionFormValues>
  onRemove: () => void
}
function AuthorCard({ index, register, watch, errors, onRemove }: AuthorCardProps) {
  const errs = errors.authors?.[index]
  const semblanza = watch(`authors.${index}.semblanzaAutor`) ?? ''
  const wordCount = countWords(semblanza)
  const isOverLimit = wordCount > MAX_WORDS

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-gray-50 to-transparent border-b border-gray-200">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f] text-white text-sm font-bold shrink-0">
          {index + 1}
        </span>
        <span className="font-semibold text-gray-800 flex-1">Autor {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
          aria-label={`Eliminar autor ${index + 1}`}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Nombre */}
        <div>
          <FieldLabel required>Nombre completo del autor</FieldLabel>
          <Input
            placeholder="ej. Dra. María López Hernández"
            className={`bg-gray-50 text-sm ${
              errs?.nombreAutor
                ? 'border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register(`authors.${index}.nombreAutor`, {
              required: 'El nombre del autor es obligatorio.',
            })}
          />
          {errs?.nombreAutor && (
            <p className="text-[11px] text-red-500 mt-1">{errs.nombreAutor.message}</p>
          )}
        </div>

        {/* Semblanza */}
        <div>
          <FieldLabel required>Semblanza profesional</FieldLabel>
          <Textarea
            placeholder="Escribe la semblanza profesional del autor. Incluye grado académico, institución, líneas de investigación y publicaciones relevantes..."
            rows={4}
            className={`bg-gray-50 text-sm resize-none ${
              errs?.semblanzaAutor || isOverLimit
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register(`authors.${index}.semblanzaAutor`, {
              required: 'La semblanza es obligatoria.',
              validate: (val) =>
                countWords(val) <= MAX_WORDS ||
                `La semblanza no puede exceder las ${MAX_WORDS} palabras.`,
            })}
          />
          {errs?.semblanzaAutor && (
            <p className="text-[11px] text-red-500 mt-1">{errs.semblanzaAutor.message}</p>
          )}
          <WordCounter text={semblanza} />
        </div>
      </div>
    </div>
  )
}

/* ─── Props ─── */
interface CreditsSectionProps {
  control: Control<CreditsSectionFormValues>
  register: UseFormRegister<CreditsSectionFormValues>
  errors: FieldErrors<CreditsSectionFormValues>
  watch: UseFormWatch<CreditsSectionFormValues>
  allSectionsSaved: boolean
  isSaving: boolean
  onPublish: () => void
}

export function CreditsSection({
  control,
  register,
  errors,
  watch,
  allSectionsSaved,
  isSaving,
  onPublish,
}: CreditsSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'authors' })

  const authors = watch('authors') ?? []
  const hasWordOverflow = authors.some((a) => countWords(a?.semblanzaAutor ?? '') > MAX_WORDS)
  const canPublish = allSectionsSaved && !hasWordOverflow && !isSaving

  return (
    <div className="space-y-8">
      {/* ── Block 1: Temporalidad ── */}
      <section>
        <SectionHeader
          icon={CalendarDaysIcon}
          iconVariant="dorado"
          title="Temporalidad del recurso"
          subtitle="Registra la fecha de realización o última actualización del RDD."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <FieldLabel required>Fecha de realización o última actualización</FieldLabel>
          <Input
            type="date"
            className={`bg-white text-sm max-w-xs ${
              errors.fechaReferencia
                ? 'border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('fechaReferencia', {
              required: 'La fecha de referencia es obligatoria.',
            })}
          />
          {errors.fechaReferencia && (
            <p className="text-xs text-red-500 mt-2">{errors.fechaReferencia.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* ── Block 2: Autores ── */}
      <section>
        <SectionHeader
          icon={UserGroupIcon}
          iconVariant="guinda"
          title="Autores del recurso"
          subtitle="Registra los autores y su semblanza profesional (máximo 500 palabras por autor)."
        />

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 mb-4">
            <p className="text-sm text-gray-400 italic mb-1">
              Aún no has agregado autores.
            </p>
            <p className="text-xs text-gray-300">
              Agrega al menos un autor para poder finalizar el RDD.
            </p>
          </div>
        )}

        {fields.length > 0 && (
          <div className="space-y-5 mb-4">
            {fields.map((field, index) => (
              <AuthorCard
                key={field.id}
                index={index}
                register={register}
                watch={watch}
                errors={errors}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => append({ nombreAutor: '', semblanzaAutor: '' })}
          className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border-2 border-dashed border-[#7C2855]/30 text-[#7C2855] font-semibold text-sm hover:bg-[#7C2855]/5 hover:border-[#7C2855]/50 transition-all duration-200 cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar autor
        </button>
      </section>

      <Divider />

      {/* ── Block 3: Publish ── */}
      <section>
        <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-linear-to-b from-[#D4AF37]/5 to-transparent p-6 text-center space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Finalizar y publicar RDD</h3>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Al finalizar, toda la información capturada será procesada y formateada automáticamente
            para generar el recurso didáctico digital conforme a los lineamientos institucionales.
          </p>

          {!allSectionsSaved && (
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <p className="text-xs font-semibold">
                Guarda todas las secciones antes de poder publicar.
              </p>
            </div>
          )}

          {hasWordOverflow && (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <p className="text-xs font-semibold">
                Uno o más autores exceden el límite de {MAX_WORDS} palabras en su semblanza.
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={!canPublish}
            onClick={onPublish}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
              canPublish
                ? 'bg-linear-to-r from-[#7C2855] to-[#5a1d3f] text-white hover:shadow-xl hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Publicando...' : 'Finalizar y Publicar RDD'}
          </button>
        </div>
      </section>
    </div>
  )
}
