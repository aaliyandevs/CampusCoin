import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CategoryFormModal from './CategoryFormModal'
import * as categoriesApi from '../../api/categories.api'

function CategoryGroup({ title, categories, onEdit, onDelete }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
      <ul className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-700 dark:text-stone-300">{category.name}</span>
              {category.isDefault && <Badge tone="neutral">Default</Badge>}
            </div>
            {!category.isDefault && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(category)}
                  aria-label={`Rename ${category.name}`}
                  className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  aria-label={`Delete ${category.name}`}
                  className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <p className="py-2 text-sm text-stone-400 dark:text-stone-500">No categories yet.</p>
        )}
      </ul>
    </Card>
  )
}

function Categories() {
  const [categories, setCategories] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const load = () => categoriesApi.listCategories().then(setCategories)

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (data) => {
    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, { name: data.name })
      } else {
        await categoriesApi.createCategory(data)
      }
      setFormOpen(false)
      setEditingCategory(null)
      await load()
      toast.success(editingCategory ? 'Category renamed' : 'Category added')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await categoriesApi.deleteCategory(deletingCategory.id)
      setDeletingCategory(null)
      await load()
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

  const incomeCategories = categories.filter((c) => c.type === 'INCOME')
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Categories</h1>
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
        <CategoryGroup
          title="Income"
          categories={incomeCategories}
          onEdit={(c) => {
            setEditingCategory(c)
            setFormOpen(true)
          }}
          onDelete={setDeletingCategory}
        />
        <CategoryGroup
          title="Expenses"
          categories={expenseCategories}
          onEdit={(c) => {
            setEditingCategory(c)
            setFormOpen(true)
          }}
          onDelete={setDeletingCategory}
        />
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
        message={`Delete "${deletingCategory?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  )
}

export default Categories
