// src\pages\manager\ClientsManagementNew.jsx
/**
 * Clients Management Page - Enhanced Design
 * إدارة العملاء - تصميم محسّن ومتجاوب
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiChip from '@/components/ui/MuiChip'
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClients, deleteClient, createClient, updateClient } from '@/api/manager'
import ViewClientDialog from './components/ViewClientDialog'
import CreateEditClientDialog from './components/CreateEditClientDialog'
import {
    Users,
    Plus,
    Search,
    Phone,
    Calendar,
    Edit2,
    Trash2,
    Eye,
    UserCheck,
    UserX,
    RefreshCw
} from 'lucide-react'


/**
 * Main Clients Management Component
 */
export default function ClientsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)

    // Dialog state management
    const {
        selectedItem: selectedClient,
        openCreateDialog,
        openEditDialog,
        openViewDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isView,
        isDelete,
    } = useDialogState()

    // CRUD operations
    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createClient,
        updateFn: updateClient,
        deleteFn: deleteClient,
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    // Fetch clients
    const { data: clientsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
        queryFn: getClients,
    })

    // Memoize clients to avoid dependency issues
    const clients = useMemo(() => {
        return clientsData?.clients || clientsData?.data || []
    }, [clientsData?.clients, clientsData?.data])

    // Filter clients
    const filteredClients = useMemo(() => {
        let filtered = Array.isArray(clients) ? clients : []

        if (debouncedSearch) {
            filtered = filtered.filter(client =>
                client.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                client.phone?.includes(debouncedSearch)
            )
        }

        return filtered
    }, [clients, debouncedSearch])

    // Stats
    const stats = {
        total: clients.length,
        active: clients.filter(c => c.isActive !== false).length,
        inactive: clients.filter(c => c.isActive === false).length,
    }

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'العميل',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
                        sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
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
                    <MuiTypography variant="body2" dir="ltr">{value || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'eventsCount',
            label: 'عدد الفعاليات',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Calendar size={14} style={{ color: '#FFE36C' }} />
                    <MuiTypography variant="body2">{value || 0}</MuiTypography>
                </MuiBox>
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
                    icon={value !== false ? <UserCheck size={14} /> : <UserX size={14} />}
                    sx={{
                        backgroundColor: value !== false ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                        color: value !== false ? '#16a34a' : '#dc2626',
                        fontWeight: 600,
                        border: `1px solid ${value !== false ? '#16a34a' : '#dc2626'}33`,
                    }}
                />
            )
        }
    ]

    // Event Handlers
    const handleRefresh = () => {
        refetch()
    }

    // Submit Handlers
    const handleCreateSubmit = async (data) => {
        const result = await handleCreate(data)
        if (result.success) {
            closeDialog()
        }
    }

    const handleUpdateSubmit = async (data) => {
        const id = selectedClient?._id || selectedClient?.id
        if (!id) return
        const result = await handleUpdate(id, data)
        if (result.success) {
            closeDialog()
        }
    }

    const handleDeleteConfirm = async () => {
        const id = selectedClient?._id || selectedClient?.id
        if (!id) return
        const result = await handleDelete(id)
        if (result.success) {
            closeDialog()
        }
    }

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <>
            <SEOHead title="إدارة العملاء" />

            <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
                {/* Header Section - Premium Welcome Card */}
                <MuiBox
                    sx={{
                        mb: 5,
                        p: { xs: 3, sm: 4.5, md: 5 },
                        borderRadius: '24px',
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(216, 185, 138, 0.2)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(216, 185, 138, 0.1)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.12) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 4s ease-in-out infinite',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-30%',
                            left: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 5s ease-in-out infinite',
                        }
                    }}
                >
                    <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 3 }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                            <MuiBox
                                sx={{
                                    width: { xs: 64, sm: 72 },
                                    height: { xs: 64, sm: 72 },
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--color-primary-400)',
                                    boxShadow: '0 10px 30px rgba(216, 185, 138, 0.3), 0 0 20px rgba(216, 185, 138, 0.2)',
                                }}
                            >
                                <Users size={36} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                            </MuiBox>
                            <MuiBox sx={{ flex: 1 }}>
                                <MuiTypography 
                                    variant="h4" 
                                    sx={{ 
                                        color: 'var(--color-text-primary-dark)', 
                                        fontWeight: 800, 
                                        mb: 1,
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                        background: 'linear-gradient(135deg, var(--color-text-primary-dark), var(--color-primary-500))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    إدارة العملاء
                                </MuiTypography>
                                <MuiTypography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'var(--color-primary-400)',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        fontWeight: 500,
                                        letterSpacing: '0.3px'
                                    }}
                                >
                                    عرض وإدارة جميع العملاء والمستخدمين
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>

                        <MuiBox sx={{ display: 'flex', gap: 2 }}>
                            <MuiButton
                                variant="outlined"
                                startIcon={<RefreshCw size={20} />}
                                onClick={handleRefresh}
                                sx={{
                                    height: '56px',
                                    borderRadius: '14px',
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                    color: 'var(--color-text-secondary)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        background: 'rgba(216, 185, 138, 0.05)'
                                    }
                                }}
                            >
                                تحديث
                            </MuiButton>
                            <MuiButton
                                variant="contained"
                                startIcon={<Plus size={20} />}
                                size="large"
                                onClick={openCreateDialog}
                                sx={{
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '14px',
                                    boxShadow: '0 8px 20px rgba(216, 185, 138, 0.4)',
                                    border: '2px solid rgba(216, 185, 138, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 28px rgba(216, 185, 138, 0.5)',
                                        background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                                    }
                                }}
                            >
                                إضافة عميل جديد
                            </MuiButton>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                {/* Stats Cards */}
                <MuiGrid container spacing={3} sx={{ mb: 4.5 }}>
                    <MuiGrid item xs={12} sm={4}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(216, 185, 138, 0.2)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, var(--color-primary-500), transparent)',
                                }
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(216, 185, 138, 0.3)',
                                    }}
                                >
                                    <Users size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)', 
                                            mb: 1,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                            display: 'block'
                                        }}
                                    >
                                        إجمالي العملاء
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800,
                                            color: 'var(--color-primary-500)',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {stats.total}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                    <MuiGrid item xs={6} sm={4}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(22, 163, 74, 0.15)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(22, 163, 74, 0.2)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #16a34a, transparent)',
                                }
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
                                    }}
                                >
                                    <UserCheck size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)', 
                                            mb: 1,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                            display: 'block'
                                        }}
                                    >
                                        نشط
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800,
                                            color: '#16a34a',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {stats.active}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                    <MuiGrid item xs={6} sm={4}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(220, 38, 38, 0.15)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(220, 38, 38, 0.2)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #dc2626, transparent)',
                                }
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
                                    }}
                                >
                                    <UserX size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)', 
                                            mb: 1,
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                            display: 'block'
                                        }}
                                    >
                                        غير نشط
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800,
                                            color: '#dc2626',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {stats.inactive}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                </MuiGrid>

                {/* Search */}
                <MuiPaper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4.5,
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <MuiTextField
                        placeholder="البحث عن عميل (الاسم، الهاتف)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <MuiInputAdornment position="start">
                                    <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
                                </MuiInputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                '&:hover': {
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                },
                                '&.Mui-focused': {
                                    borderColor: 'var(--color-primary-500)',
                                }
                            },
                            '& .MuiOutlinedInput-input': {
                                color: 'var(--color-text-primary-dark)',
                            }
                        }}
                    />
                </MuiPaper>

                {/* Clients Table */}
                <DataTable
                    columns={columns}
                    data={filteredClients}
                    onView={openViewDialog}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    showActions={true}
                    loading={isLoading}
                    emptyMessage="لا يوجد عملاء"
                    sx={{
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                />

                {/* Dialogs */}
                <CreateEditClientDialog
                    key={selectedClient?._id || selectedClient?.id || 'new'}
                    open={isCreate || isEdit}
                    onClose={closeDialog}
                    onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
                    editingClient={isEdit ? selectedClient : null}
                    loading={crudLoading}
                />

                <ViewClientDialog
                    open={isView}
                    onClose={closeDialog}
                    client={selectedClient}
                />

                <ConfirmDialog
                    open={isDelete}
                    onClose={closeDialog}
                    onConfirm={handleDeleteConfirm}
                    title="حذف العميل"
                    message={`هل أنت متأكد من حذف العميل "${selectedClient?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                    confirmLabel="حذف"
                    cancelLabel="إلغاء"
                    loading={crudLoading}
                />
            </MuiBox>
        </>
    )
}

