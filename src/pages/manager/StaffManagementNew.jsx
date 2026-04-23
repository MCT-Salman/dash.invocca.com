// src\pages\manager\StaffManagementNew.jsx

/**

 * Staff Management Page - Enhanced Design

 * إدارة الموظفين - تصميم محسّن ومتجاوب

 */



import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog, ButtonLoading, AdvancedFilter } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { useAuth, useNotification, useDebounce, useDialogState, useCRUD } from '@/hooks'
import { getStaff, deleteStaff, addStaff, updateStaff } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiChip from '@/components/ui/MuiChip'
import ViewStaffDialog from './components/ViewStaffDialog'
import CreateEditStaffDialog from './components/CreateEditStaffDialog'
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    Briefcase,
    Calendar,
    Edit2,
    Trash2,
    Eye,
    UserCheck,
    UserX,
    Shield,
    Award,
    RefreshCw,
    QrCode
} from 'lucide-react'



/**

 * Staff Role Badge

 */

function StaffRoleBadge({ role }) {

    const roleConfig = {

        manager: { label: 'مدير', color: 'var(--color-icon)', bg: 'var(--color-bg)', icon: Shield },

        employee: { label: 'موظف', color: 'var(--color-icon)', bg: 'var(--color-bg)', icon: Briefcase },

        supervisor: { label: 'مشرف', color: 'var(--color-icon)', bg: 'var(--color-bg)', icon: Award },

        scanner: { label: 'ماسح', color: 'var(--color-icon)', bg: 'var(--color-bg)', icon: QrCode },

    }



    const config = roleConfig[role] || roleConfig.scanner

    const Icon = config.icon



    return (

        <MuiChip

            icon={<Icon size={14} />}

            label={config.label}

            size="small"

            sx={{

                backgroundColor: config.bg,

                color: config.color,

                fontWeight: 700,

                fontSize: '0.75rem',

                height: 28,

                borderRadius: '8px',

                border: `2px solid ${config.color}20`

            }}

        />

    )

}





/**

 * Main Staff Management Component

 */

export default function StaffManagement() {
    const { user } = useAuth()
    const { addNotification: showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})

    const debouncedSearch = useDebounce(searchQuery, 500)



    // Dialog state management

    const {

        dialogOpen,

        dialogType,

        selectedItem: selectedStaff,

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

        createFn: addStaff,

        updateFn: updateStaff,

        deleteFn: deleteStaff,

        queryKey: QUERY_KEYS.MANAGER_STAFF,

        successMessage: 'تمت العملية بنجاح',

        errorMessage: 'حدث خطأ أثناء العملية',

    })



    // Fetch staff

    const { data: staffData, isLoading, refetch } = useQuery({

        queryKey: QUERY_KEYS.MANAGER_STAFF,

        queryFn: getStaff,

    })



    const staff = staffData?.staff || staffData?.data || []



    // Filter configuration for AdvancedFilter
    const filterConfig = useMemo(() => {
        return [
            {
                key: 'role',
                label: 'الدور',
                type: 'select',
                options: [
                    { value: 'manager', label: 'مدير صالة' },
                    { value: 'scanner', label: 'موظف استقبال' }
                ]
            },
            {
                key: 'status',
                label: 'الحالة',
                type: 'select',
                options: [
                    { value: 'active', label: 'نشط' },
                    { value: 'inactive', label: 'غير نشط' }
                ]
            },
            {
                key: 'joinDate',
                label: 'تاريخ الانضمام',
                type: 'dateRange'
            }
        ]
    }, [])

    // Filter staff

    const filteredStaff = useMemo(() => {

        let filtered = Array.isArray(staff) ? staff : []



        if (debouncedSearch) {

            filtered = filtered.filter(member => {
                const name = member.name || ''
                const phone = member.phone || ''
                const role = member.role || ''
                return (
                    name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    phone.includes(debouncedSearch) ||
                    (typeof role === 'string' && role.toLowerCase().includes(debouncedSearch.toLowerCase()))
                )
            })

        }

        // Apply role filter
        if (activeFilters.role) {
            filtered = filtered.filter(member => {
                const memberRole = member.role
                const filterRole = activeFilters.role
                if (!memberRole) return false
                if (typeof memberRole === 'string') {
                    return memberRole.toLowerCase() === filterRole.toLowerCase()
                }
                return String(memberRole).toLowerCase() === filterRole.toLowerCase()
            })
        }

        // Apply status filter
        if (activeFilters.status) {
            filtered = filtered.filter(member => {
                if (activeFilters.status === 'active') return member.isActive !== false
                if (activeFilters.status === 'inactive') return member.isActive === false
                return true
            })
        }

        // Apply date range filter
        if (activeFilters.dateFrom || activeFilters.dateTo) {
            filtered = filtered.filter(member => {
                const hireDate = member.staffInfo?.hireDate || member.joinDate
                if (!hireDate) return false
                const memberDate = new Date(hireDate)
                const fromDate = activeFilters.dateFrom ? new Date(activeFilters.dateFrom) : null
                const toDate = activeFilters.dateTo ? new Date(activeFilters.dateTo) : null

                // Set toDate to end of day to include the selected date
                if (toDate) {
                    toDate.setHours(23, 59, 59, 999)
                }

                if (fromDate && memberDate < fromDate) return false
                if (toDate && memberDate > toDate) return false

                return true
            })
        }

        return filtered

    }, [staff, debouncedSearch, activeFilters])



    // Stats

    const stats = {

        total: staff.length,

        active: staff.filter(s => s.isActive !== false).length,

        managers: staff.filter(s => s.role === 'manager').length,

        scanners: staff.filter(s => s.role === 'scanner').length,

    }



    // Table Columns

    const columns = [

        {

            id: 'name',

            label: 'الموظف',

            align: 'right',

            format: (value, row) => (

                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <MuiAvatar

                        sx={{

                            width: 40,

                            height: 40,

                            background: 'linear-gradient(135deg, var(--color-icon), var(--color-icon))',

                            color: 'var(--color-text-primary)',

                            fontWeight: 600,

                            fontSize: '0.875rem'

                        }}

                    >

                        {value?.charAt(0).toUpperCase() || 'S'}

                    </MuiAvatar>

                    <MuiBox>

                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>

                            {value}

                        </MuiTypography>

                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

                            {row.role || 'موظف'}

                        </MuiTypography>

                    </MuiBox>

                </MuiBox>

            )

        },

        {

            id: 'role',

            label: 'الدور',

            align: 'center',

            format: (value) => <StaffRoleBadge role={value} />

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

            id: 'joinDate',

            label: 'تاريخ الانضمام',

            align: 'right',

            format: (value, row) => {

                const hireDate = row.staffInfo?.hireDate || value

                return (

                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                        <Calendar size={14} style={{ color: 'var(--color-icon)' }} />

                        <MuiTypography variant="body2">

                            {hireDate ? formatDate(hireDate, 'MM/DD/YYYY') : '—'}

                        </MuiTypography>

                    </MuiBox>

                )

            }

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

                        color: value !== false ? 'var(--color-icon)' : 'var(--color-icon)',

                        fontWeight: 600,

                        border: `1px solid ${value !== false ? 'var(--color-icon)' : 'var(--color-icon)'}33`,

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
        } else {
            // Error notification is handled by handleCreate/useCRUD mutation
            // but we can add secondary handling if needed.
        }
    }

    const handleUpdateSubmit = async (data) => {
        const id = selectedStaff?._id || selectedStaff?.id
        if (!id) return
        const result = await handleUpdate(id, data)
        if (result.success) {
            closeDialog()
        }
    }



    const handleDeleteConfirm = async () => {

        const id = selectedStaff?._id || selectedStaff?.id

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

            <SEOHead title="إدارة المديرين والماسحات" />



            <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>

                {/* Header Section - Premium Welcome Card */}

                <MuiBox

                    sx={{

                        mb: 5,

                        p: { xs: 3, sm: 4.5, md: 5 },

                        borderRadius: '24px',

                        background: 'var(--color-paper)',

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

                                <Users size={36} style={{ color: 'var(--color-text-primary)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />

                            </MuiBox>

                            <MuiBox sx={{ flex: 1 }}>

                                <MuiTypography 

                                    variant="h4" 

                                    sx={{ 

                                        color: 'var(--color-text-primary)', 

                                        fontWeight: 800, 

                                        mb: 1,

                                        fontSize: { xs: '1.5rem', sm: '2rem' },

                                        background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-500))',

                                        WebkitBackgroundClip: 'text',

                                        WebkitTextFillColor: 'transparent',

                                        backgroundClip: 'text',

                                    }}

                                >

                                    إدارة المديرين والماسحات

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

                                    عرض وإدارة جميع المديرين والماسحات

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

                                إضافة مدير أو ماسح

                            </MuiButton>

                        </MuiBox>

                    </MuiBox>

                </MuiBox>



                {/* Stats Cards */}

                <MuiGrid container spacing={3} sx={{ mb: 4.5 }}>

                    <MuiGrid item xs={6} sm={6} md={3}>

                        <MuiPaper

                            elevation={0}

                            sx={{

                                p: 3.5,

                                background: 'var(--color-paper)',

                                backdropFilter: 'blur(20px)',

                                WebkitBackdropFilter: 'blur(20px)',

                                border: '1px solid var(--color-border-glass)',

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

                                    <Users size={28} style={{ color: 'var(--color-text-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />

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

                                        إجمالي الموظفين

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

                    <MuiGrid item xs={6} sm={6} md={3}>

                        <MuiPaper

                            elevation={0}

                            sx={{

                                p: 3.5,

                                background: 'var(--color-paper)',

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

                                    background: 'linear-gradient(90deg, var(--color-icon), transparent)',

                                }

                            }}

                        >

                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                                <MuiBox

                                    sx={{

                                        width: 56,

                                        height: 56,

                                        borderRadius: '14px',

                                        background: 'linear-gradient(135deg, var(--color-icon), var(--color-icon))',

                                        display: 'flex',

                                        alignItems: 'center',

                                        justifyContent: 'center',

                                        boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',

                                    }}

                                >

                                    <UserCheck size={28} style={{ color: 'var(--color-text-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />

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

                                            color: 'var(--color-icon)',

                                            fontSize: '2rem'

                                        }}

                                    >

                                        {stats.active}

                                    </MuiTypography>

                                </MuiBox>

                            </MuiBox>

                        </MuiPaper>

                    </MuiGrid>

                    <MuiGrid item xs={6} sm={6} md={3}>

                        <MuiPaper

                            elevation={0}

                            sx={{

                                p: 3.5,

                                background: 'var(--color-paper)',

                                backdropFilter: 'blur(20px)',

                                WebkitBackdropFilter: 'blur(20px)',

                                border: '1px solid rgba(147, 51, 234, 0.15)',

                                borderRadius: '20px',

                                position: 'relative',

                                overflow: 'hidden',

                                transition: 'all 0.4s ease',

                                '&:hover': {

                                    transform: 'translateY(-4px)',

                                    boxShadow: '0 12px 24px rgba(147, 51, 234, 0.2)',

                                },

                                '&::before': {

                                    content: '""',

                                    position: 'absolute',

                                    top: 0,

                                    left: 0,

                                    right: 0,

                                    height: '3px',

                                    background: 'linear-gradient(90deg, var(--color-icon), transparent)',

                                }

                            }}

                        >

                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                                <MuiBox

                                    sx={{

                                        width: 56,

                                        height: 56,

                                        borderRadius: '14px',

                                        background: 'linear-gradient(135deg, var(--color-icon), var(--color-icon))',

                                        display: 'flex',

                                        alignItems: 'center',

                                        justifyContent: 'center',

                                        boxShadow: '0 8px 20px rgba(147, 51, 234, 0.3)',

                                    }}

                                >

                                    <Shield size={28} style={{ color: 'var(--color-text-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />

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

                                        مدراء

                                    </MuiTypography>

                                    <MuiTypography 

                                        variant="h4" 

                                        sx={{ 

                                            fontWeight: 800,

                                            color: 'var(--color-icon)',

                                            fontSize: '2rem'

                                        }}

                                    >

                                        {stats.managers}

                                    </MuiTypography>

                                </MuiBox>

                            </MuiBox>

                        </MuiPaper>

                    </MuiGrid>

                    <MuiGrid item xs={6} sm={6} md={3}>

                        <MuiPaper

                            elevation={0}

                            sx={{

                                p: 3.5,

                                background: 'var(--color-paper)',

                                backdropFilter: 'blur(20px)',

                                WebkitBackdropFilter: 'blur(20px)',

                                border: '1px solid rgba(59, 130, 246, 0.15)',

                                borderRadius: '20px',

                                position: 'relative',

                                overflow: 'hidden',

                                transition: 'all 0.4s ease',

                                '&:hover': {

                                    transform: 'translateY(-4px)',

                                    boxShadow: '0 12px 24px rgba(59, 130, 246, 0.2)',

                                },

                                '&::before': {

                                    content: '""',

                                    position: 'absolute',

                                    top: 0,

                                    left: 0,

                                    right: 0,

                                    height: '3px',

                                    background: 'linear-gradient(90deg, var(--color-icon), transparent)',

                                }

                            }}

                        >

                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                                <MuiBox

                                    sx={{

                                        width: 56,

                                        height: 56,

                                        borderRadius: '14px',

                                        background: 'linear-gradient(135deg, var(--color-icon), var(--color-icon))',

                                        display: 'flex',

                                        alignItems: 'center',

                                        justifyContent: 'center',

                                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',

                                    }}

                                >

                                    <Briefcase size={28} style={{ color: 'var(--color-text-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />

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

                                        ماسحات

                                    </MuiTypography>

                                    <MuiTypography 

                                        variant="h4" 

                                        sx={{ 

                                            fontWeight: 800,

                                            color: 'var(--color-icon)',

                                            fontSize: '2rem'

                                        }}

                                    >

                                        {stats.scanners}

                                    </MuiTypography>

                                </MuiBox>

                            </MuiBox>

                        </MuiPaper>

                    </MuiGrid>

                </MuiGrid>



                {/* Advanced Filter */}
                <AdvancedFilter
                    onSearch={setSearchQuery}
                    onFilterChange={setActiveFilters}
                    filters={filterConfig}
                    onRefresh={refetch}
                    searchPlaceholder="بحث..."
                />



                {/* Staff Table */}

                <DataTable

                    columns={columns}

                    data={filteredStaff}

                    onView={openViewDialog}

                    onEdit={openEditDialog}

                    onDelete={openDeleteDialog}

                    showActions={true}

                    loading={isLoading}

                    emptyMessage="لا يوجد موظفين"

                    sx={{

                        background: 'var(--color-paper)',

                        backdropFilter: 'blur(20px)',

                        WebkitBackdropFilter: 'blur(20px)',

                        borderRadius: '20px',

                        border: '1px solid var(--color-border-glass)',

                        overflow: 'hidden',

                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',

                    }}

                />



                {/* Dialogs */}

                <CreateEditStaffDialog

                    key={selectedStaff?._id || selectedStaff?.id || 'new'}

                    open={isCreate || isEdit}

                    onClose={closeDialog}

                    onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}

                    editingStaff={isEdit ? selectedStaff : null}

                    loading={crudLoading}

                />



                <ViewStaffDialog

                    open={isView}

                    onClose={closeDialog}

                    staff={selectedStaff}

                />



                <ConfirmDialog

                    open={isDelete}

                    onClose={closeDialog}

                    onConfirm={handleDeleteConfirm}

                    title="حذف الموظف"

                    message={`هل أنت متأكد من حذف الموظف "${selectedStaff?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}

                    confirmLabel="حذف"

                    cancelLabel="إلغاء"

                    loading={crudLoading}

                />

            </MuiBox>

        </>

    )

}



