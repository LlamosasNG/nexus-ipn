import { useAuth } from '@/hooks/useAuth'
import { MyPlanningsCard } from '@/components/planning/MyPlanningsCard'
import {
  DocumentTextIcon,
  FolderIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import { Link } from 'react-router'

export default function HomeTeacherView() {
  const { data } = useAuth()

  if (!data) return null
  return (
    <div className="max-w-6xl mx-auto">
      {/* Sección de Bienvenida */}
      <div className="mb-12">
        <div className="bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                ¡Bienvenido, {data.name}!
              </h1>
              <p className="text-lg sm:text-xl text-[#e8c96f] mb-2">
                Sistema de Gestión de Planificaciones Didácticas
              </p>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                Gestiona tus planificaciones didácticas y recursos digitales de
                manera eficiente y organizada
              </p>
            </div>
          </div>
          {/* Línea decorativa dorada */}
          <div className="h-1 bg-linear-to-r fr om-transparent via-[#D4AF37] to-transparent" />
        </div>
      </div>

      {/* Sección de Acciones Principales */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
          ¿Qué deseas hacer hoy?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Botón: Crear Planificación */}
          <Link
            to="/select-subject?type=plannings"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#7C2855]"
          >
            <div className="p-10">
              {/* Icono */}
              <div className="flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#7C2855] to-[#5a1d3f] rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon className="w-12 h-12 text-white" />
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Crear Planificación Didáctica
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed text-center mb-6">
                Diseña una nueva planificación didáctica con objetivos,
                competencias, actividades y evaluaciones
              </p>

              {/* Botón de acción */}
              <div className="flex items-center justify-center gap-2 text-[#7C2855] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <PlusIcon className="w-5 h-5" />
                <span>Comenzar</span>
              </div>
            </div>

            {/* Elemento decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full" />
          </Link>

          {/* Botón: Crear Recurso Digital */}
          <Link
            to="/select-subject?type=resources"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#D4AF37]"
          >
            <div className="p-10">
              {/* Icono */}
              <div className="flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#D4AF37] to-[#e8c96f] rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FolderIcon className="w-12 h-12 text-[#7C2855]" />
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Crear Recurso Didáctico Digital
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed text-center mb-6">
                Sube y organiza materiales educativos como documentos,
                presentaciones, videos y más
              </p>

              {/* Botón de acción */}
              <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <PlusIcon className="w-5 h-5" />
                <span>Comenzar</span>
              </div>
            </div>

            {/* Elemento decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#7C2855]/10 to-transparent rounded-bl-full" />
          </Link>
        </div>
      </div>

      {/* Mis Planeaciones */}
      <div className="mb-12">
        <MyPlanningsCard />
      </div>

      {/* Sección de Acceso Rápido (Opcional) */}
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Acceso Rápido
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/my-plannings"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-[#7C2855] font-medium rounded-lg border border-gray-300 hover:border-[#7C2855] transition-all duration-200"
          >
            Ver Mis Planificaciones
          </Link>
          <Link
            to="/my-resources"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-[#D4AF37] font-medium rounded-lg border border-gray-300 hover:border-[#D4AF37] transition-all duration-200"
          >
            Ver Mis Recursos
          </Link>
          <Link
            to="/my-profile"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-[#7C2855] font-medium rounded-lg border border-gray-300 hover:border-[#7C2855] transition-all duration-200"
          >
            Mi Perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
