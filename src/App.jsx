// src\App.jsx

import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES, USER_ROLES } from './config/constants'
import { useAuth } from './hooks'
import { LoadingScreen } from './components/common'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import HallsManagement from './pages/admin/HallsManagement'
import ServicesManagement from './pages/admin/ServicesManagement'
import ComplaintsManagement from './pages/admin/ComplaintsManagement'
import TemplatesManagement from './pages/admin/TemplatesManagement'
import ReportsManagement from './pages/admin/ReportsManagement'
import ManagersManagement from './pages/admin/ManagersManagement'
import EventsManagementAdmin from './pages/admin/EventsManagement'
import ClientsManagementAdmin from './pages/admin/ClientsManagement'
import AdminProfile from './pages/admin/AdminProfile'

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import HallManagement from './pages/manager/HallManagementNew'
import ManagerServicesManagement from './pages/manager/ServicesManagement'
import EventsManagement from './pages/manager/EventsManagementNew'
import ClientsManagement from './pages/manager/ClientsManagementNew'
import StaffManagement from './pages/manager/StaffManagementNew'
import ManagerReports from './pages/manager/ManagerReports'
import ManagerRatings from './pages/manager/ManagerRatings'
import ManagerTemplates from './pages/manager/ManagerTemplates'
import ManagerComplaints from './pages/manager/ManagerComplaints'
import ManagerProfile from './pages/manager/ManagerProfile'
import ManagerSongsManagement from './pages/manager/SongsManagement'
import ManagerFinancial from './pages/manager/ManagerFinancial'
import ManagerFinancialDashboard from './pages/manager/ManagerFinancialDashboard'
import ManagerTransactions from './pages/manager/ManagerTransactions'
import ManagerFinancialReports from './pages/manager/ManagerFinancialReports'

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard'
import ClientBookings from './pages/client/Bookings'
import ClientInvitations from './pages/client/Invitations'
import ClientSongs from './pages/client/Songs'
import ClientReports from './pages/client/ClientReports'
import ClientRatings from './pages/client/ClientRatings'
import ClientProfile from './pages/client/ClientProfile'

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeScanner from './pages/employee/Scanner'
import EmployeeTasks from './pages/employee/Tasks'

export default function App() {
    const { isLoading } = useAuth()

    // Show loading while checking auth
    if (isLoading) {
        return <LoadingScreen message="جاري التحميل..." />
    }

    return (
        <Routes>
            {/* Public Routes */}
            {/* الصفحة الرئيسية */}
            <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />

            {/* Auth Routes */}
            <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
            <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
            <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />

            {/* Admin Routes under DashboardLayout */}
            <Route element={<ProtectedRoute requiredRole={USER_ROLES.ADMIN}><MainLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
                <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
                <Route path={ROUTES.ADMIN.USERS} element={<UsersManagement />} />
                <Route path="/admin/managers" element={<ManagersManagement />} />
                <Route path={ROUTES.ADMIN.HALLS} element={<HallsManagement />} />
                <Route path={ROUTES.ADMIN.SERVICES} element={<ServicesManagement />} />
                <Route path={ROUTES.ADMIN.EVENTS} element={<EventsManagementAdmin />} />
                <Route path={ROUTES.ADMIN.CLIENTS} element={<ClientsManagementAdmin />} />
                <Route path={ROUTES.ADMIN.COMPLAINTS} element={<ComplaintsManagement />} />
                <Route path={ROUTES.ADMIN.TEMPLATES} element={<TemplatesManagement />} />
                <Route path={ROUTES.ADMIN.REPORTS} element={<ReportsManagement />} />
                <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProfile />} />
            </Route>

            {/* Manager Routes under DashboardLayout */}
            <Route element={<ProtectedRoute requiredRole={USER_ROLES.MANAGER}><MainLayout /></ProtectedRoute>}>
                <Route path="/manager" element={<Navigate to={ROUTES.MANAGER.DASHBOARD} replace />} />
                <Route path={ROUTES.MANAGER.DASHBOARD} element={<ManagerDashboard />} />
                <Route path={ROUTES.MANAGER.HALL} element={<HallManagement />} />
                <Route path={ROUTES.MANAGER.SERVICES} element={<ManagerServicesManagement />} />
                <Route path={ROUTES.MANAGER.SONGS} element={<ManagerSongsManagement />} />
                <Route path={ROUTES.MANAGER.EVENTS} element={<EventsManagement />} />
                <Route path={ROUTES.MANAGER.CLIENTS} element={<ClientsManagement />} />
                <Route path={ROUTES.MANAGER.STAFF} element={<StaffManagement />} />
                <Route path={ROUTES.MANAGER.REPORTS} element={<ManagerReports />} />
                <Route path={ROUTES.MANAGER.RATINGS} element={<ManagerRatings />} />
                <Route path={ROUTES.MANAGER.TEMPLATES} element={<ManagerTemplates />} />
                <Route path={ROUTES.MANAGER.COMPLAINTS} element={<ManagerComplaints />} />
                <Route path="/manager/financial/dashboard" element={<ManagerFinancialDashboard />} />
                <Route path="/manager/financial/invoices" element={<ManagerFinancial />} />
                <Route path="/manager/financial/transactions" element={<ManagerTransactions />} />
                <Route path="/manager/financial/reports" element={<ManagerFinancialReports />} />
                <Route path={ROUTES.MANAGER.PROFILE} element={<ManagerProfile />} />
            </Route>

            {/* Client Routes under DashboardLayout */}
            <Route element={<ProtectedRoute requiredRole={USER_ROLES.CLIENT}><MainLayout /></ProtectedRoute>}>
                <Route path="/client" element={<Navigate to={ROUTES.CLIENT.DASHBOARD} replace />} />
                <Route path={ROUTES.CLIENT.DASHBOARD} element={<ClientDashboard />} />
                <Route path={ROUTES.CLIENT.BOOKINGS} element={<ClientBookings />} />
                <Route path={ROUTES.CLIENT.INVITATIONS} element={<ClientInvitations />} />
                <Route path={ROUTES.CLIENT.SONGS} element={<ClientSongs />} />
                <Route path={ROUTES.CLIENT.REPORTS} element={<ClientReports />} />
                <Route path={ROUTES.CLIENT.RATINGS} element={<ClientRatings />} />
                <Route path={ROUTES.CLIENT.PROFILE} element={<ClientProfile />} />
            </Route>

            {/* Employee Routes under DashboardLayout */}
            <Route element={<ProtectedRoute requiredRole={USER_ROLES.EMPLOYEE}><MainLayout /></ProtectedRoute>}>
                <Route path="/employee" element={<Navigate to={ROUTES.EMPLOYEE.DASHBOARD} replace />} />
                <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
                <Route path={ROUTES.EMPLOYEE.SCANNER} element={<EmployeeScanner />} />
                <Route path={ROUTES.EMPLOYEE.TASKS} element={<EmployeeTasks />} />
            </Route>
            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
    )
}
