// src\components\common\ModernViewDialog.jsx
/**
 * ModernViewDialog Component
 * Facebook-style view dialog with modern UI design
 */

import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiCard from '@/components/ui/MuiCard'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiChip from '@/components/ui/MuiChip'
import { X, Share2, Download, Edit, Calendar, MapPin, Users, DollarSign, Phone, Mail, Globe, Clock } from 'lucide-react'

/**
 * ModernViewDialog Component
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
 * @param {Array} props.actions - Additional actions array
 * @param {Object} props.data - Data object to display
 * @param {Array} props.sections - Sections configuration
 */
export default function ModernViewDialog({
    open,
    onClose,
    title,
    children,
    maxWidth = 'md',
    fullWidth = true,
    headerImage,
    closeText = 'إغلاق',
    showCloseButton = true,
    actions = [],
    data = {},
    sections = []
}) {
    const renderHeader = () => (
        <MuiBox sx={{ position: 'relative' }}>
            {/* Header Image (Optional) */}
            {headerImage && (
                <MuiBox sx={{ position: 'relative', height: 200 }}>
                    {headerImage}
                    <MuiBox sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
                        borderRadius: '20px 20px 0 0'
                    }} />
                    <MuiIconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            backdropFilter: 'blur(4px)',
                            borderRadius: '12px',
                            width: 36,
                            height: 36,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <X size={20} />
                    </MuiIconButton>
                </MuiBox>
            )}

            {/* Title */}
            {title && !headerImage && (
                <MuiBox sx={{ 
                    p: 3, 
                    pb: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'linear-gradient(135deg, var(--color-paper) 0%, var(--color-surface) 100%)'
                }}>
                    <MuiTypography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.2
                    }}>
                        {title}
                    </MuiTypography>
                    <MuiIconButton
                        onClick={onClose}
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
            )}
        </MuiBox>
    )

    const renderSection = (section, index) => {
        const { title, icon, fields, type = 'default', component } = section

        if (type === 'custom' && component) {
            return (
                <MuiBox key={index} sx={{ mb: 3 }}>
                    {component}
                </MuiBox>
            )
        }

        return (
            <MuiCard 
                key={index}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-paper)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transform: 'translateY(-1px)'
                    }
                }}
            >
                {title && (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {icon && (
                            <MuiBox sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-primary-50)',
                                color: 'var(--color-primary-500)'
                            }}>
                                {icon}
                            </MuiBox>
                        )}
                        <MuiTypography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: 'var(--color-text-primary)',
                            fontSize: '1.1rem'
                        }}>
                            {title}
                        </MuiTypography>
                    </MuiBox>
                )}

                {fields && (
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {fields.map((field, fieldIndex) => {
                            const { label, value, icon: fieldIcon, type: fieldType = 'text', chip, avatar } = field
                            const displayValue = value || data[field.key]

                            if (fieldType === 'avatar' && avatar) {
                                return (
                                    <MuiBox key={fieldIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <MuiAvatar 
                                            src={avatar} 
                                            sx={{ width: 48, height: 48 }}
                                        />
                                        <MuiBox>
                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                                {label}
                                            </MuiTypography>
                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                                {displayValue}
                                            </MuiTypography>
                                        </MuiBox>
                                    </MuiBox>
                                )
                            }

                            if (fieldType === 'chips' && Array.isArray(displayValue)) {
                                return (
                                    <MuiBox key={fieldIndex}>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                                            {label}
                                        </MuiTypography>
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {displayValue.map((item, chipIndex) => (
                                                <MuiChip
                                                    key={chipIndex}
                                                    label={typeof item === 'object' ? item.name || item.label : item}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'var(--color-primary-50)',
                                                        color: 'var(--color-primary-700)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem'
                                                    }}
                                                />
                                            ))}
                                        </MuiBox>
                                    </MuiBox>
                                )
                            }

                            if (fieldType === 'status') {
                                return (
                                    <MuiBox key={fieldIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {fieldIcon && (
                                            <MuiBox sx={{ color: displayValue ? 'var(--color-success-500)' : 'var(--color-error-500)' }}>
                                                {fieldIcon}
                                            </MuiBox>
                                        )}
                                        <MuiBox sx={{ flex: 1 }}>
                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                                {label}
                                            </MuiTypography>
                                            <MuiChip
                                                label={displayValue ? 'نشط' : 'غير نشط'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: displayValue ? 'var(--color-success-50)' : 'var(--color-error-50)',
                                                    color: displayValue ? 'var(--color-success-700)' : 'var(--color-error-700)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </MuiBox>
                                    </MuiBox>
                                )
                            }

                            return (
                                <MuiBox key={fieldIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    {fieldIcon && (
                                        <MuiBox sx={{ 
                                            color: 'var(--color-primary-500)', 
                                            mt: 0.5,
                                            flexShrink: 0
                                        }}>
                                            {fieldIcon}
                                        </MuiBox>
                                    )}
                                    <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            {label}
                                        </MuiTypography>
                                        <MuiTypography 
                                            variant="body1" 
                                            sx={{ 
                                                color: 'var(--color-text-primary)', 
                                                fontWeight: 500,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {displayValue || '-'}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            )
                        })}
                    </MuiBox>
                )}
            </MuiCard>
        )
    }

    const renderActions = () => (
        <MuiDialogActions sx={{ 
            p: 3, 
            pt: 0,
            gap: 2,
            justifyContent: 'flex-end'
        }}>
            {actions.map((action, index) => (
                <MuiButton
                    key={index}
                    onClick={action.onClick}
                    variant={action.variant || 'outlined'}
                    startIcon={action.icon}
                    disabled={action.disabled}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        ...(action.variant === 'contained' && {
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(216, 185, 138, 0.4)'
                            }
                        }),
                        '&:hover': {
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {action.label}
                </MuiButton>
            ))}

            {showCloseButton && (
                <MuiButton
                    onClick={onClose}
                    variant="contained"
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
                        transition: 'all 0.2s ease'
                    }}
                >
                    {closeText}
                </MuiButton>
            )}
        </MuiDialogActions>
    )

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-paper)',
                    backgroundImage: 'none',
                    border: 'none',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 1300,
                    maxHeight: '90vh'
                }
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)'
                }
            }}
        >
            {renderHeader()}

            <MuiDialogContent sx={{ 
                p: headerImage ? 3 : 0,
                pt: headerImage ? 3 : 0,
                overflowY: 'auto'
            }}>
                {sections.length > 0 ? (
                    sections.map(renderSection)
                ) : (
                    children
                )}
            </MuiDialogContent>

            {(actions.length > 0 || showCloseButton) && renderActions()}
        </MuiDialog>
    )
}
