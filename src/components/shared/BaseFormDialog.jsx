/**
 * BaseFormDialog Component
 * مكون أساسي قابل لإعادة الاستخدام للنماذج في Dialog
 */

import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { X } from 'lucide-react'
import { ButtonLoading } from '@/components/common'

/**
 * BaseFormDialog Component
 * @param {Object} props
 * @param {Boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {String} props.title - Dialog title
 * @param {String} props.subtitle - Dialog subtitle (optional)
 * @param {ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Submit handler
 * @param {Boolean} props.loading - Loading state
 * @param {String} props.submitText - Submit button text
 * @param {String} props.cancelText - Cancel button text
 * @param {String} props.maxWidth - Dialog max width (xs, sm, md, lg, xl)
 * @param {Boolean} props.fullWidth - Full width dialog
 * @param {Boolean} props.showCancel - Show cancel button
 */
export default function BaseFormDialog({
    open,
    onClose,
    title,
    subtitle,
    children,
    onSubmit,
    loading = false,
    submitText = 'حفظ',
    cancelText = 'إلغاء',
    maxWidth = 'sm',
    fullWidth = true,
    showCancel = true,
}) {
    const handleSubmit = (e) => {
        e?.preventDefault?.()
        // react-hook-form's handleSubmit should be called without event
        // It will handle the form submission internally
        if (typeof onSubmit === 'function') {
            onSubmit()
        }
    }

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'auto',
                    backgroundColor: 'var(--color-surface-dark)',
                    backgroundImage: 'none',
                    border: '1px solid var(--color-border-glass)',
                }
            }}
        >
            <MuiDialogTitle 
                component="div"
                sx={{ mb: subtitle ? 1 : 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <MuiBox>
                    <MuiTypography variant="h6" component="div" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                        {title}
                    </MuiTypography>
                    {subtitle && (
                        <MuiTypography variant="body2" component="div" sx={{ color: 'var(--color-text-secondary)', mt: 0.5 }}>
                            {subtitle}
                        </MuiTypography>
                    )}
                </MuiBox>
                <MuiIconButton
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }
                    }}
                >
                    <X size={20} />
                </MuiIconButton>
            </MuiDialogTitle>
            
            <form onSubmit={handleSubmit}>
                <MuiDialogContent sx={{ pt: 0 }}>
                    {children}
                </MuiDialogContent>
                
                <MuiDialogActions sx={{ p: 2, pt: 1 }}>
                    <MuiBox sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
                        {showCancel && (
                            <MuiButton
                                onClick={onClose}
                                variant="outlined"
                                disabled={loading}
                                sx={{
                                    borderColor: 'var(--color-border-glass)',
                                    color: 'var(--color-text-secondary)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        backgroundColor: 'rgba(216, 185, 138, 0.05)',
                                    }
                                }}
                            >
                                {cancelText}
                            </MuiButton>
                        )}

                        <MuiButton
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                                },
                                '&:disabled': {
                                    background: 'rgba(216, 185, 138, 0.3)',
                                }
                            }}
                        >
                            {loading ? <ButtonLoading /> : submitText}
                        </MuiButton>
                    </MuiBox>
                </MuiDialogActions>
            </form>
        </MuiDialog>
    )
}

