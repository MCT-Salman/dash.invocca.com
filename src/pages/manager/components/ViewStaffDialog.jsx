import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { BaseViewDialog } from '@/components/shared'
import { formatEmptyValue } from '@/utils/helpers'
import { Phone, Calendar, CheckCircle, XCircle, Briefcase, Shield, Award } from 'lucide-react'

const roleIcons = {
    manager: Shield,
    employee: Briefcase,
    supervisor: Award,
}

const roleLabels = {
    manager: 'مدير',
    employee: 'موظف',
    supervisor: 'مشرف',
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

                {/* Staff Details */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معلومات الموظف</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: Phone, label: 'الهاتف', value: formatEmptyValue(staff.phone) },
                            { icon: Calendar, label: 'تاريخ الانضمام', value: staff.joinDate ? new Date(staff.joinDate).toLocaleDateString('ar-SA') : '—' }
                        ].map((item, idx) => (
                            <MuiGrid item xs={12} sm={6} key={idx}>
                                <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(216, 185, 138, 0.15)' }}>
                                    <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-primary-500)' }} />
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{item.label}</MuiTypography>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary-dark)' }}>{item.value}</MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                        ))}
                    </MuiGrid>
                </MuiGrid>
            </MuiGrid>
        </BaseViewDialog>
    )
}

