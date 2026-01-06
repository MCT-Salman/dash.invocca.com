// src\pages\manager\StaffManagementNew.jsx
/**
 * Staff Management Page - Enhanced Design
 * إدارة الموظفين - تصميم محسّن ومتجاوب
 */

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth, useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiChip from '@/components/ui/MuiChip'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiTabs from '@/components/ui/MuiTabs'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog, ButtonLoading } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getStaff, deleteStaff, addStaff, updateStaff, getManagerEvents, getEventScanners, addEventScanners, removeEventScanner } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
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
    QrCode,
    Link2,
    Unlink
} from 'lucide-react'

/**
 * Staff Role Badge
 */
function StaffRoleBadge({ role }) {
    const roleConfig = {
        manager: { label: 'مدير', color: '#9333ea', bg: '#f3e8ff', icon: Shield },
        employee: { label: 'موظف', color: '#0284c7', bg: '#e0f2fe', icon: Briefcase },
        supervisor: { label: 'مشرف', color: '#D99B3D', bg: '#FFF8DA', icon: Award },
        scanner: { label: 'مسح', color: '#16a34a', bg: '#dcfce7', icon: Briefcase },
    }

    const config = roleConfig[role] || roleConfig.employee
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
 * Scanner Events Tab Component
 * تبويبة ربط الماسحات مع الفعاليات
 */
function ScannerEventsTab() {
    const { success, error: showError, warning } = useNotification()
    const queryClient = useQueryClient()
    const [selectedEventId, setSelectedEventId] = useState(undefined)
    const [selectedScannerId, setSelectedScannerId] = useState(undefined)
    const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false)
    const [scannerToUnlink, setScannerToUnlink] = useState(null)

    // Fetch events
    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_EVENTS],
        queryFn: getManagerEvents,
    })

    // Fetch staff/scanners
    const { data: staffData, isLoading: staffLoading } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_STAFF],
        queryFn: getStaff,
    })

    // Fetch event scanners when event is selected
    const { data: scannersData, isLoading: scannersLoading, refetch: refetchScanners } = useQuery({
        queryKey: ['manager', 'events', selectedEventId, 'scanners'],
        queryFn: () => getEventScanners(selectedEventId),
        enabled: !!selectedEventId,
        staleTime: 2 * 60 * 1000
    })

    const events = eventsData?.events || eventsData?.data || []
    const allStaff = staffData?.staff || staffData?.data || []
    // Filter scanners - check multiple possible fields
    const scanners = Array.isArray(allStaff) 
        ? allStaff.filter(s => {
            const role = s.role || s.position || s.userRole || ''
            return role === 'scanner' || role === 'Scanner' || role?.toLowerCase() === 'scanner'
        })
        : []
    const eventScanners = scannersData?.data || scannersData || []

    // Add scanner mutation
    const addScannerMutation = useMutation({
        mutationFn: (scannersData) => addEventScanners(selectedEventId, scannersData),
        onSuccess: (data) => {
            // Check if there are failed scanners
            const failedScanners = data?.data?.failed || []
            const successScanners = data?.data?.success || []
            
            // Helper function to clean error messages
            const cleanErrorMessage = (reason) => {
                if (!reason) return 'فشل الربط'
                if (reason.includes('E11000') || reason.includes('duplicate key')) {
                    return 'الماسح معيّن بالفعل لهذه الفعالية'
                }
                return reason
            }
            
            if (failedScanners.length > 0 && successScanners.length === 0) {
                // All failed - show error message
                const failedMessages = failedScanners.map(f => cleanErrorMessage(f.reason))
                showError(`فشل ربط الماسح: ${failedMessages.join('، ')}`)
            } else if (failedScanners.length > 0 && successScanners.length > 0) {
                // Partial success - show warning
                const failedMessages = failedScanners.map(f => cleanErrorMessage(f.reason))
                warning(`تم ربط ${successScanners.length} ماسح بنجاح، وفشل ربط ${failedScanners.length} ماسح: ${failedMessages.join('، ')}`)
                setSelectedScannerId(undefined)
            } else if (successScanners.length > 0) {
                // All success - show success message
                success(`تم ربط ${successScanners.length} ماسح بنجاح`)
                setSelectedScannerId(undefined)
            } else if (failedScanners.length > 0) {
                // Has failures but no successes (edge case)
                const failedMessages = failedScanners.map(f => cleanErrorMessage(f.reason))
                showError(`فشل ربط الماسح: ${failedMessages.join('، ')}`)
            } else {
                // No results at all
                warning('لم يتم ربط أي ماسح')
            }
            
            // Invalidate and refetch scanners
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'scanners'] })
            refetchScanners()
        },
        onError: (error) => {
            let errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء ربط الماسح'
            
            // Handle MongoDB duplicate key errors
            if (errorMessage.includes('E11000') || errorMessage.includes('duplicate key')) {
                errorMessage = 'الماسح معيّن بالفعل لهذه الفعالية'
            } else if (errorMessage.includes('الماسح معيّن بالفعل')) {
                errorMessage = 'الماسح معيّن بالفعل لهذه الفعالية'
            }
            
            showError(errorMessage)
        }
    })

    // Remove scanner mutation
    const removeScannerMutation = useMutation({
        mutationFn: (assignmentId) => removeEventScanner(assignmentId),
        onSuccess: (data) => {
            success(data.message || 'تم فك ربط الماسح بنجاح')
            // Invalidate and refetch scanners
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'scanners'] })
            refetchScanners()
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء فك ربط الماسح'
            showError(errorMessage)
        }
    })

    const handleAddScanner = () => {
        if (!selectedEventId || !selectedScannerId) {
            showError('يرجى اختيار الفعالية والماسح')
            return
        }
        addScannerMutation.mutate({
            scanners: [{ scannerId: selectedScannerId }]
        })
    }

    const handleRemoveScanner = (assignmentId) => {
        if (!assignmentId) return
        const scannerAssignment = eventScanners.find(s => (s._id || s.id) === assignmentId)
        const scanner = scannerAssignment?.scanner || {}
        setScannerToUnlink({ assignmentId, scannerName: scanner.name || scanner.username || 'الماسح' })
        setUnlinkDialogOpen(true)
    }

    const handleUnlinkConfirm = () => {
        if (scannerToUnlink?.assignmentId) {
            removeScannerMutation.mutate(scannerToUnlink.assignmentId)
            setUnlinkDialogOpen(false)
            setScannerToUnlink(null)
        }
    }

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 4,
                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(216, 185, 138, 0.15)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
        >
            <MuiTypography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link2 size={24} style={{ color: 'var(--color-primary-500)' }} />
                ربط الماسحات مع الفعاليات
            </MuiTypography>

            {/* Selection Section */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} md={5}>
                    <MuiFormControl fullWidth>
                        {/* <MuiInputLabel id="event-select-label" sx={{ color: 'var(--color-text-secondary)' }}>اختر الفعالية</MuiInputLabel> */}
                        <MuiSelect
                            labelId="event-select-label"
                            value={selectedEventId || ''}
                            label="اختر الفعالية"
                            onChange={(e) => {
                                setSelectedEventId(e.target.value || undefined)
                                setSelectedScannerId(undefined) // Reset scanner when event changes
                            }}
                            disabled={eventsLoading}
                            renderValue={(value) => {
                                if (!value) return ''
                                const selectedEvent = events.find(e => (e._id || e.id) === value)
                                return selectedEvent 
                                    ? `${selectedEvent.eventName || selectedEvent.name || 'فعالية'} - ${formatDate(selectedEvent.eventDate || selectedEvent.date)}`
                                    : ''
                            }}
                            sx={{
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                color: 'var(--color-text-primary-dark)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(216, 185, 138, 0.15)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '& .MuiSelect-select': {
                                    padding: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '1.4375em',
                                },
                                '& .MuiSelect-select:empty': {
                                    color: 'transparent !important',
                                },
                                '& .MuiSelect-select:empty::before': {
                                    content: '""',
                                    display: 'none',
                                },
                                '& input': {
                                    display: 'none !important',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'var(--color-text-secondary)',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    color: 'var(--color-text-secondary)',
                                }
                            }}
                        >
                            {eventsLoading ? (
                                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
                            ) : events.length === 0 ? (
                                <MuiMenuItem value="" disabled>لا توجد فعاليات</MuiMenuItem>
                            ) : (
                                events.map(event => (
                                    <MuiMenuItem key={event._id || event.id} value={event._id || event.id}>
                                        {event.eventName || event.name || 'فعالية'} - {formatDate(event.eventDate || event.date)}
                                    </MuiMenuItem>
                                ))
                            )}
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12} md={5}>
                    <MuiFormControl fullWidth>
                        {/* <MuiInputLabel id="scanner-select-label" sx={{ color: 'var(--color-text-secondary)' }}>اختر الماسح</MuiInputLabel> */}
                        <MuiSelect
                            labelId="scanner-select-label"
                            value={selectedScannerId || ''}
                            label="اختر الماسح"
                            onChange={(e) => {
                                setSelectedScannerId(e.target.value || undefined)
                            }}
                            disabled={staffLoading || !selectedEventId || addScannerMutation.isPending}
                            renderValue={(value) => {
                                if (!value) return ''
                                const selectedScanner = scanners.find(s => (s._id || s.id) === value)
                                return selectedScanner 
                                    ? (selectedScanner.name || selectedScanner.username || 'ماسح بدون اسم')
                                    : ''
                            }}
                            sx={{
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                color: 'var(--color-text-primary-dark)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(216, 185, 138, 0.15)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '& .MuiSelect-select': {
                                    padding: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '1.4375em',
                                },
                                '& .MuiSelect-select:empty': {
                                    color: 'transparent !important',
                                },
                                '& .MuiSelect-select:empty::before': {
                                    content: '""',
                                    display: 'none',
                                },
                                '& input': {
                                    display: 'none !important',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'var(--color-text-secondary)',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    color: 'var(--color-text-secondary)',
                                }
                            }}
                        >
                            {staffLoading ? (
                                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
                            ) : scanners.length === 0 ? (
                                <MuiMenuItem value="" disabled>لا توجد ماسحات متاحة</MuiMenuItem>
                            ) : (
                                scanners
                                    .filter(scanner => !eventScanners.some(s => (s.scanner?._id || s.scanner?.id) === (scanner._id || scanner.id)))
                                    .map(scanner => (
                                        <MuiMenuItem key={scanner._id || scanner.id} value={scanner._id || scanner.id}>
                                            {scanner.name || scanner.username || 'ماسح بدون اسم'}
                                        </MuiMenuItem>
                                    ))
                            )}
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12} md={2}>
                    <MuiButton
                        fullWidth
                        variant="contained"
                        startIcon={addScannerMutation.isPending ? <ButtonLoading size={20} /> : <Plus size={20} />}
                        onClick={handleAddScanner}
                        disabled={!selectedEventId || !selectedScannerId || addScannerMutation.isPending}
                        loading={addScannerMutation.isPending}
                        sx={{
                            height: '56px',
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            color: 'white',
                            fontWeight: 700,
                            borderRadius: '14px',
                            boxShadow: '0 8px 20px rgba(216, 185, 138, 0.4)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 28px rgba(216, 185, 138, 0.5)',
                            },
                            '&:disabled': {
                                background: 'rgba(216, 185, 138, 0.3)',
                            }
                        }}
                    >
                        {addScannerMutation.isPending ? 'جاري الربط...' : 'ربط'}
                    </MuiButton>
                </MuiGrid>
            </MuiGrid>

            {/* Event Scanners List */}
            {selectedEventId && (
                <MuiBox>
                    <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
                        الماسحات المرتبطة بالفعالية
                    </MuiTypography>
                    
                    {scannersLoading ? (
                        <MuiPaper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                جاري التحميل...
                            </MuiTypography>
                        </MuiPaper>
                    ) : eventScanners.length === 0 ? (
                        <MuiPaper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                            <QrCode size={32} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 8px', opacity: 0.5 }} />
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                لا توجد ماسحات مرتبطة بهذه الفعالية
                            </MuiTypography>
                        </MuiPaper>
                    ) : (
                        <MuiGrid container spacing={2}>
                            {eventScanners.map((scannerAssignment) => {
                                const scanner = scannerAssignment.scanner || {}
                                const assignmentId = scannerAssignment._id || scannerAssignment.id
                                return (
                                    <MuiGrid item xs={12} sm={6} md={4} key={assignmentId}>
                                        <MuiPaper sx={{ 
                                            p: 2.5, 
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                            border: '1px solid rgba(216, 185, 138, 0.15)', 
                                            borderRadius: '12px',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                            }
                                        }}>
                                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <MuiBox sx={{ flex: 1 }}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <QrCode size={18} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                                            {scanner.name || scanner.username || 'ماسح بدون اسم'}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                    {scanner.phone && (
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Phone size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                {scanner.phone}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    )}
                                                    {scannerAssignment.stats && (
                                                        <MuiBox sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            <MuiChip
                                                                label={`${scannerAssignment.stats.totalScans || 0} مسح`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                                    color: 'var(--color-primary-400)',
                                                                    fontSize: '0.7rem',
                                                                    height: 20
                                                                }}
                                                            />
                                                            {scannerAssignment.role && (
                                                                <MuiChip
                                                                    label={scannerAssignment.role === 'main' ? 'رئيسي' : scannerAssignment.role}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: scannerAssignment.role === 'main' 
                                                                            ? 'rgba(22, 163, 74, 0.1)' 
                                                                            : 'rgba(216, 185, 138, 0.1)',
                                                                        color: scannerAssignment.role === 'main' 
                                                                            ? '#16a34a' 
                                                                            : 'var(--color-primary-400)',
                                                                        fontSize: '0.7rem',
                                                                        height: 20
                                                                    }}
                                                                />
                                                            )}
                                                        </MuiBox>
                                                    )}
                                                </MuiBox>
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => handleRemoveScanner(assignmentId)}
                                                    disabled={removeScannerMutation.isPending}
                                                    sx={{
                                                        color: 'var(--color-error-500)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(220, 38, 38, 0.1)'
                                                        },
                                                        '&:disabled': {
                                                            opacity: 0.6
                                                        }
                                                    }}
                                                >
                                                    {removeScannerMutation.isPending && scannerToUnlink?.assignmentId === assignmentId ? (
                                                        <ButtonLoading size={16} />
                                                    ) : (
                                                        <Unlink size={16} />
                                                    )}
                                                </MuiIconButton>
                                            </MuiBox>
                                        </MuiPaper>
                                    </MuiGrid>
                                )
                            })}
                        </MuiGrid>
                    )}
                </MuiBox>
            )}

            {!selectedEventId && (
                <MuiPaper sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                    <Link2 size={48} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                        اختر فعالية لعرض الماسحات المرتبطة بها
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                        يمكنك ربط ماسحات جديدة أو فك ربط الماسحات الموجودة
                    </MuiTypography>
                </MuiPaper>
            )}

            {/* Unlink Confirmation Dialog */}
            <ConfirmDialog
                open={unlinkDialogOpen}
                onClose={() => {
                    setUnlinkDialogOpen(false)
                    setScannerToUnlink(null)
                }}
                onConfirm={handleUnlinkConfirm}
                title="فك ربط الماسح"
                message={`هل أنت متأكد من فك ربط الماسح "${scannerToUnlink?.scannerName}" من هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="فك الربط"
                cancelLabel="إلغاء"
                confirmColor="error"
                loading={removeScannerMutation.isPending}
            />
        </MuiPaper>
    )
}

/**
 * Main Staff Management Component
 */
export default function StaffManagement() {
    const { user } = useAuth()
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeTab, setActiveTab] = useState(0)

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

    // Filter staff
    const filteredStaff = useMemo(() => {
        let filtered = Array.isArray(staff) ? staff : []

        if (debouncedSearch) {
            filtered = filtered.filter(member =>
                member.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                member.phone?.includes(debouncedSearch) ||
                member.role?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        return filtered
    }, [staff, debouncedSearch])

    // Stats
    const stats = {
        total: staff.length,
        active: staff.filter(s => s.isActive !== false).length,
        managers: staff.filter(s => s.role === 'manager').length,
        employees: staff.filter(s => s.role === 'employee').length,
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
                            background: 'linear-gradient(135deg, #FFE36C, #ffd93d)',
                            color: '#1A1A1A',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                    >
                        {value?.charAt(0).toUpperCase() || 'S'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
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
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} style={{ color: '#FFE36C' }} />
                    <MuiTypography variant="body2">
                        {value ? new Date(value).toLocaleDateString('ar-SA') : '—'}
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
            <SEOHead title="إدارة الموظفين" />

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
                                    إدارة الموظفين
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
                                    عرض وإدارة جميع الموظفين والمشرفين
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
                                إضافة موظف جديد
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
                    <MuiGrid item xs={6} sm={6} md={3}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
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
                                    background: 'linear-gradient(90deg, #9333ea, transparent)',
                                }
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(147, 51, 234, 0.3)',
                                    }}
                                >
                                    <Shield size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
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
                                            color: '#9333ea',
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
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
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
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                                    }}
                                >
                                    <Briefcase size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
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
                                        موظفين
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800,
                                            color: '#3b82f6',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {stats.employees}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                </MuiGrid>

                {/* Tabs */}
                <MuiPaper
                    elevation={0}
                    sx={{
                        mb: 4.5,
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <MuiTabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        tabs={[
                            { label: 'قائمة الموظفين', icon: <Users size={18} /> },
                            { label: 'ربط الماسحات', icon: <Link2 size={18} /> }
                        ]}
                        sx={{
                            borderBottom: '1px solid rgba(216, 185, 138, 0.15)',
                            '& .MuiTab-root': {
                                color: 'var(--color-text-secondary)',
                                '&.Mui-selected': {
                                    color: 'var(--color-primary-500)',
                                }
                            }
                        }}
                    />
                </MuiPaper>

                {/* Tab Content */}
                {activeTab === 0 ? (
                    <>
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
                                placeholder="البحث عن موظف (الاسم، الهاتف، الدور)..."
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
                            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    />
                    </>
                ) : (
                    <ScannerEventsTab />
                )}

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

