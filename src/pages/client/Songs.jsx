// src\pages\client\Songs.jsx
/**
 * Client Songs Management Page
 * صفحة إدارة الأغاني للعميل
 */

import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiIconButton from '@/components/ui/MuiIconButton'
import Tooltip from '@mui/material/Tooltip'
import { SEOHead, LoadingScreen, EmptyState, ConfirmDialog } from '@/components/common'
import { BaseFormDialog, BaseViewDialog } from '@/components/shared'
import MuiTextField from '@/components/ui/MuiTextField'
import { useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getEventSongs, addSong, updateSong, deleteSong, reorderSongs, getClientDashboard } from '@/api/client'
import { formatDate, formatEmptyValue } from '@/utils/helpers'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Music, GripVertical, ArrowUp, ArrowDown, Calendar, Clock, Users, Building2, ExternalLink, Eye, Link as LinkIcon, FileText } from 'lucide-react'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { DataTable } from '@/components/common'

// Validation schema
const songSchema = z.object({
  title: z.string().min(1, 'عنوان الأغنية مطلوب'),
  artist: z.string().min(1, 'اسم الفنان مطلوب'),
  url: z.string().url('رابط غير صحيح').min(1, 'رابط الأغنية مطلوب'),
  duration: z.string().regex(/^\d{2}:\d{2}$/, 'المدة يجب أن تكون بصيغة MM:SS'),
  scheduledTime: z.string().optional(),
  notes: z.string().optional(),
})

export default function ClientSongs() {
  const [selectedEventId, setSelectedEventId] = useState('')
  const { addNotification: showNotification } = useNotification()
  const queryClient = useQueryClient()

  // Dialog state management
  const {
    selectedItem: editingSong,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isEdit,
    isDelete,
  } = useDialogState()

  // View dialog state
  const [viewingSong, setViewingSong] = useState(null)
  const isView = !!viewingSong

  const handleView = (song) => {
    setViewingSong(song)
  }

  const handleCloseView = () => {
    setViewingSong(null)
  }

  // Animation state for reordering
  const [animatingRows, setAnimatingRows] = useState({})

  // Fetch events to populate event selector (using dashboard endpoint)
  const { data: dashboardData, isLoading: eventsLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  // Fetch songs for selected event
  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId],
    queryFn: () => getEventSongs(selectedEventId),
    enabled: !!selectedEventId,
  })

  // CRUD operations
  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: (data) => addSong(selectedEventId, data),
    updateFn: (songId, data) => updateSong(songId, data),
    deleteFn: deleteSong,
    queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId],
    successMessage: 'تمت العملية بنجاح',
    errorMessage: 'حدث خطأ أثناء العملية',
  })

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (songOrders) => {
      if (!selectedEventId) {
        throw new Error('يجب اختيار فعالية أولاً')
      }
      return reorderSongs(selectedEventId, songOrders)
    },
    onSuccess: (response) => {
      showNotification({
        title: 'نجح',
        message: 'تم إعادة ترتيب الأغاني بنجاح',
        type: 'success',
      })
      // Update the cache directly with the new data from response
      if (response?.data && Array.isArray(response.data)) {
        queryClient.setQueryData([QUERY_KEYS.CLIENT_SONGS, selectedEventId], { data: response.data })
      } else {
        // Fallback to invalidate if response structure is different
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId] })
      }
    },
    onError: (error) => {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || error?.message || 'فشل إعادة ترتيب الأغاني',
        type: 'error',
      })
    },
  })

  // Extract events from dashboard response - handle different response structures
  const events = useMemo(() => {
    const responseData = dashboardData?.data || dashboardData || {}
    // Get events from different possible locations (same as Dashboard)
    return responseData.allEvents || responseData.recentActivity?.events || responseData.events || []
  }, [dashboardData])
  
  // Memoize songs to avoid dependency issues - handle different response structures
  const songs = useMemo(() => {
    if (Array.isArray(songsData?.data)) {
      return songsData.data
    } else if (Array.isArray(songsData?.songs)) {
      return songsData.songs
    } else if (Array.isArray(songsData)) {
      return songsData
    }
    return []
  }, [songsData])

  // Prepare songs for DataTable - sort by orderInEvent
  const songsTableData = useMemo(() => {
    const sortedSongs = [...songs].sort((a, b) => {
      const orderA = a.orderInEvent || 0
      const orderB = b.orderInEvent || 0
      return orderA - orderB
    })
    return sortedSongs.map((song, index) => ({
      ...song,
      id: song._id || song.id,
      order: song.orderInEvent || index + 1,
    }))
  }, [songs])

  // Handle reorder with animation
  const handleMoveUp = (song) => {
    const currentIndex = songsTableData.findIndex((s) => s.id === song.id)
    if (currentIndex <= 0) return

    const previousSong = songsTableData[currentIndex - 1]
    const currentSong = songsTableData[currentIndex]

    // Set animation states
    setAnimatingRows({
      [currentSong.id]: 'move-up',
      [previousSong.id]: 'move-down',
    })

    // Swap orders: move current up (to previous position), previous down (to current position)
    // newOrder is 1-based (starts from 1)
    // currentIndex is 0-based, so:
    // - currentIndex = 0 means position 1 (1-based)
    // - currentIndex = 1 means position 2 (1-based)
    // To move current up: newOrder = currentIndex (which is previous position in 1-based)
    // To move previous down: newOrder = currentIndex + 1 (which is current position in 1-based)
    const songOrders = [
      {
        songId: currentSong._id || currentSong.id,
        newOrder: currentIndex, // Move to previous position (1-based: currentIndex = previous position)
      },
      {
        songId: previousSong._id || previousSong.id,
        newOrder: currentIndex + 1, // Move to current position (1-based: currentIndex + 1 = current position)
      },
    ]

    reorderMutation.mutate(songOrders, {
      onSuccess: () => {
        // Clear animation after transition
        setTimeout(() => {
          setAnimatingRows({})
        }, 500)
      },
      onError: () => {
        // Clear animation on error
        setAnimatingRows({})
      },
    })
  }

  const handleMoveDown = (song) => {
    const currentIndex = songsTableData.findIndex((s) => s.id === song.id)
    if (currentIndex >= songsTableData.length - 1) return

    const currentSong = songsTableData[currentIndex]
    const nextSong = songsTableData[currentIndex + 1]

    // Set animation states
    setAnimatingRows({
      [currentSong.id]: 'move-down',
      [nextSong.id]: 'move-up',
    })

    // Swap orders: move current down (to next position), next up (to current position)
    // newOrder is 1-based (starts from 1)
    // currentIndex is 0-based, so:
    // - currentIndex = 0 means position 1 (1-based)
    // - currentIndex = 1 means position 2 (1-based)
    // To move current down: newOrder = currentIndex + 2 (which is next position in 1-based)
    // To move next up: newOrder = currentIndex + 1 (which is current position in 1-based)
    const songOrders = [
      {
        songId: currentSong._id || currentSong.id,
        newOrder: currentIndex + 2, // Move to next position (1-based: currentIndex + 2 = next position)
      },
      {
        songId: nextSong._id || nextSong.id,
        newOrder: currentIndex + 1, // Move to current position (1-based: currentIndex + 1 = current position)
      },
    ]

    reorderMutation.mutate(songOrders, {
      onSuccess: () => {
        // Clear animation after transition
        setTimeout(() => {
          setAnimatingRows({})
        }, 500)
      },
      onError: () => {
        // Clear animation on error
        setAnimatingRows({})
      },
    })
  }

  const columns = [
    {
      id: 'order',
      label: '#',
      format: (value, row) => row.orderInEvent || value || '—',
      width: '60px',
    },
    {
      id: 'title',
      label: 'عنوان الأغنية',
      format: (value) => formatEmptyValue(value),
    },
    {
      id: 'artist',
      label: 'الفنان',
      format: (value) => formatEmptyValue(value),
    },
    {
      id: 'duration',
      label: 'المدة',
      format: (value) => formatEmptyValue(value),
    },
    {
      id: 'url',
      label: 'الرابط',
      format: (value) => {
        if (!value) return '—'
        return (
          <MuiBox
            component="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-500)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--color-primary-400)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Tooltip title={`فتح الرابط: ${value}`}>
              <MuiIconButton
                size="small"
                sx={{
                  color: 'var(--color-primary-500)',
                  '&:hover': {
                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                    color: 'var(--color-primary-400)',
                  },
                }}
              >
                <ExternalLink size={18} />
              </MuiIconButton>
            </Tooltip>
          </MuiBox>
        )
      },
    },
    {
      id: 'scheduledTime',
      label: 'وقت التشغيل',
      format: (value) => {
        if (!value) return '—'
        try {
          return formatDate(value, 'MM/DD/YYYY HH:mm')
        } catch {
          return formatEmptyValue(value)
        }
      },
    },
    {
      id: 'playStatus',
      label: 'حالة التشغيل',
      format: (value) => {
        const statusMap = {
          playing: 'قيد التشغيل',
          paused: 'متوقف',
          played: 'تم تشغيلها',
          pending: 'في الانتظار',
        }
        const statusLabel = statusMap[value] || formatEmptyValue(value)
        const statusColor = value === 'playing' ? '#22c55e' : value === 'played' ? '#0284c7' : value === 'paused' ? '#f97316' : 'var(--color-text-secondary)'
        return (
          <MuiChip
            label={statusLabel}
            size="small"
            sx={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
              fontWeight: 600,
            }}
          />
        )
      },
    },
  ]

  const handleSubmit = async (data) => {
    // Prepare data with only required fields
    const submitData = {
      title: data.title,
      artist: data.artist,
      url: data.url,
      duration: data.duration,
      scheduledTime: data.scheduledTime ? new Date(data.scheduledTime).toISOString() : undefined,
      notes: data.notes || undefined,
    }
    
    // Remove undefined fields
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined) {
        delete submitData[key]
      }
    })

    if (isEdit && editingSong) {
      const result = await handleUpdate(editingSong.id || editingSong._id, submitData)
      if (result?.success) {
        closeDialog()
      }
    } else {
      const result = await handleCreate(submitData)
      if (result?.success) {
        closeDialog()
      }
    }
  }

  const handleDeleteConfirm = async () => {
    const id = editingSong?.id || editingSong?._id
    if (!id) return
    const result = await handleDelete(id)
    if (result?.success) {
      closeDialog()
    }
  }

  if (eventsLoading) {
    return <LoadingScreen message="جاري تحميل الفعاليات..." fullScreen={false} />
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="إدارة الأغاني - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          إدارة الأغاني
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          إدارة قائمة تشغيل الأغاني لفعالياتك
        </MuiTypography>
      </MuiBox>

      {/* Event Selection */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiFormControl fullWidth sx={{ maxWidth: 400 }}>
          <MuiSelect
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            displayEmpty
          >
            <MuiMenuItem value="" disabled>
              اختر الفعالية
            </MuiMenuItem>
            {events.map((event) => (
              <MuiMenuItem key={event._id || event.id} value={event._id || event.id}>
                {formatEmptyValue(event.name || event.eventName)} - {formatDate(event.date || event.eventDate)}
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </MuiFormControl>
      </MuiBox>

      {selectedEventId ? (
        <>
          {/* Event Info Card */}
          {(() => {
            const selectedEvent = events.find(e => (e._id || e.id) === selectedEventId)
            if (!selectedEvent) return null
            
            const eventTypeLabels = {
              wedding: 'زفاف',
              birthday: 'عيد ميلاد',
              engagement: 'خطوبة',
              graduation: 'تخرج',
              corporate: 'فعالية شركات',
              other: 'أخرى'
            }
            
            return (
              <MuiPaper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  background: 'var(--color-surface-dark)',
                  border: '1px solid var(--color-border-glass)',
                  borderRadius: '20px',
                }}
              >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <MuiBox>
                    <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
                      {formatEmptyValue(selectedEvent.name || selectedEvent.eventName)}
                    </MuiTypography>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <MuiChip
                        label={eventTypeLabels[selectedEvent.type || selectedEvent.eventType] || selectedEvent.type || selectedEvent.eventType || 'فعالية'}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(216, 185, 138, 0.1)',
                          color: 'var(--color-primary-500)',
                          fontWeight: 600,
                        }}
                      />
                      {selectedEvent.status && (
                        <MuiChip
                          label={selectedEvent.status}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                            color: 'var(--color-primary-500)',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </MuiBox>
                  </MuiBox>
                </MuiBox>

                <MuiGrid container spacing={2}>
                  {selectedEvent.date || selectedEvent.eventDate ? (
                    <MuiGrid item xs={12} sm={6} md={3}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={20} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiBox>
                          <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            التاريخ
                          </MuiTypography>
                          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {formatDate(selectedEvent.date || selectedEvent.eventDate, 'DD/MM/YYYY')}
                          </MuiTypography>
                        </MuiBox>
                      </MuiBox>
                    </MuiGrid>
                  ) : null}
                  {selectedEvent.startTime ? (
                    <MuiGrid item xs={12} sm={6} md={3}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={20} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiBox>
                          <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            الوقت
                          </MuiTypography>
                          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {selectedEvent.startTime && selectedEvent.endTime 
                              ? `${selectedEvent.startTime} - ${selectedEvent.endTime}` 
                              : selectedEvent.startTime || '—'}
                          </MuiTypography>
                        </MuiBox>
                      </MuiBox>
                    </MuiGrid>
                  ) : null}
                  {selectedEvent.guestCount !== undefined ? (
                    <MuiGrid item xs={12} sm={6} md={3}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={20} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiBox>
                          <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            عدد الضيوف
                          </MuiTypography>
                          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {formatEmptyValue(selectedEvent.guestCount)}
                          </MuiTypography>
                        </MuiBox>
                      </MuiBox>
                    </MuiGrid>
                  ) : null}
                  {selectedEvent.hall?.name || selectedEvent.hallId?.name ? (
                    <MuiGrid item xs={12} sm={6} md={3}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={20} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiBox>
                          <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            القاعة
                          </MuiTypography>
                          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {formatEmptyValue(selectedEvent.hall?.name || selectedEvent.hallId?.name)}
                          </MuiTypography>
                        </MuiBox>
                      </MuiBox>
                    </MuiGrid>
                  ) : null}
                </MuiGrid>
              </MuiPaper>
            )
          })()}

          {songsLoading ? (
            <LoadingScreen message="جاري تحميل الأغاني..." fullScreen={false} />
          ) : (
            <>
              {/* Actions */}
              <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                  الأغاني ({songs.length})
                </MuiTypography>
                <MuiButton
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={openCreateDialog}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                    color: '#1A1A1A',
                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                    },
                  }}
                >
                  أغنية جديدة
                </MuiButton>
              </MuiBox>

              {/* Songs Table */}
              {songs.length > 0 ? (
                <MuiPaper
                  elevation={0}
                  sx={{
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <DataTable
                    columns={columns}
                    data={songsTableData}
                    onView={handleView}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    showActions={true}
                    loading={false}
                    emptyMessage="لا توجد أغاني"
                    animatingRows={animatingRows}
                    customActions={(row) => {
                      const currentIndex = songsTableData.findIndex((s) => s.id === row.id)
                      const isFirst = currentIndex === 0
                      const isLast = currentIndex === songsTableData.length - 1
                      const isPending = reorderMutation.isPending
                      
                      return (
                        <MuiBox sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Tooltip title="نقل لأعلى">
                            <span>
                              <MuiIconButton
                                size="small"
                                onClick={() => handleMoveUp(row)}
                                disabled={isFirst || isPending}
                                sx={{
                                  color: isFirst ? 'var(--color-text-muted)' : 'var(--color-primary-500)',
                                  background: isFirst ? 'transparent' : 'rgba(216, 185, 138, 0.1)',
                                  border: '1px solid',
                                  borderColor: isFirst ? 'var(--color-border-dark)' : 'rgba(216, 185, 138, 0.3)',
                                  '&:hover:not(:disabled)': {
                                    background: 'rgba(216, 185, 138, 0.2)',
                                    borderColor: 'var(--color-primary-500)',
                                    transform: 'translateY(-2px)',
                                  },
                                  '&:disabled': {
                                    opacity: 0.3,
                                    cursor: 'not-allowed',
                                  },
                                }}
                              >
                                <ArrowUp size={16} />
                              </MuiIconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="نقل لأسفل">
                            <span>
                              <MuiIconButton
                                size="small"
                                onClick={() => handleMoveDown(row)}
                                disabled={isLast || isPending}
                                sx={{
                                  color: isLast ? 'var(--color-text-muted)' : 'var(--color-primary-500)',
                                  background: isLast ? 'transparent' : 'rgba(216, 185, 138, 0.1)',
                                  border: '1px solid',
                                  borderColor: isLast ? 'var(--color-border-dark)' : 'rgba(216, 185, 138, 0.3)',
                                  '&:hover:not(:disabled)': {
                                    background: 'rgba(216, 185, 138, 0.2)',
                                    borderColor: 'var(--color-primary-500)',
                                    transform: 'translateY(2px)',
                                  },
                                  '&:disabled': {
                                    opacity: 0.3,
                                    cursor: 'not-allowed',
                                  },
                                }}
                              >
                                <ArrowDown size={16} />
                              </MuiIconButton>
                            </span>
                          </Tooltip>
                        </MuiBox>
                      )
                    }}
                  />
                </MuiPaper>
              ) : (
                <EmptyState
                  title="لا توجد أغاني"
                  description="ابدأ بإضافة أغاني لهذه الفعالية"
                  icon={Music}
                />
              )}
            </>
          )}
        </>
      ) : (
        <EmptyState
          title="اختر فعالية"
          description="يرجى اختيار فعالية لإدارة أغانيها"
          icon={Music}
        />
      )}

      {/* Add/Edit Song Dialog */}
      <CreateEditSongDialog
        open={isCreate || isEdit}
        onClose={closeDialog}
        editingSong={isEdit ? editingSong : null}
        onSubmit={handleSubmit}
        loading={crudLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="حذف الأغنية"
        message={`هل أنت متأكد من حذف الأغنية "${editingSong?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        loading={crudLoading}
      />

      {/* View Song Dialog */}
      <ViewSongDialog
        open={isView}
        onClose={handleCloseView}
        song={viewingSong}
      />
    </MuiBox>
  )
}

// Create/Edit Song Dialog Component
function CreateEditSongDialog({ open, onClose, editingSong, onSubmit, loading }) {
  const isEdit = !!editingSong
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: editingSong?.title || '',
      artist: editingSong?.artist || '',
      url: editingSong?.url || '',
      duration: editingSong?.duration || '',
      scheduledTime: editingSong?.scheduledTime
        ? new Date(editingSong.scheduledTime).toISOString().slice(0, 16)
        : '',
      notes: editingSong?.notes || '',
    },
  })

  useEffect(() => {
    if (open) {
      if (editingSong) {
        // Format scheduledTime correctly for datetime-local input
        let formattedScheduledTime = ''
        if (editingSong.scheduledTime) {
          try {
            const date = new Date(editingSong.scheduledTime)
            if (!isNaN(date.getTime())) {
              // Get local datetime string in YYYY-MM-DDTHH:mm format
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              const hours = String(date.getHours()).padStart(2, '0')
              const minutes = String(date.getMinutes()).padStart(2, '0')
              formattedScheduledTime = `${year}-${month}-${day}T${hours}:${minutes}`
            }
          } catch (error) {
            console.error('Error formatting scheduledTime:', error)
          }
        }

        reset({
          title: editingSong.title || '',
          artist: editingSong.artist || '',
          url: editingSong.url || '',
          duration: editingSong.duration || '',
          scheduledTime: formattedScheduledTime,
          notes: editingSong.notes || '',
        }, {
          keepDefaultValues: false
        })
      } else {
        // Reset to empty for create mode
        reset({
          title: '',
          artist: '',
          url: '',
          duration: '',
          scheduledTime: '',
          notes: '',
        }, {
          keepDefaultValues: false
        })
      }
    }
  }, [open, editingSong, reset])

  return (
    <BaseFormDialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'تعديل الأغنية' : 'إضافة أغنية جديدة'}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      submitText={isEdit ? 'تحديث' : 'إضافة'}
      cancelText="إلغاء"
      maxWidth="sm"
    >
      <MuiGrid container spacing={3}>
        <MuiGrid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="عنوان الأغنية"
                required
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="artist"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="الفنان"
                required
                fullWidth
                error={!!errors.artist}
                helperText={errors.artist?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="رابط الأغنية"
                type="text"
                required
                fullWidth
                placeholder="https://example.com/song.mp3"
                error={!!errors.url}
                helperText={errors.url?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="المدة (MM:SS)"
                type="text"
                required
                fullWidth
                placeholder="04:30"
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="scheduledTime"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="وقت التشغيل"
                type="datetime-local"
                fullWidth
                error={!!errors.scheduledTime}
                helperText={errors.scheduledTime?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <MuiTextField
                {...field}
                label="ملاحظات"
                multiline
                rows={3}
                fullWidth
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            )}
          />
        </MuiGrid>
      </MuiGrid>
    </BaseFormDialog>
  )
}

// View Song Dialog Component
function ViewSongDialog({ open, onClose, song }) {
  if (!song) return null

  const headerImage = (
    <MuiBox sx={{ height: '192px', width: '100%', backgroundColor: 'var(--color-bg-dark)', position: 'relative' }}>
      <MuiBox sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(255, 227, 108, 0.1))' }}>
        <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>
          {song.title?.[0]?.toUpperCase() || 'S'}
        </MuiTypography>
      </MuiBox>
      <MuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
      <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16, color: '#fff' }}>
        <MuiTypography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {formatEmptyValue(song.title)}
        </MuiTypography>
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Music size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
          <MuiTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            أغنية
          </MuiTypography>
        </MuiBox>
      </MuiBox>
    </MuiBox>
  )

  return (
    <BaseViewDialog
      open={open && !!song}
      onClose={onClose}
      maxWidth="md"
      headerImage={headerImage}
    >
      <MuiGrid container spacing={3}>
        {/* Basic Info */}
        <MuiGrid item xs={12}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Music size={20} style={{ color: 'var(--color-primary-500)' }} />
            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
              معلومات الأغنية
            </MuiTypography>
          </MuiBox>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
              عنوان الأغنية
            </MuiTypography>
            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
              {formatEmptyValue(song.title)}
            </MuiTypography>
          </MuiBox>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
              الفنان
            </MuiTypography>
            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
              {formatEmptyValue(song.artist)}
            </MuiTypography>
          </MuiBox>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
              المدة
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} style={{ color: 'var(--color-primary-500)' }} />
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                {formatEmptyValue(song.duration) || '—'}
              </MuiTypography>
            </MuiBox>
          </MuiBox>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
              وقت التشغيل
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} style={{ color: 'var(--color-primary-500)' }} />
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                {song.scheduledTime
                  ? formatDate(song.scheduledTime, 'MM/DD/YYYY HH:mm')
                  : '—'}
              </MuiTypography>
            </MuiBox>
          </MuiBox>
        </MuiGrid>

        <MuiGrid item xs={12}>
          <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
        </MuiGrid>

        {/* Link */}
        <MuiGrid item xs={12}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>
              رابط الأغنية
            </MuiTypography>
            {song.url ? (
              <MuiBox
                component="a"
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'var(--color-primary-500)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(216, 185, 138, 0.1)',
                  border: '1px solid rgba(216, 185, 138, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(216, 185, 138, 0.2)',
                    borderColor: 'var(--color-primary-500)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <LinkIcon size={16} />
                <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>
                  {song.url.length > 50 ? `${song.url.substring(0, 50)}...` : song.url}
                </MuiTypography>
                <ExternalLink size={14} />
              </MuiBox>
            ) : (
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                —
              </MuiTypography>
            )}
          </MuiBox>
        </MuiGrid>

        {/* Play Status */}
        <MuiGrid item xs={12} sm={6}>
          <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
              حالة التشغيل
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {song.playStatus && (
                <MuiChip
                  label={
                    song.playStatus === 'playing' ? 'قيد التشغيل' :
                    song.playStatus === 'paused' ? 'متوقف' :
                    song.playStatus === 'played' ? 'تم تشغيلها' :
                    song.playStatus === 'pending' ? 'في الانتظار' :
                    song.playStatus
                  }
                  size="small"
                  sx={{
                    backgroundColor: song.playStatus === 'playing' ? 'rgba(34, 197, 94, 0.1)' :
                                    song.playStatus === 'played' ? 'rgba(2, 132, 199, 0.1)' :
                                    song.playStatus === 'paused' ? 'rgba(249, 115, 22, 0.1)' :
                                    'rgba(216, 185, 138, 0.1)',
                    color: song.playStatus === 'playing' ? '#22c55e' :
                           song.playStatus === 'played' ? '#0284c7' :
                           song.playStatus === 'paused' ? '#f97316' :
                           'var(--color-primary-400)',
                    fontWeight: 600,
                  }}
                />
              )}
            </MuiBox>
          </MuiBox>
        </MuiGrid>

        {/* Order in Event */}
        {song.orderInEvent !== undefined && (
          <MuiGrid item xs={12} sm={6}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                ترتيب في الفعالية
              </MuiTypography>
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                {song.orderInEvent}
              </MuiTypography>
            </MuiBox>
          </MuiGrid>
        )}

        {/* Is Explicit */}
        {song.isExplicit !== undefined && (
          <MuiGrid item xs={12} sm={6}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                محتوى صريح
              </MuiTypography>
              <MuiChip
                label={song.isExplicit ? 'نعم' : 'لا'}
                size="small"
                sx={{
                  backgroundColor: song.isExplicit ? 'rgba(220, 38, 38, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: song.isExplicit ? '#dc2626' : '#22c55e',
                  fontWeight: 600,
                }}
              />
            </MuiBox>
          </MuiGrid>
        )}

        {/* Added By */}
        {song.addedBy && (
          <MuiGrid item xs={12} sm={6}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                أضيف بواسطة
              </MuiTypography>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={16} style={{ color: 'var(--color-primary-500)' }} />
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                  {typeof song.addedBy === 'object' ? song.addedBy.name : song.addedBy}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
        )}

        {/* Created At */}
        {song.createdAt && (
          <MuiGrid item xs={12} sm={6}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                تاريخ الإنشاء
              </MuiTypography>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} style={{ color: 'var(--color-primary-500)' }} />
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                  {formatDate(song.createdAt, 'MM/DD/YYYY HH:mm')}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
        )}

        {/* Updated At */}
        {song.updatedAt && song.updatedAt !== song.createdAt && (
          <MuiGrid item xs={12} sm={6}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                آخر تحديث
              </MuiTypography>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} style={{ color: 'var(--color-primary-500)' }} />
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
                  {formatDate(song.updatedAt, 'MM/DD/YYYY HH:mm')}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
        )}

        {/* Notes */}
        {song.notes && (
          <>
            <MuiGrid item xs={12}>
              <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)' }} />
            </MuiGrid>
            <MuiGrid item xs={12}>
              <MuiBox>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FileText size={16} style={{ color: 'var(--color-primary-500)' }} />
                  <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    الملاحظات
                  </MuiTypography>
                </MuiBox>
                <MuiBox
                  sx={{
                    padding: 2,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(216, 185, 138, 0.05)',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                  }}
                >
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', whiteSpace: 'pre-wrap' }}>
                    {song.notes}
                  </MuiTypography>
                </MuiBox>
              </MuiBox>
            </MuiGrid>
          </>
        )}
      </MuiGrid>
    </BaseViewDialog>
  )
}

