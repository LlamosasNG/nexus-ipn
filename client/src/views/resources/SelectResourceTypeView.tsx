import { getUserSubjects } from '@/api/SubjectAPI'
import { LoadingApp } from '@/components/LoadingApp'
import { Button } from '@/components/ui/button'
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  CubeIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'

type ResourceType = 'digital-book' | 'interactive-digital-book' | 'learning-object'

const resourceOptions: {
  id: ResourceType
  title: string
  description: string
  icon: typeof BookOpenIcon
}[] = [
  {
    id: 'digital-book',
    title: 'Libro Digital',
    description:
      'Material en formato digital estructurado por unidades, temas o capítulos.',
    icon: BookOpenIcon,
  },
  {
    id: 'interactive-digital-book',
    title: 'Libro Digital Interactivo',
    description:
      'Libro con actividades interactivas, elementos multimedia y navegación enriquecida.',
    icon: SparklesIcon,
  },
  {
    id: 'learning-object',
    title: 'Objeto de Aprendizaje',
    description:
      'Recurso puntual orientado a una competencia o resultado de aprendizaje específico.',
    icon: CubeIcon,
  },
]

export default function SelectResourceTypeView() {
  const { subjectId } = useParams()
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null)

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['user-subjects'],
    queryFn: getUserSubjects,
  })

  const subject = subjects?.find((s) => s.id === Number(subjectId))
  const selectedOption = useMemo(
    () => resourceOptions.find((option) => option.id === selectedType),
    [selectedType]
  )
  const isImplementedType = selectedType === 'digital-book'

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
          to="/select-subject?type=resources"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C2855] text-white font-medium rounded-lg hover:bg-[#5a1d3f] transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a seleccionar materia
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-[#D4AF37]">
            <BookOpenIcon className="w-8 h-8 text-[#7C2855]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Seleccionar Tipo de Recurso
            </h1>
            <p className="text-gray-600 mt-1">
              Elige el tipo de recurso didáctico digital para la materia
              seleccionada
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8">
        <div className="bg-linear-to-r from-[#7C2855] to-[#5a1d3f] px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{subject.name}</h2>
          <p className="text-white/80 mt-1">
            Código: {subject.code} · Periodo: {subject.UserSubject.period}
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resourceOptions.map((option) => {
              const isSelected = option.id === selectedType
              const Icon = option.icon

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedType(option.id)}
                  className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#7C2855] bg-[#7C2855]/5 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                        isSelected
                          ? 'bg-[#7C2855] text-white'
                          : 'bg-[#D4AF37]/20 text-[#7C2855]'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    {isSelected && (
                      <CheckCircle2Icon className="w-6 h-6 text-[#7C2855]" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <p className="text-sm text-gray-600 mb-2">Tipo seleccionado</p>
        <p className="text-lg font-semibold text-gray-900">
          {selectedOption?.title || 'Selecciona una opción para continuar'}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/select-subject?type=resources"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Cambiar materia
        </Link>

        <div className="flex items-center gap-3">
          {selectedOption && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C2855]/10 text-[#7C2855] font-semibold">
              <CheckCircle2Icon className="w-5 h-5" />
              {selectedOption.title}
            </span>
          )}

          {subjectId && selectedType ? (
            isImplementedType ? (
              <Link to={`/resources/create/${subjectId}/${selectedType}`}>
                <Button className="px-7 py-2.5 bg-[#7C2855] text-white font-semibold rounded-lg hover:bg-[#5a1d3f] transition-all duration-300">
                  Continuar
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                className="px-7 py-2.5 bg-gray-300 text-gray-700 font-semibold rounded-lg"
              >
                Próximamente
              </Button>
            )
          ) : (
            <Button
              disabled
              className="px-7 py-2.5 bg-gray-300 text-gray-700 font-semibold rounded-lg"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
