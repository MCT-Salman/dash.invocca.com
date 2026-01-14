// src\pages\client\components\ClientSongsConnectionTab.jsx
/**
 * Client Songs Connection Tab
 * ربط الأغاني الموجودة مع الفعالية
 */

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiChip from '@/components/ui/MuiChip'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { LoadingScreen, EmptyState, ConfirmDialog, ButtonLoading } from '@/components/common'
import { getEventSongs, addSong, deleteSong, getClientDashboard, getHallSongsForClient } from '@/api/client'
import { formatEmptyValue, formatDate } from '@/utils/helpers'
import { Plus, Music, Trash2 } from 'lucide-react'
import { QUERY_KEYS } from '@/config/constants'

export default function ClientSongsConnectionTab({ selectedEventId: initialSelectedEventId }) {
  const { success, error: showError } = useNotification()
  const queryClient = useQueryClient()

  // اختيار الفعالية والأغنية للربط
  const [eventId, setEventId] = useState(initialSelectedEventId || '')
  const [selectedSongId, setSelectedSongId] = useState(undefined)

  // فك الارتباط
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false)
  const [songToUnlink, setSongToUnlink] = useState(null)

  // جلب الفعاليات من لوحة تحكم العميل (نفس طريقة صفحة الأغاني الرئيسية)
  const { data: dashboardData, isLoading: eventsLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  const events = useMemo(() => {
    const responseData = dashboardData?.data || dashboardData || {}
    return responseData.allEvents || responseData.recentActivity?.events || responseData.events || []
  }, [dashboardData])

  // مكتبة الأغاني من القاعة (لا تعتمد على فعالية معينة)
  const { data: hallSongsData, isLoading: hallSongsLoading } = useQuery({
    queryKey: ['client-hall-songs'],
    queryFn: getHallSongsForClient,
  })

  // أغاني الفعالية المختارة
  const { data: eventSongsData, refetch: refetchEventSongs } = useQuery({
    queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId],
    queryFn: () => getEventSongs(eventId),
    enabled: !!eventId,
  })

  const hallSongs = useMemo(() => {
    if (Array.isArray(hallSongsData?.data)) return hallSongsData.data
    if (Array.isArray(hallSongsData?.songs)) return hallSongsData.songs
    if (Array.isArray(hallSongsData)) return hallSongsData
    return []
  }, [hallSongsData])

  const eventSongs = useMemo(() => {
    if (Array.isArray(eventSongsData?.data)) return eventSongsData.data
    if (Array.isArray(eventSongsData?.songs)) return eventSongsData.songs
    if (Array.isArray(eventSongsData)) return eventSongsData
    return []
  }, [eventSongsData])

  // Get songs not yet added to this event
  const availableSongs = useMemo(() => {
    if (!eventId) return hallSongs
    // eventSongs contains playlist items with 'song' field (ID from hall) or direct song objects
    const eventSongIds = eventSongs.map(s => s.song || s._id || s.id).filter(Boolean)
    return hallSongs.filter(s => {
      const songId = s._id || s.id
      return songId && !eventSongIds.includes(songId.toString())
    })
  }, [hallSongs, eventSongs, eventId])

  // ربط أغنية مع فعالية
  const linkSongMutation = useMutation({
    mutationFn: (songData) => addSong(eventId, songData),
    onSuccess: () => {
      success('تم ربط الأغنية بالفعالية بنجاح')
      setSelectedSongId(undefined)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId] })
      refetchEventSongs()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء ربط الأغنية'
      showError(errorMessage)
    }
  })

  // فك ربط الأغنية من الفعالية
  const removeSongMutation = useMutation({
    mutationFn: (songId) => deleteSong(eventId, songId),
    onSuccess: () => {
      success('تم فك ربط الأغنية بنجاح')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_SONGS, eventId] })
      refetchEventSongs()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء فك ربط الأغنية'
      showError(errorMessage)
    }
  })

  const handleLinkSong = () => {
    if (!eventId || !selectedSongId) {
      showError('يرجى اختيار الفعالية والأغنية')
      return
    }

    const selectedSong = hallSongs.find(s => (s._id || s.id) === selectedSongId)
    if (!selectedSong) {
      showError('الأغنية المختارة غير موجودة')
      return
    }

    const payload = {
      songId: selectedSongId,
    }

    linkSongMutation.mutate(payload)
  }

  const handleRemoveSong = (songId, songTitle) => {
    setSongToUnlink({ songId, songTitle })
    setUnlinkDialogOpen(true)
  }

  const handleUnlinkConfirm = () => {
    if (songToUnlink?.songId) {
      removeSongMutation.mutate(songToUnlink.songId)
      setUnlinkDialogOpen(false)
      setSongToUnlink(null)
    }
  }

  if (hallSongsLoading || eventsLoading) {
    return <LoadingScreen message="جاري تحميل البيانات..." fullScreen={false} />
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
      }}
    >
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600, mb: 2 }}>
          ربط الأغاني من المكتبة
        </MuiTypography>
        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          اختر فعالية ثم اختر أغنية من مكتبة القاعة لربطها بالفعالية
        </MuiTypography>
      </MuiBox>

      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={5}>
          <MuiFormControl fullWidth>
            <MuiSelect
              value={eventId || ''}
              onChange={(e) => {
                setEventId(e.target.value || '')
                setSelectedSongId(undefined)
              }}
              displayEmpty
            >
              <MuiMenuItem value="">
                <em>اختر الفعالية</em>
              </MuiMenuItem>
              {events.map((event) => (
                <MuiMenuItem key={event._id || event.id} value={event._id || event.id}>
                  {formatEmptyValue(event.name || event.eventName)}{' '}
                  {event.date && `- ${formatDate(event.date || event.eventDate, 'DD/MM/YYYY')}`}
                </MuiMenuItem>
              ))}
            </MuiSelect>
          </MuiFormControl>
        </MuiGrid>

        <MuiGrid item xs={12} md={5}>
          <MuiFormControl fullWidth disabled={!eventId || availableSongs.length === 0}>
            <MuiSelect
              value={selectedSongId || ''}
              onChange={(e) => setSelectedSongId(e.target.value)}
              displayEmpty
            >
              <MuiMenuItem value="">
                <em>اختر أغنية لربطها</em>
              </MuiMenuItem>
              {availableSongs.map((song) => (
                <MuiMenuItem key={song._id || song.id} value={song._id || song.id}>
                  {formatEmptyValue(song.title)} - {formatEmptyValue(song.artist)}
                </MuiMenuItem>
              ))}
            </MuiSelect>
          </MuiFormControl>
        </MuiGrid>

        <MuiGrid item xs={12} md={2}>
          <MuiButton
            fullWidth
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleLinkSong}
            disabled={!eventId || !selectedSongId || linkSongMutation.isPending}
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
            {linkSongMutation.isPending ? <ButtonLoading /> : 'ربط الأغنية'}
          </MuiButton>
        </MuiGrid>
      </MuiGrid>

      {eventId && availableSongs.length === 0 && (
        <MuiBox sx={{ mb: 4 }}>
          <EmptyState
            title="جميع الأغاني مربوطة بالفعل"
            description="جميع الأغاني في مكتبة القاعة موجودة بالفعل في هذه الفعالية"
            icon={Music}
          />
        </MuiBox>
      )}

      {/* Linked Songs Section */}
      <MuiBox sx={{ borderTop: '1px solid rgba(216, 185, 138, 0.15)', pt: 4 }}>
        <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600, mb: 3 }}>
          {eventId ? `الأغاني المربوطة (${eventSongs.length})` : 'الأغاني المربوطة'}
        </MuiTypography>

        {eventId && eventSongs.length > 0 ? (
          <MuiGrid container spacing={2}>
            {eventSongs.map((song) => (
              <MuiGrid item xs={12} key={song._id || song.id}>
                <MuiPaper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: 'rgba(216, 185, 138, 0.05)',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Music size={20} style={{ color: 'var(--color-primary-500)' }} />
                      <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                          {formatEmptyValue(song.title)}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                          {formatEmptyValue(song.artist)}
                        </MuiTypography>
                      </MuiBox>
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {song.momentType && (
                        <MuiChip
                          label={song.momentType}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {song.order && (
                        <MuiChip
                          label={`ترتيب: ${song.order}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {song.notes && (
                        <MuiChip
                          label="ملاحظات"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </MuiBox>
                  </MuiBox>

                  <MuiIconButton
                    onClick={() => handleRemoveSong(song._id || song.id, song.title)}
                    disabled={removeSongMutation.isPending}
                    sx={{
                      color: 'var(--color-error)',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      },
                    }}
                  >
                    <Trash2 size={20} />
                  </MuiIconButton>
                </MuiPaper>
              </MuiGrid>
            ))}
          </MuiGrid>
        ) : (
          <EmptyState
            title="لا توجد أغاني مربوطة"
            description="ابدأ بربط أغاني من المكتبة أعلاه"
            icon={Music}
          />
        )}
      </MuiBox>

      {/* Unlink Confirmation Dialog */}
      <ConfirmDialog
        open={unlinkDialogOpen}
        onClose={() => setUnlinkDialogOpen(false)}
        onConfirm={handleUnlinkConfirm}
        title="فك ربط الأغنية"
        message={`هل أنت متأكد من فك ربط الأغنية "${songToUnlink?.songTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="فك الربط"
        cancelLabel="إلغاء"
        loading={removeSongMutation.isPending}
      />
    </MuiPaper>
  )
}
