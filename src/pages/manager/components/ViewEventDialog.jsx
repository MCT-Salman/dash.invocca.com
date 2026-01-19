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
    XCircle,
    AlertCircle,
    Building2,
    Phone,
    DollarSign,
    FileText,
    Tag,
    UserCheck,
    Sparkles,
    Music
} from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { listManagerTemplates, getEventScanners, getHallServices } from '@/api/manager'
import { SERVICE_CATEGORY_LABELS, SERVICE_UNIT_LABELS } from '@/config/constants'
import { QrCode, Hash } from 'lucide-react'
import EventSongsTab from './EventSongsTab'

export default function ViewEventDialog({ open, onClose, event }) {
    const eventId = event?._id || event?.id

    // Fetch templates to get full template details if needed
    const { data: templatesData } = useQuery({
        queryKey: ['manager', 'templates'],
        queryFn: listManagerTemplates,
        enabled: open && !!event?.template,
        staleTime: 5 * 60 * 1000
    })

    // Fetch event scanners
    const { data: scannersData } = useQuery({
        queryKey: ['manager', 'events', eventId, 'scanners'],
        queryFn: () => getEventScanners(eventId),
        enabled: open && !!eventId,
        staleTime: 2 * 60 * 1000
    })

    // Fetch hall services to get names
    const { data: hallServicesData } = useQuery({
        queryKey: ['manager', 'hall-services'],
        queryFn: getHallServices,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    // Get templates from response
    const templates = Array.isArray(templatesData?.templates)
        ? templatesData.templates
        : Array.isArray(templatesData?.data)
            ? templatesData.data
            : Array.isArray(templatesData)
                ? templatesData
                : []

    // Get scanners from response
    const eventScanners = Array.isArray(scannersData?.scanners)
        ? scannersData.scanners
        : Array.isArray(scannersData?.data)
            ? scannersData.data
            : Array.isArray(scannersData)
                ? scannersData
                : []

    // Get all services from response
    const allServices = Array.isArray(hallServicesData?.services)
        ? hallServicesData.services
        : Array.isArray(hallServicesData?.data)
            ? hallServicesData.data
            : Array.isArray(hallServicesData)
                ? hallServicesData
                : []

    // Find full template details if template ID is available
    const fullTemplate = event?.template?._id
        ? templates.find(t => (t._id || t.id) === event?.template?._id)
        : null

    const [activeTab, setActiveTab] = useState('details')

    const statusConfig = {
        pending: { label: 'قيد الانتظار', color: '#D99B3D', bg: '#FFF8DA', icon: AlertCircle },
        confirmed: { label: 'مؤكد', color: '#0284c7', bg: '#e0f2fe', icon: CheckCircle },
        in_progress: { label: 'جاري', color: '#9333ea', bg: '#f3e8ff', icon: Clock },
        completed: { label: 'مكتمل', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
        cancelled: { label: 'ملغي', color: '#dc2626', bg: '#fee2e2', icon: XCircle }
    }

    if (!event) return null

    const status = statusConfig[event?.status] || statusConfig.pending
    const StatusIcon = status.icon

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
        <MuiDialog
            open={open && !!event}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'auto',
                    backgroundColor: 'var(--color-surface-dark)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 1300,
                    maxHeight: '90vh'
                }
            }}
        >
            <MuiBox sx={{ position: 'relative' }}>
                {/* Header */}
                <MuiBox sx={{ p: 3, borderBottom: '1px solid rgba(216, 185, 138, 0.15)' }}>
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'var(--color-text-primary-dark)' }}>
                                {event.eventName || event.name}
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <MuiChip
                                    label={status.label}
                                    icon={<StatusIcon size={14} />}
                                    size="small"
                                    sx={{
                                        backgroundColor: status.bg,
                                        color: status.color,
                                        fontWeight: 600,
                                    }}
                                />
                                <MuiChip
                                    label={eventTypeLabel}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                        color: 'var(--color-primary-500)',
                                        fontWeight: 600,
                                    }}
                                />
                            </MuiBox>
                        </MuiBox>
                        <MuiIconButton
                            onClick={onClose}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'var(--color-text-primary)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                        >
                            <X size={20} />
                        </MuiIconButton>
                    </MuiBox>
                </MuiBox>

                <MuiDialogContent sx={{ p: 3 }}>
                    {/* Tabs for details and songs management */}
                    <MuiBox sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <MuiTabs
                            value={activeTab}
                            onChange={(_, value) => setActiveTab(value)}
                            textColor="inherit"
                            indicatorColor="primary"
                        >
                            <MuiTab label="التفاصيل" value="details" />
                            <MuiTab label="قائمة الأغاني" value="songs" />
                        </MuiTabs>
                    </MuiBox>

                    {activeTab === 'details' && (
                        <MuiGrid container spacing={3}>
                            {/* Basic Information */}
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                    المعلومات الأساسية
                                </MuiTypography>
                                <MuiGrid container spacing={2}>
                                    <MuiGrid item xs={12} sm={6} md={3}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Calendar size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        التاريخ
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {formatDate(event.eventDate || event.date, 'DD/MM/YYYY')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>

                                    <MuiGrid item xs={12} sm={6} md={3}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Clock size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        الوقت
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : (event.startTime || '—')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>

                                    <MuiGrid item xs={12} sm={6} md={3}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Users size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        عدد الضيوف
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {event.guestCount || 0}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>

                                    <MuiGrid item xs={12} sm={6} md={3}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <UserCheck size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        الموظفين المطلوبين
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {event.requiredEmployees || 0}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                </MuiGrid>
                            </MuiGrid>

                            {/* Client Information */}
                            <MuiGrid item xs={12}>
                                <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                            </MuiGrid>

                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                    معلومات العميل
                                </MuiTypography>
                                {event.client ? (
                                    <MuiPaper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                        <MuiGrid container spacing={2}>
                                            <MuiGrid item xs={12} sm={6} md={4}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <User size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            الاسم
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {event.client.name || '—'}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiGrid>
                                            {event.client.username && (
                                                <MuiGrid item xs={12} sm={6} md={4}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Tag size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiBox>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                اسم المستخدم
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {event.client.username}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                </MuiGrid>
                                            )}
                                            {event.client.phone && (
                                                <MuiGrid item xs={12} sm={6} md={4}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Phone size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiBox>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                رقم الهاتف
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {event.client.phone}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                </MuiGrid>
                                            )}
                                        </MuiGrid>
                                    </MuiPaper>
                                ) : (
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        {event.clientName || '—'}
                                    </MuiTypography>
                                )}
                            </MuiGrid>

                            {/* Hall Information */}
                            {event.hall && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            معلومات قاعة/صالة
                                        </MuiTypography>
                                        <MuiPaper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiGrid container spacing={2}>
                                                <MuiGrid item xs={12} sm={6}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Building2 size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiBox>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                اسم قاعة/صالة
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {event.hall.name || '—'}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                </MuiGrid>
                                                {event.hall.location && (
                                                    <MuiGrid item xs={12} sm={6}>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <MapPin size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                            <MuiBox>
                                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                    الموقع
                                                                </MuiTypography>
                                                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                    {event.hall.location}
                                                                </MuiTypography>
                                                            </MuiBox>
                                                        </MuiBox>
                                                    </MuiGrid>
                                                )}
                                            </MuiGrid>
                                        </MuiPaper>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Services */}
                            {event.services && event.services.length > 0 && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            الخدمات ({event.services.length})
                                        </MuiTypography>
                                        <MuiGrid container spacing={2}>
                                            {event.services.map((serviceItem, index) => {
                                                const serviceItemData = serviceItem.service || serviceItem
                                                const serviceId = (serviceItemData?._id || serviceItemData?.id || serviceItemData).toString()
                                                const serviceInfo = allServices.find(s => (s._id || s.id) === serviceId) || serviceItemData

                                                return (
                                                    <MuiGrid item xs={12} sm={6} md={4} key={serviceItem._id || index}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                                <Sparkles size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, flex: 1 }}>
                                                                    {serviceInfo.name || 'خدمة'}
                                                                </MuiTypography>
                                                            </MuiBox>
                                                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                {serviceInfo.description && (
                                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                        {serviceInfo.description}
                                                                    </MuiTypography>
                                                                )}
                                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                    الكمية: {serviceItem.quantity || 1}
                                                                </MuiTypography>
                                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                    السعر: {serviceItem.price || serviceInfo.basePrice || 0} ل.س
                                                                </MuiTypography>
                                                                {serviceInfo.category && (
                                                                    <MuiChip
                                                                        label={SERVICE_CATEGORY_LABELS[serviceInfo.category] || serviceInfo.category}
                                                                        size="small"
                                                                        sx={{
                                                                            mt: 0.5,
                                                                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                                            color: 'var(--color-primary-400)',
                                                                            fontSize: '0.7rem',
                                                                            height: 20
                                                                        }}
                                                                    />
                                                                )}
                                                                {serviceInfo.unit && (
                                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', mt: 0.5 }}>
                                                                        الوحدة: {SERVICE_UNIT_LABELS[serviceInfo.unit] || serviceInfo.unit}
                                                                    </MuiTypography>
                                                                )}
                                                            </MuiBox>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )
                                            })}
                                        </MuiGrid>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Financial Information */}
                            {(event.totalPrice !== undefined || event.paidAmount !== undefined) && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            المعلومات المالية
                                        </MuiTypography>
                                        <MuiGrid container spacing={2}>
                                            <MuiGrid item xs={12} sm={6}>
                                                <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <DollarSign size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiBox>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                السعر الإجمالي
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {event.totalPrice || 0} ل.س
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                </MuiPaper>
                                            </MuiGrid>
                                            <MuiGrid item xs={12} sm={6}>
                                                <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <DollarSign size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiBox>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                المبلغ المدفوع
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {event.paidAmount || 0} ل.س
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                </MuiPaper>
                                            </MuiGrid>
                                            {(event.totalPrice || 0) > (event.paidAmount || 0) && (
                                                <MuiGrid item xs={12}>
                                                    <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '12px' }}>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <AlertCircle size={20} style={{ color: '#dc2626' }} />
                                                            <MuiBox>
                                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                    المبلغ المتبقي
                                                                </MuiTypography>
                                                                <MuiTypography variant="body1" sx={{ color: '#dc2626', fontWeight: 600 }}>
                                                                    {((event.totalPrice || 0) - (event.paidAmount || 0)).toLocaleString()} ل.س
                                                                </MuiTypography>
                                                            </MuiBox>
                                                        </MuiBox>
                                                    </MuiPaper>
                                                </MuiGrid>
                                            )}
                                        </MuiGrid>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Assigned Employees */}
                            {event.assignedEmployees && event.assignedEmployees.length > 0 && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            الموظفين المعينين ({event.assignedEmployees.length})
                                        </MuiTypography>
                                        <MuiGrid container spacing={2}>
                                            {event.assignedEmployees.map((employee, index) => (
                                                <MuiGrid item xs={12} sm={6} md={4} key={employee._id || employee.id || index}>
                                                    <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <UserCheck size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                                {employee.name || employee.username || 'موظف'}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiPaper>
                                                </MuiGrid>
                                            ))}
                                        </MuiGrid>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Playlist preview section removed in favor of dedicated tab */}

                            {/* Special Requests */}
                            {event.specialRequests && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            طلبات خاصة
                                        </MuiTypography>
                                        <MuiPaper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <FileText size={20} style={{ color: 'var(--color-primary-400)', marginTop: 2 }} />
                                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                    {event.specialRequests}
                                                </MuiTypography>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Template */}
                            {event?.template && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            القالب
                                        </MuiTypography>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            {(event?.template?.imageUrl || fullTemplate?.imageUrl) && (
                                                <MuiBox sx={{ mb: 2 }}>
                                                    <img
                                                        src={(event?.template?.imageUrl || fullTemplate?.imageUrl || '').startsWith('http')
                                                            ? (event?.template?.imageUrl || fullTemplate?.imageUrl)
                                                            : `http://82.137.244.167:5001${event?.template?.imageUrl || fullTemplate?.imageUrl}`}
                                                        alt={fullTemplate?.templateName || event?.template?.templateName || event?.template?.name || 'قالب'}
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '300px',
                                                            objectFit: 'contain',
                                                            borderRadius: '12px',
                                                            backgroundColor: '#f5f5f5'
                                                        }}
                                                    />
                                                </MuiBox>
                                            )}
                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 1 }}>
                                                {fullTemplate?.templateName || event?.template?.templateName || event?.template?.name || `قالب #${event?.template?._id?.slice(-6) || ''}`}
                                            </MuiTypography>
                                            {fullTemplate?.description && (
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                                    {fullTemplate.description}
                                                </MuiTypography>
                                            )}
                                        </MuiPaper>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Notes */}
                            {(event.notes || event.description) && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            {event.notes ? 'ملاحظات' : 'الوصف'}
                                        </MuiTypography>
                                        <MuiPaper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <FileText size={20} style={{ color: 'var(--color-primary-400)', marginTop: 2 }} />
                                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                    {event.notes || event.description}
                                                </MuiTypography>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Scanners */}
                            {eventScanners.length > 0 && (
                                <>
                                    <MuiGrid item xs={12}>
                                        <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                    </MuiGrid>
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                            الماسحات ({eventScanners.length})
                                        </MuiTypography>
                                        <MuiGrid container spacing={2}>
                                            {eventScanners.map((scannerAssignment, index) => {
                                                const scanner = scannerAssignment.scanner || {}
                                                const assignmentId = scannerAssignment._id || scannerAssignment.id
                                                return (
                                                    <MuiGrid item xs={12} sm={6} md={4} key={assignmentId || index}>
                                                        <MuiPaper sx={{ p: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                                <QrCode size={20} style={{ color: 'var(--color-primary-400)', marginTop: 2 }} />
                                                                <MuiBox sx={{ flex: 1 }}>
                                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 1 }}>
                                                                        {scanner.name || scanner.username || 'ماسح'}
                                                                    </MuiTypography>
                                                                    {scanner.username && scanner.name && (
                                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', mb: 0.5 }}>
                                                                            اسم المستخدم: {scanner.username}
                                                                        </MuiTypography>
                                                                    )}
                                                                    {scanner.phone && (
                                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', mb: 0.5 }}>
                                                                            رقم الهاتف: {scanner.phone}
                                                                        </MuiTypography>
                                                                    )}
                                                                    {scanner.email && (
                                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', mb: 0.5 }}>
                                                                            البريد الإلكتروني: {scanner.email}
                                                                        </MuiTypography>
                                                                    )}
                                                                    {scannerAssignment.scannedCount !== undefined && (
                                                                        <MuiBox sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(216, 185, 138, 0.15)' }}>
                                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-400)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                                                عدد المسح: {scannerAssignment.scannedCount || 0}
                                                                            </MuiTypography>
                                                                        </MuiBox>
                                                                    )}
                                                                </MuiBox>
                                                            </MuiBox>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )
                                            })}
                                        </MuiGrid>
                                    </MuiGrid>
                                </>
                            )}

                            {/* Additional Information */}
                            <MuiGrid item xs={12}>
                                <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                    معلومات إضافية
                                </MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {eventId && (
                                        <MuiGrid item xs={12} sm={6} md={4}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Hash size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            رقم الفعالية
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {String(eventId).slice(-8)}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>
                                    )}
                                    {event.createdAt && (
                                        <MuiGrid item xs={12} sm={6} md={4}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Calendar size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            تاريخ الإنشاء
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {formatDate(event.createdAt, 'MM/DD/YYYY HH:mm')}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>
                                    )}
                                    {event.updatedAt && (
                                        <MuiGrid item xs={12} sm={6} md={4}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Calendar size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            آخر تحديث
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {formatDate(event.updatedAt, 'MM/DD/YYYY HH:mm')}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>
                                    )}
                                </MuiGrid>
                            </MuiGrid>
                        </MuiGrid>
                    )}

                    {activeTab === 'songs' && (
                        <EventSongsTab eventId={eventId} open={open} />
                    )}
                </MuiDialogContent>

                <MuiDialogActions sx={{ p: 3, backgroundColor: 'var(--color-surface-dark)', borderTop: '1px solid rgba(216, 185, 138, 0.15)' }}>
                    <MuiButton
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                        }}
                    >
                        إغلاق
                    </MuiButton>
                </MuiDialogActions>
            </MuiBox>
        </MuiDialog>
    )
}
