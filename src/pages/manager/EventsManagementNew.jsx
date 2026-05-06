// src\pages\manager\EventsManagementNew.jsx
import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { LoadingScreen, SEOHead, CrudPageLayout, ConfirmDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerEvents, deleteEvent, createEvent, updateEvent } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import ViewEventDialog from './components/ViewEventDialog'
import CreateEditEventDialog from './components/CreateEditEventDialog'
import {
    Calendar,
    Users,
    Clock,
    LayoutDashboard,
} from 'lucide-react'

export default function EventsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const { success, error: showError } = useNotification()

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

    const { data: eventsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_EVENTS,
        queryFn: getManagerEvents,
    })

    const events = useMemo(() => {
        return eventsData?.data || eventsData?.events || eventsData || []
    }, [eventsData])

    const filteredEvents = useMemo(() => {
        let filtered = Array.isArray(events) ? events : []
        if (debouncedSearch) {
            filtered = filtered.filter(event =>
                (event.name || event.eventName)?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (event.client?.name || event.clientName)?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }
        return filtered
    }, [events, debouncedSearch])

    const columns = [
        {
            id: 'name',
            label: 'الفعالية',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ bgcolor: 'var(--color-icon)', fontWeight: 700 }}>
                        <Calendar size={20} />
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value || row.eventName}</MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{row.client?.name || row.clientName}</MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'date',
            label: 'التاريخ',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Clock size={14} style={{ color: 'var(--color-icon)' }} />
                    <MuiTypography variant="body2">{formatDate(value)}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'guestCount',
            label: 'المدعوين',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Users size={14} style={{ color: 'var(--color-text-secondary)' }} />
                    <MuiTypography variant="body2">{value || 0}</MuiTypography>
                </MuiBox>
            )
        }
    ]

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة الفعاليات | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي الفعاليات', value: events.length, icon: <Calendar size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredEvents}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                addButtonLabel="فعالية جديدة"
            />

            <CreateEditEventDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedEvent._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingEvent={selectedEvent}
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
                onConfirm={async () => {
                    const result = await handleDelete(selectedEvent._id)
                    if (result.success) closeDialog()
                }}
                title="حذف فعالية"
                message={`هل أنت متأكد من حذف الفعالية "${selectedEvent?.name || selectedEvent?.eventName}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
