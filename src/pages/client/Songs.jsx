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
import { SEOHead, LoadingScreen, EmptyState, ConfirmDialog } from '@/components/common'
import { BaseFormDialog, FormField } from '@/components/shared'
import { useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getEventSongs, addSong, updateSong, deleteSong, reorderSongs, getClientDashboard } from '@/api/client'
import { formatDate, formatEmptyValue } from '@/utils/helpers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Music, GripVertical, ArrowUp, ArrowDown, Calendar, Clock, Users, Building2 } from 'lucide-react'
import MuiSwitch from '@/components/ui/MuiSwitch'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import MuiChip from '@/components/ui/MuiChip'
import { Controller } from 'react-hook-form'
import { DataTable } from '@/components/common'

// Validation schema
const songSchema = z.object({
  title: z.string().min(1, 'عنوان الأغنية مطلوب'),
  artist: z.string().min(1, 'اسم الفنان مطلوب'),
  url: z.string().url('رابط غير صحيح').min(1, 'رابط الأغنية مطلوب'),
  duration: z.string().regex(/^\d{2}:\d{2}$/, 'المدة يجب أن تكون بصيغة MM:SS'),
  isExplicit: z.boolean().optional().default(false),
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
    mutationFn: (songOrders) => reorderSongs(selectedEventId, songOrders),
    onSuccess: () => {
      showNotification({
        title: 'نجح',
        message: 'تم إعادة ترتيب الأغاني بنجاح',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId] })
    },
    onError: (error) => {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || 'فشل إعادة ترتيب الأغاني',
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

  // Prepare songs for DataTable
  const songsTableData = useMemo(() => {
    return songs.map((song, index) => ({
      ...song,
      id: song._id || song.id,
      order: song.orderInEvent || index + 1,
    }))
  }, [songs])

  // Handle reorder
  const handleMoveUp = (song) => {
    const currentIndex = songsTableData.findIndex((s) => s.id === song.id)
    if (currentIndex <= 0) return

    // Swap with previous item
    const newOrder = songsTableData.map((s, idx) => {
      if (idx === currentIndex) {
        // Move current item up (decrease order)
        return {
          songId: s._id || s.id,
          newOrder: currentIndex
        }
      } else if (idx === currentIndex - 1) {
        // Move previous item down (increase order)
        return {
          songId: s._id || s.id,
          newOrder: currentIndex + 1
        }
      } else {
        // Keep other items in their current position
        return {
          songId: s._id || s.id,
          newOrder: idx + 1
        }
      }
    })

    reorderMutation.mutate(newOrder)
  }

  const handleMoveDown = (song) => {
    const currentIndex = songsTableData.findIndex((s) => s.id === song.id)
    if (currentIndex >= songsTableData.length - 1) return

    // Swap with next item
    const newOrder = songsTableData.map((s, idx) => {
      if (idx === currentIndex) {
        // Move current item down (increase order)
        return {
          songId: s._id || s.id,
          newOrder: currentIndex + 2
        }
      } else if (idx === currentIndex + 1) {
        // Move next item up (decrease order)
        return {
          songId: s._id || s.id,
          newOrder: currentIndex + 1
        }
      } else {
        // Keep other items in their current position
        return {
          songId: s._id || s.id,
          newOrder: idx + 1
        }
      }
    })

    reorderMutation.mutate(newOrder)
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
              color: 'var(--color-primary-500)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {value.length > 40 ? `${value.substring(0, 40)}...` : value}
          </MuiBox>
        )
      },
    },
    {
      id: 'isExplicit',
      label: 'محتوى صريح',
      format: (value) => {
        return value ? (
          <MuiChip
            label="نعم"
            size="small"
            sx={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#dc2626',
              fontWeight: 600,
            }}
          />
        ) : (
          <MuiChip
            label="لا"
            size="small"
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 600,
            }}
          />
        )
      },
    },
    {
      id: 'scheduledTime',
      label: 'وقت التشغيل',
      format: (value) => {
        if (!value) return '—'
        try {
          return formatDate(value, 'DD/MM/YYYY HH:mm')
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
    {
      id: 'addedBy',
      label: 'أضيف بواسطة',
      format: (value, row) => {
        const addedBy = row.addedBy || value
        if (typeof addedBy === 'object' && addedBy.name) {
          return formatEmptyValue(addedBy.name)
        }
        return '—'
      },
    },
    {
      id: 'notes',
      label: 'ملاحظات',
      format: (value) => {
        if (!value || !value.trim()) return '—'
        return (
          <MuiTypography
            variant="body2"
            sx={{
              color: 'var(--color-text-secondary)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={value}
          >
            {value}
          </MuiTypography>
        )
      },
    },
  ]

  const handleSubmit = async (data) => {
    if (isEdit && editingSong) {
      const result = await handleUpdate(editingSong.id || editingSong._id, data)
      if (result?.success) {
        closeDialog()
      }
    } else {
      const result = await handleCreate(data)
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
            sx={{
              borderRadius: '12px',
              background: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
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
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    showActions={true}
                    loading={false}
                    emptyMessage="لا توجد أغاني"
                    customActions={(row) => (
                      <MuiBox sx={{ display: 'flex', gap: 0.5 }}>
                        <MuiIconButton
                          size="small"
                          onClick={() => handleMoveUp(row)}
                          disabled={songsTableData.findIndex((s) => s.id === row.id) === 0 || reorderMutation.isPending}
                          sx={{
                            background: 'rgba(216, 185, 138, 0.1)',
                            '&:hover': {
                              background: 'rgba(216, 185, 138, 0.2)',
                              color: 'var(--color-primary-500)',
                            },
                            '&:disabled': {
                              opacity: 0.3,
                            },
                          }}
                        >
                          <ArrowUp size={16} />
                        </MuiIconButton>
                        <MuiIconButton
                          size="small"
                          onClick={() => handleMoveDown(row)}
                          disabled={
                            songsTableData.findIndex((s) => s.id === row.id) === songsTableData.length - 1 ||
                            reorderMutation.isPending
                          }
                          sx={{
                            background: 'rgba(216, 185, 138, 0.1)',
                            '&:hover': {
                              background: 'rgba(216, 185, 138, 0.2)',
                              color: 'var(--color-primary-500)',
                            },
                            '&:disabled': {
                              opacity: 0.3,
                            },
                          }}
                        >
                          <ArrowDown size={16} />
                        </MuiIconButton>
                      </MuiBox>
                    )}
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
      isExplicit: editingSong?.isExplicit || false,
      scheduledTime: editingSong?.scheduledTime
        ? new Date(editingSong.scheduledTime).toISOString().slice(0, 16)
        : '',
      notes: editingSong?.notes || '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: editingSong?.title || '',
        artist: editingSong?.artist || '',
        url: editingSong?.url || '',
        duration: editingSong?.duration || '',
        isExplicit: editingSong?.isExplicit || false,
        scheduledTime: editingSong?.scheduledTime
          ? new Date(editingSong.scheduledTime).toISOString().slice(0, 16)
          : '',
        notes: editingSong?.notes || '',
      })
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
        <FormField
          name="title"
          control={control}
          label="عنوان الأغنية"
          errors={errors}
          required
          fullWidth
          gridItemProps={{ xs: 12 }}
        />

        <FormField
          name="artist"
          control={control}
          label="الفنان"
          errors={errors}
          required
          fullWidth
          gridItemProps={{ xs: 12 }}
        />

        <FormField
          name="url"
          control={control}
          label="رابط الأغنية"
          errors={errors}
          type="text"
          required
          fullWidth
          placeholder="https://example.com/song.mp3"
          gridItemProps={{ xs: 12 }}
        />

        <FormField
          name="duration"
          control={control}
          label="المدة (MM:SS)"
          errors={errors}
          type="text"
          required
          fullWidth
          placeholder="04:30"
          gridItemProps={{ xs: 12 }}
        />

        <MuiGrid item xs={12}>
          <Controller
            name="isExplicit"
            control={control}
            render={({ field }) => (
              <MuiFormControlLabel
                control={
                  <MuiSwitch
                    checked={field.value || false}
                    onChange={field.onChange}
                  />
                }
                label="محتوى صريح"
              />
            )}
          />
        </MuiGrid>

        <FormField
          name="scheduledTime"
          control={control}
          label="وقت التشغيل"
          errors={errors}
          type="datetime-local"
          fullWidth
          gridItemProps={{ xs: 12 }}
        />

        <FormField
          name="notes"
          control={control}
          label="ملاحظات"
          errors={errors}
          type="textarea"
          rows={3}
          fullWidth
          gridItemProps={{ xs: 12 }}
        />
      </MuiGrid>
    </BaseFormDialog>
  )
}

