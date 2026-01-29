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
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiIconButton from '@/components/ui/MuiIconButton'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, PageHeader } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD } from '@/hooks'
import { QUERY_KEYS, EVENT_STATUS, EVENT_STATUS_LABELS } from '@/config/constants'
import { getAdminEvents, deleteAdminEvent as deleteEvent } from '@/api/admin'
import { formatDate } from '@/utils/helpers'

// Icons
import {
    Calendar,
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Trash2,
    Edit2
} from 'lucide-react'

// ====================== Status Badge ======================
const EventStatusBadge = ({ status }) => {
    const statusConfig = {
        [EVENT_STATUS.PENDING]: { label: 'قيد الانتظار', color: 'warning', icon: Clock },
        [EVENT_STATUS.CONFIRMED]: { label: 'مؤكد', color: 'info', icon: CheckCircle },
        [EVENT_STATUS.ACTIVE]: { label: 'نشط', color: 'success', icon: RefreshCw },
        [EVENT_STATUS.COMPLETED]: { label: 'مكتمل', color: 'secondary', icon: CheckCircle },
        [EVENT_STATUS.CANCELLED]: { label: 'ملغي', color: 'error', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig[EVENT_STATUS.PENDING]
    const Icon = config.icon

    return (
        <MuiChip
            icon={<Icon size={14} />}
            label={config.label}
            size="small"
            color={config.color}
            variant="filled"
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
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: 'var(--color-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <Calendar size={18} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
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
                    <Users size={14} style={{ color: 'var(--color-primary-500)' }} />
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

    const handleEdit = (event) => { }

    const handleDeleteClick = async (event) => {
        if (window.confirm(`هل أنت متأكد من حذف هذه الفعالية؟`)) {
            const id = event.id || event._id
            if (!id) return
            await handleDelete(id)
        }
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل الفعاليات..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة الفعاليات | INVOCCA" />

            <PageHeader
                icon={Calendar}
                title={`إدارة الفعاليات (${filteredEvents.length})`}
                subtitle="نظرة شاملة على جميع الحجوزات والفعاليات المقامة"
                actions={
                    <MuiButton
                        variant="outlined"
                        start_icon={<RefreshCw size={18} />}
                        onClick={() => refetch()}
                    >
                        تحديث
                    </MuiButton>
                }
            />

            {/* Search & Filter */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={8}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث باسم الفعالية، العميل، أو قاعة/صالة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiSelect
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="تصفية حسب الحالة"
                            options={[
                                { label: 'الكل', value: 'all' },
                                { label: 'قيد الانتظار', value: EVENT_STATUS.PENDING },
                                { label: 'مؤكد', value: EVENT_STATUS.CONFIRMED },
                                { label: 'نشط', value: EVENT_STATUS.ACTIVE },
                                { label: 'مكتمل', value: EVENT_STATUS.COMPLETED },
                                { label: 'ملغي', value: EVENT_STATUS.CANCELLED }
                            ]}
                        />
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
                />
            )}
        </MuiBox>
    )
}
