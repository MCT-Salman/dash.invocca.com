// src\pages\admin\ClientsManagement.jsx
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

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, PageHeader } from '@/components/common'

// Hooks & Utilities
import { useDebounce, useCRUD, useNotification } from '@/hooks'
import { getUsers, deleteUser, toggleUserStatus } from '@/api/admin'
import { USER_ROLES, QUERY_KEYS } from '@/config/constants'
import { formatPhoneNumber, formatDate } from '@/utils/helpers'

// Icons
import {
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    Phone,
    Calendar,
    Users
} from 'lucide-react'

// ====================== Main Component ======================
export default function ClientsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const { showNotification } = useNotification()

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
                client.username?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                client.phone?.includes(debouncedSearch)
            )
        }

        return filtered
    }, [clients, debouncedSearch])

    // Handle toggle user status
    const handleToggleStatus = async (client) => {
        try {
            const id = client.id || client._id
            if (!id) return

            await toggleUserStatus(id)
            showNotification('success', `تم ${client.isActive !== false ? 'تعطيل' : 'تفعيل'} حساب العميل بنجاح`)
            refetch()
        } catch (error) {
            showNotification('error', 'حدث خطأ أثناء تغيير حالة الحساب')
        }
    }

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'الاسم',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
                        sx={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            color: 'var(--color-text-on-primary)',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                        }}
                    >
                        {value?.charAt(0).toUpperCase() || 'C'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                            {value || '—'}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            @{row.username || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'username',
            label: 'اسم المستخدم',
            align: 'right',
            format: (value) => (
                <MuiTypography variant="body2">
                    {value || '—'}
                </MuiTypography>
            )
        },
        {
            id: 'phone',
            label: 'رقم الهاتف',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} style={{ color: 'var(--color-primary-500)' }} />
                    <MuiTypography variant="body2">{formatPhoneNumber(value) || value || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'createdAt',
            label: 'تاريخ الإنشاء',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} style={{ color: 'var(--color-primary-500)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(value) || '—'}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <MuiChip
                        label={value !== false ? 'نشط' : 'غير نشط'}
                        size="small"
                        color={value !== false ? 'success' : 'error'}
                        variant="filled"
                        icon={value !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    />
                    <MuiButton
                        size="small"
                        variant="outlined"
                        onClick={() => handleToggleStatus(row)}
                        sx={{
                            minWidth: 'auto',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.7rem',
                        }}
                        color={value !== false ? 'error' : 'success'}
                    >
                        {value !== false ? 'تعطيل' : 'تفعيل'}
                    </MuiButton>
                </MuiBox>
            )
        }
    ]

    const handleEdit = (client) => { }

    const handleDeleteClick = async (client) => {
        if (window.confirm(`هل أنت متأكد من حذف حساب العميل "${client.name}"؟`)) {
            const id = client.id || client._id
            if (!id) return
            await handleDelete(id)
        }
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل قائمة العملاء..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة العملاء | INVOCCA" />

            <PageHeader
                icon={Users}
                title={`إدارة العملاء (${filteredClients.length})`}
                subtitle="إدارة جميع حسابات العملاء وسجلات حجوزاتهم في النظام"
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
                    <MuiGrid item xs={12} md={12}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث بالاسم، اسم المستخدم، أو رقم الهاتف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
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
                />
            )}
        </MuiBox>
    )
}
