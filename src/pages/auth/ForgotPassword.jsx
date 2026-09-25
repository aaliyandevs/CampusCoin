import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import * as authApi from '../../api/auth.api'

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
})

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await authApi.forgotPassword(data)
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to reset it."
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Back to login
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-stone-600 dark:text-stone-300">
          If that email is registered, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@university.edu"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
