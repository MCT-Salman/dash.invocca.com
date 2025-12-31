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
import { X, MapPin, Users, Armchair as Chair, Table, User, Phone, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { API_CONFIG } from '@/config/constants'

const getImageUrl = (image) => {
    if (!image) return null
    if (typeof image === 'string') {
        if (image.startsWith('http')) return image
        return `${API_CONFIG.BASE_URL}/uploads/halls/${image}`
    }
    if (image.url) {
        if (image.url.startsWith('http')) return image.url
        return `${API_CONFIG.BASE_URL}/uploads/halls/${image.url}`
    }
    return null
}

export default function ViewHallDialog({ open, onClose, hall }) {
    // Don't return null early, let the dialog handle the open/close state
    return (
        <MuiDialog
            open={open && !!hall}
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
            {hall ? (
                <MuiBox sx={{ position: 'relative' }}>
                    {/* Header Image */}
                    <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
                        {getImageUrl(hall.primaryImage) ? (
                            <img
                                src={getImageUrl(hall.primaryImage)}
                                alt={hall.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(216, 185, 138, 0.1)' }}>
                                <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-300)', fontWeight: 'bold' }}>
                                    {hall.name?.[0]}
                                </MuiTypography>
                            </MuiBox>
                        )}
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
                            {hall.name}
                        </MuiTypography>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <MapPin size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                            <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                {hall.location}
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                <MuiDialogContent sx={{ p: 3 }}>
                    <MuiGrid container spacing={3}>
                        {/* Status & Basic Info */}
                        <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <MuiChip
                                label={hall.isActive ? 'نشطة' : 'غير نشطة'}
                                icon={hall.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                sx={{
                                    backgroundColor: hall.isActive ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                                    color: hall.isActive ? '#16a34a' : '#dc2626',
                                    fontWeight: 'bold',
                                    border: 'none',
                                }}
                            />
                            <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>
                                {formatCurrency(hall.defaultPrices)}
                            </MuiTypography>
                        </MuiGrid>

                        {/* Description */}
                        {hall.description && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    {hall.description}
                                </MuiTypography>
                            </MuiGrid>
                        )}

                        <MuiGrid item xs={12}>
                            <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                        </MuiGrid>

                        {/* Capacity Details */}
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>تفاصيل السعة</MuiTypography>
                            <MuiGrid container spacing={2}>
                                {[{ icon: Users, label: 'السعة', value: hall.capacity },
                                { icon: Table, label: 'الطاولات', value: hall.tables },
                                { icon: Chair, label: 'الكراسي', value: hall.chairs },
                                { icon: Users, label: 'الموظفين', value: hall.maxEmployees }].map((item, idx) => (
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

                        {/* Manager Info */}
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معلومات المدير</MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid var(--color-border-glass)', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                <MuiBox sx={{ backgroundColor: 'rgba(216, 185, 138, 0.1)', p: 1.5, borderRadius: '50%' }}>
                                    <User size={24} style={{ color: 'var(--color-primary-500)' }} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary-dark)' }}>
                                        {hall.managerName || hall.generalManager?.name}
                                    </MuiTypography>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                                        <Phone size={14} />
                                        <MuiTypography variant="body2">
                                            {hall.managerPhone || hall.generalManager?.phone}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiGrid>

                        {/* Services */}
                        {hall.services && hall.services.length > 0 && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>الخدمات</MuiTypography>
                                <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {hall.services.map((s, index) => (
                                        <MuiChip
                                            key={index}
                                            label={`${s.service?.name || 'خدمة'} - ${formatCurrency(s.service?.basePrice)}`}
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

                        {/* Gallery */}
                        {hall.images && hall.images.length > 0 && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معرض الصور</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {hall.images.map((img, index) => (
                                        <MuiGrid item xs={6} sm={4} md={3} key={index}>
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`Gallery ${index}`}
                                                style={{ width: '100%', height: '96px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </MuiGrid>
                                    ))}
                                </MuiGrid>
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
                        لم يتم اختيار قاعة
                    </MuiTypography>
                    <MuiButton onClick={onClose} sx={{ mt: 2 }}>
                        إغلاق
                    </MuiButton>
                </MuiBox>
            )}
        </MuiDialog>
    )
}
