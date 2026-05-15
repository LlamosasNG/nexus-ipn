import {
  deleteDigitalResource,
  getMyDigitalResources,
} from '@/api/DigitalResourceAPI'
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
import type { DigitalBookResource } from '@/types'
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  FolderIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getResourceTitle = (resource: DigitalBookResource) =>
  resource.identification?.title || 'Libro digital sin título'

const getResourceTypeLabel = (resourceType: DigitalBookResource['resourceType']) => {
  if (resourceType === 'digital-book') return 'Libro Digital'
  return resourceType
}

export default function MyResourcesView() {
  const queryClient = useQueryClient()
  const [resourceToDelete, setResourceToDelete] = useState<DigitalBookResource | null>(null)
  const [password, setPassword] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['digital-resources'],
    queryFn: getMyDigitalResources,
    refetchOnWindowFocus: false,
  })

  const { mutate: removeResource, isPending: isDeleting } = useMutation({
    mutationFn: deleteDigitalResource,
    onSuccess: (message) => {
      toast.success(message || 'Recurso digital eliminado correctamente')
      setResourceToDelete(null)
      setPassword('')
      queryClient.invalidateQueries({ queryKey: ['digital-resources'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const resources = data || []

  const handleOpenDeleteModal = (resource: DigitalBookResource) => {
    setResourceToDelete(resource)
    setPassword('')
  }

  const handleCloseDeleteModal = () => {
    if (isDeleting) return
    setResourceToDelete(null)
    setPassword('')
  }

  const handleConfirmDelete = () => {
    if (!resourceToDelete) return

    if (!password.trim()) {
      toast.error('Debes ingresar tu contraseña para eliminar el recurso digital')
      return
    }

    removeResource({
      subjectId: resourceToDelete.subjectId,
      resourceType: resourceToDelete.resourceType,
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
      <div className="bg-linear-to-r from-[#D4AF37] to-[#b8962e] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-sm font-semibold mb-4">
                <FolderIcon className="w-4 h-4" />
                Recursos Didácticos Digitales
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Mis Recursos
              </h1>
              <p className="text-white/90 mt-2 text-base sm:text-lg max-w-2xl">
                Consulta y continúa editando los recursos didácticos digitales que ya has creado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="px-5 py-4 bg-white/15 rounded-2xl text-white min-w-44">
                <p className="text-sm text-white/80">Recursos creados</p>
                <p className="text-3xl font-bold mt-1">{resources.length}</p>
              </div>
              <Link
                to="/select-subject?type=resources"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#7C2855] font-semibold rounded-2xl hover:bg-white/90 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo recurso
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 bg-linear-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
            >
              <div className="h-1.5 bg-linear-to-r from-[#D4AF37] via-[#e8c96f] to-[#7C2855]" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <FolderIcon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(resource)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                      aria-label={`Eliminar recurso ${getResourceTitle(resource)}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="px-3 py-1 bg-[#7C2855]/10 text-[#7C2855] text-xs font-semibold rounded-full">
                    {getResourceTypeLabel(resource.resourceType)}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#7C2855] transition-colors">
                  {getResourceTitle(resource)}
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="inline-flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4 text-[#7C2855]" />
                    {resource.subject?.name || 'Materia no disponible'}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-[#7C2855]" />
                    Última actualización: {formatDate(resource.updatedAt)}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Código: {resource.subject?.code || 'N/D'}
                  </p>
                  <Link
                    to={`/resources/create/${resource.subjectId}/${resource.resourceType}`}
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
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <FolderIcon className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aún no has creado recursos didácticos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Comienza creando tu primer libro digital para una de tus materias asignadas.
          </p>
          <Link
            to="/select-subject?type=resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b8962e] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Crear mi primer recurso
          </Link>
        </div>
      )}

      <Dialog
        open={Boolean(resourceToDelete)}
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
              Esta acción eliminará el recurso digital{' '}
              <strong>
                {resourceToDelete ? getResourceTitle(resourceToDelete) : 'seleccionado'}
              </strong>
              . Para continuar, ingresa tu contraseña.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="delete-resource-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="delete-resource-password"
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
              {isDeleting ? 'Eliminando...' : 'Eliminar recurso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
