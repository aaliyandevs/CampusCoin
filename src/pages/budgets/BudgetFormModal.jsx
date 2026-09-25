import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import * as categoriesApi from '../../api/categories.api'

const schema = z.object({
  categoryId: z.coerce.number().int().positive('Choose a category'),
  limitAmount: z.coerce.number().positive('Enter an amount'),
})

function BudgetFormModal({ open, onClose, onSubmit, month }) {
  const [categories, setCategories] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { categoryId: '', limitAmount: '' } })

  useEffect(() => {
    if (open) {
      categoriesApi.listCategories().then((cats) => setCategories(cats.filter((c) => c.type === 'EXPENSE')))
      reset({ categoryId: '', limitAmount: '' })
    }
  }, [open, reset])

  const submit = (data) => onSubmit({ ...data, month })

  return (
    <Modal open={open} onClose={onClose} title="Set a budget">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Select
          id="categoryId"
          label="Category"
          error={errors.categoryId?.message}
          {...register('categoryId')}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input
          id="limitAmount"
          type="number"
          step="0.01"
          label="Monthly limit"
          error={errors.limitAmount?.message}
          {...register('limitAmount')}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default BudgetFormModal
