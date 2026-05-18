import InstitutionalFooter from '@/components/InstitutionalFooter'
import { LoadingApp } from '@/components/LoadingApp'
import { LogoHomeopatia } from '@/components/LogoHomeopatia'
import { LogoIPN } from '@/components/LogoIPN'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useAuth } from '@/hooks/useAuth'
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router'
import { Toaster } from 'sonner'

export default function UserLayout() {
  const { data, isError, isLoading } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('NEXUS_TOKEN')
    navigate('/auth/login')
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen ">
        <LoadingApp />
      </div>
    )
  if (isError) return <Navigate to="/auth/login" />
  if (data) {
    const isDepartmentHead = data.role === 'Jefe de Departamento'

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header Institucional */}
        <header className="bg-linear-to-r from-[#7C2855] to-[#5a1d3f] shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logos y Título */}
              <div className="flex items-center gap-4 group">
                <LogoIPN className="h-16 w-16 sm:h-20 sm:w-20 bg-white p-2 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300" />
                <div className="text-white hidden sm:block">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                    Instituto Politécnico Nacional
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-[#e8c96f]">
                    Escuela Nacional de Medicina y Homeopatía
                  </p>
                </div>
              </div>

              {/* Logo ENMH + Mobile Button */}
              <div className="flex items-center gap-4">
                <LogoHomeopatia className="h-16 w-16 sm:h-20 sm:w-20 bg-white p-2 rounded-lg shadow-md hidden md:block" />

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Línea decorativa dorada */}
          <div className="h-1 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
        </header>

        {/* Barra de Navegación */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            {/* Navegación Desktop */}
            <div className="hidden lg:flex items-center justify-between py-3">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 rounded-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-[#7C2855]"
                    >
                      <Link to="/my-home">
                        <HomeIcon className="w-5 h-5" />
                        <span>Inicio</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {isDepartmentHead ? (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          asChild
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 rounded-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-[#7C2855]"
                        >
                          <Link to="/department-head/plannings">
                            <DocumentTextIcon className="w-5 h-5" />
                            <span>Planeaciones</span>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </>
                  ) : (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          asChild
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 rounded-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-[#7C2855]"
                        >
                          <Link to="/my-plannings">
                            <DocumentTextIcon className="w-5 h-5" />
                            <span>Planificaciones</span>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuLink
                          asChild
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 rounded-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-[#7C2855]"
                        >
                          <Link to="/my-resources">
                            <FolderIcon className="w-5 h-5" />
                            <span>Recursos</span>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuLink
                          asChild
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 rounded-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-[#7C2855]"
                        >
                          <Link to="/my-profile">
                            <UserIcon className="w-5 h-5" />
                            <span>Mi Perfil</span>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              {/* User Section Desktop */}
              <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {data.name}
                  </p>
                  <p className="text-xs text-gray-500">{data.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7C2855] hover:bg-[#5a1d3f] text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
                <img
                  src="/logo_nexusipn.png"
                  alt="Logo NexusIPN"
                  className="h-16 w-16 sm:h-20 sm:w-20 bg-white p-2 rounded-lg shadow-md hidden md:block"
                />
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden py-4 space-y-2">
                <Link
                  to="/my-home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Inicio</span>
                </Link>
                {isDepartmentHead ? (
                  <>
                    <Link
                      to="/department-head/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Panel</span>
                    </Link>
                    <Link
                      to="/department-head/plannings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>Planeaciones</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-plannings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>Planificaciones</span>
                    </Link>
                    <Link
                      to="/my-resources"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      <FolderIcon className="w-5 h-5" />
                      <span>Recursos</span>
                    </Link>
                    <Link
                      to="/my-profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#7C2855] hover:bg-[#7C2855]/5 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Mi Perfil</span>
                    </Link>
                  </>
                )}

                {/* User Info Mobile */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg mb-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {data.name}
                    </p>
                    <p className="text-xs text-gray-500">{data.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-[#7C2855] hover:bg-[#5a1d3f] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                  >
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Área de Contenido Principal */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Outlet />
        </main>

        {/* Footer Institucional */}
        <InstitutionalFooter />
        <Toaster position="top-right" visibleToasts={3} />
      </div>
    )
  }
}
