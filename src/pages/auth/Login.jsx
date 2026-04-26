import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import MuiAlert from '@/components/ui/MuiAlert'
import MuiBox from '@/components/ui/MuiBox'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiTypography from '@/components/ui/MuiTypography'
import { ButtonLoading, SEOHead } from '@/components/common'
import { useAuth, useNotification } from '@/hooks'
import { MESSAGES, ROUTES, USER_ROLES } from '@/config/constants'

const loginSchema = z.object({
    phone: z.string().min(1, 'اسم المستخدم مطلوب'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

const fieldSx = {
    '& .MuiInputBase-root': {
        minHeight: '64px',
        position: 'relative',
        borderRadius: '0 !important',
        backgroundColor: 'transparent !important',
        border: 'none !important',
        borderBottom: '1px solid var(--color-border) !important',
        boxShadow: 'none !important',
        '&:hover': {
            borderBottom: '1px solid var(--color-border) !important',
        },
        '&.Mui-focused': {
            borderBottom: '1px solid var(--color-border) !important',
        },
        '&.Mui-error': {
            borderBottom: '1px solid var(--color-error-500) !important',
        },
        '&.Mui-error:hover': {
            borderBottom: '1px solid var(--color-error-500) !important',
        },
        '&.Mui-error.Mui-focused': {
            borderBottom: '1px solid var(--color-error-500) !important',
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: '-1px',
            height: '2px',
            backgroundColor: 'var(--color-icon) !important',
            transform: 'scaleX(0)',
            transformOrigin: 'right center',
            transition: 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
        },
        '&.Mui-focused:after': {
            transform: 'scaleX(1)',
        },
        '&.Mui-error:after': {
            backgroundColor: 'var(--color-error-500) !important',
        },
        '&.Mui-error.Mui-focused:after': {
            transform: 'scaleX(1)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none !important',
    },
    '& .MuiInputBase-input': {
        textAlign: 'right',
        color: 'var(--color-text-primary) !important',
        WebkitTextFillColor: 'var(--color-text-primary) !important',
        fontFamily: 'Alexandria, var(--font-family-base)',
        fontWeight: 500,
        fontSize: '1rem',
        padding: '22px 14px 10px 0',
        '&::placeholder': {
            color: 'var(--color-text-secondary) !important',
            WebkitTextFillColor: 'var(--color-text-secondary) !important',
            opacity: 0.8,
            fontFamily: 'Alexandria, var(--font-family-base)',
        },
    },
    '& .MuiInputLabel-root': {
        width: '100%',
        textAlign: 'right',
        color: 'var(--color-text-primary) !important',
        fontWeight: 700,
        fontSize: '1rem',
        fontFamily: 'Alexandria, var(--font-family-base)',
        '&.Mui-error': {
            color: 'var(--color-error-500) !important',
        },
    },
    '& .MuiFormHelperText-root': {
        textAlign: 'right',
        color: 'var(--color-text-primary) !important',
        marginRight: 0,
        marginLeft: 0,
        fontFamily: 'Alexandria, var(--font-family-base)',
        '&.Mui-error': {
            color: 'var(--color-error-500) !important',
        },
    },
}

const startAdornmentSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    color: 'var(--color-icon)',
    '&::after': {
        content: '""',
        width: '1px',
        height: '22px',
        backgroundColor: 'var(--color-border)',
        display: 'block',
    },
}

const revealUp = {
    opacity: 0,
    animation: 'loginRevealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
}

const revealRight = {
    opacity: 0,
    animation: 'loginRevealRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
}

export default function Login() {
    const navigate = useNavigate()
    const { login, user, isAuthenticated, isLoading: authLoading } = useAuth()
    const { success, error: showError } = useNotification()

    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            const userRoles = Array.isArray(user.role) ? user.role : [user.role]
            const primaryRole = userRoles[0]

            switch (primaryRole) {
                case USER_ROLES.ADMIN:
                    navigate(ROUTES.ADMIN.DASHBOARD)
                    break
                case USER_ROLES.MANAGER:
                    navigate(ROUTES.MANAGER.DASHBOARD)
                    break
                case USER_ROLES.CLIENT:
                    navigate(ROUTES.CLIENT.DASHBOARD)
                    break
                case USER_ROLES.EMPLOYEE:
                case 'scanner':
                    navigate(ROUTES.EMPLOYEE.DASHBOARD)
                    break
                default:
                    navigate(ROUTES.HOME)
            }
        }
    }, [authLoading, isAuthenticated, navigate, user])

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

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            setServerError('')

            const result = await login(data.phone, data.password)

            if (result.success) {
                success(MESSAGES.SUCCESS.LOGIN)
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
        <>
            <SEOHead pageKey="login" />

            <MuiBox
                sx={{
                    minHeight: '100dvh',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gridTemplateRows: { xs: 'auto auto', md: '1fr' },
                    overflow: { xs: 'auto', md: 'hidden' },
                    backgroundColor: 'var(--color-bg)',
                    '@keyframes loginRevealUp': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(26px)',
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    },
                    '@keyframes loginRevealRight': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateX(36px)',
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateX(0)',
                        },
                    },
                    '@keyframes loginLogoPop': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(18px) scale(0.86)',
                            filter: 'blur(6px)',
                        },
                        '60%': {
                            opacity: 1,
                            transform: 'translateY(-4px) scale(1.04)',
                            filter: 'blur(0)',
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0) scale(1)',
                            filter: 'blur(0)',
                        },
                    },
                }}
            >
                <MuiBox
                    sx={{
                        order: { xs: 2, md: 1 },
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: 'auto', md: '100dvh' },
                        px: { xs: 2.5, sm: 4, md: 8, lg: 10 },
                        py: { xs: 4, sm: 5, md: 6 },
                        overflow: 'hidden',
                        ...revealUp,
                        animationDelay: '0.12s',
                    }}
                >
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '440px' },
                            direction: 'rtl',
                        }}
                    >
                        <MuiTypography
                            component="h1"
                            sx={{
                                color: 'var(--color-text-primary)',
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                                lineHeight: 1.2,
                                mb: 1.5,
                                textAlign: 'center',
                                fontFamily: 'Alexandria, var(--font-family-base)',
                                ...revealUp,
                                animationDelay: '0.28s',
                            }}
                        >
                            سجل دخولك
                        </MuiTypography>

                        <MuiTypography
                            sx={{
                                color: 'var(--color-text-secondary)',
                                fontWeight: 400,
                                fontSize: { xs: '0.98rem', sm: '1.05rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                mb: { xs: 3.5, sm: 4.5 },
                                textAlign: 'center',
                                fontFamily: 'Alexandria, var(--font-family-base)',
                                ...revealUp,
                                animationDelay: '0.38s',
                            }}
                        >
                            واستمتع برحلتك في الدعوات
                        </MuiTypography>

                        <MuiBox
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                            sx={{
                                borderRadius: '24px',
                                border: '5px solid transparent',
                                backgroundImage:
                                    'linear-gradient(var(--color-light-soft), var(--color-light-soft)), linear-gradient(127.12deg, #D8B98A -1.37%, #FFF8DA 21.3%, #D8B98A 51.52%, #FFF8DA 68.99%, #D8B98A 96.85%)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                                px: { xs: 2.5, sm: 3.5, md: 4.5 },
                                py: { xs: 3, sm: 3.5, md: 4 },
                                overflow: 'hidden',
                                ...revealUp,
                                animationDelay: '0.5s',
                            }}
                        >

                            {serverError && (
                                <MuiAlert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '14px',
                                        border: '1px solid var(--color-error-500) !important',
                                        backgroundColor: 'var(--color-error-50) !important',
                                        color: 'var(--color-error-700) !important',
                                        px: 2,
                                        py: 1.5,
                                        '& .MuiAlert-icon': {
                                            color: 'var(--color-error-500) !important',
                                            px: 1,
                                        },
                                        '& .MuiAlert-message': {
                                            color: 'var(--color-error-700) !important',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'var(--color-error-500) !important',
                                        },
                                    }}
                                >
                                    {serverError}
                                </MuiAlert>
                            )}

                            <MuiBox sx={{ mb: { xs: 2.25, sm: 3 } }}>
                                <MuiTextField
                                    {...register('phone')}
                                    label="اسم المستخدم"
                                    placeholder="اسم المستخدم"
                                    type="text"
                                    fullWidth
                                    required
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    disabled={isLoading}
                                    autoFocus
                                    inputMode="text"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <MuiInputAdornment position="start">
                                                <MuiBox sx={startAdornmentSx}>
                                                    <User size={18} />
                                                </MuiBox>
                                            </MuiInputAdornment>
                                        ),
                                    }}
                                />
                            </MuiBox>

                            <MuiBox sx={{ mb: { xs: 4, sm: 5 } }}>
                                <MuiTextField
                                    {...register('password')}
                                    label="كلمة المرور"
                                    placeholder="كلمة المرور"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    disabled={isLoading}
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <MuiInputAdornment position="start">
                                                <MuiBox sx={startAdornmentSx}>
                                                    <Lock size={18} />
                                                </MuiBox>
                                            </MuiInputAdornment>
                                        ),
                                        endAdornment: (
                                            <MuiInputAdornment position="end">
                                                <MuiIconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{
                                                        color: 'var(--color-icon)',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                        },
                                                    }}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </MuiIconButton>
                                            </MuiInputAdornment>
                                        ),
                                    }}
                                />
                            </MuiBox>

                            <MuiButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    minHeight: { xs: '52px', sm: '56px' },
                                    borderRadius: '16px',
                                    background: 'var(--color-icon)',
                                    color: 'var(--color-text-on-primary)',
                                    fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
                                    fontWeight: 700,
                                    fontFamily: 'Alexandria, var(--font-family-base)',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    border: '1px solid var(--color-border)',
                                    '&:hover': {
                                        background: 'var(--color-icon)',
                                        boxShadow: 'none',
                                    },
                                    '&.Mui-disabled': {
                                        background: 'var(--color-border)',
                                        color: 'var(--color-text-on-primary)',
                                        opacity: 1,
                                    },
                                }}
                            >
                                {isLoading ? <ButtonLoading /> : 'تسجيل الدخول'}
                            </MuiButton>
                        </MuiBox>

                        <MuiTypography
                            sx={{
                                mt: { xs: 4, sm: 5 },
                                color: 'var(--color-text-secondary)',
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                textAlign: 'center',
                                fontFamily: 'Alexandria, var(--font-family-base)',
                            }}
                        >
                            © 2026 INVOCCA جميع الحقوق محفوظة
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>

                <MuiBox
                    sx={{
                        order: { xs: 1, md: 2 },
                        backgroundColor: 'var(--color-primary-500)',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: '42dvh', sm: '46dvh', md: '100dvh' },
                        px: { xs: 2.5, sm: 4, md: 8, lg: 10 },
                        py: { xs: 4, sm: 5, md: 6 },
                        overflow: 'hidden',
                        ...revealRight,
                    }}
                >
                    <MuiBox
                        sx={{
                            textAlign: 'center',
                            maxWidth: '560px',
                        }}
                    >
                        <MuiBox
                            component="img"
                            src="/logo/logo_white_with_invocca.png"
                            alt="INVOCCA"
                            sx={{
                                width: { xs: '132px', sm: '170px', md: '220px' },
                                maxWidth: '52%',
                                mb: { xs: 2.5, sm: 3, md: 4 },
                                mx: 'auto',
                                display: 'block',
                                opacity: 0,
                                animation: 'loginLogoPop 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                animationDelay: '0.28s',
                            }}
                        />

                        <MuiTypography
                            sx={{
                                fontSize: { xs: '1.35rem', sm: '1.85rem', md: '2.4rem', lg: '2.8rem' },
                                color: 'var(--color-text-primary)',
                                mb: { xs: 0.75, sm: 1, md: 1.5 },
                                lineHeight: 1.35,
                                fontWeight: 300,
                                letterSpacing: '0.4em',
                                fontFamily: 'Montserrat, sans-serif',
                                ...revealRight,
                                animationDelay: '0.72s',
                            }}
                        >
                            Where invitations begin
                        </MuiTypography>

                        <MuiTypography
                            sx={{
                                fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.9rem' },
                                color: 'var(--color-text-primary)',
                                mb: { xs: 2, sm: 2.5, md: 4 },
                                fontWeight: 500,
                                ...revealRight,
                                animationDelay: '0.86s',
                            }}
                        >
                            حيث تبدأ الدعوة
                        </MuiTypography>

                        <MuiTypography
                            sx={{
                                fontSize: { xs: '0.95rem', sm: '1.12rem', md: '1.5rem' },
                                lineHeight: { xs: 1.75, md: 1.9 },
                                color: 'var(--color-text-on-primary)',
                                fontWeight: 600,
                                fontFamily: 'Alexandria, var(--font-family-base)',
                                maxWidth: { xs: '300px', sm: '420px', md: '100%' },
                                mx: 'auto',
                                ...revealRight,
                                animationDelay: '1s',
                            }}
                        >
                            الحل الأمثل لإنشاء وإرسال الدعوات بكل سهولة واحترافية
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            </MuiBox>
        </>
    )
}
