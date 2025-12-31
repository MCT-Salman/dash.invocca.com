/**
 * Register Page
 * صفحة التسجيل
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiBox from '@/components/ui/MuiBox'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiAlert from '@/components/ui/MuiAlert'
import AuthLayout from '@/components/layout/AuthLayout'
import { useAuth, useNotification } from '@/hooks'
import { ROUTES, VALIDATION, MESSAGES } from '@/config/constants'
import { ButtonLoading } from '@/components/common'

// Validation Schema
const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'الاسم مطلوب')
        .min(VALIDATION.NAME.MIN_LENGTH, VALIDATION.NAME.MESSAGE)
        .max(VALIDATION.NAME.MAX_LENGTH, VALIDATION.NAME.MESSAGE),
    phone: z
        .string()
        .min(1, 'رقم الهاتف مطلوب')
        .regex(VALIDATION.PHONE.PATTERN, VALIDATION.PHONE.MESSAGE),
    password: z
        .string()
        .min(1, 'كلمة المرور مطلوبة')
        .min(VALIDATION.PASSWORD.MIN_LENGTH, VALIDATION.PASSWORD.MESSAGE),
    confirmPassword: z
        .string()
        .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
})

export default function Register() {
    const { register: registerUser } = useAuth()
    const { success, error: showError } = useNotification()

    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    })

    // Submit handler
    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            setServerError('')

            const { confirmPassword, ...userData } = data
            const result = await registerUser(userData)

            if (result.success) {
                success(MESSAGES.SUCCESS.REGISTER)
                // Navigation handled by AuthContext based on role
            } else {
                setServerError(result.error || MESSAGES.ERROR.GENERIC)
                showError(result.error || MESSAGES.ERROR.GENERIC)
            }
        } catch (err) {
            const errorMessage = err.message || MESSAGES.ERROR.GENERIC
            setServerError(errorMessage)
            showError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="إنشاء حساب جديد"
            subtitle="انضم إلينا وابدأ بتنظيم حفلاتك"
            seoPageKey="register"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Server Error */}
                {serverError && (
                    <MuiAlert severity="error" className="!mb-6">
                        {serverError}
                    </MuiAlert>
                )}

                {/* Name Field */}
                <MuiBox className="!mb-6">
                    <MuiTextField
                        {...register('name')}
                        label="الاسم الكامل"
                        placeholder="أدخل اسمك الكامل"
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={isLoading}
                        autoFocus
                    />
                </MuiBox>

                {/* Phone Field */}
                <MuiBox className="!mb-6">
                    <MuiTextField
                        {...register('phone')}
                        label="رقم الهاتف"
                        placeholder="09xxxxxxxx"
                        type="phone"
                        fullWidth
                        required
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        disabled={isLoading}
                        inputMode="tel"
                    />
                </MuiBox>

                {/* Password Field */}
                <MuiBox className="!mb-6">
                    <MuiTextField
                        {...register('password')}
                        label="كلمة المرور"
                        type="password"
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
                    />
                </MuiBox>

                {/* Confirm Password Field */}
                <MuiBox className="!mb-6">
                    <MuiTextField
                        {...register('confirmPassword')}
                        label="تأكيد كلمة المرور"
                        type="password"
                        fullWidth
                        required
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        disabled={isLoading}
                    />
                </MuiBox>

                {/* Submit Button */}
                <MuiButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    className="!mb-4 !py-3 !text-base !font-semibold bg-gradient-to-br from-secondary-500 to-beige-dark hover:from-beige-dark hover:to-secondary-500 transition-all duration-300"
                >
                    {isLoading ? <ButtonLoading /> : 'إنشاء حساب'}
                </MuiButton>

                {/* Login Link */}
                <MuiBox className="text-center">
                    <MuiTypography variant="body2" className="text-text-secondary">
                        لديك حساب بالفعل؟{' '}
                        <Link
                            to={ROUTES.AUTH.LOGIN}
                            className="text-beige-dark no-underline font-semibold hover:opacity-80 transition-opacity"
                        >
                            سجل دخولك
                        </Link>
                    </MuiTypography>
                </MuiBox>
            </form>
        </AuthLayout>
    )
}
