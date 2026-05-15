import { createPlanning } from '@/api/PlanningAPI'
import { getUserSubjects } from '@/api/SubjectAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

export default function ConfirmPlanningView() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { data: user } = useAuth()

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['user-subjects'],
    queryFn: getUserSubjects,
  })

  const subject = subjects?.find((s) => s.id === Number(subjectId))

  const { mutate, isPending } = useMutation({
    mutationFn: createPlanning,
    onSuccess: (data) => {
      if (!data) return
      toast.success(data.message)
      navigate(`/plannings/${data.data.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingApp />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Materia no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          No se encontró la materia seleccionada en tu lista de materias
          asignadas.
        </p>
        <Link
          to="/select-subject?type=plannings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C2855] text-white font-medium rounded-lg hover:bg-[#5a1d3f] transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a seleccionar materia
        </Link>
      </div>
    )
  }

  const handleConfirm = () => {
    mutate({
      subjectId: Number(subjectId),
      period: subject.UserSubject.period,
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-[#7C2855]">
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Confirmar Creación de Planificación
            </h1>
            <p className="text-gray-600 mt-1">
              Revisa los datos antes de crear la planificación didáctica
            </p>
          </div>
        </div>
      </div>

      {/* Card de confirmación */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Banner superior */}
        <div className="bg-linear-to-r from-[#7C2855] to-[#5a1d3f] px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{subject.name}</h2>
          <p className="text-white/80 mt-1">Código: {subject.code}</p>
        </div>

        {/* Información de la planificación */}
        <div className="p-8 space-y-6">
          {/* Materia */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <AcademicCapIcon className="w-6 h-6 text-[#7C2855] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Materia</p>
              <p className="text-lg font-semibold text-gray-900">
                {subject.name}
              </p>
              <p className="text-sm text-gray-600">
                Academia de {subject.academy.name}
              </p>
            </div>
          </div>

          {/* Docente */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <UserIcon className="w-6 h-6 text-[#7C2855] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Docente</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Periodo */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <CalendarDaysIcon className="w-6 h-6 text-[#7C2855] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Periodo</p>
              <p className="text-lg font-semibold text-gray-900">
                {subject.UserSubject.period}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <CheckCircleIcon className="w-6 h-6 text-[#D4AF37] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Estado inicial
              </p>
              <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                Borrador
              </span>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Al crear la planificación se generará un
              borrador que podrás editar sección por sección. Podrás guardar tu
              avance en cualquier momento.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <Link
            to="/select-subject?type=plannings"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver
          </Link>

          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-8 py-3 bg-[#7C2855] text-white font-semibold rounded-lg hover:bg-[#5a1d3f] transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? 'Creando planificación...' : 'Crear Planificación'}
          </Button>
        </div>
      </div>
    </div>
  )
}
