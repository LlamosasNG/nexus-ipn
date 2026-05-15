import { deletePlanning, getPlannings } from '@/api/PlanningAPI'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingApp } from '@/components/LoadingApp'
import type { PlanningItem } from '@/types'
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  Borrador: 'bg-yellow-100 text-yellow-800',
  Enviada: 'bg-blue-100 text-blue-800',
  Aprobada: 'bg-green-100 text-green-800',
  Rechazada: 'bg-red-100 text-red-800',
  Desfasado: 'bg-gray-100 text-gray-800',
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function MyPlanningsView() {
  const queryClient = useQueryClient()
  const [planningToDelete, setPlanningToDelete] = useState<PlanningItem | null>(null)
  const [password, setPassword] = useState('')

  const { data: planningsData, isLoading } = useQuery({
    queryKey: ['plannings'],
    queryFn: getPlannings,
    refetchOnWindowFocus: false,
  })

  const { mutate: removePlanning, isPending: isDeleting } = useMutation({
    mutationFn: deletePlanning,
    onSuccess: (message) => {
      toast.success(message || 'Planeación eliminada correctamente')
      setPlanningToDelete(null)
      setPassword('')
      queryClient.invalidateQueries({ queryKey: ['plannings'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const plannings: PlanningItem[] = planningsData || []

  const handleOpenDeleteModal = (planning: PlanningItem) => {
    setPlanningToDelete(planning)
    setPassword('')
  }

  const handleCloseDeleteModal = () => {
    if (isDeleting) return
    setPlanningToDelete(null)
    setPassword('')
  }

  const handleConfirmDelete = () => {
    if (!planningToDelete) return

    if (!password.trim()) {
      toast.error('Debes ingresar tu contraseña para eliminar la planeación')
      return
    }

    removePlanning({
      planningId: planningToDelete.id,
      password,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingApp />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-linear-to-r from-[#7C2855] to-[#5a1d3f] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-sm font-semibold mb-4">
                <DocumentTextIcon className="w-4 h-4" />
                Planificaciones Didácticas
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Mis Planeaciones
              </h1>
              <p className="text-white/90 mt-2 text-base sm:text-lg max-w-2xl">
                Consulta y continúa editando las planeaciones didácticas que ya has creado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="px-5 py-4 bg-white/15 rounded-2xl text-white min-w-44">
                <p className="text-sm text-white/80">Planeaciones creadas</p>
                <p className="text-3xl font-bold mt-1">{plannings.length}</p>
              </div>
              <Link
                to="/select-subject?type=plannings"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#7C2855] font-semibold rounded-2xl hover:bg-white/90 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nueva planeación
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 bg-linear-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {plannings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plannings.map((plan) => (
            <div
              key={plan.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#7C2855] hover:shadow-xl transition-all duration-300"
            >
              <div className="h-1.5 bg-linear-to-r from-[#7C2855] via-[#D4AF37] to-[#5a1d3f]" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#7C2855]/10 group-hover:bg-[#7C2855]/20 transition-colors">
                      <DocumentTextIcon className="w-6 h-6 text-[#7C2855]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(plan)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                      aria-label={`Eliminar planeación ${plan.subject?.name || plan.id}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[plan.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {plan.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#7C2855] transition-colors">
                  {plan.subject?.name || 'Materia'}
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="inline-flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4 text-[#7C2855]" />
                    Código: {plan.subject?.code || 'N/D'}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-[#7C2855]" />
                    Última actualización: {formatDate(plan.updatedAt)}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Periodo: {plan.period}
                  </p>
                  <Link
                    to={`/plannings/${plan.id}`}
                    className="inline-flex items-center gap-2 text-[#7C2855] font-semibold hover:text-[#5a1d3f] transition-colors"
                  >
                    Continuar edición
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
          <div className="w-20 h-20 bg-[#7C2855]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <DocumentTextIcon className="w-10 h-10 text-[#7C2855]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aún no has creado planeaciones didácticas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Comienza creando tu primera planeación para una de tus materias asignadas.
          </p>
          <Link
            to="/select-subject?type=plannings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C2855] text-white font-semibold rounded-xl hover:bg-[#5a1d3f] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Crear mi primera planeación
          </Link>
        </div>
      )}

      <Dialog
        open={Boolean(planningToDelete)}
        onOpenChange={(open) => {
          if (!open) handleCloseDeleteModal()
        }}
      >
        <DialogContent className="max-w-md rounded-2xl border-0 p-0 shadow-2xl data-[state=open]:slide-in-from-top-2 data-[state=open]:duration-300">
          <DialogHeader className="border-b border-gray-200 px-6 py-5">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">
              Esta acción eliminará la planeación{' '}
              <strong>{planningToDelete?.subject?.name || 'seleccionada'}</strong>{' '}
              y su información relacionada. Para continuar, ingresa tu contraseña.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="delete-planning-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="delete-planning-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#7C2855]"
                placeholder="Ingresa tu contraseña"
                autoFocus
              />
            </div>

            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              Esta acción no se puede deshacer.
            </div>
          </div>

          <DialogFooter className="border-t border-gray-200 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar planeación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
