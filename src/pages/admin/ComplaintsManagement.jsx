import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiSelect from '@/components/ui/MuiSelect'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, PageHeader, StatCard } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD } from '@/hooks'
import { QUERY_KEYS, COMPLAINT_STATUS } from '@/config/constants'
import { getComplaints, updateComplaintStatus, deleteComplaint } from '@/api/admin'
import { formatDate } from '@/utils/helpers'

// Icons
import {
    MessageCircle,
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    User,
    Building2
} from 'lucide-react'

// ====================== Status Badge ======================
const ComplaintStatusBadge = ({ status }) => {
    const statusConfig = {
        [COMPLAINT_STATUS.PENDING]: { label: 'قيد الانتظار', color: 'warning', icon: Clock },
        [COMPLAINT_STATUS.IN_PROGRESS]: { label: 'قيد المعالجة', color: 'info', icon: AlertCircle },
        [COMPLAINT_STATUS.RESOLVED]: { label: 'تم الحل', color: 'success', icon: CheckCircle },
        [COMPLAINT_STATUS.CLOSED]: { label: 'مغلق', color: 'default', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig[COMPLAINT_STATUS.PENDING]
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
export default function ComplaintsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [statusFilter, setStatusFilter] = useState('all')

    // CRUD operations for delete
    const {
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: null,
        updateFn: null,
        deleteFn: deleteComplaint,
        queryKey: QUERY_KEYS.ADMIN_COMPLAINTS,
        successMessage: 'تم حذف الشكوى بنجاح',
        errorMessage: 'حدث خطأ أثناء حذف الشكوى',
    })

    // Fetch Complaints
    const { data: complaintsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_COMPLAINTS,
        queryFn: () => getComplaints(),
    })

    const complaints = complaintsData?.complaints || complaintsData?.data || complaintsData || []

    // Filtered Complaints
    const filteredComplaints = useMemo(() => {
        let filtered = Array.isArray(complaints) ? complaints : []

        if (debouncedSearch) {
            filtered = filtered.filter(complaint =>
                complaint.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                complaint.userName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                complaint.hallName?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(complaint => complaint.status === statusFilter)
        }

        return filtered
    }, [complaints, debouncedSearch, statusFilter])

    // Table Columns
    const columns = [
        {
            id: 'title',
            label: 'الشكوى',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: 'var(--color-primary-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-primary-200)',
                        }}
                    >
                        <MessageCircle size={18} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.description}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'userName',
            label: 'المشتكي',
            align: 'right',
            format: (value, row) => (
                <MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={14} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiTypography variant="body2">{value}</MuiTypography>
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={12} style={{ color: 'var(--color-text-secondary)' }} />
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.hallName || 'عام'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'createdAt',
            label: 'التاريخ',
            align: 'center',
            format: (value) => (
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(value, 'DD/MM/YYYY')}
                </MuiTypography>
            )
        },
        {
            id: 'status',
            label: 'الحالة',
            align: 'center',
            format: (value) => <ComplaintStatusBadge status={value} />
        }
    ]

    const handleView = (complaint) => { }

    const handleDeleteClick = async (complaint) => {
        if (window.confirm(`هل أنت متأكد من حذف هذه الشكوى؟`)) {
            const id = complaint.id || complaint._id
            if (!id) return
            await handleDelete(id)
        }
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل الشكاوى..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة الشكاوى | INVOCCA" />

            <PageHeader
                icon={MessageCircle}
                title={`إدارة الشكاوى (${filteredComplaints.length})`}
                subtitle="إدارة جميع الشكاوى المقدمة من قبل المستخدمين ومتابعة حلها"
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

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الشكاوى"
                        value={complaints.length}
                        icon={<MessageCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-primary-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="قيد الانتظار"
                        value={complaints.filter(c => c.status === COMPLAINT_STATUS.PENDING).length}
                        icon={<Clock size={24} />}
                        sx={{ borderTop: '4px solid var(--color-warning-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="قيد المعالجة"
                        value={complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length}
                        icon={<AlertCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-info-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="تم الحل"
                        value={complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length}
                        icon={<CheckCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-success-500)' }}
                    />
                </MuiGrid>
            </MuiGrid>

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
                            placeholder="البحث بنوع الشكوى، اسم المستخدم، أو قاعة/صالة..."
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
                            options={[
                                { label: 'الكل', value: 'all' },
                                { label: 'قيد الانتظار', value: COMPLAINT_STATUS.PENDING },
                                { label: 'قيد المعالجة', value: COMPLAINT_STATUS.IN_PROGRESS },
                                { label: 'تم الحل', value: COMPLAINT_STATUS.RESOLVED },
                                { label: 'مغلق', value: COMPLAINT_STATUS.CLOSED },
                            ]}
                        />
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Complaints Table */}
            {filteredComplaints.length === 0 ? (
                <EmptyState
                    title="لا يوجد شكاوى"
                    description="لم يتم العثور على أي شكاوى تطابق بحثك"
                    icon={MessageCircle}
                    showPaper
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredComplaints}
                    onView={handleView}
                    onDelete={handleDeleteClick}
                />
            )}
        </MuiBox>
    )
}
