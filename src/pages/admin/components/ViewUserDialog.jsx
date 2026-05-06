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
import { translatePermission } from '@/utils/helpers'
import { X, Shield, User, Phone, CheckCircle, XCircle, Calendar, Mail } from 'lucide-react'

export default function ViewUserDialog({ open, onClose, user }) {
    // Don't return null early, let's dialog handle open/close state
    return (
        <MuiDialog
            open={open && !!user}
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
            {user ? (
                <MuiBox sx={{ position: 'relative' }}>
                    {/* Header Image */}
                    <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
                        {user.avatar || user.image ? (
                            <img 
                                src={(user.avatar || user.image).startsWith('http') ? (user.avatar || user.image) : `${import.meta.env.VITE_API_BASE}${(user.avatar || user.image)}`} 
                                alt={user.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)' }}>
                                <MuiTypography variant="h3" sx={{ color: 'var(--color-icon)', fontWeight: 'bold' }}>
                                    {user.name?.[0]}
                                </MuiTypography>
                            </MuiBox>
                        )}
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
                                {user.name}
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Shield size={16} style={{ color: 'var(--color-text-secondary)' }} />
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                                    {user.role === 'admin' ? 'مدير نظام' : user.role === 'manager' ? 'مدير قاعة/صالة' : user.role === 'client' ? 'عميل' : 'موظف'}
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    <MuiDialogContent sx={{ p: 3 }}>
                        <MuiGrid container spacing={3}>
                            {/* Status & Basic Info */}
                            <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <MuiChip
                                    label={user.isActive ? 'نشط' : 'غير نشط'}
                                    icon={user.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    sx={{
                                        backgroundColor: user.isActive ? 'color-mix(in srgb, var(--color-gold) 20%, transparent)' : 'color-mix(in srgb, var(--color-gold) 20%, transparent)',
                                        color: user.isActive ? 'var(--color-icon)' : 'var(--color-icon)',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                />
                                <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-icon)' }}>
                                    {user.phone}
                                </MuiTypography>
                            </MuiGrid>

                            {/* Contact Info */}
                            {user.email && (
                                <MuiGrid item xs={12}>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                        {user.email}
                                    </MuiTypography>
                                </MuiGrid>
                            )}

                            <MuiGrid item xs={12}>
                                <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                            </MuiGrid>

                            {/* User Details */}
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معلومات المستخدم</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {[
                                        { icon: User, label: 'الدور', value: user.role === 'admin' ? 'مدير نظام' : user.role === 'manager' ? 'مدير قاعة/صالة' : user.role === 'client' ? 'عميل' : 'موظف' },
                                        { icon: Phone, label: 'الهاتف', value: user.phone },
                                        { icon: Calendar, label: 'تاريخ الإنشاء', value: new Date(user.createdAt).toLocaleDateString('ar-SA') }
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
                            {user.hallId && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>قاعة/صالة المرتبطة</MuiTypography>
                                        <MuiBox sx={{ p: 2, backgroundColor: 'color-mix(in srgb, var(--color-light) 3%, transparent)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 'bold' }}>{user.hallId.name}</MuiTypography>
                                            {user.hallId.location && (
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 1 }}>
                                                    <MuiBox component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Mail size={14} style={{ color: 'var(--color-icon)' }} />
                                                        {user.hallId.location}
                                                    </MuiBox>
                                                </MuiTypography>
                                            )}
                                        </MuiBox>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Permissions */}
                            {user.permissions && user.permissions.length > 0 && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>الصلاحيات</MuiTypography>
                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {user.permissions.map((permission, index) => (
                                                <MuiChip
                                                    key={index}
                                                    label={translatePermission(permission)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                                        color: 'var(--color-icon)',
                                                        border: '1px solid var(--color-border)',
                                                    }}
                                                />
                                            ))}
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
