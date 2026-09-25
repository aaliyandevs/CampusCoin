import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import * as adminApi from '../../api/admin.api'

function AdminUsers() {
  const [users, setUsers] = useState(null)

  const load = () => adminApi.listUsers().then(setUsers)

  useEffect(() => {
    load()
  }, [])

  const handleToggleDisable = async (user) => {
    try {
      await adminApi.toggleDisableUser(user.id)
      load()
      toast.success(user.isDisabled ? 'User re-enabled' : 'User disabled')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleResetPassword = async (user) => {
    try {
      await adminApi.resetUserPassword(user.id)
      toast.success(`Reset link sent to ${user.email}`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  if (!users) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-stone-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Users</h1>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-stone-500 dark:border-stone-800 dark:text-stone-400">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Transactions</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 text-stone-700 dark:text-stone-300">{u.name}</td>
                  <td className="px-4 py-3 text-stone-500 dark:text-stone-400">{u.email}</td>
                  <td className="px-4 py-3 text-stone-500 dark:text-stone-400">
                    {u._count.transactions}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isDisabled ? 'danger' : 'brand'}>
                      {u.isDisabled ? 'Disabled' : 'Active'}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleResetPassword(u)}>
                        Reset password
                      </Button>
                      <Button
                        variant={u.isDisabled ? 'secondary' : 'danger'}
                        size="sm"
                        onClick={() => handleToggleDisable(u)}
                      >
                        {u.isDisabled ? 'Enable' : 'Disable'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-stone-400 dark:text-stone-500">
              No students registered yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AdminUsers
