import { LogoHomeopatia } from '@/components/LogoHomeopatia'
import { LogoIPN } from '@/components/LogoIPN'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowUpTrayIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  PhotoIcon,
  SparklesIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { useState, type ChangeEvent } from 'react'
import {
  type UseFormRegister,
  type UseFormWatch,
  type UseFormSetValue,
  type FieldErrors,
} from 'react-hook-form'
import type { IdentificationFormValues } from '@/types'

const MAX_COVER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024

/* ─────────────────────────────────────────────────────────────
   Thematic units sub-component (local state, synced to RHF)
   ───────────────────────────────────────────────────────────── */
interface ThematicUnitsFieldProps {
  watch: UseFormWatch<IdentificationFormValues>
  setValue: UseFormSetValue<IdentificationFormValues>
  error?: string
}

function ThematicUnitsField({ watch, setValue, error }: ThematicUnitsFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const units = watch('thematicUnits')

  const add = () => {
    const normalized = inputValue.trim()
    if (!normalized) return
    if (units.some((u) => u.toLowerCase() === normalized.toLowerCase())) {
      setInputValue('')
      return
    }
    setValue('thematicUnits', [...units, normalized], { shouldValidate: true })
    setInputValue('')
  }

  const remove = (unit: string) => {
    setValue(
      'thematicUnits',
      units.filter((u) => u !== unit),
      { shouldValidate: true }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder="Escribe una unidad temática y presiona Enter o Agregar"
          className="bg-white border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20 h-11 text-base"
        />
        <Button
          type="button"
          onClick={add}
          className="bg-[#7C2855] hover:bg-[#5a1d3f] text-white font-semibold px-6 h-11 shrink-0 transition-all duration-300 hover:shadow-lg cursor-pointer"
        >
          Agregar
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="min-h-[44px] flex flex-wrap gap-2 items-start">
        {units.length > 0 ? (
          units.map((unit, index) => (
            <span
              key={unit}
              className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7C2855]/20 text-[#7C2855] text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7C2855] text-white text-[10px] font-bold">
                {index + 1}
              </span>
              {unit}
              <button
                type="button"
                onClick={() => remove(unit)}
                className="ml-0.5 text-[#7C2855]/50 hover:text-[#7C2855] font-bold leading-none transition-colors text-lg"
                aria-label={`Eliminar ${unit}`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <div className="w-full flex items-center justify-center py-2">
            <p className="text-sm text-gray-400 italic">
              Aún no has agregado unidades temáticas para este RDD.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main section component
   ───────────────────────────────────────────────────────────── */
interface IdentificationSectionProps {
  academicUnit: string
  academicProgram: string
  subjectName: string
  academyName: string
  register: UseFormRegister<IdentificationFormValues>
  watch: UseFormWatch<IdentificationFormValues>
  setValue: UseFormSetValue<IdentificationFormValues>
  errors: FieldErrors<IdentificationFormValues>
  isInteractiveResource?: boolean
}

export function IdentificationSection({
  academicUnit,
  academicProgram,
  subjectName,
  academyName,
  register,
  watch,
  setValue,
  errors,
  isInteractiveResource = false,
}: IdentificationSectionProps) {
  const coverImage = watch('coverImage')
  const [coverImageError, setCoverImageError] = useState('')

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setCoverImageError('Selecciona un archivo de imagen válido.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_COVER_IMAGE_SIZE_BYTES) {
      setCoverImageError('La imagen no debe superar 2 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') return

      setValue('coverImage', reader.result, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setCoverImageError('')
      event.target.value = ''
    }

    reader.readAsDataURL(file)
  }

  const removeCoverImage = () => {
    setValue('coverImage', '', {
      shouldDirty: true,
      shouldValidate: true,
    })
    setCoverImageError('')
  }

  return (
    <div className="space-y-8">
      {/* ── Institutional Document Header ── */}
      <div className="bg-linear-to-b from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="h-1 bg-linear-to-r from-[#7C2855] via-[#D4AF37] to-[#7C2855]" />

        <div className="px-6 md:px-10 py-5">
          <div className="flex items-center justify-between gap-6">
            <div className="shrink-0">
              <LogoIPN className="h-14 w-14 md:h-18 md:w-18" />
            </div>

            <div className="flex-1 text-center space-y-1">
              <p className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-[#7C2855]">
                Instituto Politécnico Nacional
              </p>
              <p className="text-[11px] md:text-xs text-gray-600 tracking-wide uppercase">
                {academicUnit}
              </p>
              <div className="flex justify-center pt-1">
                <div className="h-px w-40 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>
              <p className="text-[11px] md:text-xs text-gray-500 tracking-wide">
                Formato de Recurso Didáctico Digital
              </p>
            </div>

            <div className="shrink-0">
              <LogoHomeopatia className="h-14 w-14 md:h-18 md:w-18" />
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-linear-to-r from-transparent via-[#7C2855]/30 to-transparent" />
      </div>

      {/* Resource type badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-[#7C2855] to-[#5a1d3f] text-white font-semibold text-sm shadow-md">
          {isInteractiveResource ? (
            <SparklesIcon className="w-4 h-4" />
          ) : (
            <BookOpenIcon className="w-4 h-4" />
          )}
          Tipo de RDD:{' '}
          {isInteractiveResource ? 'Libro Digital Interactivo' : 'Libro Digital'}
        </span>
      </div>

      {/* ── Academic Identification ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-lg">
            <BuildingLibraryIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Identificación Académica
          </h2>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1">
                Unidad académica
              </span>
              <span className="text-sm text-gray-800 leading-relaxed">{academicUnit}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1">
                Programa académico
              </span>
              <span className="text-sm text-gray-800 leading-relaxed">{academicProgram}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1">
                Unidad de aprendizaje
              </span>
              <span className="text-sm text-gray-800 leading-relaxed font-medium">{subjectName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1">
                Academia
              </span>
              <span className="text-sm text-gray-800 leading-relaxed">{academyName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {isInteractiveResource && (
        <>
          {/* ── Interactive Resource Identification ── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-[#D4AF37] to-[#e8c96f] rounded-lg">
                <SparklesIcon className="w-5 h-5 text-[#7C2855]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Identificación interactiva
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Describe los elementos que hacen interactivo al recurso
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
              <textarea
                rows={4}
                placeholder="Ej. Integra navegación por unidades, actividades automatizadas, recursos multimedia, retroalimentación inmediata o espacios de comunicación."
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed outline-none transition-colors ${
                  errors.interactiveDescription
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-gray-200 focus:border-[#7C2855] focus:ring-2 focus:ring-[#7C2855]/20'
                }`}
                {...register('interactiveDescription', {
                  required:
                    'Describe los elementos interactivos del Libro Digital Interactivo.',
                })}
              />
              {errors.interactiveDescription && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.interactiveDescription.message}
                </p>
              )}
            </div>
          </section>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </>
      )}

      {/* ── Cover Image ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-lg">
            <PhotoIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Portada del RDD
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Imagen principal que se mostrará como portada del recurso
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Portada del RDD"
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 bg-white text-gray-400">
                  <PhotoIcon className="h-12 w-12" />
                  <p className="text-sm font-medium">Sin portada cargada</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label
                  htmlFor="rdd-cover-image"
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C2855] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5a1d3f] hover:shadow-md"
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  Cargar imagen de portada
                </label>
                <input
                  id="rdd-cover-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="sr-only"
                />

                {coverImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeCoverImage}
                    className="h-11 rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Quitar portada
                  </Button>
                )}
              </div>

              <p className="text-xs leading-relaxed text-gray-500">
                Formatos permitidos: JPG, PNG, WebP o GIF. Tamaño máximo: 2 MB.
              </p>

              {coverImageError && (
                <p className="text-xs text-red-500">{coverImageError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── RDD Title ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-[#D4AF37] to-[#e8c96f] rounded-lg">
            <DocumentTextIcon className="w-5 h-5 text-[#7C2855]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Título del RDD</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Nombre descriptivo del Recurso Didáctico Digital
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Input
            id="rdd-title"
            placeholder="Ej. Fundamentos de Homeopatía Clínica"
            className={`bg-white h-11 text-base ${
              errors.title
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('title', { required: 'El título del RDD es obligatorio.' })}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-2">{errors.title.message}</p>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Thematic Units ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-lg">
            <TagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Unidades Temáticas</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Temas que abordará el Recurso Didáctico Digital
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <ThematicUnitsField
            watch={watch}
            setValue={setValue}
            error={errors.thematicUnits?.message}
          />
        </div>
      </section>
    </div>
  )
}
