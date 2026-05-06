// src\pages\manager\components\EventSongsConnectionTab.jsx
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
import MuiTextField from '@/components/ui/MuiTextField'
import { LoadingScreen, EmptyState, ConfirmDialog } from '@/components/common'
import { getManagerEvents, getHallSongs, getEventPlaylist, addEventPlaylistSong, deleteEventPlaylistSong } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Plus, Music, Trash2, Link2 } from 'lucide-react'

export default function EventSongsConnectionTab() {
    const { success, error: showError } = useNotification()
    const queryClient = useQueryClient()
    const [selectedEventId, setSelectedEventId] = useState('')
    const [selectedSongId, setSelectedSongId] = useState('')
    const [songMomentType, setSongMomentType] = useState('')
    const [songNotes, setSongNotes] = useState('')
    const [songToDelete, setSongToDelete] = useState(null)

    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['manager', 'events'],
        queryFn: getManagerEvents,
    })

    const { data: songsData, isLoading: songsLoading } = useQuery({
        queryKey: ['manager', 'hall-songs'],
        queryFn: getHallSongs,
    })

    const { data: playlistData, isLoading: playlistLoading } = useQuery({
        queryKey: ['manager', 'events', selectedEventId, 'playlist'],
        queryFn: () => getEventPlaylist(selectedEventId),
        enabled: !!selectedEventId,
    })

    const events = useMemo(() => eventsData?.events || eventsData?.data || [], [eventsData])
    const allSongs = useMemo(() => songsData?.songs || songsData?.data || [], [songsData])
    const playlist = useMemo(() => playlistData?.songs || playlistData?.data || [], [playlistData])

    const addMutation = useMutation({
        mutationFn: (payload) => addEventPlaylistSong(selectedEventId, payload),
        onSuccess: () => {
            success('تم ربط الأغنية بالفعالية بنجاح')
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'playlist'] })
            setSelectedSongId('')
            setSongMomentType('')
            setSongNotes('')
        },
        onError: (err) => showError(err?.response?.data?.message || 'فشل في ربط الأغنية')
    })

    const deleteMutation = useMutation({
        mutationFn: (playlistId) => deleteEventPlaylistSong(selectedEventId, playlistId),
        onSuccess: () => {
            success('تم فك ربط الأغنية')
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', selectedEventId, 'playlist'] })
            setSongToDelete(null)
        },
        onError: (err) => showError(err?.response?.data?.message || 'فشل في الحذف')
    })

    if (eventsLoading || songsLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: 3 }}>
            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12} md={4}>
                    <MuiPaper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--color-paper)' }}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>1. اختر الفعالية</MuiTypography>
                        <MuiFormControl fullWidth>
                            <MuiSelect
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                displayEmpty
                            >
                                <MuiMenuItem value=""><em>اختر الفعالية المستهدفة</em></MuiMenuItem>
                                {events.map(e => <MuiMenuItem key={e._id} value={e._id}>{e.name} - {formatDate(e.date)}</MuiMenuItem>)}
                            </MuiSelect>
                        </MuiFormControl>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} md={8}>
                    <MuiPaper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--color-paper)' }}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>2. ربط أغنية جديدة</MuiTypography>
                        <MuiGrid container spacing={2}>
                            <MuiGrid item xs={12} md={6}>
                                <MuiSelect fullWidth value={selectedSongId} onChange={(e) => setSelectedSongId(e.target.value)} displayEmpty disabled={!selectedEventId}>
                                    <MuiMenuItem value=""><em>اختر الأغنية من المكتبة</em></MuiMenuItem>
                                    {allSongs.map(s => <MuiMenuItem key={s._id} value={s._id}>{s.title} - {s.artist}</MuiMenuItem>)}
                                </MuiSelect>
                            </MuiGrid>
                            <MuiGrid item xs={12} md={6}>
                                <MuiSelect fullWidth value={songMomentType} onChange={(e) => setSongMomentType(e.target.value)} displayEmpty disabled={!selectedEventId}>
                                    <MuiMenuItem value=""><em>اللحظة (اختياري)</em></MuiMenuItem>
                                    <MuiMenuItem value="entrance">دخول</MuiMenuItem>
                                    <MuiMenuItem value="dance">رقصة</MuiMenuItem>
                                    <MuiMenuItem value="background">خلفية</MuiMenuItem>
                                </MuiSelect>
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <MuiTextField fullWidth label="ملاحظات إضافية" value={songNotes} onChange={(e) => setSongNotes(e.target.value)} disabled={!selectedEventId} />
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <MuiButton variant="contained" startIcon={<Plus />} fullWidth disabled={!selectedEventId || !selectedSongId || addMutation.isPending} onClick={() => addMutation.mutate({ songId: selectedSongId, momentType: songMomentType, notes: songNotes })}>
                                    ربط الأغنية بالفعالية
                                </MuiButton>
                            </MuiGrid>
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiPaper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--color-paper)' }}>
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Music size={20} /> قائمة تشغيل الفعالية المختارة
                        </MuiTypography>
                        {!selectedEventId ? (
                            <EmptyState title="لم يتم اختيار فعالية" description="يرجى اختيار فعالية من القائمة الجانبية لعرض قائمة الأغاني الخاصة بها" icon={Link2} showPaper={false} />
                        ) : playlistLoading ? (
                            <LoadingScreen message="جاري تحميل الأغاني..." fullScreen={false} />
                        ) : playlist.length === 0 ? (
                            <EmptyState title="القائمة فارغة" description="لم يتم ربط أي أغاني بهذه الفعالية حتى الآن" icon={Music} showPaper={false} />
                        ) : (
                            <MuiGrid container spacing={2}>
                                {playlist.map((item, i) => (
                                    <MuiGrid item xs={12} md={6} key={i}>
                                        <MuiPaper sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <MuiBox sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-icon)' }}>
                                                <Music size={20} />
                                            </MuiBox>
                                            <MuiBox sx={{ flex: 1 }}>
                                                <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{item.song?.title || item.title}</MuiTypography>
                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{item.song?.artist || item.artist} • {item.momentType || 'عام'}</MuiTypography>
                                            </MuiBox>
                                            <MuiIconButton color="error" onClick={() => setSongToDelete(item)}><Trash2 size={18} /></MuiIconButton>
                                        </MuiPaper>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            <ConfirmDialog
                open={!!songToDelete}
                onClose={() => setSongToDelete(null)}
                onConfirm={() => deleteMutation.mutate(songToDelete?._id)}
                title="إلغاء ربط الأغنية"
                message={`هل أنت متأكد من فك ربط الأغنية "${songToDelete?.song?.title || songToDelete?.title}" عن هذه الفعالية؟`}
                loading={deleteMutation.isPending}
            />
        </MuiBox>
    )
}
