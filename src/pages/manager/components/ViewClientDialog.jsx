import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiDivider from '@/components/ui/MuiDivider'
import { BaseViewDialog } from '@/components/shared'
import { formatEmptyValue } from '@/utils/helpers'
import { User, Phone, Calendar } from 'lucide-react'

export default function ViewClientDialog({ open, onClose, client }) {
    if (!client) return null

    const headerImage = (
        <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-gold) 20%, transparent), color-mix(in srgb, var(--color-gold) 10%, transparent))' }}>
                <MuiTypography variant="h3" sx={{ color: 'var(--color-icon)', fontWeight: 'bold' }}>
                    {client.name?.[0]?.toUpperCase() || 'C'}
                </MuiTypography>
            </MuiBox>
            <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--color-dark), transparent)' }} />
            <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: 'var(--color-text-primary)' }}>
                <MuiTypography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatEmptyValue(client.name)}
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                        عميل
                    </MuiTypography>
                </MuiBox>
            </MuiBox>
        </MuiBox>
    )

    return (
        <BaseViewDialog
            open={open && !!client}
            onClose={onClose}
            maxWidth="md"
            headerImage={headerImage}
        >
            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>معلومات العميل</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: Phone, label: 'رقم الهاتف', value: formatEmptyValue(client.phone) },
                            { icon: Calendar, label: 'تاريخ الانضمام', value: formatEmptyValue(client.createdAt ? new Date(client.createdAt).toLocaleDateString('ar-SA') : null) }
                        ].map((item, idx) => (
                            <MuiGrid item xs={12} sm={6} key={idx}>
                                <MuiBox sx={{ p: 2, backgroundColor: 'color-mix(in srgb, var(--color-light) 3%, transparent)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                                    <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-icon)' }} />
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{item.label}</MuiTypography>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{item.value}</MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                        ))}
                    </MuiGrid>
                </MuiGrid>
            </MuiGrid>
        </BaseViewDialog>
    )
}
