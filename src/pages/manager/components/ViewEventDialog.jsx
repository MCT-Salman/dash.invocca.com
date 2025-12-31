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
    Sparkles
} from 'lucide-react'
import { formatDate, formatNumber } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { listManagerTemplates } from '@/api/manager'

export default function ViewEventDialog({ open, onClose, event }) {
    if (!event) return null

    // Fetch templates to get full template details if needed
    const { data: templatesData } = useQuery({
        queryKey: ['manager', 'templates'],
        queryFn: listManagerTemplates,
        enabled: open && !!event.template,
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

    // Find full template details if template ID is available
    const fullTemplate = event.template?._id 
        ? templates.find(t => (t._id || t.id) === event.template._id)
        : null

    const statusConfig = {
        pending: { label: 'قيد الانتظار', color: '#D99B3D', bg: '#FFF8DA', icon: AlertCircle },
        confirmed: { label: 'مؤكد', color: '#0284c7', bg: '#e0f2fe', icon: CheckCircle },
        in_progress: { label: 'جاري', color: '#9333ea', bg: '#f3e8ff', icon: Clock },
        completed: { label: 'مكتمل', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
        cancelled: { label: 'ملغي', color: '#dc2626', bg: '#fee2e2', icon: XCircle }
    }

    const status = statusConfig[event.status] || statusConfig.pending
    const StatusIcon = status.icon

    const eventTypeLabels = {
        wedding: 'زفاف',
        birthday: 'عيد ميلاد',
        engagement: 'خطوبة',
        graduation: 'تخرج',
        corporate: 'فعالية شركات',
        other: 'أخرى'
    }

    const eventType = event.eventType || event.type || 'other'
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
                                        معلومات القاعة
                                    </MuiTypography>
                                    <MuiPaper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                        <MuiGrid container spacing={2}>
                                            <MuiGrid item xs={12} sm={6}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Building2 size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            اسم القاعة
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
                                            const service = serviceItem.service || serviceItem
                                            return (
                                                <MuiGrid item xs={12} sm={6} md={4} key={serviceItem._id || index}>
                                                    <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                            <Sparkles size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, flex: 1 }}>
                                                                {service.name || 'خدمة'}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {service.description && (
                                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                    {service.description}
                                                                </MuiTypography>
                                                            )}
                                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                الكمية: {serviceItem.quantity || 1}
                                                            </MuiTypography>
                                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                السعر: {serviceItem.price || service.basePrice || 0} ر.س
                                                            </MuiTypography>
                                                            {service.category && (
                                                                <MuiChip
                                                                    label={service.category}
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
                                                            {service.unit && (
                                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', mt: 0.5 }}>
                                                                    الوحدة: {service.unit}
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
                                                            {event.totalPrice || 0} ر.س
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
                                                            {event.paidAmount || 0} ر.س
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
                                                                {((event.totalPrice || 0) - (event.paidAmount || 0)).toLocaleString()} ر.س
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
                        {event.template && (
                            <>
                                <MuiGrid item xs={12}>
                                    <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                                </MuiGrid>
                                <MuiGrid item xs={12}>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                        القالب
                                    </MuiTypography>
                                    <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                        {(event.template.imageUrl || fullTemplate?.imageUrl) && (
                                            <MuiBox sx={{ mb: 2 }}>
                                                <img
                                                    src={(event.template.imageUrl || fullTemplate?.imageUrl || '').startsWith('http') 
                                                        ? (event.template.imageUrl || fullTemplate?.imageUrl) 
                                                        : `http://82.137.244.167:5001${event.template.imageUrl || fullTemplate?.imageUrl}`}
                                                    alt={fullTemplate?.templateName || event.template.templateName || event.template.name || 'قالب'}
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
                                            {fullTemplate?.templateName || event.template.templateName || event.template.name || `قالب #${event.template._id?.slice(-6) || ''}`}
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

                        {/* Dates */}
                        <MuiGrid item xs={12}>
                            <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
                        </MuiGrid>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                                معلومات إضافية
                            </MuiTypography>
                            <MuiGrid container spacing={2}>
                                {event.createdAt && (
                                    <MuiGrid item xs={12} sm={6}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Calendar size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        تاريخ الإنشاء
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {formatDate(event.createdAt, 'DD/MM/YYYY HH:mm')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                )}
                                {event.updatedAt && (
                                    <MuiGrid item xs={12} sm={6}>
                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Calendar size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                <MuiBox>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                        آخر تحديث
                                                    </MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                        {formatDate(event.updatedAt, 'DD/MM/YYYY HH:mm')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                )}
                            </MuiGrid>
                        </MuiGrid>
                    </MuiGrid>
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
