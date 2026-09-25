import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import * as authApi from '../../api/auth.api'

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
})

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Reset link is missing a token')
      return
    }
    setIsSubmitting(true)
    try {
      await authApi.resetPassword({ token, password: data.password })
      toast.success('Password reset. Please log in.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Reset failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Back to login
        </Link>
      }
    >
      {!token ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          This reset link is invalid. Please request a new one.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="New password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
