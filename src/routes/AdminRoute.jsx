import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'

function AdminRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default AdminRoute
