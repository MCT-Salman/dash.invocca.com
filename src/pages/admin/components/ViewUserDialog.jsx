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
                        <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(216, 185, 138, 0.1)' }}>
                            <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-300)', fontWeight: 'bold' }}>
                                {user.name?.[0]}
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
                                {user.name}
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Shield size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                                <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {user.role === 'admin' ? 'مدير نظام' : user.role === 'manager' ? 'مدير قاعة' : user.role === 'client' ? 'عميل' : 'موظف'}
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
                                        backgroundColor: user.isActive ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                                        color: user.isActive ? '#16a34a' : '#dc2626',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                />
                                <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>
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
                                        { icon: User, label: 'الدور', value: user.role === 'admin' ? 'مدير نظام' : user.role === 'manager' ? 'مدير قاعة' : user.role === 'client' ? 'عميل' : 'موظف' },
                                        { icon: Phone, label: 'الهاتف', value: user.phone },
                                        { icon: Calendar, label: 'تاريخ الإنشاء', value: new Date(user.createdAt).toLocaleDateString('ar-SA') }
                                    ].map((item, idx) => (
                                        <MuiGrid item xs={12} sm={6} key={idx}>
                                            <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                                                <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-secondary-500)' }} />
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
                                        <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>القاعة المرتبطة</MuiTypography>
                                        <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 'bold' }}>{user.hallId.name}</MuiTypography>
                                            {user.hallId.location && (
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 1 }}>
                                                    <MuiBox component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Mail size={14} style={{ color: 'var(--color-secondary-500)' }} />
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
                                                    label={permission}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                        color: 'var(--color-primary-400)',
                                                        border: '1px solid rgba(216, 185, 138, 0.3)',
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
