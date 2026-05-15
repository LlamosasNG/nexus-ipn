import { Textarea } from '@/components/ui/textarea'
import type { ActivityValues, EvaluationFormValues } from '@/types'
import {
  ArrowLeftCircleIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

/* ─── Helpers ─── */
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
  icon: typeof ChartBarIcon
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

function MdBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
      Markdown
    </span>
  )
}

/* ─── Summary table ─── */
interface SummaryTableProps {
  activities: ActivityValues[]
  diagnostic: string
}

function SummaryTable({ activities, diagnostic }: SummaryTableProps) {
  const total = activities.reduce((s, a) => s + (Number(a?.porcentaje) || 0), 0)
  const isValid = total === 100
  const isOver = total > 100

  const totalColor = isValid ? 'text-green-700' : 'text-red-600'
  const totalBg = isValid ? 'bg-green-50' : 'bg-red-50'

  return (
    <div className="space-y-3">
      {/* Warning banner when total is wrong */}
      {!isValid && activities.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {isOver
                ? `La suma de porcentajes excede el 100% (actual: ${total}%)`
                : `La suma de porcentajes no alcanza el 100% (actual: ${total}%)`}
            </p>
            <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
              <ArrowLeftCircleIcon className="w-3.5 h-3.5 shrink-0" />
              Regresa al paso de <strong className="ml-0.5">Actividades de aprendizaje</strong> para ajustar los valores.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7C2855] text-white">
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide w-8">#</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Actividad / Propósito</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Evidencia esperada</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide w-24">Valor (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Diagnostic row (from pedagogical, read-only) */}
            <tr className="bg-[#D4AF37]/5">
              <td className="px-4 py-3 text-gray-400 text-xs">—</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#7C2855] text-[10px] font-bold uppercase tracking-wide">
                  Diagnóstica
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700 text-xs leading-relaxed">
                {diagnostic || (
                  <span className="italic text-gray-400">
                    Sin definir (registra la actividad diagnóstica en Encuadre Pedagógico)
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs italic">—</td>
              <td className="px-4 py-3 text-right text-gray-400 text-xs">—</td>
            </tr>

            {/* Activity rows */}
            {activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400 italic">
                  Aún no hay actividades registradas. Completa el paso de{' '}
                  <strong>Actividades de aprendizaje</strong>.
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-400 text-xs font-medium">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#7C2855]/10 text-[#7C2855] text-[10px] font-bold uppercase tracking-wide">
                      Formativa
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs leading-relaxed">
                    {activity.proposito || <span className="italic text-gray-400">Sin propósito definido</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">
                    {activity.evidenciaEsperada || <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 text-sm">
                    {Number(activity.porcentaje) || 0}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Total footer */}
          <tfoot>
            <tr className={`border-t-2 border-gray-200 ${totalBg}`}>
              <td colSpan={4} className={`px-4 py-3 font-bold text-sm ${totalColor}`}>
                {isValid ? (
                  <span className="flex items-center gap-2">
                    <CheckBadgeIcon className="w-4 h-4" />
                    Total de criterios de evaluación (Formativa)
                  </span>
                ) : (
                  'Total de criterios de evaluación (Formativa)'
                )}
              </td>
              <td className={`px-4 py-3 text-right font-bold text-lg ${totalColor}`}>{total}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

/* ─── Props ─── */
interface EvaluationSectionProps {
  activities: ActivityValues[]
  diagnostic: string
  register: UseFormRegister<EvaluationFormValues>
  errors: FieldErrors<EvaluationFormValues>
}

export function EvaluationSection({ activities, diagnostic, register, errors }: EvaluationSectionProps) {
  return (
    <div className="space-y-8">
      {/* ── Block 1: Summary table ── */}
      <section>
        <SectionHeader
          icon={ChartBarIcon}
          iconVariant="guinda"
          title="Tabla resumen de criterios y valores"
          subtitle="Generada automáticamente a partir de la actividad diagnóstica (Encuadre Pedagógico) y las actividades de aprendizaje registradas."
        />
        <SummaryTable activities={activities} diagnostic={diagnostic} />
      </section>

      <Divider />

      {/* ── Block 2: Evaluación final (sumativa) ── */}
      <section>
        <SectionHeader
          icon={DocumentCheckIcon}
          iconVariant="dorado"
          title="Criterios e instrucciones de la evaluación final"
          subtitle="Evaluación sumativa: describe evidencias, lineamientos y criterios para la evaluación final del RDD."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1.5">
            Evaluación final (sumativa) <MdBadge />
          </label>
          <Textarea
            id="eval-evaluacionFinal"
            placeholder="Describe cómo se llevará a cabo la evaluación sumativa/final, qué evidencias se considerarán y sus lineamientos..."
            rows={4}
            className={`bg-white text-sm resize-none ${
              errors.evaluacionFinal
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('evaluacionFinal', {
              required: 'El campo "Evaluación final" es obligatorio.',
            })}
          />
          {errors.evaluacionFinal && (
            <p className="text-xs text-red-500 mt-2">{errors.evaluacionFinal.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* ── Block 3: Autoevaluación ── */}
      <section>
        <SectionHeader
          icon={UserCircleIcon}
          iconVariant="guinda"
          title="Rúbrica o criterios de autoevaluación"
          subtitle="Provee los parámetros o el instrumento para que el estudiante realice su autoevaluación."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#7C2855] mb-1.5">
            Autoevaluación <MdBadge />
          </label>
          <Textarea
            id="eval-autoevaluacion"
            placeholder="Incluye los parámetros o el instrumento para que el estudiante realice su autoevaluación..."
            rows={4}
            className={`bg-white text-sm resize-none ${
              errors.autoevaluacion
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('autoevaluacion', {
              required: 'El campo "Autoevaluación" es obligatorio.',
            })}
          />
          {errors.autoevaluacion && (
            <p className="text-xs text-red-500 mt-2">{errors.autoevaluacion.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* ── Block 4: Momentos de evaluación ── */}
      <section>
        <SectionHeader
          icon={ChartBarIcon}
          iconVariant="dorado"
          title="Estrategia de momentos de evaluación"
          subtitle="Articulación de los momentos diagnóstico, formativo y sumativo a lo largo del RDD."
        />
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <Textarea
            id="eval-momentosEvaluacion"
            placeholder="Redacta un texto breve que haga referencia a cómo se articulan los momentos de la evaluación (diagnóstica, formativa y sumativa) a lo largo del recurso..."
            rows={3}
            className={`bg-white text-sm resize-none ${
              errors.momentosEvaluacion
                ? 'border-red-400 focus-visible:border-red-400'
                : 'border-gray-200 focus-visible:border-[#7C2855] focus-visible:ring-[#7C2855]/20'
            }`}
            {...register('momentosEvaluacion', {
              required: 'El campo "Momentos de evaluación" es obligatorio.',
            })}
          />
          {errors.momentosEvaluacion && (
            <p className="text-xs text-red-500 mt-2">{errors.momentosEvaluacion.message}</p>
          )}
        </div>
      </section>
    </div>
  )
}
