// src\components\common\ConfirmDialog.jsx
/**
 * Confirm Dialog Component
 * مربع حوار التأكيد
 */

import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiBox from '@/components/ui/MuiBox'

/**
 * Confirm Dialog
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmLabel - Confirm button label
 * @param {string} props.cancelLabel - Cancel button label
 * @param {string} props.confirmColor - Confirm button color
 * @param {boolean} props.loading - Loading state
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'تأكيد',
    message = 'هل أنت متأكد؟',
    confirmLabel = 'تأكيد',
    cancelLabel = 'إلغاء',
    confirmColor = 'primary',
    loading = false,
}) {
    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm()
        }
        if (onClose) {
            onClose()
        }
    }

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <MuiDialogTitle component="div" sx={{ mb: 2 }}>
                <MuiTypography variant="h6" component="div" sx={{ color: 'var(--color-text-primary)' }}>
                    {title}
                </MuiTypography>
            </MuiDialogTitle>

            <MuiDialogContent>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                    {message}
                </MuiTypography>
            </MuiDialogContent>

            <MuiDialogActions>
                <MuiBox sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
                    <MuiButton
                        onClick={onClose}
                        variant="outlined"
                        disabled={loading}
                    >
                        {cancelLabel}
                    </MuiButton>

                    <MuiButton
                        onClick={handleConfirm}
                        variant="contained"
                        color={confirmColor}
                        disabled={loading}
                        loading={loading}
                    >
                        {confirmLabel}
                    </MuiButton>
                </MuiBox>
            </MuiDialogActions>
        </MuiDialog>
    )
}
