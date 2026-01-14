// src\pages\admin\components\ViewServiceDialog.jsx
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { X, Package, Tag, DollarSign, CheckCircle, XCircle, FileText } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { SERVICE_CATEGORY_LABELS, SERVICE_UNIT_LABELS } from '@/config/constants'

export default function ViewServiceDialog({ open, onClose, service }) {
    return (
        <MuiDialog
            open={open && !!service}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'auto',
                    backgroundColor: 'var(--color-surface-dark)',
                    backgroundImage: 'none',
                    border: '1px solid var(--color-border-glass)',
                    zIndex: 1300,
                    maxHeight: '90vh'
                }
            }}
        >
            {service ? (
                <MuiBox sx={{ position: 'relative' }}>
                    {/* Header Section */}
                    <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
                        <MuiBox sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: 'rgba(216, 185, 138, 0.1)' 
                        }}>
                            <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-300)', fontWeight: 'bold' }}>
                                {service.name?.[0]}
                            </MuiTypography>
                        </MuiBox>
                        <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />

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

                        <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: '#fff' }}>
                            <MuiTypography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {service.name}
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Package size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                                <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {SERVICE_CATEGORY_LABELS[service.category] || service.category}
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    <MuiDialogContent sx={{ p: 3 }}>
                        <MuiGrid container spacing={3}>
                            {/* Status & Basic Info */}
                            <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <MuiChip
                                    label={service.isActive ? 'نشطة' : 'غير نشطة'}
                                    icon={service.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    sx={{
                                        backgroundColor: service.isActive ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                                        color: service.isActive ? '#16a34a' : '#dc2626',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                />
                                <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>
                                    {formatCurrency(service.price ?? service.basePrice)}
                                </MuiTypography>
                            </MuiGrid>

                            {/* Description */}
                            {service.description && (
                                <MuiGrid item xs={12}>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                        {service.description}
                                    </MuiTypography>
                                </MuiGrid>
                            )}

                            <MuiGrid item xs={12}>
                                <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                            </MuiGrid>

                            {/* Service Details */}
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>تفاصيل الخدمة</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {[
                                        { icon: Tag, label: 'الفئة', value: SERVICE_CATEGORY_LABELS[service.category] || service.category },
                                        { icon: DollarSign, label: 'السعر', value: formatCurrency(service.price ?? service.basePrice) },
                                        { icon: FileText, label: 'الوحدة', value: SERVICE_UNIT_LABELS[service.unit] || service.unit },
                                        { icon: Package, label: 'الحالة', value: service.isActive ? 'نشطة' : 'غير نشطة' }
                                    ].map((item, idx) => (
                                        <MuiGrid item xs={6} sm={3} key={idx}>
                                            <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                                                <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-secondary-500)' }} />
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{item.label}</MuiTypography>
                                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary-dark)' }}>{item.value}</MuiTypography>
                                            </MuiBox>
                                        </MuiGrid>
                                    ))}
                                </MuiGrid>
                            </MuiGrid>

                            {/* Requirements */}
                            {service.requirements && service.requirements.length > 0 && (
                                <MuiGrid item xs={12}>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>المتطلبات</MuiTypography>
                                    <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {service.requirements.map((requirement, index) => (
                                            <MuiChip
                                                key={index}
                                                label={requirement}
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    borderColor: 'var(--color-border-glass)',
                                                    color: 'var(--color-text-primary-dark)',
                                                }}
                                            />
                                        ))}
                                    </MuiBox>
                                </MuiGrid>
                            )}
                        </MuiGrid>
                    </MuiDialogContent>

                    <MuiDialogActions sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--color-border-glass)' }}>
                        <MuiButton onClick={onClose} variant="contained" color="primary">
                            إغلاق
                        </MuiButton>
                    </MuiDialogActions>
                </MuiBox>
            ) : (
                <MuiBox sx={{ p: 4, textAlign: 'center' }}>
                    <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)' }}>
                        لم يتم اختيار خدمة
                    </MuiTypography>
                    <MuiButton onClick={onClose} sx={{ mt: 2 }}>
                        إغلاق
                    </MuiButton>
                </MuiBox>
            )}
        </MuiDialog>
    )
}
