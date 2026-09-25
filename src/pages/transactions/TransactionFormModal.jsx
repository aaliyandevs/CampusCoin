import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import * as categoriesApi from '../../api/categories.api'

const schema = z
  .object({
    type: z.enum(['INCOME', 'EXPENSE']),
    categoryId: z.coerce.number().int().positive('Choose a category'),
    amount: z.coerce.number().positive('Enter an amount'),
    date: z.string().min(1, 'Date is required'),
    description: z.string().trim().max(255).optional(),
    isRecurringTemplate: z.boolean().optional(),
    recurrenceInterval: z.enum(['WEEKLY', 'MONTHLY']).optional(),
  })
  .refine((data) => !data.isRecurringTemplate || data.recurrenceInterval, {
    message: 'Choose how often this repeats',
    path: ['recurrenceInterval'],
  })

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function TransactionFormModal({ open, onClose, onSubmit, initialValues, defaultType = 'EXPENSE' }) {
  const isEditing = Boolean(initialValues)
  const [categories, setCategories] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'EXPENSE',
      categoryId: '',
      amount: '',
      date: todayString(),
      description: '',
      isRecurringTemplate: false,
      recurrenceInterval: 'MONTHLY',
    },
  })

  const type = watch('type')
  const isRecurring = watch('isRecurringTemplate')

  useEffect(() => {
    if (open) {
      categoriesApi.listCategories().then(setCategories)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              type: initialValues.type,
              categoryId: initialValues.categoryId,
              amount: initialValues.amount,
              date: initialValues.date?.slice(0, 10) ?? todayString(),
              description: initialValues.description ?? '',
              isRecurringTemplate: false,
            }
          : {
              type: defaultType,
              categoryId: '',
              amount: '',
              date: todayString(),
              description: '',
              isRecurringTemplate: false,
              recurrenceInterval: 'MONTHLY',
            },
      )
    }
    // categories must be in deps: it re-populates <option> elements, and reset()
    // needs to run again after they land or the select's value won't match
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categories, initialValues, defaultType, reset])

  const filteredCategories = categories.filter((c) => c.type === type)

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Select id="type" label="Type" {...register('type')}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Input
            id="amount"
            type="number"
            step="0.01"
            label="Amount"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </div>

        <Select
          id="categoryId"
          label="Category"
          error={errors.categoryId?.message}
          {...register('categoryId')}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input id="date" type="date" label="Date" error={errors.date?.message} {...register('date')} />

        <Input
          id="description"
          label="Description (optional)"
          placeholder="e.g. Campus Cafe lunch"
          {...register('description')}
        />

        {!isEditing && (
          <div className="flex flex-col gap-3 rounded-lg border border-stone-200 p-3 dark:border-stone-700">
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <Controller
                name="isRecurringTemplate"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                )}
              />
              This repeats automatically
            </label>
            {isRecurring && (
              <Select id="recurrenceInterval" label="Repeats" {...register('recurrenceInterval')}>
                <option value="MONTHLY">Monthly</option>
                <option value="WEEKLY">Weekly</option>
              </Select>
            )}
          </div>
        )}

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

export default TransactionFormModal
