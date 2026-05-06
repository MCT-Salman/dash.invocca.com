import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { X, User, Phone, CheckCircle, XCircle, Calendar, Building2 } from 'lucide-react'

export default function ViewManagerDialog({ open, onClose, manager }) {
    return (
        <MuiDialog
            open={open && !!manager}
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
            {manager ? (
                <MuiBox sx={{ position: 'relative' }}>
                    {/* Header Image */}
                    <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
                        <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)' }}>
                            <MuiTypography variant="h3" sx={{ color: 'var(--color-icon)', fontWeight: 'bold' }}>
                                {manager.name?.[0]}
                            </MuiTypography>
                        </MuiBox>
                        <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--color-dark), transparent)' }} />

                        <MuiIconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                backgroundColor: 'color-mix(in srgb, var(--color-light) 10%, transparent)',
                                color: 'var(--color-text-primary)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    backgroundColor: 'color-mix(in srgb, var(--color-light) 20%, transparent)',
                                }
                            }}
                        >
                            <X size={20} />
                        </MuiIconButton>

                        <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: 'var(--color-text-primary)' }}>
                            <MuiTypography variant="h4" sx={{ fontWeight: 'bold', textShadow: 'none' }}>
                                {manager.name}
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                                    مدير قاعة/صالة
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    <MuiDialogContent sx={{ p: 3 }}>
                        <MuiGrid container spacing={3}>
                            {/* Status & Basic Info */}
                            <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <MuiChip
                                    label={manager.isActive !== false ? 'نشط' : 'غير نشط'}
                                    icon={manager.isActive !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    sx={{
                                        backgroundColor: manager.isActive !== false ? 'color-mix(in srgb, var(--color-gold) 20%, transparent)' : 'color-mix(in srgb, var(--color-gold) 20%, transparent)',
                                        color: manager.isActive !== false ? 'var(--color-icon)' : 'var(--color-icon)',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                />
                                <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-icon)' }}>
                                    {manager.phone}
                                </MuiTypography>
                            </MuiGrid>

                            <MuiGrid item xs={12}>
                                <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                            </MuiGrid>

                            {/* Manager Details */}
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معلومات المدير</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {[
                                        { icon: User, label: 'اسم المستخدم', value: manager.username || '—' },
                                        { icon: Phone, label: 'الهاتف', value: manager.phone || '—' },
                                        { icon: Calendar, label: 'تاريخ الإنشاء', value: manager.createdAt ? new Date(manager.createdAt).toLocaleDateString('ar-SA') : '—' }
                                    ].map((item, idx) => (
                                        <MuiGrid item xs={12} sm={6} key={idx}>
                                            <MuiBox sx={{ p: 2, backgroundColor: 'color-mix(in srgb, var(--color-light) 3%, transparent)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                                                <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-icon)' }} />
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{item.label}</MuiTypography>
                                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary-dark)' }}>{item.value}</MuiTypography>
                                            </MuiBox>
                                        </MuiGrid>
                                    ))}
                                </MuiGrid>
                            </MuiGrid>

                            {/* Hall Info */}
                            {(manager.hallId || manager.hallName) && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>قاعة/صالة المرتبطة</MuiTypography>
                                        <MuiBox sx={{ p: 2, backgroundColor: 'color-mix(in srgb, var(--color-light) 3%, transparent)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Building2 size={20} style={{ color: 'var(--color-icon)' }} />
                                                <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 'bold' }}>
                                                    {manager.hallId?.name || manager.hallName || 'غير معين'}
                                                </MuiTypography>
                                            </MuiBox>
                                            {manager.hallId?.location && (
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 1, mr: 4 }}>
                                                    {manager.hallId.location}
                                                </MuiTypography>
                                            )}
                                        </MuiBox>
                                    </MuiGrid>
                                </>
                            )}
                        </MuiGrid>
                    </MuiDialogContent>

                    <MuiDialogActions sx={{ p: 3, backgroundColor: 'var(--color-surface-dark)', borderTop: '1px solid var(--color-border-glass)' }}>
                        <MuiButton onClick={onClose} variant="contained">
                            إغلاق
                        </MuiButton>
                    </MuiDialogActions>
                </MuiBox>
            ) : null}
        </MuiDialog>
    )
}
