// src\pages\manager\components\ViewStaffDialog.jsx
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
    Clock
} from 'lucide-react'

const roleIcons = {
    manager: Shield,
    employee: Briefcase,
    supervisor: Award,
    scanner: Hash,
}

const roleLabels = {
    manager: 'مدير',
    employee: 'موظف',
    supervisor: 'مشرف',
    scanner: 'ماسح ضوئي',
}

export default function ViewStaffDialog({ open, onClose, staff }) {
    if (!staff) return null

    const RoleIcon = staff?.role ? roleIcons[staff.role] || Briefcase : Briefcase
    const roleLabel = staff?.role ? roleLabels[staff.role] || 'موظف' : 'موظف'

    const headerImage = (
        <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-gold) 20%, transparent), color-mix(in srgb, var(--color-gold) 10%, transparent))' }}>
                <MuiTypography variant="h3" sx={{ color: 'var(--color-icon)', fontWeight: 'bold' }}>
                    {staff.name?.[0]?.toUpperCase() || 'S'}
                </MuiTypography>
            </MuiBox>
            <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--color-dark), transparent)' }} />
            <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: 'var(--color-text-primary)' }}>
                <MuiTypography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatEmptyValue(staff.name)}
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <RoleIcon size={16} style={{ color: 'var(--color-text-secondary)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
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
                <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <MuiChip
                        label={roleLabel}
                        icon={<RoleIcon size={14} />}
                        sx={{
                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                            color: 'var(--color-icon)',
                            fontWeight: 'bold',
                        }}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}><MuiDivider /></MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-icon)' }}>المعلومات الأساسية</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: User, label: 'اسم المستخدم', value: formatEmptyValue(staff.username) },
                            { icon: Phone, label: 'رقم الهاتف', value: formatEmptyValue(staff.phone) },
                            { icon: Hash, label: 'رقم الموظف', value: staff._id ? staff._id.slice(-8) : 'غير متوفر' },
                            { icon: Calendar, label: 'تاريخ الانضمام', value: formatDate(staff.createdAt) }
                        ].map((item, idx) => (
                            <MuiGrid item xs={12} sm={6} md={3} key={idx}>
                                <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                                    <item.icon size={20} style={{ margin: '0 auto 8px', color: 'var(--color-icon)' }} />
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>{item.label}</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{item.value}</MuiTypography>
                                </MuiPaper>
                            </MuiGrid>
                        ))}
                    </MuiGrid>
                </MuiGrid>

                {staff.permissions && staff.permissions.length > 0 && (
                    <>
                        <MuiGrid item xs={12}><MuiDivider /></MuiGrid>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-icon)' }}>الصلاحيات</MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {staff.permissions.map((p, i) => (
                                    <MuiChip key={i} label={translatePermission(p)} size="small" sx={{ bgcolor: 'rgba(216, 185, 138, 0.05)', color: 'var(--color-icon)' }} />
                                ))}
                            </MuiBox>
                        </MuiGrid>
                    </>
                )}
            </MuiGrid>
        </BaseViewDialog>
    )
}
