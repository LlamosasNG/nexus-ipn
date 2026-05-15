import { useAuth } from '@/hooks/useAuth'
import DepartmentHeadDashboardView from './departmentHead/DepartmentHeadDashboardView'
import HomeTeacherView from './teacher/HomeTeacherView'

export default function RoleHomeView() {
  const { data } = useAuth()

  if (!data) return null

  if (data.role === 'Jefe de Departamento') {
    return <DepartmentHeadDashboardView />
  }

  return <HomeTeacherView />
}
