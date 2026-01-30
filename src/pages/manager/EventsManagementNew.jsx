// src\pages\manager\EventsManagementNew.jsx
/**
 * Events Management Page - Enhanced Design
 * إدارة الفعاليات - تصميم محسّن ومتجاوب
 */

import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiChip from '@/components/ui/MuiChip'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerEvents, deleteEvent, createEvent, updateEvent, getEventScanners, addEventScanners, removeEventScanner } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import ViewEventDialog from './components/ViewEventDialog'
import CreateEditEventDialog from './components/CreateEditEventDialog'
import {
    Calendar,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Users,
    Clock,
    MapPin,
    MoreVertical,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    LayoutDashboard,
    RefreshCw
} from 'lucide-react'

/**
 * Event Status Badge
 */
function EventStatusBadge({ status }) {
    const statusConfig = {
        pending: { label: 'قيد الانتظار', color: '#D99B3D', bg: '#FFF8DA' },
        confirmed: { label: 'مؤكد', color: '#0284c7', bg: '#e0f2fe' },
        in_progress: { label: 'جاري', color: '#9333ea', bg: '#f3e8ff' },
        completed: { label: 'مكتمل', color: '#16a34a', bg: '#dcfce7' },
        cancelled: { label: 'ملغي', color: '#dc2626', bg: '#fee2e2' }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
        <MuiChip
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
 * Event Card Component - Premium Design
 */
function EventCard({ event, onEdit, onView }) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                borderRadius: '20px',
                border: '1px solid var(--color-border-glass)',
                background: 'var(--color-paper)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(216, 185, 138, 0.2)',
                    borderColor: 'rgba(216, 185, 138, 0.5)',
                }
            }}
        >
            {/* Header with gradient */}
            <MuiBox 
                sx={{ 
                    p: 3.5,
                    background: 'linear-gradient(135deg, var(--color-border-glass), rgba(255, 227, 108, 0.08))',
                    borderBottom: '1px solid var(--color-border-glass)',
                }}
            >
                <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <MuiBox sx={{ flex: 1 }}>
                        <MuiTypography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'var(--color-text-primary)', 
                                mb: 1,
                                fontSize: '1.1rem',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {event.eventName || event.name}
                        </MuiTypography>
                        <MuiTypography 
                            variant="body2" 
                            sx={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.85rem'
                            }}
                        >
                            {typeof (event.eventType || event.type) === 'object'
                                ? ((event.eventType || event.type).label || (event.eventType || event.type).name || String(event.eventType || event.type))
                                : (event.eventType || event.type || 'فعالية')}
                        </MuiTypography>
                    </MuiBox>
                    <EventStatusBadge status={event.status} />
                </MuiBox>
            </MuiBox>

            {/* Content */}
            <MuiBox sx={{ p: 3.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Date & Time */}
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: 'var(--color-border-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Calendar size={18} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiTypography 
                        variant="body2" 
                        sx={{ 
                            color: 'var(--color-text-primary)',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    >
                        {formatDate(event.eventDate || event.date, 'MM/DD/YYYY')}
                    </MuiTypography>
                </MuiBox>

                {event.startTime && (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBox
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                background: 'var(--color-border-glass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Clock size={18} style={{ color: 'var(--color-primary-500)' }} />
                        </MuiBox>
                        <MuiTypography 
                            variant="body2" 
                            sx={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.85rem'
                            }}
                        >
                            {event.startTime} - {event.endTime}
                        </MuiTypography>
                    </MuiBox>
                )}

                {/* Guests */}
                {event.guestCount && (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBox
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                background: 'var(--color-border-glass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Users size={18} style={{ color: 'var(--color-primary-500)' }} />
                        </MuiBox>
                        <MuiTypography 
                            variant="body2" 
                            sx={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.85rem'
                            }}
                        >
                            {event.guestCount} ضيف
                        </MuiTypography>
                    </MuiBox>
                )}

                {/* Client */}
                {event.client && (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBox
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                background: 'var(--color-border-glass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MapPin size={18} style={{ color: 'var(--color-primary-500)' }} />
                        </MuiBox>
                        <MuiTypography 
                            variant="body2" 
                            sx={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.85rem'
                            }}
                        >
                            {event.client.name || event.clientName}
                        </MuiTypography>
                    </MuiBox>
                )}
            </MuiBox>

            {/* Actions */}
            <MuiBox 
                sx={{ 
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderTop: '1px solid var(--color-border-glass)',
                    display: 'flex',
                    gap: 1.5
                }}
            >
                <MuiButton
                    size="small"
                    variant="outlined"
                    startIcon={<Eye size={16} />}
                    onClick={() => onView(event)}
                    sx={{
                        flex: 1,
                        borderColor: 'rgba(216, 185, 138, 0.3)',
                        color: 'var(--color-primary-500)',
                        fontWeight: 600,
                        borderRadius: '12px',
                        '&:hover': {
                            borderColor: 'var(--color-primary-500)',
                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    عرض
                </MuiButton>
                <MuiButton
                    size="small"
                    variant="outlined"
                    startIcon={<Edit2 size={16} />}
                    onClick={() => onEdit(event)}
                    sx={{
                        flex: 1,
                        borderColor: 'rgba(216, 185, 138, 0.3)',
                        color: 'var(--color-primary-500)',
                        fontWeight: 600,
                        borderRadius: '12px',
                        '&:hover': {
                            borderColor: 'var(--color-primary-500)',
                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    تعديل
                </MuiButton>
            </MuiBox>
        </MuiPaper>
    )
}

/**
 * Main Events Management Component
 */
export default function EventsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotification()

    // Dialog state management
    const {
        selectedItem: selectedEvent,
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
        createFn: createEvent,
        updateFn: updateEvent,
        deleteFn: deleteEvent,
        queryKey: QUERY_KEYS.MANAGER_EVENTS,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    // Fetch events
    const { data: eventsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_EVENTS,
        queryFn: getManagerEvents,
    })

    // Memoize events to avoid dependency issues
    const events = useMemo(() => {
        // Handle different response structures
        if (Array.isArray(eventsData?.data)) {
            return eventsData.data
        } else if (Array.isArray(eventsData?.events)) {
            return eventsData.events
        } else if (Array.isArray(eventsData)) {
            return eventsData
        }
        return []
    }, [eventsData])

    // Filter events
    const filteredEvents = useMemo(() => {
        let filtered = Array.isArray(events) ? events : []

        if (debouncedSearch) {
            filtered = filtered.filter(event =>
                (event.eventName || event.name)?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                event.clientName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (event.client?.name)?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        return filtered
    }, [events, debouncedSearch])

    // Stats
    const stats = useMemo(() => ({
        total: events.length,
        pending: events.filter(e => e.status === 'pending').length,
        confirmed: events.filter(e => e.status === 'confirmed').length,
        completed: events.filter(e => e.status === 'completed').length,
    }), [events])

    // Table Columns
    const columns = [
        {
            id: 'eventName',
            label: 'الفعالية',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'rgba(216, 185, 138, 0.1)',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                        }}
                    >
                        <Calendar size={20} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            {value || row.name}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.eventType || 'فعالية'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'eventDate',
            label: 'التاريخ',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2">{formatDate(value || row.date, 'MM/DD/YYYY') || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'clientName',
            label: 'العميل',
            align: 'right',
            format: (value, row) => (
                <MuiTypography variant="body2">{value || row.client?.name || '—'}</MuiTypography>
            )
        },
        {
            id: 'guestCount',
            label: 'عدد الضيوف',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Users size={14} style={{ color: '#FFE36C' }} />
                    <MuiTypography variant="body2">{value || 0}</MuiTypography>
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
        const id = selectedEvent?._id || selectedEvent?.id
        if (!id) return

        // Separate scanners from other data
        const scanners = data.scanners || []
        const eventDataWithoutScanners = { ...data }
        delete eventDataWithoutScanners.scanners

        // Update event data (without scanners)
        const result = await handleUpdate(id, eventDataWithoutScanners)
        
        if (result.success) {
            // Get current scanners from API
            try {
                const currentScannersResponse = await getEventScanners(id)
                const currentScanners = Array.isArray(currentScannersResponse?.scanners)
                    ? currentScannersResponse.scanners
                    : Array.isArray(currentScannersResponse?.data)
                        ? currentScannersResponse.data
                        : Array.isArray(currentScannersResponse)
                            ? currentScannersResponse
                            : []

                // Extract current scanner IDs
                const currentScannerIds = currentScanners
                    .map(s => (s.scanner?._id || s.scanner?.id || s.scannerId?._id || s.scannerId || s._id)?.toString())
                    .filter(Boolean)

                // Extract new scanner IDs from form
                const newScannerIds = scanners
                    .map(s => (s.scannerId || '').toString().trim())
                    .filter(Boolean)

                // Find scanners to add (in new but not in current)
                const scannersToAdd = newScannerIds.filter(id => !currentScannerIds.includes(id))
                
                // Find scanners to remove (in current but not in new)
                const scannersToRemove = currentScanners.filter(s => {
                    const scannerId = (s.scanner?._id || s.scanner?.id || s.scannerId?._id || s.scannerId || s._id)?.toString()
                    return scannerId && !newScannerIds.includes(scannerId)
                })

                // Remove scanners
                for (const scannerAssignment of scannersToRemove) {
                    const assignmentId = scannerAssignment._id || scannerAssignment.id
                    if (assignmentId) {
                        try {
                            await removeEventScanner(assignmentId)
                        } catch (error) {
                            console.error('Error removing scanner:', error)
                        }
                    }
                }

                // Add new scanners
                if (scannersToAdd.length > 0) {
                    try {
                        await addEventScanners(id, {
                            scanners: scannersToAdd.map(scannerId => ({ scannerId }))
                        })
                    } catch (error) {
                        console.error('Error adding scanners:', error)
                        showError('تم تحديث الفعالية لكن حدث خطأ في تحديث الماسحات')
                    }
                }

                // Invalidate queries to refresh data
                queryClient.invalidateQueries({ queryKey: ['manager', 'events', id, 'scanners'] })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MANAGER_EVENTS })
            } catch (error) {
                console.error('Error updating scanners:', error)
                showError('تم تحديث الفعالية لكن حدث خطأ في تحديث الماسحات')
            }

            closeDialog()
        }
    }

    const handleDeleteConfirm = async () => {
        const id = selectedEvent?._id || selectedEvent?.id
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
            <SEOHead title="إدارة الفعاليات" />

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
                                <Calendar size={36} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
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
                                    إدارة الفعاليات
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
                                    عرض وإدارة جميع الفعاليات والحجوزات
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
                                إضافة فعالية جديدة
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
                            <MuiTypography 
                                variant="caption" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)', 
                                    mb: 1.5,
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    display: 'block'
                                }}
                            >
                                إجمالي الفعاليات
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
                                border: '1px solid rgba(217, 155, 61, 0.15)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(217, 155, 61, 0.2)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #D99B3D, transparent)',
                                }
                            }}
                        >
                            <MuiTypography 
                                variant="caption" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)', 
                                    mb: 1.5,
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    display: 'block'
                                }}
                            >
                                قيد الانتظار
                            </MuiTypography>
                            <MuiTypography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800,
                                    color: '#D99B3D',
                                    fontSize: '2rem'
                                }}
                            >
                                {stats.pending}
                            </MuiTypography>
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
                                    background: 'linear-gradient(90deg, #3b82f6, transparent)',
                                }
                            }}
                        >
                            <MuiTypography 
                                variant="caption" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)', 
                                    mb: 1.5,
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    display: 'block'
                                }}
                            >
                                مؤكدة
                            </MuiTypography>
                            <MuiTypography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800,
                                    color: '#3b82f6',
                                    fontSize: '2rem'
                                }}
                            >
                                {stats.confirmed}
                            </MuiTypography>
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
                                    background: 'linear-gradient(90deg, #16a34a, transparent)',
                                }
                            }}
                        >
                            <MuiTypography 
                                variant="caption" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)', 
                                    mb: 1.5,
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    display: 'block'
                                }}
                            >
                                مكتملة
                            </MuiTypography>
                            <MuiTypography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800,
                                    color: '#16a34a',
                                    fontSize: '2rem'
                                }}
                            >
                                {stats.completed}
                            </MuiTypography>
                        </MuiPaper>
                    </MuiGrid>
                </MuiGrid>

                {/* Search & Filters */}
                <MuiPaper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4.5,
                        background: 'var(--color-paper)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <MuiBox sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <MuiTextField
                            placeholder="البحث عن فعالية..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--color-border-glass)',
                                    '&:hover': {
                                        borderColor: 'rgba(216, 185, 138, 0.3)',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: 'var(--color-primary-500)',
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'var(--color-text-primary)',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <MuiInputAdornment position="start">
                                        <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
                                    </MuiInputAdornment>
                                ),
                            }}
                        />
                    </MuiBox>
                </MuiPaper>

                {/* Events Table */}
                <DataTable
                    columns={columns}
                    data={filteredEvents}
                    onView={openViewDialog}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    showActions={true}
                    loading={isLoading}
                    emptyMessage="لا توجد فعاليات"
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
                <CreateEditEventDialog
                    key={selectedEvent?._id || selectedEvent?.id || 'new'}
                    open={isCreate || isEdit}
                    onClose={closeDialog}
                    onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
                    editingEvent={isEdit ? selectedEvent : null}
                    loading={crudLoading}
                />

                <ViewEventDialog
                    open={isView}
                    onClose={closeDialog}
                    event={selectedEvent}
                />

                <ConfirmDialog
                    open={isDelete}
                    onClose={closeDialog}
                    onConfirm={handleDeleteConfirm}
                    title="حذف الفعالية"
                    message={`هل أنت متأكد من حذف الفعالية "${selectedEvent?.eventName || selectedEvent?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                    confirmLabel="حذف"
                    cancelLabel="إلغاء"
                    loading={crudLoading}
                />
            </MuiBox>
        </>
    )
}

