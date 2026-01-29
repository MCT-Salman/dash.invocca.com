/**
 * BaseViewDialog Component
 * مكون أساسي قابل لإعادة الاستخدام لعرض البيانات في Dialog
 */

import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { X } from 'lucide-react'

/**
 * BaseViewDialog Component
 * @param {Object} props
 * @param {Boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {String} props.title - Dialog title
 * @param {ReactNode} props.children - Dialog content
 * @param {String} props.maxWidth - Dialog max width (xs, sm, md, lg, xl)
 * @param {Boolean} props.fullWidth - Full width dialog
 * @param {ReactNode} props.headerImage - Optional header image/content
 * @param {String} props.closeText - Close button text
 * @param {Boolean} props.showCloseButton - Show close button in actions
 */
export default function BaseViewDialog({
    open,
    onClose,
    title,
    children,
    maxWidth = 'md',
    fullWidth = true,
    headerImage,
    closeText = 'إغلاق',
    showCloseButton = true,
}) {
    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'auto',
                    backgroundColor: 'var(--color-paper)',
                    backgroundImage: 'none',
                    border: '1px solid var(--color-border)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 1300,
                    maxHeight: '90vh'
                }
            }}
        >
            <MuiBox sx={{ position: 'relative' }}>
                {/* Header Image (Optional) */}
                {headerImage && (
                    <MuiBox sx={{ position: 'relative' }}>
                        {headerImage}
                        <MuiIconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }
                            }}
                        >
                            <X size={20} />
                        </MuiIconButton>
                    </MuiBox>
                )}

                {/* Title */}
                {title && !headerImage && (
                    <MuiBox sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                        <MuiTypography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {title}
                        </MuiTypography>
                        <MuiIconButton
                            onClick={onClose}
                            sx={{
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-surface-hover)',
                                }
                            }}
                        >
                            <X size={20} />
                        </MuiIconButton>
                    </MuiBox>
                )}

                {/* Content */}
                <MuiDialogContent sx={{ p: headerImage ? 3 : 3 }}>
                    {children}
                </MuiDialogContent>

                {/* Actions */}
                {showCloseButton && (
                    <MuiDialogActions sx={{ p: 2, pt: 0 }}>
                        <MuiButton
                            onClick={onClose}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                                }
                            }}
                        >
                            {closeText}
                        </MuiButton>
                    </MuiDialogActions>
                )}
            </MuiBox>
        </MuiDialog>
    )
}

