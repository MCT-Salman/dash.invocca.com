// src\pages\manager\components\ViewEventDialog.jsx
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
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import { useState } from 'react'
import {
    X,
    Calendar,
    Clock,
    Users,
    MapPin,
    User,
    CheckCircle,
    Building2,
    Phone,
    DollarSign,
    FileText,
    Tag,
    UserCheck,
    Sparkles,
} from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { listManagerTemplates, getEventScanners, getHallServices } from '@/api/manager'
import { SERVICE_CATEGORY_LABELS, SERVICE_UNIT_LABELS } from '@/config/constants'
import { QrCode, Hash } from 'lucide-react'
import EventSongsTab from './EventSongsTab'

export default function ViewEventDialog({ open, onClose, event }) {
    const eventId = event?._id || event?.id
    const [activeTab, setActiveTab] = useState('details')

    const { data: templatesData } = useQuery({
        queryKey: ['manager', 'templates'],
        queryFn: listManagerTemplates,
        enabled: open && !!event?.template,
    })

    const { data: scannersData } = useQuery({
        queryKey: ['manager', 'events', eventId, 'scanners'],
        queryFn: () => getEventScanners(eventId),
        enabled: open && !!eventId,
    })

    const { data: hallServicesData } = useQuery({
        queryKey: ['manager', 'hall-services'],
        queryFn: getHallServices,
        enabled: open,
    })

    if (!event) return null

    const eventTypeLabels = {
        wedding: 'زفاف',
        birthday: 'عيد ميلاد',
        engagement: 'خطوبة',
        graduation: 'تخرج',
        corporate: 'فعالية شركات',
        other: 'أخرى'
    }

    const eventType = event?.eventType || event?.type || 'other'
    const eventTypeLabel = eventTypeLabels[eventType] || eventType

    return (
        <MuiDialog open={open && !!event} onClose={onClose} maxWidth="lg" fullWidth>
            <MuiBox sx={{ p: 3, borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MuiBox>
                    <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{event.eventName || event.name}</MuiTypography>
                    <MuiChip label={eventTypeLabel} size="small" sx={{ bgcolor: 'rgba(216, 185, 138, 0.1)', color: 'var(--color-icon)', fontWeight: 700 }} />
                </MuiBox>
                <MuiIconButton onClick={onClose}><X size={24} /></MuiIconButton>
            </MuiBox>

            <MuiDialogContent sx={{ p: 3 }}>
                <MuiTabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                    <MuiTab label="التفاصيل" value="details" />
                    <MuiTab label="قائمة الأغاني" value="songs" />
                </MuiTabs>

                {activeTab === 'details' && (
                    <MuiGrid container spacing={4}>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>المعلومات الأساسية</MuiTypography>
                            <MuiGrid container spacing={2}>
                                {[
                                    { icon: Calendar, label: 'التاريخ', value: formatDate(event.eventDate || event.date) },
                                    { icon: Clock, label: 'الوقت', value: event.startTime ? `${event.startTime} - ${event.endTime || ''}` : 'غير محدد' },
                                    { icon: Users, label: 'عدد المدعوين', value: event.guestCount || 0 },
                                    { icon: UserCheck, label: 'الموظفين المطلوبين', value: event.requiredEmployees || 0 }
                                ].map((item, idx) => (
                                    <MuiGrid item xs={12} sm={6} md={3} key={idx}>
                                        <MuiPaper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <item.icon size={20} color="var(--color-icon)" />
                                                <MuiBox>
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>{item.label}</MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{item.value}</MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        </MuiGrid>

                        <MuiGrid item xs={12}><MuiDivider /></MuiGrid>

                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>معلومات العميل</MuiTypography>
                            <MuiPaper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                                <MuiGrid container spacing={3}>
                                    <MuiGrid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <User size={20} color="var(--color-icon)" />
                                        <MuiBox>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>الاسم</MuiTypography>
                                            <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{event.client?.name || event.clientName || 'غير متوفر'}</MuiTypography>
                                        </MuiBox>
                                    </MuiGrid>
                                    <MuiGrid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Phone size={20} color="var(--color-icon)" />
                                        <MuiBox>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>رقم الهاتف</MuiTypography>
                                            <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{event.client?.phone || 'غير متوفر'}</MuiTypography>
                                        </MuiBox>
                                    </MuiGrid>
                                </MuiGrid>
                            </MuiPaper>
                        </MuiGrid>
                    </MuiGrid>
                )}

                {activeTab === 'songs' && (
                    <EventSongsTab eventId={eventId} open={open} />
                )}
            </MuiDialogContent>

            <MuiDialogActions sx={{ p: 3, borderTop: '1px solid var(--color-border)' }}>
                <MuiButton onClick={onClose} variant="contained" sx={{ px: 4, borderRadius: '12px' }}>إغلاق</MuiButton>
            </MuiDialogActions>
        </MuiDialog>
    )
}
