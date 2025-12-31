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
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444'
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
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                border: '2px solid rgba(216, 185, 138, 0.2)',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: '#fff',
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 3px rgba(216, 185, 138, 0.15)',
                                },
                                '& .MuiInputBase-input': {
                                    color: '#000000 !important',
                                    WebkitTextFillColor: '#000000 !important',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:focus': {
                                        color: '#000000 !important',
                                        WebkitTextFillColor: '#000000 !important',
                                    },
                                    '&::placeholder': {
                                        color: 'rgba(0, 0, 0, 0.5) !important',
                                        opacity: 1,
                                        fontWeight: 400,
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.5) !important',
                                    },
                                    '&:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                                        WebkitTextFillColor: '#000000 !important',
                                        color: '#000000 !important',
                                    },
                                    '&:autofill': {
                                        WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                                        WebkitTextFillColor: '#000000 !important',
                                        color: '#000000 !important',
                                    }
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.85) !important',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                '&.Mui-focused': {
                                    color: 'var(--color-primary-600) !important',
                                }
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'rgba(0, 0, 0, 0.7) !important',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                '&.Mui-error': {
                                    color: '#d32f2f !important',
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
                                                backgroundColor: 'rgba(216, 185, 138, 0.1)',
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
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                border: '2px solid rgba(216, 185, 138, 0.2)',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: '#fff',
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 3px rgba(216, 185, 138, 0.15)',
                                },
                                '& .MuiInputBase-input': {
                                    color: '#000000 !important',
                                    WebkitTextFillColor: '#000000 !important',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:focus': {
                                        color: '#000000 !important',
                                        WebkitTextFillColor: '#000000 !important',
                                    },
                                    '&::placeholder': {
                                        color: 'rgba(0, 0, 0, 0.5) !important',
                                        opacity: 1,
                                        fontWeight: 400,
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.5) !important',
                                    },
                                    '&:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                                        WebkitTextFillColor: '#000000 !important',
                                        color: '#000000 !important',
                                    },
                                    '&:autofill': {
                                        WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                                        WebkitTextFillColor: '#000000 !important',
                                        color: '#000000 !important',
                                    }
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.85) !important',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                '&.Mui-focused': {
                                    color: 'var(--color-primary-600) !important',
                                }
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'rgba(0, 0, 0, 0.7) !important',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                '&.Mui-error': {
                                    color: '#d32f2f !important',
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
                        color: '#fff',
                        boxShadow: '0 4px 16px rgba(216, 185, 138, 0.4)',
                        border: '2px solid rgba(216, 185, 138, 0.3)',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                            boxShadow: '0 6px 24px rgba(216, 185, 138, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        '&:disabled': {
                            background: 'rgba(216, 185, 138, 0.3)',
                            color: 'rgba(255, 255, 255, 0.5)',
                        }
                    }}
                >
                    {isLoading ? <ButtonLoading /> : 'تسجيل الدخول'}
                </MuiButton>
            </form>
        </AuthLayout>
    )
}