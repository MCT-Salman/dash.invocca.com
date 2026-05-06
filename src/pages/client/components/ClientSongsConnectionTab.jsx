// src\pages\client\components\ClientSongsConnectionTab.jsx
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/hooks'
import { useClient } from '@/providers/ClientProvider'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { LoadingScreen, EmptyState, ConfirmDialog } from '@/components/common'
import { getEventSongs, addSong, deleteSong, getClientDashboard, getHallSongsForClient } from '@/api/client'
import { formatDate } from '@/utils/helpers'
import { Plus, Music, Trash2 } from 'lucide-react'
import { QUERY_KEYS } from '@/config/constants'

export default function ClientSongsConnectionTab({ selectedEventId: initialSelectedEventId }) {
  const { selectedEventId: contextEventId } = useClient()
  const { success, error: showError } = useNotification()
  const queryClient = useQueryClient()
  const [eventId, setEventId] = useState(initialSelectedEventId || contextEventId || '')
  const [selectedSongId, setSelectedSongId] = useState('')
  const [songToDelete, setSongToDelete] = useState(null)

  const { data: dashboardData, isLoading: eventsLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  const { data: hallSongsData, isLoading: hallSongsLoading } = useQuery({
    queryKey: ['client-hall-songs'],
    queryFn: getHallSongsForClient,
  })

  const { data: eventSongsData } = useQuery({
    queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId],
    queryFn: () => getEventSongs(eventId),
    enabled: !!eventId,
  })

  const events = useMemo(() => {
    const data = dashboardData?.data || dashboardData || {}
    return data.allEvents || data.events || []
  }, [dashboardData])

  const hallSongs = useMemo(() => hallSongsData?.songs || hallSongsData?.data || [], [hallSongsData])
  const eventSongs = useMemo(() => eventSongsData?.songs || eventSongsData?.data || [], [eventSongsData])

  const availableSongs = useMemo(() => {
    if (!eventId) return hallSongs
    const existingIds = eventSongs.map(s => (s.song?._id || s.song || s._id || s.id)?.toString())
    return hallSongs.filter(s => !existingIds.includes((s._id || s.id)?.toString()))
  }, [hallSongs, eventSongs, eventId])

  const linkSongMutation = useMutation({
    mutationFn: (songId) => addSong(eventId, { songId }),
    onSuccess: () => {
      success('تم إضافة الأغنية للمناسبة بنجاح')
      setSelectedSongId('')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId] })
    },
    onError: (err) => showError(err?.response?.data?.message || 'فشل في الإضافة')
  })

  const deleteMutation = useMutation({
    mutationFn: (songId) => deleteSong(eventId, songId),
    onSuccess: () => {
      success('تم حذف الأغنية من المناسبة')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId] })
      setSongToDelete(null)
    },
    onError: (err) => showError(err?.response?.data?.message || 'فشل في الحذف')
  })

  if (hallSongsLoading || eventsLoading) return <LoadingScreen fullScreen={false} />

  return (
    <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>ربط أغاني من المكتبة</MuiTypography>
        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>اختر المناسبة ثم اختر الأغنية التي تريد إضافتها من مكتبة القاعة</MuiTypography>
      </MuiBox>

      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={5}>
          <MuiSelect fullWidth value={eventId} onChange={(e) => setEventId(e.target.value)} displayEmpty>
            <MuiMenuItem value=""><em>اختر المناسبة</em></MuiMenuItem>
            {events.map(e => <MuiMenuItem key={e._id} value={e._id}>{e.name} ({formatDate(e.date)})</MuiMenuItem>)}
          </MuiSelect>
        </MuiGrid>
        <MuiGrid item xs={12} md={5}>
          <MuiSelect fullWidth value={selectedSongId} onChange={(e) => setSelectedSongId(e.target.value)} displayEmpty disabled={!eventId}>
            <MuiMenuItem value=""><em>اختر الأغنية</em></MuiMenuItem>
            {availableSongs.map(s => <MuiMenuItem key={s._id} value={s._id}>{s.title} - {s.artist}</MuiMenuItem>)}
          </MuiSelect>
        </MuiGrid>
        <MuiGrid item xs={12} md={2}>
          <MuiButton fullWidth variant="contained" startIcon={<Plus />} disabled={!eventId || !selectedSongId || linkSongMutation.isPending} onClick={() => linkSongMutation.mutate(selectedSongId)}>إضافة</MuiButton>
        </MuiGrid>
      </MuiGrid>

      <MuiDivider sx={{ my: 4 }} />

      <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>الأغاني المضافة لهذه المناسبة ({eventSongs.length})</MuiTypography>
      {!eventId ? (
        <EmptyState title="يرجى اختيار مناسبة" icon={Music} showPaper={false} />
      ) : eventSongs.length === 0 ? (
        <EmptyState title="لا توجد أغاني مضافة" description="ابدأ بإضافة الأغاني من القائمة أعلاه" icon={Music} showPaper={false} />
      ) : (
        <MuiGrid container spacing={2}>
          {eventSongs.map((item, i) => (
            <MuiGrid item xs={12} key={i}>
              <MuiPaper sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <MuiBox sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-icon)' }}>
                  <Music size={20} />
                </MuiBox>
                <MuiBox sx={{ flex: 1 }}>
                  <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{item.song?.title || item.title}</MuiTypography>
                  <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{item.song?.artist || item.artist}</MuiTypography>
                </MuiBox>
                <MuiIconButton color="error" onClick={() => setSongToDelete(item)}><Trash2 size={18} /></MuiIconButton>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      )}

      <ConfirmDialog
        open={!!songToDelete}
        onClose={() => setSongToDelete(null)}
        onConfirm={() => deleteMutation.mutate(songToDelete?._id || songToDelete?.id)}
        title="حذف أغنية"
        message={`هل أنت متأكد من حذف أغنية "${songToDelete?.song?.title || songToDelete?.title}"؟`}
        loading={deleteMutation.isPending}
      />
    </MuiPaper>
  )
}
