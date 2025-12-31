/**
 * Forgot Password Page
 * صفحة استعادة كلمة المرور
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
import { useNotification } from '@/hooks'
import { ROUTES, VALIDATION } from '@/config/constants'
import { ButtonLoading } from '@/components/common'

// Validation Schema
const forgotPasswordSchema = z.object({
    phone: z
        .string()
        .min(1, 'رقم الهاتف مطلوب')
        .regex(VALIDATION.PHONE.PATTERN, VALIDATION.PHONE.MESSAGE),
})

export default function ForgotPassword() {
    const { success, error: showError } = useNotification()

    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            phone: '',
        },
    })

    // Submit handler
    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            setServerError('')

            // TODO: Implement forgot password API call
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1500))

            setIsSuccess(true)
            success('تم إرسال رابط استعادة كلمة المرور إلى رقم هاتفك')
        } catch (err) {
            const errorMessage = err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'
            setServerError(errorMessage)
            showError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <AuthLayout
                title="تم الإرسال بنجاح"
                seoPageKey="forgotPassword"
            >
                <MuiBox className="text-center !p-6">
                    <MuiAlert severity="success" className="!mb-6">
                        تم إرسال رابط استعادة كلمة المرور إلى رقم هاتفك
                    </MuiAlert>

                    <MuiTypography variant="body1" className="text-text-secondary !mb-4">
                        يرجى التحقق من رسائلك واتباع التعليمات لإعادة تعيين كلمة المرور
                    </MuiTypography>

                    <Link to={ROUTES.AUTH.LOGIN}>
                        <MuiButton
                            variant="contained"
                            fullWidth
                            className="!mt-4 bg-gradient-to-br from-secondary-500 to-beige-dark hover:from-beige-dark hover:to-secondary-500 transition-all duration-300"
                        >
                            العودة لتسجيل الدخول
                        </MuiButton>
                    </Link>
                </MuiBox>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="استعادة كلمة المرور"
            subtitle="أدخل رقم هاتفك لاستعادة كلمة المرور"
            seoPageKey="forgotPassword"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Server Error */}
                {serverError && (
                    <MuiAlert severity="error" className="!mb-6">
                        {serverError}
                    </MuiAlert>
                )}

                {/* Info Message */}
                <MuiAlert severity="info" className="!mb-6">
                    سنرسل لك رابط استعادة كلمة المرور عبر رسالة نصية
                </MuiAlert>

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
                        autoFocus
                        inputMode="tel"
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
                    {isLoading ? <ButtonLoading /> : 'إرسال رابط الاستعادة'}
                </MuiButton>

                {/* Back to Login Link */}
                <MuiBox className="text-center">
                    <MuiTypography variant="body2" className="text-text-secondary">
                        تذكرت كلمة المرور؟{' '}
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
