// SelectSubjectView.tsx
import { getUserSubjects } from '@/api/SubjectAPI'
import { LoadingApp } from '@/components/LoadingApp'
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  FolderIcon,
} from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightCircleIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'

export default function SelectSubjectView() {
  const [searchParams] = useSearchParams()
  const type =
    (searchParams.get('type') as 'plannings' | 'resources') || 'plannings'

  const { data, isLoading } = useQuery({
    queryKey: ['user-subjects'],
    queryFn: getUserSubjects,
  })

  const config = {
    plannings: {
      title: 'Crear Planificación Didáctica',
      subtitle:
        'Selecciona la materia para la cual deseas crear una planificación',
      icon: DocumentTextIcon,
      color: 'guinda',
      route: '/plannings/create',
    },
    resources: {
      title: 'Crear Recurso Didáctico Digital',
      subtitle: 'Selecciona la materia para la cual deseas agregar recursos',
      icon: FolderIcon,
      color: 'dorado',
      route: '/resources/create',
    },
  }

  const currentConfig = config[type]

  // Filtrar materias que ya tienen planificación creada
  const subjects =
    type === 'plannings'
      ? data?.filter(
          (subject) =>
            !subject.plannings.some(
              (planning) => planning.period === subject.UserSubject.period
            )
        )
      : data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <LoadingApp />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`p-3 rounded-xl ${type === 'plannings' ? 'bg-[#7C2855]' : 'bg-[#D4AF37]'}`}
          >
            <currentConfig.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {currentConfig.title}
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {currentConfig.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Materias */}
      {subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`${currentConfig.route}/${subject.id}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#7C2855]"
            >
              <div className="p-6">
                {/* Icono de Materia */}
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon className="w-10 h-10 text-white" />
                </div>

                {/* Código de Materia */}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#7C2855] text-xs font-semibold rounded-full">
                    {subject.code}
                  </span>
                </div>

                {/* Nombre de Materia */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#7C2855] transition-colors duration-200">
                  {subject.name}
                </h3>

                {/* Academia */}
                {subject.academy && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    Academia de {subject.academy.name}
                  </p>
                )}

                {/* Periodo */}
                <p className="text-xs text-gray-500 mb-4">
                  Periodo: {subject.UserSubject.period}
                </p>

                {/* Indicador de acción */}
                <div className="flex items-center gap-2 text-[#7C2855] font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>Seleccionar</span>
                  <ArrowRightCircleIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Elemento decorativo */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes materias asignadas
          </h3>
          <p className="text-gray-600">
            Contacta al administrador para que te asigne materias
          </p>
        </div>
      )}

      {/* Botón de regreso */}
      <div className="mt-8">
        <Link
          to="/my-home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  )
}
