import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMediaQuery, useTheme } from '@mui/material'

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
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiIconButton from '@/components/ui/MuiIconButton'

// Layout & Common Components
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LoadingScreen, EmptyState, ConfirmDialog, SEOHead, CardsView, TablePagination, DataTable, FormDialog } from '@/components/common'
import ViewManagerDialog from './components/ViewManagerDialog'
import CreateEditManagerDialog from './components/CreateEditManagerDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getManagers, deleteManager, toggleManagerStatus, createManager, updateManager, getHallsList } from '@/api/admin'
import { formatPhoneNumber } from '@/utils/helpers'

// Icons
import {
    User,
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    Phone,
    Building2,
    X,
    UserPlus,
    Plus
} from 'lucide-react'

// ====================== Validation Schema ======================
const createManagerSchema = (editingManager = null) => z.object({
    name: z.string()
        .min(3, 'اسم المدير يجب أن يكون 3 أحرف على الأقل')
        .max(100, 'اسم المدير طويل جداً'),

    phone: z.string()
        .regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط')
        .min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل')
        .max(15, 'رقم الهاتف طويل جداً'),

    password: editingManager
        ? z.string()
            .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            .max(50, 'كلمة المرور طويلة جداً')
            .optional()
            .or(z.literal(''))
        : z.string()
            .min(6, 'كلمة المرور مطلوبة')
            .max(50, 'كلمة المرور طويلة جداً'),

    hallId: z.string()
        .min(1, 'معرف القاعة مطلوب')
        .optional(),

    isActive: z.boolean()
        .optional()
        .default(true)
})

// ====================== Main Component ======================
export default function ManagersManagement() {
    // State Management
    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [viewMode, setViewMode] = useState('table') // 'table' or 'card'

    // Hooks
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const debouncedSearch = useDebounce(searchTerm, 500)
    const { addNotification: showNotification } = useNotification()

    // Dialog state management
    const {
        dialogOpen,
        dialogType,
        selectedItem: selectedManager,
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
        createMutation,
        updateMutation,
        deleteMutation,
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createManager,
        updateFn: updateManager,
        deleteFn: deleteManager,
        queryKey: QUERY_KEYS.ADMIN_MANAGERS,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
        onSuccess: () => {
            fetchManagers()
        },
    })

    // Fetch halls list for populating hall names
    const { data: hallsData } = useQuery({
        queryKey: ['admin', 'halls-list'],
        queryFn: getHallsList,
        staleTime: 5 * 60 * 1000
    })

    const hallsList = Array.isArray(hallsData)
        ? hallsData
        : (Array.isArray(hallsData?.data) ? hallsData.data : (hallsData?.halls || []))

    // Form
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createManagerSchema()),
        defaultValues: {
            name: '',
            phone: '',
            password: '',
            hallId: '',
            isActive: true
        }
    })

    // Fetch Managers Function
    const fetchManagers = async () => {
        try {
            setLoading(true)
            const response = await getManagers()

            // تحقق من بنية الاستجابة المختلفة
            let managersData = []

            if (Array.isArray(response)) {
                managersData = response
            } else if (response?.data) {
                if (Array.isArray(response.data)) {
                    managersData = response.data
                } else if (response.data?.data && Array.isArray(response.data.data)) {
                    managersData = response.data.data
                } else if (response.data?.managers && Array.isArray(response.data.managers)) {
                    managersData = response.data.managers
                }
            } else if (response?.managers && Array.isArray(response.managers)) {
                managersData = response.managers
            }

            setManagers(managersData)
            setError(null)
        } catch (err) {
            setError('حدث خطأ في جلب بيانات المدراء')
            showNotification({
                title: 'خطأ',
                message: 'فشل في تحميل بيانات المدراء',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // Initial Data Fetch
    useEffect(() => {
        fetchManagers()
    }, [])


    // Filtered Managers
    const filteredManagers = useMemo(() => {
        let filtered = Array.isArray(managers) ? managers : []

        if (debouncedSearch) {
            filtered = filtered.filter(manager =>
                manager.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                manager.phone?.includes(debouncedSearch) ||
                (manager.hallId?.name || manager.hallName)?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(manager =>
                statusFilter === 'active' ? manager.isActive !== false : manager.isActive === false
            )
        }

        return filtered
    }, [managers, debouncedSearch, statusFilter])

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'المدير',
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
                        {value?.charAt(0).toUpperCase() || 'M'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.username || 'بدون اسم مستخدم'}
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
            id: 'hallId',
            label: 'القاعة المسؤول عنها',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={14} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>
                        {value?.name || row.hallName || 'غير معين'}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={value !== false ? 'نشط' : 'معطل'}
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


    const handleToggleStatus = async (row) => {
        try {
            const id = row._id || row.id
            if (!id) return

            // Clean data - only send necessary fields with proper types
            const updatedData = {
                name: String(row.name || ''),
                username: row.username ? String(row.username) : undefined,
                phone: String(row.phone || ''),
                hallId: row.hallId?._id || row.hallId || undefined,
                isActive: !row.isActive
            }

            // Remove undefined fields
            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] === undefined) {
                    delete updatedData[key]
                }
            })

            // Update manager status
            const result = await handleUpdate(id, updatedData)
            
            if (result?.success !== false) {
                // Refresh data after successful update
                await fetchManagers()
                
                // Show custom notification (useCRUD will also show one, but this is more specific)
                showNotification({
                    title: 'تم التحديث',
                    message: `تم ${updatedData.isActive ? 'تفعيل' : 'إلغاء تفعيل'} المدير "${row.name}" بنجاح`,
                    type: 'success'
                })
            }
        } catch (err) {
            // Error is already handled by useCRUD, but we can add additional handling if needed
            const errorMessage = err?.response?.data?.message || err?.message || 'فشل في تحديث حالة المدير'
            showNotification({
                title: 'خطأ',
                message: String(errorMessage),
                type: 'error'
            })
        }
    }

    const handleCreateClick = () => {
        openCreateDialog()
    }

    const handleEditClick = (row) => {
        openEditDialog(row)
    }

    // Helper function to clean data and remove circular references
    const cleanManagerData = (data) => {
        return {
            name: String(data.name || ''),
            username: data.username ? String(data.username) : undefined,
            phone: String(data.phone || ''),
            password: data.password ? String(data.password) : undefined,
            hallId: data.hallId ? String(data.hallId) : undefined,
            isActive: Boolean(data.isActive !== false)
        }
    }

    // Submit Handlers
    const handleCreateSubmit = async (data) => {
        const cleanedData = cleanManagerData(data)
        await handleCreate(cleanedData)
        closeDialog()
    }

    const handleUpdateSubmit = async (data) => {
        const id = selectedManager?._id || selectedManager?.id
        if (!id) return
        const cleanedData = cleanManagerData(data)
        await handleUpdate(id, cleanedData)
        closeDialog()
    }

    const handleDeleteConfirm = async () => {
        const id = selectedManager?._id || selectedManager?.id
        if (!id) return
        await handleDelete(id)
        closeDialog()
    }

    if (loading) {
        return <LoadingScreen />
    }

    if (error) {
        return (
            <MuiBox sx={{ p: 3 }}>
                <MuiAlert severity="error" sx={{ mb: 2 }}>
                    {error}
                </MuiAlert>
                <MuiButton
                    variant="contained"
                    onClick={fetchManagers}
                    startIcon={<RefreshCw size={20} />}
                >
                    إعادة المحاولة
                </MuiButton>
            </MuiBox>
        )
    }

    const handleRefresh = () => {
        fetchManagers()
        showNotification({ title: 'تحديث', message: 'تم تحديث البيانات بنجاح', type: 'success' })
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة المدراء | INVOCCA" />

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
                            <User size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة المدراء ({filteredManagers.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة حسابات مدراء الصالات وربطهم مع القاعات المخصصة
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>

                    <MuiButton
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={handleCreateClick}
                        sx={{
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-800))',
                            color: '#fff',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900))',
                                boxShadow: '0 4px 15px rgba(216, 185, 138, 0.4)'
                            }
                        }}
                    >
                        إضافة مدير قاعة
                    </MuiButton>
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
                                    {managers.length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    عدد المدراء
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
                                <User size={28} style={{ color: '#D8B98A' }} />
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
                                    {managers.filter(m => m.isActive !== false).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    المدراء النشطون
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

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid rgba(147, 51, 234, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: '#9333ea',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #9333ea, transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {managers.filter(m => m.hallId).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    مع قاعة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(147, 51, 234, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(147, 51, 234, 0.2)',
                                }}
                            >
                                <Building2 size={28} style={{ color: '#9333ea' }} />
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
                            border: '1px solid rgba(234, 179, 8, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: '#eab308',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #eab308, transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {managers.filter(m => !m.hallId).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    بدون قاعة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(234, 179, 8, 0.2)',
                                }}
                            >
                                <XCircle size={28} style={{ color: '#eab308' }} />
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
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '16px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={9}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث بالاسم، الهاتف، أو اسم القاعة..."
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

            {/* Managers Table */}
            {
                filteredManagers.length === 0 ? (
                    <EmptyState
                        title="لا يوجد مدراء"
                        description="لم يتم العثور على أي مدراء يطابقون بحثك"
                        icon={User}
                        showPaper
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredManagers}
                        onView={openViewDialog}
                        onEdit={handleEditClick}
                        onDelete={openDeleteDialog}
                        onToggleStatus={handleToggleStatus}
                        showActions={true}
                        sx={{
                            background: 'rgba(26, 26, 26, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: '1px solid var(--color-border-glass)',
                            overflow: 'hidden',
                        }}
                    />
                )
            }

            {/* Dialogs */}
            <CreateEditManagerDialog
                key={selectedManager?._id || 'new'}
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
                editingManager={isEdit ? selectedManager : null}
                loading={crudLoading}
            />

            <ViewManagerDialog
                open={isView}
                onClose={closeDialog}
                manager={selectedManager}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="حذف المدير"
                message={`هل أنت متأكد من حذف المدير "${selectedManager?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                loading={crudLoading}
            />
        </MuiBox >
    )
}
