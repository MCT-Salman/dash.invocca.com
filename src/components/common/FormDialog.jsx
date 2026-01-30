// src\components\common\FormDialog.jsx
/**
 * FormDialog Component
 * نافذة منبثقة للنماذج مع دعم react-hook-form
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
import { ButtonLoading } from './index'

/**
 * FormDialog Component
 * @param {Object} props
 * @param {Boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {String} props.title - Dialog title
 * @param {String} props.subtitle - Dialog subtitle
 * @param {ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Submit handler
 * @param {Boolean} props.loading - Loading state
 * @param {String} props.submitText - Submit button text
 * @param {String} props.cancelText - Cancel button text
 * @param {String} props.maxWidth - Dialog max width (xs, sm, md, lg, xl)
 * @param {Boolean} props.fullWidth - Full width dialog
 */
export default function FormDialog({
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
}) {
    const handleSubmit = (e) => {
        e?.preventDefault?.()
        // react-hook-form's handleSubmit should be called without event
        // It will handle the form submission internally
        if (typeof onSubmit === 'function') {
            // Pass event if function expects it, otherwise call without
            if (onSubmit.length > 0) {
                onSubmit(e)
            } else {
                onSubmit()
            }
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
                    backgroundColor: 'var(--color-surface)',
                    backgroundImage: 'none',
                    border: '1px solid var(--color-border)',
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <MuiDialogTitle component="div" sx={{ mb: 2 }}>
                    <MuiTypography variant="h6" component="div" sx={{ color: 'var(--color-text-primary)' }}>
                        {title}
                    </MuiTypography>
                </MuiDialogTitle>

                <MuiDialogContent sx={{ pt: 3, '& .MuiInputLabel-root': { position: 'relative', transform: 'none', marginBottom: '8px' } }}>
                    {children}
                </MuiDialogContent>

                <MuiDialogActions>
                    <MuiBox sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
                        <MuiButton
                            type="button"
                            onClick={onClose}
                            variant="outlined"
                            disabled={loading}
                        >
                            {cancelText}
                        </MuiButton>

                        <MuiButton
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <ButtonLoading /> : submitText}
                        </MuiButton>
                    </MuiBox>
                </MuiDialogActions>
            </form>
        </MuiDialog>
    )
}
