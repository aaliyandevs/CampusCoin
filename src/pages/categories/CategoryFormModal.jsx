import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
})

function CategoryFormModal({ open, onClose, onSubmit, initialValues }) {
  const isEditing = Boolean(initialValues)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', type: 'EXPENSE' } })

  useEffect(() => {
    if (open) {
      reset(initialValues ?? { name: '', type: 'EXPENSE' })
    }
  }, [open, initialValues, reset])

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Rename category' : 'Add category'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          placeholder="e.g. Textbooks"
          error={errors.name?.message}
          {...register('name')}
        />
        <Select id="type" label="Type" disabled={isEditing} {...register('type')}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </Select>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CategoryFormModal
