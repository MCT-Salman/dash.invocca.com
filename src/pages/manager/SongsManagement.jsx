// src\pages\manager\SongsManagement.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingScreen, SEOHead, CrudPageLayout, StatusBadge, ConfirmDialog } from '@/components/common'
import { useDialogState, useCRUD } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getHallSongs, addHallSong, updateHallSong, deleteHallSong } from '@/api/manager'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { Music } from 'lucide-react'
import CreateEditSongDialog from './components/CreateEditSongDialog'

export default function SongsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const {
        selectedItem: selectedSong,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isDelete,
    } = useDialogState()

    const { data: songsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_SONGS,
        queryFn: getHallSongs,
    })

    const songs = useMemo(() => songsData?.songs || songsData?.data || [], [songsData])

    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: addHallSong,
        updateFn: updateHallSong,
        deleteFn: deleteHallSong,
        queryKey: QUERY_KEYS.MANAGER_SONGS,
        successMessage: 'تمت العملية بنجاح',
    })

    const filteredSongs = useMemo(() => {
        if (!searchQuery) return songs
        return songs.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [songs, searchQuery])

    const columns = [
        {
            id: 'title',
            label: 'الأغنية',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Music size={20} style={{ color: 'var(--color-icon)' }} />
                    <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'artist',
            label: 'الفنان',
            align: 'center'
        },
        {
            id: 'category',
            label: 'الفئة',
            align: 'center'
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => <StatusBadge value={value} activeLabel="نشط" inactiveLabel="معطل" />
        }
    ]

    if (isLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة الأغاني | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي الأغاني', value: songs.length, icon: <Music size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredSongs}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                addButtonLabel="أغنية جديدة"
            />

            <CreateEditSongDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedSong._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingSong={selectedSong}
                loading={crudLoading}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={async () => {
                    const result = await handleDelete(selectedSong._id)
                    if (result.success) closeDialog()
                }}
                title="حذف أغنية"
                message={`هل أنت متأكد من حذف أغنية "${selectedSong?.title}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
