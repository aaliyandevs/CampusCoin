import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CategoryFormModal from '../categories/CategoryFormModal'
import * as adminApi from '../../api/admin.api'

function AdminCategories() {
  const [categories, setCategories] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const load = () => adminApi.listDefaultCategories().then(setCategories)

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (data) => {
    try {
      if (editingCategory) {
        await adminApi.updateDefaultCategory(editingCategory.id, { name: data.name })
      } else {
        await adminApi.createDefaultCategory(data)
      }
      setFormOpen(false)
      setEditingCategory(null)
      load()
      toast.success(editingCategory ? 'Category renamed' : 'Category added')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await adminApi.deleteDefaultCategory(deletingCategory.id)
      setDeletingCategory(null)
      load()
      toast.success('Category deleted')
    } catch (err) {
      setDeletingCategory(null)
      toast.error(err.response?.data?.message ?? 'Could not delete category')
    }
  }

  if (!categories) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-stone-400" />
      </div>
    )
  }

  const income = categories.filter((c) => c.type === 'INCOME')
  const expense = categories.filter((c) => c.type === 'EXPENSE')

  const renderGroup = (title, list) => (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
      <ul className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2.5">
            <span className="text-sm text-stone-700 dark:text-stone-300">{c.name}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingCategory(c)
                  setFormOpen(true)
                }}
                aria-label={`Rename ${c.name}`}
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingCategory(c)}
                aria-label={`Delete ${c.name}`}
                className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <p className="py-2 text-sm text-stone-400 dark:text-stone-500">No categories yet.</p>
        )}
      </ul>
    </Card>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Default categories
        </h1>
        <Button
          onClick={() => {
            setEditingCategory(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderGroup('Income', income)}
        {renderGroup('Expenses', expense)}
      </div>

      <CategoryFormModal
        open={formOpen}
        initialValues={editingCategory}
        onClose={() => {
          setFormOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Delete category"
        message={`Delete "${deletingCategory?.name}"? Students using it will be affected.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  )
}

export default AdminCategories
