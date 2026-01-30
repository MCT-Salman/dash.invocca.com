import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiPaper from '@/components/ui/MuiPaper'
import { BaseViewDialog } from '@/components/shared'
import { formatEmptyValue, formatDate, translatePermission } from '@/utils/helpers'
import { 
    Phone, 
    Calendar, 
    CheckCircle, 
    XCircle, 
    Briefcase, 
    Shield, 
    Award, 
    User,
    Hash,
    TrendingUp,
    Clock
} from 'lucide-react'

const roleIcons = {
    manager: Shield,
    employee: Briefcase,
    supervisor: Award,
}

const roleLabels = {
    manager: 'مدير',
    employee: 'موظف',
    supervisor: 'مشرف',
    scanner: 'ماسح',
}

export default function ViewStaffDialog({ open, onClose, staff }) {
    if (!staff) return null

    const RoleIcon = staff?.role ? roleIcons[staff.role] || Briefcase : Briefcase
    const roleLabel = staff?.role ? roleLabels[staff.role] || 'موظف' : 'موظف'

    const headerImage = (
        <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(255, 227, 108, 0.1))' }}>
                <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>
                    {staff.name?.[0]?.toUpperCase() || 'S'}
                </MuiTypography>
            </MuiBox>
            <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: '#fff' }}>
                <MuiTypography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {formatEmptyValue(staff.name)}
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <RoleIcon size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {roleLabel}
                    </MuiTypography>
                </MuiBox>
            </MuiBox>
        </MuiBox>
    )

    return (
        <BaseViewDialog
            open={open && !!staff}
            onClose={onClose}
            maxWidth="md"
            headerImage={headerImage}
        >
            <MuiGrid container spacing={3}>
                {/* Status & Basic Info */}
                <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <MuiChip
                        label={staff.isActive !== false ? 'نشط' : 'غير نشط'}
                        icon={staff.isActive !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        sx={{
                            backgroundColor: staff.isActive !== false ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                            color: staff.isActive !== false ? '#16a34a' : '#dc2626',
                            fontWeight: 'bold',
                            border: 'none',
                        }}
                    />
                    <MuiChip
                        label={roleLabel}
                        icon={<RoleIcon size={14} />}
                        sx={{
                            backgroundColor: staff.role === 'manager' ? 'rgba(147, 51, 234, 0.2)' : staff.role === 'supervisor' ? 'rgba(217, 155, 61, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: staff.role === 'manager' ? '#9333ea' : staff.role === 'supervisor' ? '#D99B3D' : '#3b82f6',
                            fontWeight: 'bold',
                            border: 'none',
                        }}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                </MuiGrid>

                {/* Basic Information */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>المعلومات الأساسية</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: User, label: 'اسم المستخدم', value: formatEmptyValue(staff.username) },
                            { icon: Phone, label: 'الهاتف', value: formatEmptyValue(staff.phone) },
                            { icon: Hash, label: 'رقم الموظف', value: staff._id ? staff._id.slice(-8) : '—' },
                            { icon: Calendar, label: 'تاريخ التوظيف', value: staff.staffInfo?.hireDate ? formatDate(staff.staffInfo.hireDate, 'MM/DD/YYYY') : (staff.joinDate ? formatDate(staff.joinDate, 'MM/DD/YYYY') : '—') }
                        ].map((item, idx) => (
                            <MuiGrid item xs={12} sm={6} md={3} key={idx}>
                                <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(216, 185, 138, 0.15)' }}>
                                    <item.icon size={20} style={{ margin: '0 auto 8px', color: 'var(--color-primary-500)' }} />
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>{item.label}</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.value}</MuiTypography>
                                </MuiPaper>
                            </MuiGrid>
                        ))}
                    </MuiGrid>
                </MuiGrid>

                {/* Permissions */}
                {staff.permissions && staff.permissions.length > 0 && (
                    <>
                        <MuiGrid item xs={12}>
                            <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                        </MuiGrid>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>الصلاحيات</MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {staff.permissions.map((permission, index) => (
                                    <MuiChip
                                        key={index}
                                        label={translatePermission(permission)}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                            color: 'var(--color-primary-400)',
                                            border: '1px solid rgba(216, 185, 138, 0.3)',
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </MuiBox>
                        </MuiGrid>
                    </>
                )}

                {/* Client Info */}
                {staff.clientInfo && (
                    <>
                        <MuiGrid item xs={12}>
                            <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                        </MuiGrid>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>معلومات العميل</MuiTypography>
                            <MuiGrid container spacing={2}>
                                <MuiGrid item xs={12} sm={6} md={3}>
                                    <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(216, 185, 138, 0.15)' }}>
                                        <TrendingUp size={20} style={{ margin: '0 auto 8px', color: 'var(--color-primary-500)' }} />
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>عدد الفعاليات</MuiTypography>
                                        <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {staff.clientInfo.totalEvents || 0}
                                        </MuiTypography>
                                    </MuiPaper>
                                </MuiGrid>
                            </MuiGrid>
                        </MuiGrid>
                    </>
                )}


                {/* Additional Information */}
                <MuiGrid item xs={12}>
                    <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>معلومات إضافية</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: Calendar, label: 'تاريخ الإنشاء', value: staff.createdAt ? formatDate(staff.createdAt, 'MM/DD/YYYY HH:mm') : '—' },
                            { icon: Clock, label: 'آخر تحديث', value: staff.updatedAt ? formatDate(staff.updatedAt, 'MM/DD/YYYY HH:mm') : '—' }
                        ].map((item, idx) => (
                            <MuiGrid item xs={12} sm={6} key={idx}>
                                <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(216, 185, 138, 0.15)' }}>
                                    <item.icon size={20} style={{ margin: '0 auto 8px', color: 'var(--color-primary-500)' }} />
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>{item.label}</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.value}</MuiTypography>
                                </MuiPaper>
                            </MuiGrid>
                        ))}
                    </MuiGrid>
                </MuiGrid>
            </MuiGrid>
        </BaseViewDialog>
    )
}

