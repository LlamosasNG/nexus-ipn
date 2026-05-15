import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  ContentFormValues,
  ContentSubtemaValues,
  ContentTemaValues,
  ContentUnidadValues,
} from '@/types'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

/* ─── uid helper ─── */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

/* ─── Markdown badge ─── */
function MdBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
      Markdown
    </span>
  )
}

/* ─── Three-area content block (Inicio / Desarrollo / Conclusión) ─── */
interface ContentAreasProps {
  inicio: string
  desarrollo: string
  conclusion: string
  onInicio: (v: string) => void
  onDesarrollo: (v: string) => void
  onConclusion: (v: string) => void
}
function ContentAreas({
  inicio,
  desarrollo,
  conclusion,
  onInicio,
  onDesarrollo,
  onConclusion,
}: ContentAreasProps) {
  const areas = [
    {
      label: 'Inicio',
      sublabel: 'Ideas clave y detonantes',
      color: '#7C2855',
      value: inicio,
      onChange: onInicio,
      placeholder:
        'Redacta la introducción al tema. Plantea preguntas detonantes o ideas clave y añade una imagen significativa.',
    },
    {
      label: 'Desarrollo',
      sublabel: 'Explicación, recursos y ejemplos',
      color: '#D4AF37',
      value: desarrollo,
      onChange: onDesarrollo,
      placeholder:
        'Desarrolla el tema. Incluye ejemplos descriptivos, vinculación con entornos profesionales y recursos de apoyo (videos, pódcasts, ilustraciones).',
    },
    {
      label: 'Conclusión',
      sublabel: 'Cierre y enlace',
      color: '#7C2855',
      value: conclusion,
      onChange: onConclusion,
      placeholder:
        'Redacta el cierre del tema y un texto de enlace que conecte lógicamente con el siguiente apartado.',
    },
  ] as const

  return (
    <div className="space-y-4 mt-4">
      {areas.map((area) => (
        <div key={area.label}>
          <div
            className="flex items-center gap-1.5 mb-1.5 pl-2"
            style={{ borderLeft: `3px solid ${area.color}` }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: area.color }}
            >
              {area.label}
            </span>
            <span className="text-[10px] text-gray-400">— {area.sublabel}</span>
            <MdBadge />
          </div>
          <Textarea
            placeholder={area.placeholder}
            rows={3}
            value={area.value}
            onChange={(e) => area.onChange(e.target.value)}
            className="bg-white text-sm resize-none border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20"
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Subtema card ─── */
interface SubtemaCardProps {
  subtema: ContentSubtemaValues
  index: number
  onUpdate: (patch: Partial<ContentSubtemaValues>) => void
  onDelete: () => void
}
function SubtemaCard({ subtema, index, onUpdate, onDelete }: SubtemaCardProps) {
  return (
    <div className="ml-4 border border-dashed border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-dashed border-gray-200">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold shrink-0">
          {index + 1}
        </span>
        <Input
          value={subtema.tituloSubtema}
          onChange={(e) => onUpdate({ tituloSubtema: e.target.value })}
          placeholder="Título del subtema..."
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:border-b focus-visible:border-[#7C2855] px-0 flex-1"
        />
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer shrink-0"
          aria-label="Eliminar subtema"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Content */}
      <div className="p-4">
        <ContentAreas
          inicio={subtema.contenidoInicio}
          desarrollo={subtema.contenidoDesarrollo}
          conclusion={subtema.contenidoConclusion}
          onInicio={(v) => onUpdate({ contenidoInicio: v })}
          onDesarrollo={(v) => onUpdate({ contenidoDesarrollo: v })}
          onConclusion={(v) => onUpdate({ contenidoConclusion: v })}
        />
      </div>
    </div>
  )
}

/* ─── Tema card ─── */
interface TemaCardProps {
  tema: ContentTemaValues
  unidadIndex: number
  temaIndex: number
  onUpdate: (patch: Partial<ContentTemaValues>) => void
  onDelete: () => void
}
function TemaCard({
  tema,
  unidadIndex,
  temaIndex,
  onUpdate,
  onDelete,
}: TemaCardProps) {
  const addSubtema = () =>
    onUpdate({
      subtemas: [
        ...tema.subtemas,
        {
          id: uid(),
          tituloSubtema: '',
          contenidoInicio: '',
          contenidoDesarrollo: '',
          contenidoConclusion: '',
        },
      ],
    })

  const updateSubtema = (sid: string, patch: Partial<ContentSubtemaValues>) =>
    onUpdate({
      subtemas: tema.subtemas.map((s) =>
        s.id === sid ? { ...s, ...patch } : s
      ),
    })

  const deleteSubtema = (sid: string) =>
    onUpdate({ subtemas: tema.subtemas.filter((s) => s.id !== sid) })

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      {/* Tema header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
        <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-md bg-[#7C2855]/10 text-[#7C2855] text-[10px] font-bold px-1.5">
          {unidadIndex + 1}.{temaIndex + 1}
        </span>
        <Input
          value={tema.tituloTema}
          onChange={(e) => onUpdate({ tituloTema: e.target.value })}
          placeholder="Título del tema..."
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:border-b focus-visible:border-[#7C2855] px-0 flex-1"
        />
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer shrink-0"
          aria-label="Eliminar tema"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content areas */}
      <div className="p-4">
        <ContentAreas
          inicio={tema.contenidoInicio}
          desarrollo={tema.contenidoDesarrollo}
          conclusion={tema.contenidoConclusion}
          onInicio={(v) => onUpdate({ contenidoInicio: v })}
          onDesarrollo={(v) => onUpdate({ contenidoDesarrollo: v })}
          onConclusion={(v) => onUpdate({ contenidoConclusion: v })}
        />

        {/* Subtemas */}
        {tema.subtemas.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">
              Subtemas
            </p>
            {tema.subtemas.map((st, si) => (
              <SubtemaCard
                key={st.id}
                subtema={st}
                index={si}
                onUpdate={(patch) => updateSubtema(st.id, patch)}
                onDelete={() => deleteSubtema(st.id)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addSubtema}
          className="mt-4 ml-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#7C2855] transition-colors cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Agregar subtema
        </button>
      </div>
    </div>
  )
}

/* ─── Unidad card ─── */
interface UnidadCardProps {
  unidad: ContentUnidadValues
  index: number
  onUpdate: (patch: Partial<ContentUnidadValues>) => void
  onDelete: () => void
}
function UnidadCard({ unidad, index, onUpdate, onDelete }: UnidadCardProps) {
  const addTema = () =>
    onUpdate({
      temas: [
        ...unidad.temas,
        {
          id: uid(),
          tituloTema: '',
          contenidoInicio: '',
          contenidoDesarrollo: '',
          contenidoConclusion: '',
          subtemas: [],
        },
      ],
    })

  const updateTema = (tid: string, patch: Partial<ContentTemaValues>) =>
    onUpdate({
      temas: unidad.temas.map((t) => (t.id === tid ? { ...t, ...patch } : t)),
    })

  const deleteTema = (tid: string) =>
    onUpdate({ temas: unidad.temas.filter((t) => t.id !== tid) })

  return (
    <div className="rounded-2xl border-2 border-[#7C2855]/20 bg-white shadow-sm overflow-hidden">
      {/* Unit header bar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-[#7C2855]/5 to-transparent border-b border-[#7C2855]/10">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-[#7C2855] to-[#5a1d3f] text-white text-sm font-bold shrink-0">
          {index + 1}
        </span>
        <Input
          value={unidad.nombreUnidad}
          onChange={(e) => onUpdate({ nombreUnidad: e.target.value })}
          placeholder="Nombre de la unidad temática..."
          className="h-9 text-sm font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:border-b focus-visible:border-[#7C2855] px-0 flex-1"
        />
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer shrink-0"
          aria-label="Eliminar unidad"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Objetivo */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1.5">
            Objetivo de la Unidad Temática/Didáctica
          </label>
          <Textarea
            value={unidad.objetivoUnidad}
            onChange={(e) => onUpdate({ objetivoUnidad: e.target.value })}
            placeholder="Describe qué logrará el estudiante al finalizar esta unidad..."
            rows={2}
            className="bg-gray-50 text-sm resize-none border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20"
          />
        </div>

        {/* Temas */}
        {unidad.temas.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Temas
            </p>
            {unidad.temas.map((tema, ti) => (
              <TemaCard
                key={tema.id}
                tema={tema}
                unidadIndex={index}
                temaIndex={ti}
                onUpdate={(patch) => updateTema(tema.id, patch)}
                onDelete={() => deleteTema(tema.id)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addTema}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#7C2855]/30 text-[#7C2855] text-xs font-semibold hover:bg-[#7C2855]/5 transition-colors cursor-pointer w-full justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar tema
        </button>
      </div>
    </div>
  )
}

/* ─── Main section ─── */
interface ContentSectionProps {
  errors: FieldErrors<ContentFormValues>
  watch: UseFormWatch<ContentFormValues>
  setValue: UseFormSetValue<ContentFormValues>
}

export function ContentSection({
  errors,
  watch,
  setValue,
}: ContentSectionProps) {
  const unidades = watch('unidades')

  const sync = (u: ContentUnidadValues[]) =>
    setValue('unidades', u, { shouldValidate: true })
  const addUnidad = () =>
    sync([
      ...unidades,
      { id: uid(), nombreUnidad: '', objetivoUnidad: '', temas: [] },
    ])
  const updateUnidad = (uid: string, patch: Partial<ContentUnidadValues>) =>
    sync(unidades.map((u) => (u.id === uid ? { ...u, ...patch } : u)))
  const deleteUnidad = (uid: string) =>
    sync(unidades.filter((u) => u.id !== uid))

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Estructura de contenidos
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Organiza el contenido por unidades, temas y subtemas.
          </p>
        </div>
      </div>

      {errors.unidades && (
        <p className="text-xs text-red-500">{errors.unidades.message}</p>
      )}

      {/* Units list */}
      {unidades.length > 0 ? (
        <div className="space-y-6">
          {unidades.map((unidad, i) => (
            <UnidadCard
              key={unidad.id}
              unidad={unidad}
              index={i}
              onUpdate={(patch) => updateUnidad(unidad.id, patch)}
              onDelete={() => deleteUnidad(unidad.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-400 italic mb-3">
            Aún no has agregado ninguna unidad temática.
          </p>
        </div>
      )}

      {/* Add unit */}
      <button
        type="button"
        onClick={addUnidad}
        className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border-2 border-dashed border-[#7C2855]/30 text-[#7C2855] font-semibold hover:bg-[#7C2855]/5 hover:border-[#7C2855]/50 transition-all duration-200 cursor-pointer"
      >
        <PlusIcon className="w-5 h-5" />
        Agregar Unidad
      </button>
    </div>
  )
}
