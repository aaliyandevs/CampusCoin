import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { updateProfile } from '../../api/auth.api'
import { cn } from '../../utils/cn'

const fontSizeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'larger', label: 'Larger' },
]

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  academicYear: z.string().trim().max(50).optional().or(z.literal('')),
  monthlyAllowance: z.coerce.number().nonnegative().optional().or(z.literal('')),
  monthlySavingsGoal: z.coerce.number().nonnegative().optional().or(z.literal('')),
})

function Profile() {
  const { user, refreshUser } = useAuth()
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        academicYear: user.academicYear ?? '',
        monthlyAllowance: user.monthlyAllowance ?? '',
        monthlySavingsGoal: user.monthlySavingsGoal ?? '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        name: data.name,
        academicYear: data.academicYear || null,
        monthlyAllowance: data.monthlyAllowance === '' ? null : Number(data.monthlyAllowance),
        monthlySavingsGoal:
          data.monthlySavingsGoal === '' ? null : Number(data.monthlySavingsGoal),
      })
      await refreshUser()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Update failed')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Profile</h1>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input id="email" label="Email" value={user?.email ?? ''} disabled />
          <Input
            id="academicYear"
            label="Academic year"
            placeholder="e.g. Sophomore"
            error={errors.academicYear?.message}
            {...register('academicYear')}
          />
          <Input
            id="monthlyAllowance"
            type="number"
            step="0.01"
            label="Monthly allowance baseline"
            error={errors.monthlyAllowance?.message}
            {...register('monthlyAllowance')}
          />
          <Input
            id="monthlySavingsGoal"
            type="number"
            step="0.01"
            label="Monthly savings goal"
            error={errors.monthlySavingsGoal?.message}
            {...register('monthlySavingsGoal')}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>

      <Card className="max-w-lg">
        <h2 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
          Accessibility
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Theme</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Switch between light and dark mode
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
              Text size
            </p>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    fontSize === option.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-900/40 dark:text-brand-300'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Profile
