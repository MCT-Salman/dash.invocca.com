// src\pages\manager\components\EventSongsConnectionTab.jsx
/**
 * Event Songs Connection Tab
 * ربط الأغاني مع الفعاليات
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
import { 
  getManagerEvents, 
  getHallSongs, 
  getEventPlaylist, 
  addEventPlaylistSong, 
  deleteEventPlaylistSong 
} from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Plus, Music, Trash2, Link2, Unlink } from 'lucide-react'

export default function EventSongsConnectionTab() {
  const { success, error: showError } = useNotification()
  const queryClient = useQueryClient()
  const [selectedEventId, setSelectedEventId] = useState(undefined)
  const [selectedSongId, setSelectedSongId] = useState(undefined)
  const [songMomentType, setSongMomentType] = useState('')
  const [songNotes, setSongNotes] = useState('')
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false)
  const [songToUnlink, setSongToUnlink] = useState(null)

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['manager', 'events'],
    queryFn: getManagerEvents,
  })

  // Fetch available songs from hall
  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: ['manager', 'hall-songs'],
    queryFn: getHallSongs,
    enabled: !!selectedEventId,
  })

  // Fetch event playlist when event is selected
  const { data: playlistData, isLoading: playlistLoading, refetch: refetchPlaylist } = useQuery({
    queryKey: ['manager', 'events', selectedEventId, 'playlist'],
    queryFn: () => getEventPlaylist(selectedEventId),
    enabled: !!selectedEventId,
    staleTime: 2 * 60 * 1000
  })

  const events = eventsData?.events || eventsData?.data || []
  const allSongs = useMemo(() => {
    if (Array.isArray(songsData?.data)) return songsData.data
    if (Array.isArray(songsData?.songs)) return songsData.songs
    if (Array.isArray(songsData)) return songsData
    return []
  }, [songsData])

  const eventPlaylist = useMemo(() => {
    if (Array.isArray(playlistData?.data)) return playlistData.data
    if (Array.isArray(playlistData?.songs)) return playlistData.songs
    if (Array.isArray(playlistData)) return playlistData
    return []
  }, [playlistData])

  // Add song mutation
  const addSongMutation = useMutation({
    mutationFn: (payload) => addEventPlaylistSong(selectedEventId, payload),
    onSuccess: () => {
      success('تم إضافة الأغنية للفعالية بنجاح')
      setSelectedSongId(undefined)
      setSongMomentType('')
      setSongNotes('')
      queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'playlist'] })
      refetchPlaylist()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء إضافة الأغنية'
      showError(errorMessage)
    }
  })

  // Remove song mutation
  const removeSongMutation = useMutation({
    mutationFn: (playlistId) => deleteEventPlaylistSong(selectedEventId, playlistId),
    onSuccess: (data) => {
      success(data.message || 'تم فك ربط الأغنية بنجاح')
      queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'playlist'] })
      refetchPlaylist()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء فك ربط الأغنية'
      showError(errorMessage)
    }
  })

  const handleAddSong = () => {
    if (!selectedEventId || !selectedSongId) {
      showError('يرجى اختيار الفعالية والأغنية')
      return
    }
    
    const payload = {
      songId: selectedSongId,
      momentType: songMomentType || undefined,
      notes: songNotes || undefined,
    }
    
    addSongMutation.mutate(payload)
  }

  const handleRemoveSong = (playlistId, songTitle) => {
    setSongToUnlink({ playlistId, songTitle })
    setUnlinkDialogOpen(true)
  }

  const handleUnlinkConfirm = () => {
    if (songToUnlink?.playlistId) {
      removeSongMutation.mutate(songToUnlink.playlistId)
      setUnlinkDialogOpen(false)
      setSongToUnlink(null)
    }
  }

  const momentTypeLabels = {
    entrance: 'دخول',
    dance: 'رقصة',
    background: 'خلفية',
    other: 'أخرى',
  }

  return (
    <MuiPaper
      elevation={0}
      sx={{
        p: 4,
        background: 'var(--color-paper)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border-glass)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <MuiTypography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link2 size={24} style={{ color: 'var(--color-primary-500)' }} />
        ربط الأغاني مع الفعاليات
      </MuiTypography>

      {/* Selection Section */}
      <MuiGrid container spacing={2} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={4}>
          <MuiFormControl fullWidth>
            <MuiSelect
              value={selectedEventId || ''}
              label="اختر الفعالية"
              onChange={(e) => {
                setSelectedEventId(e.target.value || undefined)
                setSelectedSongId(undefined)
              }}
              disabled={eventsLoading}
              renderValue={(value) => {
                if (!value) return ''
                const selectedEvent = events.find(e => (e._id || e.id) === value)
                return selectedEvent 
                  ? `${selectedEvent.eventName || selectedEvent.name} - ${formatDate(selectedEvent.eventDate || selectedEvent.date)}`
                  : ''
              }}
              sx={{
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--color-text-primary)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-border-glass)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(216, 185, 138, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)',
                },
              }}
            >
              {eventsLoading ? (
                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
              ) : events.length === 0 ? (
                <MuiMenuItem value="" disabled>لا توجد فعاليات</MuiMenuItem>
              ) : (
                events.map(event => (
                  <MuiMenuItem key={event._id || event.id} value={event._id || event.id}>
                    {event.eventName || event.name} - {formatDate(event.eventDate || event.date)}
                  </MuiMenuItem>
                ))
              )}
            </MuiSelect>
          </MuiFormControl>
        </MuiGrid>

        <MuiGrid item xs={12} md={3}>
          <MuiFormControl fullWidth>
            <MuiSelect
              value={selectedSongId || ''}
              label="اختر الأغنية"
              onChange={(e) => {
                setSelectedSongId(e.target.value || undefined)
              }}
              disabled={songsLoading || !selectedEventId || addSongMutation.isPending}
              renderValue={(value) => {
                if (!value) return ''
                const selectedSong = allSongs.find(s => (s._id || s.id) === value)
                return selectedSong 
                  ? `${selectedSong.title || selectedSong.name || 'أغنية'}`
                  : ''
              }}
              sx={{
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--color-text-primary)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-border-glass)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(216, 185, 138, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)',
                },
              }}
            >
              {songsLoading ? (
                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
              ) : allSongs.length === 0 ? (
                <MuiMenuItem value="" disabled>لا توجد أغاني متاحة</MuiMenuItem>
              ) : (
                allSongs.map(song => (
                  <MuiMenuItem key={song._id || song.id} value={song._id || song.id}>
                    {song.title || song.name || 'أغنية'} {song.artist && `- ${song.artist}`}
                  </MuiMenuItem>
                ))
              )}
            </MuiSelect>
          </MuiFormControl>
        </MuiGrid>

        <MuiGrid item xs={12} md={2}>
          <MuiFormControl fullWidth>
            <MuiSelect
              value={songMomentType}
              label="نوع اللحظة (اختياري)"
              onChange={(e) => setSongMomentType(e.target.value)}
              disabled={!selectedEventId || !selectedSongId || addSongMutation.isPending}
              sx={{
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--color-text-primary)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-border-glass)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(216, 185, 138, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)',
                },
              }}
            >
              <MuiMenuItem value="">بدون</MuiMenuItem>
              <MuiMenuItem value="entrance">دخول</MuiMenuItem>
              <MuiMenuItem value="dance">رقصة</MuiMenuItem>
              <MuiMenuItem value="background">خلفية</MuiMenuItem>
              <MuiMenuItem value="other">أخرى</MuiMenuItem>
            </MuiSelect>
          </MuiFormControl>
        </MuiGrid>

        <MuiGrid item xs={12} md={3}>
          <MuiButton
            fullWidth
            variant="contained"
            startIcon={addSongMutation.isPending ? <ButtonLoading size={20} /> : <Plus size={20} />}
            onClick={handleAddSong}
            disabled={!selectedEventId || !selectedSongId || addSongMutation.isPending}
            loading={addSongMutation.isPending}
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
            {addSongMutation.isPending ? 'جاري الإضافة...' : 'إضافة'}
          </MuiButton>
        </MuiGrid>
      </MuiGrid>

      {/* Event Playlist */}
      {selectedEventId && (
        <MuiBox>
          <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-primary-500)' }}>
            الأغاني المرتبطة بالفعالية
          </MuiTypography>
          
          {playlistLoading ? (
            <MuiPaper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '12px' }}>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                جاري التحميل...
              </MuiTypography>
            </MuiPaper>
          ) : eventPlaylist.length === 0 ? (
            <MuiPaper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '12px' }}>
              <Music size={32} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 8px', opacity: 0.5 }} />
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                لا توجد أغاني مرتبطة بهذه الفعالية
              </MuiTypography>
            </MuiPaper>
          ) : (
            <MuiGrid container spacing={2}>
              {eventPlaylist.map((playlistItem) => {
                const playlistId = playlistItem._id || playlistItem.id
                const songTitle = playlistItem.title || playlistItem.song?.title || 'أغنية'
                const songArtist = playlistItem.artist || playlistItem.song?.artist || ''
                return (
                  <MuiGrid item xs={12} sm={6} md={4} key={playlistId}>
                    <MuiPaper sx={{ 
                      p: 2.5, 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid var(--color-border-glass)', 
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Music size={20} style={{ color: 'var(--color-primary-400)', marginTop: 2 }} />
                        <MuiBox sx={{ flex: 1 }}>
                          <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 0.5 }}>
                            {songTitle}
                          </MuiTypography>
                          {songArtist && (
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', mb: 0.5 }}>
                              {songArtist}
                            </MuiTypography>
                          )}
                          {playlistItem.momentType && (
                            <MuiChip
                              label={momentTypeLabels[playlistItem.momentType] || playlistItem.momentType}
                              size="small"
                              sx={{
                                mt: 1,
                                backgroundColor: 'var(--color-border-glass)',
                                color: 'var(--color-primary-400)',
                                fontWeight: 600,
                                height: '24px',
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                          {playlistItem.notes && (
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', mt: 1, fontStyle: 'italic' }}>
                              "{playlistItem.notes}"
                            </MuiTypography>
                          )}
                        </MuiBox>
                      </MuiBox>
                      
                      <MuiBox sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, borderTop: '1px solid var(--color-border-glass)' }}>
                        <MuiIconButton
                          size="small"
                          onClick={() => handleRemoveSong(playlistId, songTitle)}
                          disabled={removeSongMutation.isPending}
                          sx={{
                            color: 'var(--color-error-500)',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            }
                          }}
                        >
                          <Trash2 size={18} />
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

      {/* Unlink Confirmation Dialog */}
      <ConfirmDialog
        open={unlinkDialogOpen}
        onClose={() => setUnlinkDialogOpen(false)}
        onConfirm={handleUnlinkConfirm}
        title="فك ربط الأغنية"
        message={`هل أنت متأكد من فك ربط الأغنية "${songToUnlink?.songTitle || ''}" من الفعالية؟`}
        confirmText="فك الربط"
        cancelText="إلغاء"
        loading={removeSongMutation.isPending}
        confirmColor="error"
        icon={Unlink}
      />
    </MuiPaper>
  )
}
