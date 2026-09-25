import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import AdminLogin from '../pages/admin/AdminLogin'
import NotFound from '../pages/NotFound'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import AppShell from '../components/layout/AppShell'
import AdminShell from '../components/layout/AdminShell'
import Dashboard from '../pages/dashboard/Dashboard'
import Transactions from '../pages/transactions/Transactions'
import Categories from '../pages/categories/Categories'
import Budgets from '../pages/budgets/Budgets'
import Reports from '../pages/reports/Reports'
import Profile from '../pages/profile/Profile'
import AdminOverview from '../pages/admin/AdminOverview'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminAnnouncements from '../pages/admin/AdminAnnouncements'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminShell />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
