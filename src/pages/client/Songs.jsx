// src\pages\client\Songs.jsx
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
import { SEOHead, LoadingScreen, EmptyState, ConfirmDialog, DataTable } from '@/components/common'
import { BaseFormDialog } from '@/components/shared'
import MuiTextField from '@/components/ui/MuiTextField'
import { useDialogState, useCRUD, useNotification } from '@/hooks'
import { useClient } from '@/providers/ClientProvider'
import { QUERY_KEYS } from '@/config/constants'
import { getEventSongs, addSong, updateSong, deleteSong, getClientDashboard } from '@/api/client'
import { formatDate } from '@/utils/helpers'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Music, Calendar, Clock, Users, ChevronLeft } from 'lucide-react'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'

const songSchema = z.object({
  title: z.string().min(1, 'عنوان الأغنية مطلوب'),
  artist: z.string().min(1, 'اسم الفنان مطلوب'),
  momentType: z.string().optional(),
  notes: z.string().optional(),
})

export default function ClientSongs() {
  const { selectedEventId, selectEvent } = useClient()
  const { success, error: showError } = useNotification()
  const queryClient = useQueryClient()

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

  const { data: dashboardData, isLoading: eventsLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId],
    queryFn: () => getEventSongs(selectedEventId),
    enabled: !!selectedEventId,
  })

  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: (data) => addSong(selectedEventId, data),
    updateFn: (songId, data) => updateSong(selectedEventId, songId, data),
    deleteFn: (songId) => deleteSong(selectedEventId, songId),
    queryKey: [QUERY_KEYS.CLIENT_SONGS, selectedEventId],
    successMessage: 'تمت العملية بنجاح',
  })

  const events = useMemo(() => {
    const d = dashboardData?.data || dashboardData || {}
    const evs = d.allEvents || d.events || (Array.isArray(d) ? d : [])
    return Array.isArray(evs) ? evs : []
  }, [dashboardData])

  const currentEvent = useMemo(() => events.find(e => (e._id || e.id) === selectedEventId), [events, selectedEventId])
  
  const songs = useMemo(() => {
    const s = songsData?.songs || songsData?.data || (Array.isArray(songsData) ? songsData : [])
    return Array.isArray(s) ? s : []
  }, [songsData])

  const { control, handleSubmit: formSubmit, reset } = useForm({
    resolver: zodResolver(songSchema),
    defaultValues: { title: '', artist: '', momentType: 'background', notes: '' }
  })

  useEffect(() => {
    if (editingSong) reset(editingSong)
    else reset({ title: '', artist: '', momentType: 'background', notes: '' })
  }, [editingSong, reset])

  const onFormSubmit = formSubmit(async (formData) => {
    const res = isEdit ? await handleUpdate(editingSong._id, formData) : await handleCreate(formData)
    if (res.success) closeDialog()
  })

  const columns = [
    {
      id: 'title',
      label: 'الأغنية',
      align: 'right',
      format: (value, row) => (
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Music size={18} style={{ color: 'var(--color-icon)' }} />
          <MuiBox>
            <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{row.artist}</MuiTypography>
          </MuiBox>
        </MuiBox>
      )
    },
    {
      id: 'momentType',
      label: 'اللحظة',
      align: 'center',
      format: (v) => {
        const map = { entrance: 'دخول', dance: 'رقصة', background: 'خلفية', other: 'أخرى' }
        return <MuiChip label={map[v] || v || '—'} size="small" variant="outlined" />
      }
    }
  ]

  if (eventsLoading) return <LoadingScreen />

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="إدارة الأغاني | INVOCCA" />

      <MuiBox sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MuiBox>
          <MuiTypography variant="h4" sx={{ fontWeight: 900, color: 'var(--color-icon)', mb: 1 }}>قائمة الأغاني</MuiTypography>
          <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
            إدارة قائمة تشغيل الأغاني لـ {currentEvent?.name || 'المناسبة'}
          </MuiTypography>
        </MuiBox>
        <MuiBox sx={{ display: 'flex', gap: 2 }}>
          <MuiButton variant="outlined" onClick={() => selectEvent(null)} startIcon={<ChevronLeft />}>تغيير المناسبة</MuiButton>
          <MuiButton variant="contained" startIcon={<Plus />} onClick={openCreateDialog} disabled={!selectedEventId}>إضافة أغنية</MuiButton>
        </MuiBox>
      </MuiBox>

      {!selectedEventId ? (
        <EmptyState title="يرجى اختيار مناسبة أولاً" description="يجب اختيار مناسبة من لوحة التحكم لإدارة الأغاني الخاصة بها" icon={Music} />
      ) : (
        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12} md={3}>
             <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>المناسبة المختارة</MuiTypography>
                <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{currentEvent?.name}</MuiTypography>
                <MuiDivider sx={{ mb: 3 }} />
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Calendar size={18} style={{ color: 'var(--color-icon)' }} />
                        <MuiTypography variant="body2">{formatDate(currentEvent?.date)}</MuiTypography>
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Users size={18} style={{ color: 'var(--color-icon)' }} />
                        <MuiTypography variant="body2">{currentEvent?.capacity} ضيف</MuiTypography>
                    </MuiBox>
                </MuiBox>
             </MuiPaper>
          </MuiGrid>
          <MuiGrid item xs={12} md={9}>
            <MuiPaper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              {songsLoading ? <LoadingScreen fullScreen={false} /> : songs.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={songs}
                  showActions
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ) : <EmptyState title="لا توجد أغاني مضافة" description="ابدأ بإضافة الأغاني الخاصة بمناسبتك" icon={Music} showPaper={false} />}
            </MuiPaper>
          </MuiGrid>
        </MuiGrid>
      )}

      <BaseFormDialog
        open={isCreate || isEdit}
        onClose={closeDialog}
        title={isEdit ? 'تعديل أغنية' : 'إضافة أغنية جديدة'}
        onSubmit={onFormSubmit}
        loading={crudLoading}
      >
        <Controller name="title" control={control} render={({ field, fieldState }) => <MuiTextField {...field} label="عنوان الأغنية" fullWidth sx={{ mb: 2 }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
        <Controller name="artist" control={control} render={({ field, fieldState }) => <MuiTextField {...field} label="اسم الفنان" fullWidth sx={{ mb: 2 }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
        <Controller name="momentType" control={control} render={({ field }) => (
          <MuiFormControl fullWidth sx={{ mb: 2 }}>
            <MuiTypography variant="caption" sx={{ mb: 1, display: 'block' }}>لحظة التشغيل</MuiTypography>
            <MuiSelect {...field}>
              <MuiMenuItem value="entrance">دخول</MuiMenuItem>
              <MuiMenuItem value="dance">رقصة</MuiMenuItem>
              <MuiMenuItem value="background">خلفية</MuiMenuItem>
              <MuiMenuItem value="other">أخرى</MuiMenuItem>
            </MuiSelect>
          </MuiFormControl>
        )} />
        <Controller name="notes" control={control} render={({ field }) => <MuiTextField {...field} label="ملاحظات" multiline rows={3} fullWidth />} />
      </BaseFormDialog>

      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={async () => {
          const res = await handleDelete(editingSong._id)
          if (res.success) closeDialog()
        }}
        title="حذف أغنية"
        message={`هل أنت متأكد من حذف أغنية "${editingSong?.title}"؟`}
        loading={crudLoading}
      />
    </MuiBox>
  )
}
