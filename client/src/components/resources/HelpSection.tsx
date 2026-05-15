import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { HelpSectionFormValues } from '@/types'
import {
  DocumentTextIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'

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
  icon: typeof GlobeAltIcon
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

function InfoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-3 mb-4">
      <InformationCircleIcon className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
      <p className="text-xs text-gray-600 leading-relaxed">{children}</p>
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border-2 border-dashed border-[#7C2855]/30 text-[#7C2855] font-semibold text-sm hover:bg-[#7C2855]/5 hover:border-[#7C2855]/50 transition-all duration-200 cursor-pointer"
    >
      <PlusIcon className="w-4 h-4" />
      {label}
    </button>
  )
}

function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer shrink-0"
      aria-label={label}
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 mb-4">
      <p className="text-sm text-gray-400 italic">{message}</p>
    </div>
  )
}

/* ─── Block 1: Support resources ─── */
interface ResourcesBlockProps {
  control: Control<HelpSectionFormValues>
  register: UseFormRegister<HelpSectionFormValues>
  errors: FieldErrors<HelpSectionFormValues>
}
function ResourcesBlock({ control, register, errors }: ResourcesBlockProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'resources' })

  return (
    <section>
      <SectionHeader
        icon={GlobeAltIcon}
        iconVariant="guinda"
        title="Vínculos a recursos de apoyo"
        subtitle="Agrega guías, tutoriales, artículos, videos u otros materiales de consulta que complementen el RDD."
      />

      {fields.length === 0 && (
        <EmptyState message="Aún no has agregado recursos de apoyo." />
      )}

      {fields.length > 0 && (
        <div className="space-y-4 mb-4">
          {fields.map((field, index) => {
            const errs = errors.resources?.[index]
            return (
              <div
                key={field.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7C2855] text-white text-[11px] font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 flex-1">Recurso {index + 1}</span>
                  <DeleteButton onClick={() => remove(index)} label={`Eliminar recurso ${index + 1}`} />
                </div>

                <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Título */}
                  <div className="sm:col-span-2">
                    <FieldLabel required>Nombre o título del recurso</FieldLabel>
                    <Input
                      placeholder="ej. Guía de instalación de Python"
                      className={`bg-gray-50 text-sm ${errs?.tituloRecurso ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
                      {...register(`resources.${index}.tituloRecurso`, { required: 'El título es obligatorio.' })}
                    />
                    {errs?.tituloRecurso && <p className="text-[11px] text-red-500 mt-1">{errs.tituloRecurso.message}</p>}
                  </div>

                  {/* Tipo */}
                  <div>
                    <FieldLabel required>Tipo</FieldLabel>
                    <select
                      className={`w-full h-10 rounded-lg border px-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7C2855]/20 focus:border-[#7C2855] transition-colors ${errs?.tipoRecurso ? 'border-red-400' : 'border-gray-200'}`}
                      {...register(`resources.${index}.tipoRecurso`, { required: 'Selecciona un tipo.' })}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="guia">Guía</option>
                      <option value="articulo">Artículo</option>
                      <option value="video">Video</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errs?.tipoRecurso && <p className="text-[11px] text-red-500 mt-1">{errs.tipoRecurso.message}</p>}
                  </div>

                  {/* URL */}
                  <div className="sm:col-span-3">
                    <FieldLabel required>Enlace (URL) del recurso</FieldLabel>
                    <Input
                      type="url"
                      placeholder="https://..."
                      className={`bg-gray-50 text-sm font-mono ${errs?.urlRecurso ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
                      {...register(`resources.${index}.urlRecurso`, {
                        required: 'La URL es obligatoria.',
                        pattern: { value: /^https?:\/\/.+/, message: 'Debe ser una URL válida (https://...).' },
                      })}
                    />
                    {errs?.urlRecurso && <p className="text-[11px] text-red-500 mt-1">{errs.urlRecurso.message}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddButton onClick={() => append({ tituloRecurso: '', urlRecurso: '', tipoRecurso: '' })} label="Agregar recurso" />
    </section>
  )
}

/* ─── Block 2: References ─── */
interface ReferencesBlockProps {
  control: Control<HelpSectionFormValues>
  register: UseFormRegister<HelpSectionFormValues>
  errors: FieldErrors<HelpSectionFormValues>
}
function ReferencesBlock({ control, register, errors }: ReferencesBlockProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'references' })

  return (
    <section>
      <SectionHeader
        icon={DocumentTextIcon}
        iconVariant="dorado"
        title="Lista de referencias bibliográficas"
        subtitle="Registra las fuentes documentales utilizadas en el contenido del RDD en formato APA 7."
      />

      <InfoNotice>
        <strong>Ordenamiento automático:</strong> La plataforma ordenará alphabéticamente la lista de referencias en el renderizado final del libro digital. No es necesario ingresarlas en orden.
      </InfoNotice>

      {fields.length === 0 && (
        <EmptyState message="Aún no has agregado referencias bibliográficas." />
      )}

      {fields.length > 0 && (
        <div className="space-y-3 mb-4">
          {fields.map((field, index) => {
            const errs = errors.references?.[index]
            return (
              <div
                key={field.id}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-[#7C2855] text-[11px] font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-1.5">
                  <Textarea
                    placeholder="Apellido, N. (Año). Título del trabajo. Editorial. https://doi.org/..."
                    rows={2}
                    className={`bg-gray-50 text-sm resize-none ${errs?.referenciaAPA ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
                    {...register(`references.${index}.referenciaAPA`, { required: 'La referencia es obligatoria.' })}
                  />
                  {errs?.referenciaAPA && <p className="text-[11px] text-red-500">{errs.referenciaAPA.message}</p>}
                </div>
                <DeleteButton onClick={() => remove(index)} label={`Eliminar referencia ${index + 1}`} />
              </div>
            )
          })}
        </div>
      )}

      <AddButton onClick={() => append({ referenciaAPA: '' })} label="Agregar referencia" />
    </section>
  )
}

/* ─── Block 3: Glossary ─── */
interface GlossaryBlockProps {
  control: Control<HelpSectionFormValues>
  register: UseFormRegister<HelpSectionFormValues>
  errors: FieldErrors<HelpSectionFormValues>
}
function GlossaryBlock({ control, register, errors }: GlossaryBlockProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'glossary' })

  return (
    <section>
      <SectionHeader
        icon={TagIcon}
        iconVariant="guinda"
        title="Glosario de términos"
        subtitle="Construye el glosario temático del RDD con conceptos clave y sus definiciones."
      />

      <InfoNotice>
        <strong>Formato automático:</strong> Al generar el libro digital, el sistema resaltará cada término en <strong>negritas</strong> y agregará punto final a la definición conforme a los lineamientos editoriales institucionales.
      </InfoNotice>

      {fields.length === 0 && (
        <EmptyState message="Aún no has agregado términos al glosario." />
      )}

      {fields.length > 0 && (
        <div className="space-y-4 mb-4">
          {fields.map((field, index) => {
            const errs = errors.glossary?.[index]
            return (
              <div
                key={field.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Term header */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7C2855] text-white text-[11px] font-bold shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder="Concepto o término..."
                      className={`h-7 text-sm font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:border-b focus-visible:border-[#7C2855] px-0 ${errs?.termino ? 'text-red-500' : ''}`}
                      {...register(`glossary.${index}.termino`, { required: 'El término es obligatorio.' })}
                    />
                    {errs?.termino && <p className="text-[11px] text-red-500">{errs.termino.message}</p>}
                  </div>
                  <DeleteButton onClick={() => remove(index)} label={`Eliminar término ${index + 1}`} />
                </div>
                {/* Definition */}
                <div className="p-4">
                  <Textarea
                    placeholder="Definición del término..."
                    rows={2}
                    className={`bg-gray-50 text-sm resize-none ${errs?.definicion ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'}`}
                    {...register(`glossary.${index}.definicion`, { required: 'La definición es obligatoria.' })}
                  />
                  {errs?.definicion && <p className="text-[11px] text-red-500 mt-1">{errs.definicion.message}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddButton onClick={() => append({ termino: '', definicion: '' })} label="Agregar término" />
    </section>
  )
}

/* ─── Main section ─── */
interface HelpSectionProps {
  control: Control<HelpSectionFormValues>
  register: UseFormRegister<HelpSectionFormValues>
  errors: FieldErrors<HelpSectionFormValues>
}

export function HelpSection({ control, register, errors }: HelpSectionProps) {
  return (
    <div className="space-y-8">
      <ResourcesBlock control={control} register={register} errors={errors} />
      <Divider />
      <ReferencesBlock control={control} register={register} errors={errors} />
      <Divider />
      <GlossaryBlock control={control} register={register} errors={errors} />
    </div>
  )
}
