import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiIconButton from '@/components/ui/MuiIconButton'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD } from '@/hooks'
import { QUERY_KEYS, EVENT_STATUS, EVENT_STATUS_LABELS } from '@/config/constants'
import { getAdminEvents, deleteAdminEvent as deleteEvent } from '@/api/admin'
import { formatDate } from '@/utils/helpers'

// Icons
import {
    Calendar,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Building2,
    Filter,
    Eye,
    Trash2,
    Edit2
} from 'lucide-react'

// ====================== Status Badge ======================
const EventStatusBadge = ({ status }) => {
    const statusConfig = {
        [EVENT_STATUS.PENDING]: { label: 'قيد الانتظار', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: Clock },
        [EVENT_STATUS.CONFIRMED]: { label: 'مؤكد', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', icon: CheckCircle },
        [EVENT_STATUS.ACTIVE]: { label: 'نشط', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)', icon: RefreshCw },
        [EVENT_STATUS.COMPLETED]: { label: 'مكتمل', color: '#666', bg: 'rgba(102, 102, 102, 0.1)', icon: CheckCircle },
        [EVENT_STATUS.CANCELLED]: { label: 'ملغي', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig[EVENT_STATUS.PENDING]
    const Icon = config.icon

    return (
        <MuiChip
            icon={<Icon size={14} />}
            label={config.label}
            size="small"
            sx={{
                background: config.bg,
                color: config.color,
                fontWeight: 600,
                border: `1px solid ${config.color}33`,
                '& .MuiChip-icon': { color: config.color }
            }}
        />
    )
}

// ====================== Main Component ======================
export default function EventsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [statusFilter, setStatusFilter] = useState('all')

    // CRUD operations
    const {
        deleteMutation,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: null,
        updateFn: null,
        deleteFn: deleteEvent,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'all-events'],
        successMessage: 'تم حذف الفعالية بنجاح',
        errorMessage: 'حدث خطأ أثناء حذف الفعالية',
    })

    // Fetch Events
    const { data: eventsData, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'all-events'],
        queryFn: () => getAdminEvents(),
    })

    const events = eventsData?.events || eventsData?.data || []

    // Filtered Events
    const filteredEvents = useMemo(() => {
        let filtered = Array.isArray(events) ? events : []

        if (debouncedSearch) {
            filtered = filtered.filter(event =>
                event.eventName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                event.clientName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                event.hallName?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(event => event.status === statusFilter)
        }

        return filtered
    }, [events, debouncedSearch, statusFilter])

    // Table Columns
    const columns = [
        {
            id: 'eventName',
            label: 'الفعالية',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'rgba(216, 185, 138, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                        }}
                    >
                        <Calendar size={20} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.hallName || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'eventDate',
            label: 'التاريخ',
            align: 'center',
            format: (value) => (
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(value, 'MM/DD/YYYY')}
                </MuiTypography>
            )
        },
        {
            id: 'clientName',
            label: 'العميل',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={14} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2">{value || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'status',
            label: 'الحالة',
            align: 'center',
            format: (value) => <EventStatusBadge status={value} />
        }
    ]

    const handleEdit = (event) => {
        // Edit functionality to be implemented
    }

    const handleDeleteClick = async (event) => {
        if (window.confirm(`هل أنت متأكد من حذف هذه الفعالية؟`)) {
            const id = event.id || event._id
            if (!id) return
            await handleDelete(id)
        }
    }

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل الفعاليات..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة الفعاليات | INVOCCA" />

            {/* Header Section */}
            <MuiBox
                sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: '20px',
                    background: 'var(--color-surface-dark)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-glass)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBox
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--color-primary-500)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                        >
                            <Calendar size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة الفعاليات ({filteredEvents.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                نظرة شاملة على جميع الفعاليات والحجوزات المقامة في جميع الصالات
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Search & Filter */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    background: 'rgba(26, 26, 26, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '16px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث باسم الفعالية، العميل، أو القاعة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <MuiInputAdornment position="start">
                                        <Search size={20} style={{ color: 'var(--color-primary-400)' }} />
                                    </MuiInputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiTextField
                            select
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="تصفية حسب الحالة"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        >
                            <option value="all">الكل</option>
                            <option value={EVENT_STATUS.PENDING}>قيد الانتظار</option>
                            <option value={EVENT_STATUS.CONFIRMED}>مؤكد</option>
                            <option value={EVENT_STATUS.ACTIVE}>نشط</option>
                            <option value={EVENT_STATUS.COMPLETED}>مكتمل</option>
                            <option value={EVENT_STATUS.CANCELLED}>ملغي</option>
                        </MuiTextField>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={2}>
                        <MuiButton
                            fullWidth
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={handleRefresh}
                            sx={{
                                height: '56px',
                                borderRadius: '12px',
                                borderColor: 'var(--color-border-glass)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary-500)',
                                    background: 'rgba(216, 185, 138, 0.05)'
                                }
                            }}
                        >
                            تحديث
                        </MuiButton>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Events Table */}
            {filteredEvents.length === 0 ? (
                <EmptyState
                    title="لا يوجد فعاليات"
                    description="لم يتم العثور على أي فعاليات تطابق بحثك"
                    icon={Calendar}
                    showPaper
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredEvents}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    sx={{
                        background: 'rgba(26, 26, 26, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border-glass)',
                        overflow: 'hidden',
                    }}
                />
            )}
        </MuiBox>
    )
}
