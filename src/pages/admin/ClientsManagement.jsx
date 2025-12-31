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
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD } from '@/hooks'
import { getUsers, deleteUser } from '@/api/admin'
import { USER_ROLES, QUERY_KEYS } from '@/config/constants'
import { formatPhoneNumber } from '@/utils/helpers'

// Icons
import {
    UserPlus,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Calendar,
    MoreVertical,
    Trash2,
    Edit2,
    Users
} from 'lucide-react'

// ====================== Main Component ======================
export default function ClientsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    // CRUD operations
    const {
        deleteMutation,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: null,
        updateFn: null,
        deleteFn: deleteUser,
        queryKey: [QUERY_KEYS.ADMIN_USERS, 'role-client'],
        successMessage: 'تم حذف العميل بنجاح',
        errorMessage: 'حدث خطأ أثناء حذف العميل',
    })

    // Fetch Clients
    const { data: clientsData, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN_USERS, 'role-client'],
        queryFn: () => getUsers({ role: USER_ROLES.CLIENT }),
    })

    const clients = clientsData?.clients || clientsData?.data || []

    // Filtered Clients
    const filteredClients = useMemo(() => {
        let filtered = Array.isArray(clients) ? clients : []

        if (debouncedSearch) {
            filtered = filtered.filter(client =>
                client.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                client.phone?.includes(debouncedSearch) ||
                client.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        return filtered
    }, [clients, debouncedSearch])

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'العميل',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
                        sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                    >
                        {value?.charAt(0).toUpperCase() || 'C'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.email || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'phone',
            label: 'رقم الهاتف',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2">{formatPhoneNumber(value) || value || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'totalEvents',
            label: 'إجمالي الحجوزات',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={`${value || 0} مناسبة`}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                        color: 'var(--color-primary-300)',
                        fontWeight: 600,
                        border: '1px solid rgba(216, 185, 138, 0.2)',
                    }}
                />
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={value !== false ? 'نشط' : 'غير نشط'}
                    size="small"
                    sx={{
                        backgroundColor: value !== false ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                        color: value !== false ? '#16a34a' : '#dc2626',
                        fontWeight: 600,
                        border: `1px solid ${value !== false ? '#16a34a' : '#dc2626'}33`,
                    }}
                    icon={value !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                />
            )
        }
    ]

    const handleEdit = (client) => {
        // Edit functionality to be implemented
    }

    const handleDeleteClick = async (client) => {
        if (window.confirm(`هل أنت متأكد من حذف حساب العميل "${client.name}"؟`)) {
            const id = client.id || client._id
            if (!id) return
            await handleDelete(id)
        }
    }

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل قائمة العملاء..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة العملاء | INVOCCA" />

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
                            <Users size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة العملاء ({filteredClients.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة جميع حسابات العملاء وسجلات حجوزاتهم في النظام
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
                    <MuiGrid item xs={12} md={9}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث بالاسم، الهاتف، أو البريد الإلكتروني..."
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
                    <MuiGrid item xs={12} md={3}>
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
                            تحديث البيانات
                        </MuiButton>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Clients Table */}
            {filteredClients.length === 0 ? (
                <EmptyState
                    title="لا يوجد عملاء"
                    description="لم يتم العثور على أي عملاء يطابقون بحثك"
                    icon={Users}
                    showPaper
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredClients}
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
