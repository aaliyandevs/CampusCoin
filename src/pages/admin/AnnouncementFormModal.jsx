import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  body: z.string().trim().min(1, 'Message is required').max(5000),
})

function AnnouncementFormModal({ open, onClose, onSubmit, initialValues }) {
  const isEditing = Boolean(initialValues)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { title: '', body: '' } })

  useEffect(() => {
    if (open) reset(initialValues ?? { title: '', body: '' })
  }, [open, initialValues, reset])

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit announcement' : 'New announcement'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input id="title" label="Title" error={errors.title?.message} {...register('title')} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Message
          </label>
          <textarea
            id="body"
            rows={4}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            {...register('body')}
          />
          {errors.body?.message && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{errors.body.message}</p>
          )}
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save' : 'Post'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AnnouncementFormModal
