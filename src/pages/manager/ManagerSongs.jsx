// src\pages\manager\ManagerSongs.jsx
/**
 * Manager Songs Playlist Management Page
 * إدارة قائمة التشغيل للأغاني في الفعاليات
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiTabs from '@/components/ui/MuiTabs'
import MuiChip from '@/components/ui/MuiChip'
import { SEOHead, LoadingScreen, EmptyState, DataTable, ConfirmDialog } from '@/components/common'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getManagerEvents, getEventPlaylist, addEventPlaylistSong, deleteEventPlaylistSong, getHallSongs } from '@/api/manager'
import { useState, useMemo } from 'react'
import { Plus, Music, Trash2, Search, Link2 } from 'lucide-react'
import { useNotification, useDialogState } from '@/hooks'
import { formatDate } from '@/utils/helpers'
import EventSongsConnectionTab from './components/EventSongsConnectionTab'

export default function ManagerSongs() {
    const { addNotification: showNotification } = useNotification()
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState(0)
    const [selectedEvent, setSelectedEvent] = useState('')

    // Dialog state management
    const {
        selectedItem: songToDelete,
        openDeleteDialog,
        closeDialog,
        isDelete,
    } = useDialogState()

    // Form state for adding songs
    const [formData, setFormData] = useState({
        songId: '',
        momentType: '',
        notes: '',
    })

    // Fetch all events
    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['manager', 'events'],
        queryFn: () => getManagerEvents(),
        staleTime: 5 * 60 * 1000,
    })

    const events = useMemo(() => {
        if (Array.isArray(eventsData?.events)) return eventsData.events
        if (Array.isArray(eventsData?.data)) return eventsData.data
        if (Array.isArray(eventsData)) return eventsData
        return []
    }, [eventsData])

    // Fetch playlist for selected event
    const { data: playlistData, isLoading: playlistLoading } = useQuery({
        queryKey: ['manager', 'events', selectedEvent, 'playlist'],
        queryFn: () => getEventPlaylist(selectedEvent),
        enabled: !!selectedEvent,
        staleTime: 2 * 60 * 1000,
    })

    const playlist = useMemo(() => {
        if (Array.isArray(playlistData?.data)) return playlistData.data
        if (Array.isArray(playlistData?.songs)) return playlistData.songs
        if (Array.isArray(playlistData)) return playlistData
        return []
    }, [playlistData])

    // Fetch all hall songs to pick from
    const { data: hallSongsData } = useQuery({
        queryKey: ['manager', 'hall-songs'],
        queryFn: getHallSongs,
        enabled: !!selectedEvent,
        staleTime: 5 * 60 * 1000,
    })

    const hallSongs = useMemo(() => {
        if (Array.isArray(hallSongsData?.data)) return hallSongsData.data
        if (Array.isArray(hallSongsData?.songs)) return hallSongsData.songs
        if (Array.isArray(hallSongsData)) return hallSongsData
        return []
    }, [hallSongsData])

    // Mutations
    const addMutation = useMutation({
        mutationFn: (payload) => addEventPlaylistSong(selectedEvent, payload),
        onSuccess: () => {
            showNotification({
                title: 'نجاح',
                message: 'تم إضافة الأغنية لقائمة التشغيل بنجاح',
                type: 'success',
            })
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEvent, 'playlist'] })
            setFormData({ songId: '', momentType: '', notes: '' })
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'فشل في إضافة الأغنية',
                type: 'error',
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: ({ playlistId }) => deleteEventPlaylistSong(selectedEvent, playlistId),
        onSuccess: () => {
            showNotification({
                title: 'نجاح',
                message: 'تم حذف الأغنية من قائمة التشغيل بنجاح',
                type: 'success',
            })
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEvent, 'playlist'] })
            closeDialog()
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'فشل في حذف الأغنية',
                type: 'error',
            })
        },
    })

    // Handlers
    const handleAdd = (e) => {
        e?.preventDefault?.()
        if (!formData.songId) {
            showNotification({
                title: 'تنبيه',
                message: 'يرجى اختيار أغنية',
                type: 'warning',
            })
            return
        }

        const payload = {
            songId: formData.songId,
            momentType: formData.momentType || undefined,
            notes: formData.notes || undefined,
        }

        addMutation.mutate(payload)
    }

    const handleDeleteConfirm = () => {
        if (!songToDelete) return
        deleteMutation.mutate({
            playlistId: songToDelete?._id || songToDelete?.id,
        })
    }

    // Table columns
    const columns = [
        {
            id: 'title',
            label: 'الأغنية',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Music size={18} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}
                        >
                            {value || row.song?.title || 'أغنية'}
                        </MuiTypography>
                        <MuiTypography
                            variant="caption"
                            sx={{ color: 'var(--color-text-secondary)' }}
                        >
                            {row.artist || row.song?.artist || ''}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            ),
        },
        {
            id: 'momentType',
            label: 'نوع اللحظة',
            align: 'center',
            format: (value) => {
                const config = {
                    entrance: { label: 'دخول', color: 'primary' },
                    dance: { label: 'رقصة', color: 'secondary' },
                    background: { label: 'خلفية', color: 'info' },
                    other: { label: 'أخرى', color: 'default' },
                }
                const item = config[value]
                if (!item && !value) return '—'
                return (
                    <MuiChip
                        label={item?.label || value}
                        color={item?.color}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                )
            },
        },
        {
            id: 'notes',
            label: 'ملاحظات',
            align: 'left',
            format: (value) => value || '—',
        },
        {
            id: 'createdAt',
            label: 'تاريخ الإضافة',
            align: 'center',
            format: (value) => (value ? formatDate(value, 'DD/MM/YYYY HH:mm') : '—'),
        },
    ]

    if (eventsLoading) {
        return <LoadingScreen message="جاري تحميل الفعاليات..." />
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
            <SEOHead title="إدارة أغاني الفعاليات | INVOCCA" />

            {/* Header */}
            <MuiBox sx={{ mb: 4 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <MuiBox
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-primary-500)',
                        }}
                    >
                        <Music size={26} style={{ color: '#fff' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography
                            variant="h4"
                            sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}
                        >
                            إدارة أغاني الفعاليات
                        </MuiTypography>
                        <MuiTypography
                            variant="body2"
                            sx={{ color: 'var(--color-primary-300)' }}
                        >
                            ربط الأغاني بقوائم التشغيل للفعاليات
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

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
                        { label: 'إدارة الأغاني', icon: <Music size={18} /> },
                        { label: 'ربط الأغاني', icon: <Link2 size={18} /> }
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
                    {/* Event Selection */}
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                        }}
                    >
                        <MuiTypography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            اختر الفعالية
                        </MuiTypography>
                        <MuiFormControl fullWidth>
                            <MuiSelect
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                displayEmpty
                            >
                                <MuiMenuItem value="" disabled>
                                    اختر الفعالية لإدارة أغانيها
                                </MuiMenuItem>
                                {events.map((event) => {
                                    const eventId = event._id || event.id
                                    const eventName = event.eventName || event.name || `فعالية ${eventId}`
                                    return (
                                        <MuiMenuItem key={eventId} value={eventId}>
                                            {eventName}
                                        </MuiMenuItem>
                                    )
                                })}
                            </MuiSelect>
                        </MuiFormControl>
                    </MuiPaper>

                    {selectedEvent ? (
                        <>
                            {playlistLoading ? (
                                <LoadingScreen message="جاري تحميل قائمة الأغاني..." fullScreen={false} />
                            ) : (
                                <>
                                    {/* Add Song Form */}
                                    <MuiPaper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            mb: 3,
                                            borderRadius: '16px',
                                            background: 'var(--color-surface-dark)',
                                            border: '1px solid var(--color-border-glass)',
                                        }}
                                    >
                                        <MuiTypography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                            إضافة أغنية لقائمة التشغيل
                                        </MuiTypography>
                                        <MuiGrid container spacing={2}>
                                            <MuiGrid item xs={12} md={4}>
                                                <MuiSelect
                                                    fullWidth
                                                    value={formData.songId}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, songId: e.target.value }))
                                                    }
                                                    displayEmpty
                                                >
                                                    <MuiMenuItem value="">
                                                        <em>اختر الأغنية</em>
                                                    </MuiMenuItem>
                                                    {hallSongs.map((song) => {
                                                        const id = song._id || song.id
                                                        return (
                                                            <MuiMenuItem key={id} value={id}>
                                                                {song.title || song.name || `أغنية ${id}`}
                                                                {song.artist && ` - ${song.artist}`}
                                                            </MuiMenuItem>
                                                        )
                                                    })}
                                                </MuiSelect>
                                            </MuiGrid>
                                            <MuiGrid item xs={12} md={3}>
                                                <MuiSelect
                                                    fullWidth
                                                    value={formData.momentType}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, momentType: e.target.value }))
                                                    }
                                                    displayEmpty
                                                >
                                                    <MuiMenuItem value="">
                                                        <em>نوع اللحظة (اختياري)</em>
                                                    </MuiMenuItem>
                                                    <MuiMenuItem value="entrance">دخول</MuiMenuItem>
                                                    <MuiMenuItem value="dance">رقصة</MuiMenuItem>
                                                    <MuiMenuItem value="background">خلفية</MuiMenuItem>
                                                    <MuiMenuItem value="other">أخرى</MuiMenuItem>
                                                </MuiSelect>
                                            </MuiGrid>
                                            <MuiGrid item xs={12} md={4}>
                                                <MuiTextField
                                                    fullWidth
                                                    label="ملاحظات (اختياري)"
                                                    value={formData.notes}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                                                    }
                                                />
                                            </MuiGrid>
                                            <MuiGrid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                                <MuiButton
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<Plus size={18} />}
                                                    onClick={handleAdd}
                                                    disabled={addMutation.isPending}
                                                >
                                                    إضافة
                                                </MuiButton>
                                            </MuiGrid>
                                        </MuiGrid>
                                    </MuiPaper>

                                    {/* Playlist Table */}
                                    <MuiPaper
                                        elevation={0}
                                        sx={{
                                            borderRadius: '16px',
                                            border: '1px solid var(--color-border-glass)',
                                            background: 'var(--color-surface-dark)',
                                        }}
                                    >
                                        {playlist.length > 0 ? (
                                            <DataTable
                                                columns={columns}
                                                data={playlist}
                                                showActions
                                                onDelete={openDeleteDialog}
                                                emptyMessage="لا توجد أغاني في قائمة التشغيل"
                                            />
                                        ) : (
                                            <EmptyState
                                                title="لا توجد أغاني"
                                                description="لم تتم إضافة أي أغاني لهذه الفعالية بعد."
                                                icon={Music}
                                                showPaper={false}
                                            />
                                        )}
                                    </MuiPaper>

                                    {/* Delete Confirmation */}
                                    <ConfirmDialog
                                        open={isDelete}
                                        onClose={closeDialog}
                                        onConfirm={handleDeleteConfirm}
                                        title="حذف أغنية من قائمة التشغيل"
                                        message={
                                            songToDelete
                                                ? `هل أنت متأكد من حذف الأغنية "${songToDelete.title || songToDelete.song?.title || ''}" من قائمة التشغيل؟`
                                                : ''
                                        }
                                        confirmText="حذف"
                                        cancelText="إلغاء"
                                        loading={deleteMutation.isPending}
                                        confirmColor="error"
                                        icon={Trash2}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            title="اختر فعالية"
                            description="يرجى اختيار الفعالية لإدارة أغانيها"
                            icon={Music}
                        />
                    )}
                </>
            ) : (
                <EventSongsConnectionTab />
            )}
        </MuiBox>
    )
}
