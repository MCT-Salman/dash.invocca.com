// src\components\common\ModernDialog.jsx
/**
 * ModernDialog Component
 * Facebook-style dialog with modern UI design
 */

import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiDivider from '@/components/ui/MuiDivider'
import { X, ArrowLeft } from 'lucide-react'
import { ButtonLoading } from './index'

/**
 * ModernDialog Component
 * @param {Object} props
 * @param {Boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {String} props.title - Dialog title
 * @param {String} props.subtitle - Dialog subtitle (optional)
 * @param {ReactNode} props.children - Dialog content
 * @param {Function} props.onSubmit - Submit handler (for forms)
 * @param {Boolean} props.loading - Loading state
 * @param {String} props.submitText - Submit button text
 * @param {String} props.cancelText - Cancel button text
 * @param {String} props.maxWidth - Dialog max width (xs, sm, md, lg, xl)
 * @param {Boolean} props.fullWidth - Full width dialog
 * @param {Boolean} props.showCancel - Show cancel button
 * @param {Boolean} props.isForm - Enable form mode
 * @param {ReactNode} props.headerIcon - Icon in header
 * @param {Boolean} props.showBackButton - Show back button
 * @param {Function} props.onBack - Back button handler
 * @param {String} props.variant - Dialog variant (default, fullscreen, sheet)
 */
export default function ModernDialog({
    open,
    onClose,
    title,
    subtitle,
    children,
    onSubmit,
    loading = false,
    submitText = 'حفظ',
    cancelText = 'إلغاء',
    maxWidth = 'md',
    fullWidth = true,
    showCancel = true,
    isForm = false,
    headerIcon,
    showBackButton = false,
    onBack,
    variant = 'default'
}) {
    const handleSubmit = (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault()
        if (typeof onSubmit === 'function') {
            onSubmit()
        }
    }

    const getDialogStyles = () => {
        const baseStyles = {
            borderRadius: variant === 'fullscreen' ? '0px' : '20px',
            overflow: 'hidden',
            backgroundColor: 'var(--color-paper)',
            backgroundImage: 'none',
            border: 'none',
            boxShadow: variant === 'fullscreen' 
                ? 'none' 
                : '0px 25px 50px -12px rgba(0, 0, 0, 0.25), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(20px)',
            zIndex: 1300,
            maxHeight: variant === 'fullscreen' ? '100vh' : '90vh',
            ...(variant === 'sheet' && {
                margin: 0,
                maxHeight: '100vh',
                height: '100vh',
                borderRadius: '20px 20px 0px 0px'
            })
        }

        return baseStyles
    }

    const getContentStyles = () => {
        const baseStyles = {
            padding: variant === 'fullscreen' ? '24px' : '20px 24px 24px 24px',
            minHeight: variant === 'fullscreen' ? 'calc(100vh - 140px)' : 'auto',
            maxHeight: variant === 'fullscreen' ? 'calc(100vh - 140px)' : '60vh',
            overflowY: 'auto',
            scrollBehavior: 'smooth'
        }

        return baseStyles
    }

    const renderHeader = () => (
        <MuiBox 
            sx={{ 
                position: 'relative',
                padding: variant === 'fullscreen' ? '16px 24px' : '20px 24px 16px 24px',
                borderBottom: '1px solid var(--color-border)',
                background: 'linear-gradient(135deg, var(--color-paper) 0%, var(--color-surface) 100%)'
            }}
        >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    {showBackButton && (
                        <MuiIconButton
                            onClick={onBack}
                            sx={{
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-surface-hover)',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </MuiIconButton>
                    )}
                    
                    {headerIcon && (
                        <MuiBox sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            backgroundColor: 'var(--color-primary-50)',
                            color: 'var(--color-primary-500)',
                            '& svg': {
                                color: 'var(--color-primary-500) !important',
                                stroke: 'var(--color-primary-500) !important'
                            }
                        }}>
                            {headerIcon}
                        </MuiBox>
                    )}

                    <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography 
                            variant={variant === 'fullscreen' ? "h5" : "h6"} 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'var(--color-text-primary)',
                                lineHeight: 1.2,
                                wordBreak: 'break-word'
                            }}
                        >
                            {title}
                        </MuiTypography>
                        {subtitle && (
                            <MuiTypography 
                                variant="body2" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)', 
                                    mt: 0.5,
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word'
                                }}
                            >
                                {subtitle}
                            </MuiTypography>
                        )}
                    </MuiBox>
                </MuiBox>

                <MuiIconButton
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'transparent',
                        borderRadius: '12px',
                        width: 36,
                        height: 36,
                        '&:hover': {
                            backgroundColor: 'var(--color-surface-hover)',
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <X size={20} />
                </MuiIconButton>
            </MuiBox>
        </MuiBox>
    )

    const renderActions = () => (
        <MuiBox 
            sx={{ 
                padding: variant === 'fullscreen' ? '16px 24px' : '16px 24px 20px 24px',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}
        >
            {showCancel && (
                <MuiButton
                    onClick={onClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: '12px',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: 'var(--color-primary-500)',
                            backgroundColor: 'var(--color-surface-hover)',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {cancelText}
                </MuiButton>
            )}

            <MuiButton
                type={isForm ? "submit" : "button"}
                onClick={!isForm ? onSubmit : undefined}
                variant="contained"
                disabled={loading}
                sx={{
                    px: 3,
                    py: 1,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                    color: '#ffffff',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(216, 185, 138, 0.4)'
                    },
                    '&:disabled': {
                        background: 'rgba(216, 185, 138, 0.3)',
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                {loading ? <ButtonLoading /> : submitText}
            </MuiButton>
        </MuiBox>
    )

    const content = (
        <>
            {renderHeader()}
            
            <MuiDialogContent sx={getContentStyles()}>
                {children}
            </MuiDialogContent>

            {(onSubmit || showCancel) && renderActions()}
        </>
    )

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={variant === 'fullscreen' ? false : maxWidth}
            fullWidth={variant === 'fullscreen' ? true : fullWidth}
            fullScreen={variant === 'fullscreen'}
            PaperProps={{
                sx: getDialogStyles()
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)'
                }
            }}
        >
            {isForm ? (
                <form onSubmit={handleSubmit}>
                    {content}
                </form>
            ) : (
                content
            )}
        </MuiDialog>
    )
}
