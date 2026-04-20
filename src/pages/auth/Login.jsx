/**
 * Login Page
 * صفحة تسجيل الدخول
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Lock, Phone, Eye, EyeOff } from 'lucide-react'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'

// Validation Schema
const loginSchema = z.object({
    phone: z
        .string()
        .min(1, 'رقم الهاتف مطلوب'),
    password: z
        .string()
        .min(1, 'كلمة المرور مطلوبة'),
})

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { success, error: showError } = useNotification()

    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: '',
            password: '',
        },
    })

    // Submit handler
    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            setServerError('')

            const result = await login(data.phone, data.password)

            if (result.success) {
                success(MESSAGES.SUCCESS.LOGIN)
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
            title="مرحباً بك"
            subtitle="سجل دخولك للمتابعة"
            seoPageKey="login"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Server Error */}
                {serverError && (
                    <MuiAlert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: '12px',
                            backgroundColor: 'var(--color-error-100)',
                            border: '1px solid var(--color-error-300)',
                            color: 'var(--color-error-500)'
                        }}
                    >
                        {serverError}
                    </MuiAlert>
                )}

                {/* Phone Field */}
                <MuiBox sx={{ mb: 3 }}>
                    <MuiTextField
                        {...register('phone')}
                        label="رقم الهاتف"
                        placeholder="09xxxxxxxx"
                        type="tel"
                        fullWidth
                        required
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        disabled={isLoading}
                        autoFocus
                        inputMode="tel"
                        InputProps={{
                            startAdornment: (
                                <MuiBox sx={{ mr: 1, display: 'flex', alignItems: 'center', color: 'var(--color-primary-500)' }}>
                                    <Phone size={20} />
                                </MuiBox>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-white)',
                                border: '2px solid var(--color-primary-200)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-white)',
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'var(--color-white)',
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 3px var(--color-primary-100)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'var(--color-black)',
                                    WebkitTextFillColor: 'var(--color-black)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:focus': {
                                        color: 'var(--color-black)',
                                        WebkitTextFillColor: 'var(--color-black)',
                                    },
                                    '&::placeholder': {
                                        color: 'var(--color-gray-500)',
                                        opacity: 1,
                                        fontWeight: 400,
                                        WebkitTextFillColor: 'var(--color-gray-500)',
                                    },
                                    '&:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 100px var(--color-white) inset !important',
                                        WebkitTextFillColor: 'var(--color-black)',
                                        color: 'var(--color-black)',
                                    },
                                    '&:autofill': {
                                        WebkitBoxShadow: '0 0 0 100px var(--color-white) inset !important',
                                        WebkitTextFillColor: 'var(--color-black)',
                                        color: 'var(--color-black)',
                                    }
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--color-primary-500) !important',
                                fontWeight: 500,
                                fontSize: '0.95rem',
                                textAlign: 'right',
                                direction: 'rtl',
                                right: 0,
                                left: 'auto',
                                transformOrigin: 'top right',
                                '&.Mui-focused': {
                                    color: 'var(--color-primary-500) !important',
                                    fontWeight: 600,
                                }
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'var(--color-gray-700) !important',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                '&.Mui-error': {
                                    color: 'var(--color-error-500) !important',
                                }
                            }
                        }}
                    />
                </MuiBox>

                {/* Password Field */}
                <MuiBox sx={{ mb: 4 }}>
                    <MuiTextField
                        {...register('password')}
                        label="كلمة المرور"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <MuiInputAdornment position="start">
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary-500)' }}>
                                        <Lock size={20} />
                                    </MuiBox>
                                </MuiInputAdornment>
                            ),
                            endAdornment: (
                                <MuiInputAdornment position="end">
                                    <MuiIconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{
                                            color: 'var(--color-primary-500)',
                                            '&:hover': {
                                                backgroundColor: 'var(--color-primary-100)',
                                            }
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </MuiIconButton>
                                </MuiInputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-white)',
                                border: '2px solid var(--color-primary-200)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-white)',
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'var(--color-white)',
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 3px var(--color-primary-100)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'var(--color-black)',
                                    WebkitTextFillColor: 'var(--color-black)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:focus': {
                                        color: 'var(--color-black)',
                                        WebkitTextFillColor: 'var(--color-black)',
                                    },
                                    '&::placeholder': {
                                        color: 'var(--color-gray-500)',
                                        opacity: 1,
                                        fontWeight: 400,
                                        WebkitTextFillColor: 'var(--color-gray-500)',
                                    },
                                    '&:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 100px var(--color-white) inset !important',
                                        WebkitTextFillColor: 'var(--color-black)',
                                        color: 'var(--color-black)',
                                    },
                                    '&:autofill': {
                                        WebkitBoxShadow: '0 0 0 100px var(--color-white) inset !important',
                                        WebkitTextFillColor: 'var(--color-black)',
                                        color: 'var(--color-black)',
                                    }
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--color-primary-500) !important',
                                fontWeight: 500,
                                fontSize: '0.95rem',
                                textAlign: 'right',
                                direction: 'rtl',
                                right: 0,
                                left: 'auto',
                                transformOrigin: 'top right',
                                '&.Mui-focused': {
                                    color: 'var(--color-primary-500) !important',
                                    fontWeight: 600,
                                }
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'var(--color-gray-700) !important',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                '&.Mui-error': {
                                    color: 'var(--color-error-500) !important',
                                }
                            }
                        }}
                    />
                </MuiBox>

                {/* Submit Button */}
                <MuiButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                        py: 1.75,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                        color: 'var(--color-white)',
                        boxShadow: '0 4px 16px var(--color-primary-100)',
                        border: '2px solid var(--color-primary-300)',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                            boxShadow: '0 6px 24px var(--color-primary-200)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        '&:disabled': {
                            background: 'var(--color-primary-200)',
                            color: 'var(--color-white-500)',
                        }
                    }}
                >
                    {isLoading ? <ButtonLoading /> : 'تسجيل الدخول'}
                </MuiButton>
            </form>
        </AuthLayout>
    )
}