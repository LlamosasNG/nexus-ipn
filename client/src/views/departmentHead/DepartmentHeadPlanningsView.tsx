import {
  getDepartmentHeadPlanningById,
  getDepartmentHeadPlannings,
} from '@/api/DepartmentHeadAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import type {
  DepartmentHeadPlanningListItem,
  DepartmentHeadPlanningReviewStatus,
} from '@/types'
import {
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate } from 'react-router'

const reviewStatusColors: Record<DepartmentHeadPlanningReviewStatus, string> = {
  Pendiente: 'bg-amber-100 text-amber-800',
  'En revisión': 'bg-sky-100 text-sky-800',
  Validada: 'bg-emerald-100 text-emerald-800',
  Rechazada: 'bg-rose-100 text-rose-800',
}

const sortLabels: Record<string, string> = {
  updatedAt: 'Última actualización',
  createdAt: 'Fecha de creación',
  teacherName: 'Docente',
  subjectName: 'Unidad de aprendizaje',
  period: 'Periodo escolar',
  status: 'Estado',
}

const formatDateTime = (date: string | null) => {
  if (!date) return 'No disponible'

  return new Date(date).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    dateStyle: 'medium',
  })

type PlanningFiltersState = {
  page: number
  pageSize: number
  search: string
  teacherId: string
  subjectId: string
  academyId: string
  period: string
  status: DepartmentHeadPlanningReviewStatus | ''
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

function StatusBadge({
  status,
}: {
  status: DepartmentHeadPlanningReviewStatus
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${reviewStatusColors[status]}`}
    >
      {status}
    </span>
  )
}

export default function DepartmentHeadPlanningsView() {
  const { data: user, isLoading: isLoadingUser } = useAuth()
  const [searchDraft, setSearchDraft] = useState('')
  const [selectedPlanningId, setSelectedPlanningId] = useState<number | null>(null)
  const [filters, setFilters] = useState<PlanningFiltersState>({
    page: 1,
    pageSize: 10,
    search: '',
    teacherId: '',
    subjectId: '',
    academyId: '',
    period: '',
    status: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  })

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['department-head-plannings', filters],
    queryFn: () => getDepartmentHeadPlannings(filters),
    enabled: user?.role === 'Jefe de Departamento',
    placeholderData: (previousData) => previousData,
  })

  const { data: planningDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['department-head-planning-detail', selectedPlanningId],
    queryFn: () => getDepartmentHeadPlanningById(selectedPlanningId as number),
    enabled: Boolean(selectedPlanningId) && user?.role === 'Jefe de Departamento',
  })

  const handleFilterChange = (
    key: keyof PlanningFiltersState,
    value: string | number
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === 'page' ? Number(value) : 1,
    }))
  }

  const handleSort = (sortBy: string) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      sortBy,
      sortOrder:
        current.sortBy === sortBy && current.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilters((current) => ({
      ...current,
      page: 1,
      search: searchDraft.trim(),
    }))
  }

  const plannings = data?.data || []
  const meta = data?.meta
  const filterOptions = data?.filters

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

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-4xl border border-[#7C2855]/10 bg-white shadow-xl">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-[#D4AF37]/10 to-transparent" />
        <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[#7C2855]/8" />
        <div className="relative px-8 py-10 sm:px-12">
          <span className="inline-flex rounded-full bg-[#7C2855]/8 px-4 py-1.5 text-sm font-semibold tracking-wide text-[#7C2855]">
            Gestión Académica
          </span>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Gestión de planeaciones
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            Consulta, filtra y revisa las planeaciones didácticas registradas en tu academia.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7C2855]/10">
            <FunnelIcon className="h-6 w-6 text-[#7C2855]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Filtros y búsqueda
            </h2>
            <p className="text-sm text-gray-600">
              Refina la consulta por docente, unidad, academia, periodo o estado.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 gap-4 xl:grid-cols-12"
        >
          <div className="xl:col-span-4">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Búsqueda por texto
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Docente, materia, código, periodo..."
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Docente
            </label>
            <select
              value={filters.teacherId}
              onChange={(event) =>
                handleFilterChange('teacherId', event.target.value)
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="">Todos</option>
              {filterOptions?.teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Unidad de aprendizaje
            </label>
            <select
              value={filters.subjectId}
              onChange={(event) =>
                handleFilterChange('subjectId', event.target.value)
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="">Todas</option>
              {filterOptions?.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Academia
            </label>
            <select
              value={filters.academyId}
              onChange={(event) =>
                handleFilterChange('academyId', event.target.value)
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="">Todas</option>
              {filterOptions?.academies.map((academy) => (
                <option key={academy.id} value={academy.id}>
                  {academy.name}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Periodo escolar
            </label>
            <select
              value={filters.period}
              onChange={(event) => handleFilterChange('period', event.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="">Todos</option>
              {filterOptions?.periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(event) =>
                handleFilterChange(
                  'status',
                  event.target.value as DepartmentHeadPlanningReviewStatus | ''
                )
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="">Todos</option>
              {filterOptions?.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(event) => handleFilterChange('sortBy', event.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Dirección
            </label>
            <select
              value={filters.sortOrder}
              onChange={(event) =>
                handleFilterChange('sortOrder', event.target.value as 'asc' | 'desc')
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Registros por página
            </label>
            <select
              value={filters.pageSize}
              onChange={(event) =>
                handleFilterChange('pageSize', Number(event.target.value))
              }
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>

          <div className="flex items-end gap-3 xl:col-span-4">
            <Button type="submit" className="h-11 rounded-xl bg-[#7C2855] px-5">
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => {
                setSearchDraft('')
                setFilters({
                  page: 1,
                  pageSize: 10,
                  search: '',
                  teacherId: '',
                  subjectId: '',
                  academyId: '',
                  period: '',
                  status: '',
                  sortBy: 'updatedAt',
                  sortOrder: 'desc',
                })
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
              <ClipboardDocumentListIcon className="h-6 w-6 text-[#7C2855]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tabla de planeaciones
              </h2>
              <p className="text-sm text-gray-600">
                {meta?.total || 0} registros encontrados.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Página {meta?.page || 1} de {meta?.totalPages || 1}
          </div>
        </div>

        {isError ? (
          <div className="px-6 py-10 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No fue posible cargar la gestión de planeaciones
            </p>
            <p className="mt-2 text-sm text-gray-600">{error.message}</p>
          </div>
        ) : plannings.length === 0 ? (
          <div className="px-6 py-14 text-center text-gray-500">
            No se encontraron planeaciones con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      ['teacherName', 'Docente'],
                      ['subjectName', 'Unidad de aprendizaje'],
                      ['academy', 'Academia'],
                      ['period', 'Periodo escolar'],
                      ['status', 'Estado'],
                      ['updatedAt', 'Actualizada'],
                    ].map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-600 uppercase"
                      >
                        {key === 'academy' ? (
                          <span>{label}</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSort(key)}
                            className="inline-flex items-center gap-2 text-left"
                          >
                            <span>{label}</span>
                            <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-600 uppercase">
                      Detalle
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {plannings.map((planning: DepartmentHeadPlanningListItem) => (
                    <tr key={planning.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {planning.teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {planning.teacher.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {planning.subject.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Código: {planning.subject.code}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {planning.academy?.name || 'Sin academia'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {planning.period}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <StatusBadge status={planning.reviewStatus} />
                          <p className="text-xs text-gray-500">
                            Estado interno: {planning.status}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(planning.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setSelectedPlanningId(planning.id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Mostrando {(meta?.pageSize || 0) * ((meta?.page || 1) - 1) + 1} a{' '}
                {Math.min(
                  (meta?.pageSize || 0) * (meta?.page || 1),
                  meta?.total || 0
                )}{' '}
                de {meta?.total || 0} planeaciones
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={!meta || meta.page <= 1}
                  onClick={() => handleFilterChange('page', (meta?.page || 1) - 1)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={!meta || meta.page >= meta.totalPages}
                  onClick={() => handleFilterChange('page', (meta?.page || 1) + 1)}
                >
                  Siguiente
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog
        open={Boolean(selectedPlanningId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlanningId(null)
          }
        }}
      >
        <DialogContent className="max-w-3xl rounded-3xl border border-gray-200 p-0 data-[state=open]:slide-in-from-top-4 data-[state=open]:zoom-in-95">
          <div className="overflow-hidden rounded-3xl">
            <div className="bg-linear-to-r from-[#7C2855] to-[#5a1d3f] px-8 py-7 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  Detalle de la planeación
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  Revisión resumida de la planeación seleccionada.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="px-8 py-7">
              {isLoadingDetail || !planningDetail ? (
                <div className="flex items-center justify-center py-10">
                  <LoadingApp />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={planningDetail.reviewStatus} />
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Estado interno: {planningDetail.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Docente
                      </p>
                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {planningDetail.teacher.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {planningDetail.teacher.email}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Unidad de aprendizaje
                      </p>
                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {planningDetail.subject.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {planningDetail.subject.code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Academia
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.academy?.name || 'Sin academia'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Periodo escolar
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.period}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Modalidad
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.subject.modality}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Unidad académica
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.subject.academicUnit}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Semestre
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.subject.semester}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Área de formación
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {planningDetail.subject.areaFormation}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Envío de la planeación
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        {formatDateTime(planningDetail.submissionDate)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Última actualización
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        {formatDateTime(planningDetail.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Resumen de contenido
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div>
                        <p className="text-xs text-gray-500">Datos generales</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {planningDetail.summary.hasGeneralData ? 'Sí' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ejes transversales</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {planningDetail.summary.hasTransversalAxis ? 'Sí' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Unidades temáticas</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {planningDetail.summary.thematicUnitsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Referencias</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {planningDetail.summary.referencesCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Herramienta antiplagio</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {planningDetail.summary.plagiarismTool || 'Sin definir'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Retroalimentación
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {planningDetail.feedback || 'Sin retroalimentación registrada.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-gray-200 px-8 py-5">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setSelectedPlanningId(null)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
