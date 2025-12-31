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
import { LoadingScreen, EmptyState, SEOHead, DataTable } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD } from '@/hooks'
import { QUERY_KEYS, COMPLAINT_STATUS, COMPLAINT_STATUS_LABELS } from '@/config/constants'
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
    CheckCheck,
    MoreVertical,
    Trash2,
    Eye,
    User,
    Building2
} from 'lucide-react'

// ====================== Status Badge ======================
const ComplaintStatusBadge = ({ status }) => {
    const statusConfig = {
        [COMPLAINT_STATUS.PENDING]: { label: 'قيد الانتظار', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: Clock },
        [COMPLAINT_STATUS.IN_PROGRESS]: { label: 'قيد المعالجة', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: AlertCircle },
        [COMPLAINT_STATUS.RESOLVED]: { label: 'تم الحل', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)', icon: CheckCircle },
        [COMPLAINT_STATUS.CLOSED]: { label: 'مغلق', color: '#666', bg: 'rgba(102, 102, 102, 0.1)', icon: CheckCheck }
    }

    const config = statusConfig[status] || statusConfig[COMPLAINT_STATUS.PENDING]
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
export default function ComplaintsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [statusFilter, setStatusFilter] = useState('all')

    // CRUD operations for delete
    const {
        deleteMutation,
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

    // Status update mutation (separate from CRUD)
    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => updateComplaintStatus(id, { status }),
        onSuccess: () => {
            // Success handled by useCRUD
        }
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
                        <MessageCircle size={20} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
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
                        <User size={14} style={{ color: 'var(--color-primary-400)' }} />
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

    const handleView = (complaint) => {
        // View functionality to be implemented
    }

    const handleDeleteClick = async (complaint) => {
        if (window.confirm(`هل أنت متأكد من حذف هذه الشكوى؟`)) {
            const id = complaint.id || complaint._id
            if (!id) return
            await handleDelete(id)
        }
    }

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل الشكاوى..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة الشكاوى | INVOCCA" />

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
                            <MessageCircle size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة الشكاوى ({filteredComplaints.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة جميع الشكاوى المقدمة من قبل المستخدمين ومتابعة حلها
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-primary-500)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-primary-500), transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {complaints.length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    إجمالي الشكاوى
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(216, 185, 138, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(216, 185, 138, 0.2)',
                                }}
                            >
                                <MessageCircle size={28} style={{ color: '#D8B98A' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: '#f59e0b',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #f59e0b, transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {complaints.filter(c => c.status === COMPLAINT_STATUS.PENDING).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    قيد الانتظار
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}
                            >
                                <Clock size={28} style={{ color: '#f59e0b' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: '#3b82f6',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #3b82f6, transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    قيد المعالجة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                }}
                            >
                                <AlertCircle size={28} style={{ color: '#3b82f6' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid rgba(22, 163, 74, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: '#16a34a',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #16a34a, transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    تم الحل
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(22, 163, 74, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(22, 163, 74, 0.2)',
                                }}
                            >
                                <CheckCircle size={28} style={{ color: '#16a34a' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

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
                            placeholder="البحث بنوع الشكوى، اسم المستخدم، أو القاعة..."
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
                        <MuiSelect
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{
                                borderRadius: '10px',
                            }}
                        >
                            <MuiMenuItem value="all">الكل</MuiMenuItem>
                            <MuiMenuItem value={COMPLAINT_STATUS.PENDING}>قيد الانتظار</MuiMenuItem>
                            <MuiMenuItem value={COMPLAINT_STATUS.IN_PROGRESS}>قيد المعالجة</MuiMenuItem>
                            <MuiMenuItem value={COMPLAINT_STATUS.RESOLVED}>تم الحل</MuiMenuItem>
                            <MuiMenuItem value={COMPLAINT_STATUS.CLOSED}>مغلق</MuiMenuItem>
                        </MuiSelect>
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
