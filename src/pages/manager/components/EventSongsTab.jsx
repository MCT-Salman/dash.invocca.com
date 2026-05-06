// src/pages/manager/components/EventSongsTab.jsx
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiTextField from '@/components/ui/MuiTextField'
import { LoadingScreen, EmptyState, DataTable, ConfirmDialog } from '@/components/common'
import { useNotification } from '@/hooks'
import { getEventPlaylist, getHallSongs, addEventPlaylistSong, deleteEventPlaylistSong } from '@/api/manager'
import { Music, Trash2, Plus } from 'lucide-react'
import { formatDate } from '@/utils/helpers'

export default function EventSongsTab({ eventId, open }) {
    const { success, error: showNotification } = useNotification()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        songId: '',
        momentType: '',
        notes: '',
    })
    const [songToDelete, setSongToDelete] = useState(null)

    // Fetch playlist for event
    const { data: playlistData, isLoading: playlistLoading } = useQuery({
        queryKey: ['manager', 'events', eventId, 'playlist'],
        queryFn: () => getEventPlaylist(eventId),
        enabled: open && !!eventId,
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
        enabled: open,
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
        mutationFn: (payload) => addEventPlaylistSong(eventId, payload),
        onSuccess: () => {
            success('تم إضافة الأغنية لقائمة التشغيل بنجاح')
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', eventId, 'playlist'] })
            setFormData({ songId: '', momentType: '', notes: '' })
        },
        onError: (error) => {
            showNotification(error?.response?.data?.message || 'فشل في إضافة الأغنية')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: ({ playlistId }) => deleteEventPlaylistSong(eventId, playlistId),
        onSuccess: () => {
            success('تم حذف الأغنية من القائمة')
            queryClient.invalidateQueries({ queryKey: ['manager', 'events', eventId, 'playlist'] })
            setSongToDelete(null)
        },
        onError: (error) => {
            showNotification(error?.response?.data?.message || 'فشل في حذف الأغنية')
        },
    })

    const columns = [
        {
            id: 'title',
            label: 'الأغنية',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Music size={18} style={{ color: 'var(--color-icon)' }} />
                    <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                            {value || row.song?.title || 'أغنية'}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.artist || row.song?.artist || ''}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            ),
        },
        {
            id: 'momentType',
            label: 'اللحظة',
            align: 'center',
            format: (value) => {
                const map = { entrance: 'دخول', dance: 'رقصة', background: 'خلفية', other: 'أخرى' }
                return map[value] || value || '—'
            }
        },
        {
            id: 'notes',
            label: 'ملاحظات',
            align: 'right',
            format: (value) => value || '—',
        },
        {
            id: 'createdAt',
            label: 'تاريخ الإضافة',
            align: 'center',
            format: (value) => value ? formatDate(value) : '—',
        },
    ]

    const handleAdd = (e) => {
        e?.preventDefault?.()
        if (!formData.songId) return
        addMutation.mutate(formData)
    }

    if (playlistLoading && !playlist.length) {
        return <LoadingScreen message="جاري تحميل قائمة الأغاني..." fullScreen={false} />
    }

    return (
        <MuiBox sx={{ mt: 3 }}>
            <MuiPaper sx={{ p: 3, mb: 3, borderRadius: '16px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                <MuiTypography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>إضافة أغنية للقائمة</MuiTypography>
                <MuiGrid container spacing={2}>
                    <MuiGrid item xs={12} md={4}>
                        <MuiSelect
                            fullWidth
                            value={formData.songId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, songId: e.target.value }))}
                            displayEmpty
                        >
                            <MuiMenuItem value=""><em>اختر الأغنية</em></MuiMenuItem>
                            {hallSongs.map((song) => (
                                <MuiMenuItem key={song._id} value={song._id}>{song.title} - {song.artist}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={3}>
                        <MuiSelect
                            fullWidth
                            value={formData.momentType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, momentType: e.target.value }))}
                            displayEmpty
                        >
                            <MuiMenuItem value=""><em>اللحظة</em></MuiMenuItem>
                            <MuiMenuItem value="entrance">دخول</MuiMenuItem>
                            <MuiMenuItem value="dance">رقصة</MuiMenuItem>
                            <MuiMenuItem value="background">خلفية</MuiMenuItem>
                            <MuiMenuItem value="other">أخرى</MuiMenuItem>
                        </MuiSelect>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiTextField
                            fullWidth
                            label="ملاحظات"
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={1} sx={{ display: 'flex' }}>
                        <MuiButton fullWidth variant="contained" onClick={handleAdd} disabled={addMutation.isPending || !formData.songId}>إضافة</MuiButton>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            <MuiPaper sx={{ borderRadius: '16px', border: '1px solid var(--color-border)', background: 'var(--color-paper)' }}>
                {playlist.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={playlist}
                        showActions
                        onDelete={setSongToDelete}
                    />
                ) : (
                    <EmptyState title="لا توجد أغاني" description="لم يتم إضافة أي أغاني لهذه الفعالية بعد." icon={Music} showPaper={false} />
                )}
            </MuiPaper>

            <ConfirmDialog
                open={!!songToDelete}
                onClose={() => setSongToDelete(null)}
                onConfirm={() => deleteMutation.mutate({ playlistId: songToDelete?._id })}
                title="حذف أغنية"
                message={`هل أنت متأكد من حذف أغنية "${songToDelete?.title || songToDelete?.song?.title || ''}"؟`}
                loading={deleteMutation.isPending}
            />
        </MuiBox>
    )
}
