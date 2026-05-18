import AuthLayout from '@/layouts/AuthLayout'
import LoginView from '@/views/auth/LoginView'
import RegisterView from '@/views/auth/RegisterView'
import ProfileTeacherView from '@/views/teacher/ProfileTeacherView'
import MyPlanningsView from '@/views/teacher/MyPlanningsView'
import MyResourcesView from '@/views/teacher/MyResourcesView'
import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import UserLayout from './layouts/UserLayout'
import RoleHomeView from './views/RoleHomeView'
import ConfirmAccountView from './views/auth/ConfirmAccountView'
import ForgotPasswordView from './views/auth/ForgotPasswordView'
import NewPasswordView from './views/auth/NewPasswordView'
import RequestNewCodeView from './views/auth/RequestNewCodeView'
import DashboardView from './views/DashboardView'
import DepartmentHeadDashboardView from './views/departmentHead/DepartmentHeadDashboardView'
import DepartmentHeadPlanningsView from './views/departmentHead/DepartmentHeadPlanningsView'
import DepartmentHeadPlanningViewerView from './views/departmentHead/DepartmentHeadPlanningViewerView'
import ConfirmPlanningView from './views/plannings/ConfirmPlanningView'
import CreatePlanningView from './views/plannings/CreatePlanningView'
import CreateDigitalBookView from './views/resources/CreateDigitalBookView'
import SelectResourceTypeView from './views/resources/SelectResourceTypeView'
import RegisterCodeView from './views/students/RegisterCodeView'
import SelectSubjectView from './views/subjects/SelectSubjectView'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route
            path="/auth/confirm-account"
            element={<ConfirmAccountView />}
          />
          <Route
            path="/auth/request-new-code"
            element={<RequestNewCodeView />}
          />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordView />}
          />
          <Route path="/auth/reset-password" element={<NewPasswordView />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/register-code" element={<RegisterCodeView />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="/my-home" element={<RoleHomeView />} />
          <Route
            path="/department-head/dashboard"
            element={<DepartmentHeadDashboardView />}
          />
          <Route
            path="/department-head/plannings"
            element={<DepartmentHeadPlanningsView />}
          />
          <Route
            path="/department-head/plannings/:planningId"
            element={<DepartmentHeadPlanningViewerView />}
          />
          <Route path="/my-plannings" element={<MyPlanningsView />} />
          <Route path="/my-resources" element={<MyResourcesView />} />
          <Route path="/select-subject" element={<SelectSubjectView />} />
          <Route
            path="/plannings/create/:subjectId"
            element={<ConfirmPlanningView />}
          />
          <Route
            path="/resources/create/:subjectId"
            element={<SelectResourceTypeView />}
          />
          <Route
            path="/resources/create/:subjectId/:resourceType"
            element={<CreateDigitalBookView />}
          />
          <Route path="/my-profile" element={<ProfileTeacherView />} />
          <Route
            path="/plannings/:planningId"
            element={<CreatePlanningView />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
