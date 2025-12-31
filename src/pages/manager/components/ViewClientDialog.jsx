import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { BaseViewDialog } from '@/components/shared'
import { formatEmptyValue } from '@/utils/helpers'
import { User, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react'

export default function ViewClientDialog({ open, onClose, client }) {
    if (!client) return null

    const headerImage = (
        <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
            <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(255, 227, 108, 0.1))' }}>
                <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>
                    {client.name?.[0]?.toUpperCase() || 'C'}
                </MuiTypography>
            </MuiBox>
            <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: '#fff' }}>
                <MuiTypography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {formatEmptyValue(client.name)}
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <User size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
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
                {/* Status & Basic Info */}
                <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MuiChip
                        label={client.isActive !== false ? 'نشط' : 'غير نشط'}
                        icon={client.isActive !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        sx={{
                            backgroundColor: client.isActive !== false ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                            color: client.isActive !== false ? '#16a34a' : '#dc2626',
                            fontWeight: 'bold',
                            border: 'none',
                        }}
                    />
                    {client.phone && (
                        <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>
                            {formatEmptyValue(client.phone)}
                        </MuiTypography>
                    )}
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                </MuiGrid>

                {/* Client Details */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary-dark)' }}>معلومات العميل</MuiTypography>
                    <MuiGrid container spacing={2}>
                        {[
                            { icon: Phone, label: 'الهاتف', value: formatEmptyValue(client.phone) },
                            { icon: Calendar, label: 'عدد الفعاليات', value: formatEmptyValue(client.eventsCount, 0) }
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

