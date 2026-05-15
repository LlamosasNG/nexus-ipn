import { getDepartmentHeadDashboard } from '@/api/DepartmentHeadAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { useAuth } from '@/hooks/useAuth'
import {
  AcademicCapIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'

const metricCards = [
  {
    key: 'totalTeachers',
    title: 'Total de docentes registrados',
    icon: AcademicCapIcon,
    accent: 'from-[#7C2855] to-[#5a1d3f]',
  },
  {
    key: 'totalPlannings',
    title: 'Total de planeaciones creadas',
    icon: ClipboardDocumentListIcon,
    accent: 'from-[#D4AF37] to-[#e8c96f]',
  },
  {
    key: 'pendingPlannings',
    title: 'Planeaciones pendientes',
    icon: ClockIcon,
    accent: 'from-amber-500 to-orange-400',
  },
  {
    key: 'approvedPlannings',
    title: 'Planeaciones aprobadas',
    icon: CheckBadgeIcon,
    accent: 'from-emerald-600 to-emerald-400',
  },
  {
    key: 'approvedDigitalResources',
    title: 'Recursos didácticos aprobados',
    icon: FolderOpenIcon,
    accent: 'from-cyan-600 to-sky-400',
  },
  {
    key: 'teacherParticipation',
    title: 'Participación docente (%)',
    icon: ChartBarIcon,
    accent: 'from-fuchsia-700 to-rose-500',
  },
] as const

export default function DepartmentHeadDashboardView() {
  const { data: user, isLoading: isLoadingUser } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['department-head-dashboard'],
    queryFn: getDepartmentHeadDashboard,
    enabled: user?.role === 'Jefe de Departamento',
  })

  if (isLoadingUser || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingApp />
      </div>
    )
  }

  if (!user) return null

  if (user.role !== 'Jefe de Departamento') {
    return <Navigate to="/my-home" replace />
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Jefe de Departamento
        </h1>
        <p className="mt-3 text-gray-600">
          No fue posible cargar las métricas del departamento.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="relative mb-10 overflow-hidden rounded-4xl border border-[#7C2855]/10 bg-white shadow-xl">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-[#D4AF37]/10 to-transparent" />
        <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[#7C2855]/8" />
        <div className="relative px-8 py-10 sm:px-12">
          <span className="inline-flex rounded-full bg-[#D4AF37]/15 px-4 py-1.5 text-sm font-semibold tracking-wide text-[#7C2855]">
            Módulo Exclusivo
          </span>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Panel de Jefe de Departamento
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            Seguimiento general del desempeño académico del departamento
            {data.academy ? ` de ${data.academy.name}` : ''}.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon
          const value =
            card.key === 'teacherParticipation'
              ? `${data.metrics[card.key]}%`
              : data.metrics[card.key]

          return (
            <div
              key={card.key}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${card.accent}`}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-4 text-4xl font-bold text-gray-900">
                    {value}
                  </p>
                </div>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${card.accent}`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Actividad reciente
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Últimos movimientos registrados en planeaciones y recursos.
              </p>
            </div>
            <span className="rounded-full bg-[#7C2855]/8 px-4 py-2 text-sm font-semibold text-[#7C2855]">
              {data.metrics.recentActivityCount} registros
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.recentActivity.length === 0 ? (
            <div className="px-8 py-10 text-center text-gray-500">
              No hay actividad reciente para mostrar.
            </div>
          ) : (
            data.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-3 px-8 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        activity.type === 'planning'
                          ? 'bg-[#7C2855]/10 text-[#7C2855]'
                          : 'bg-[#D4AF37]/15 text-[#7C2855]'
                      }`}
                    >
                      {activity.type === 'planning'
                        ? 'Planeación'
                        : 'Recurso digital'}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {activity.status}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {activity.teacherName} · {activity.subjectName}
                  </p>
                </div>

                <p className="text-sm font-medium text-gray-500">
                  {new Date(activity.updatedAt).toLocaleString('es-MX', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
