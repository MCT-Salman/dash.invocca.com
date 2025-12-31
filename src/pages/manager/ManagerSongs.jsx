// src/pages/manager/ManagerSongs.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTable from '@/components/ui/MuiTable'
import MuiTableBody from '@/components/ui/MuiTableBody'
import MuiTableCell from '@/components/ui/MuiTableCell'
import MuiTableContainer from '@/components/ui/MuiTableContainer'
import MuiTableHead from '@/components/ui/MuiTableHead'
import MuiTableRow from '@/components/ui/MuiTableRow'
import MuiChip from '@/components/ui/MuiChip'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import { SEOHead, LoadingScreen, ConfirmDialog } from '@/components/common'
import { useQuery } from '@tanstack/react-query'
import { getEventSongs, addSong, updateSong, deleteSong } from '@/api/client'
import { useState } from 'react'
import { Plus, Edit2, Trash2, Music, Play, Pause, Clock, User } from 'lucide-react'
import { useDialogState, useCRUD } from '@/hooks'

export default function ManagerSongs() {
    const [selectedEvent, setSelectedEvent] = useState('')

    // Dialog state management
    const {
        dialogOpen,
        dialogType,
        selectedItem: editingSong,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isDelete,
    } = useDialogState()

    // CRUD operations - Wrapper functions to handle eventId
    const createSongWithEvent = async (data) => {
        return addSong({ eventId: selectedEvent, ...data })
    }

    const {
        createMutation,
        updateMutation,
        deleteMutation,
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createSongWithEvent,
        updateFn: updateSong,
        deleteFn: deleteSong,
        queryKey: ['manager-songs', selectedEvent],
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    const { data: songsData, isLoading, refetch } = useQuery({
        queryKey: ['manager-songs', selectedEvent],
        queryFn: () => getEventSongs(selectedEvent),
        enabled: !!selectedEvent
    })

    const handleSubmit = async (formData) => {
        if (isEdit && editingSong) {
            const result = await handleUpdate(editingSong.id, formData)
            if (result.success) {
                closeDialog()
            }
        } else {
            const result = await handleCreate(formData)
            if (result.success) {
                closeDialog()
            }
        }
    }

    const handleDeleteConfirm = async () => {
        const id = editingSong?.id
        if (!id) return
        const result = await handleDelete(id)
        if (result.success) {
            closeDialog()
        }
    }

    const handlePlayPause = async (song) => {
        // Toggle play status
        const newStatus = song.playStatus === 'playing' ? 'paused' : 'playing'
        await handleUpdate(song.id, { playStatus: newStatus })
    }

    if (isLoading && selectedEvent) {
        return <LoadingScreen message="جاري تحميل الأغاني..." fullScreen={false} />
    }

    const songs = songsData?.songs || []

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
            <SEOHead title="إدارة الأغاني | INVOCCA" />

            {/* Header */}
            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 1,
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    إدارة الأغاني
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    إدارة قائمة تشغيل الأغاني للفعاليات
                </MuiTypography>
            </MuiBox>

            {/* Event Selection */}
            <MuiBox sx={{ mb: 6, textAlign: 'center' }}>
                <MuiFormControl size="small" sx={{ minWidth: 300 }}>
                    <MuiSelect
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        displayEmpty
                        sx={{
                            borderRadius: '10px',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                        }}
                    >
                        <MuiMenuItem value="" disabled>
                            اختر الفعالية لإدارة أغانيها
                        </MuiMenuItem>
                        {/* This would be populated with actual events from API */}
                    </MuiSelect>
                </MuiFormControl>
            </MuiBox>

            {selectedEvent ? (
                <>
                    {/* Controls */}
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <MuiTypography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: 'var(--color-text-primary-dark)' 
                        }}>
                            الأغاني ({songs.length})
                        </MuiTypography>
                        <MuiButton
                            variant="contained"
                            startIcon={<Plus size={20} />}
                            onClick={openCreateDialog}
                            sx={{
                                borderRadius: '12px',
                                py: 2,
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                color: '#1A1A1A',
                                boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                }
                            }}
                        >
                            أغنية جديدة
                        </MuiButton>
                    </MuiBox>

                    {/* Songs Table */}
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '24px',
                            overflow: 'hidden'
                        }}
                    >
                        <MuiTableContainer>
                            <MuiTable>
                                <MuiTableHead>
                                    <MuiTableRow>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الأغنية</MuiTableCell>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الفنان</MuiTableCell>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>المدة</MuiTableCell>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>وقت التشغيل</MuiTableCell>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الحالة</MuiTableCell>
                                        <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الإجراءات</MuiTableCell>
                                    </MuiTableRow>
                                </MuiTableHead>
                                <MuiTableBody>
                                    {songs.length === 0 ? (
                                        <MuiTableRow>
                                            <MuiTableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                                                <MuiBox sx={{ textAlign: 'center' }}>
                                                    <Music size={64} style={{ 
                                                        color: 'var(--color-text-disabled)', 
                                                        opacity: 0.5,
                                                        margin: '0 auto 1.5rem'
                                                    }} />
                                                    <MuiTypography variant="h6" sx={{ 
                                                        color: 'var(--color-text-secondary)', 
                                                        mb: 2, 
                                                        fontWeight: 700 
                                                    }}>
                                                        لا توجد أغاني
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                                        لم يتم إضافة أي أغاني لهذه الفعالية بعد
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiTableCell>
                                        </MuiTableRow>
                                    ) : (
                                        songs.map((song) => (
                                            <MuiTableRow key={song.id} sx={{ '&:hover': { backgroundColor: 'rgba(216, 185, 138, 0.05)' } }}>
                                                <MuiTableCell sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                                    {song.title}
                                                </MuiTableCell>
                                                <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                                    {song.artist}
                                                </MuiTableCell>
                                                <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Clock size={16} style={{ color: 'var(--color-primary-500)' }} />
                                                        {song.duration}
                                                    </MuiBox>
                                                </MuiTableCell>
                                                <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                                    {song.scheduledTime ? new Date(song.scheduledTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                </MuiTableCell>
                                                <MuiTableCell>
                                                    <MuiChip
                                                        label={
                                                            song.playStatus === 'playing' ? 'قيد التشغيل' :
                                                            song.playStatus === 'paused' ? 'متوقف' :
                                                            song.playStatus === 'played' ? 'تم تشغيلها' : 'في الانتظار'
                                                        }
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 
                                                                song.playStatus === 'playing' ? 'rgba(34, 197, 94, 0.1)' :
                                                                song.playStatus === 'paused' ? 'rgba(249, 115, 22, 0.1)' :
                                                                song.playStatus === 'played' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(216, 185, 138, 0.1)',
                                                            color: 
                                                                song.playStatus === 'playing' ? '#22c55e' :
                                                                song.playStatus === 'paused' ? '#f97316' :
                                                                song.playStatus === 'played' ? 'var(--color-text-secondary)' : 'var(--color-primary-500)',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 28,
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                </MuiTableCell>
                                                <MuiTableCell>
                                                    <MuiBox sx={{ display: 'flex', gap: 1 }}>
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => handlePlayPause(song)}
                                                            sx={{
                                                                background: song.playStatus === 'playing' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                                '&:hover': {
                                                                    background: song.playStatus === 'playing' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                                    color: song.playStatus === 'playing' ? '#f97316' : '#22c55e'
                                                                }
                                                            }}
                                                        >
                                                            {song.playStatus === 'playing' ? <Pause size={16} /> : <Play size={16} />}
                                                        </MuiIconButton>
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => openEditDialog(song)}
                                                            sx={{
                                                                background: 'rgba(216, 185, 138, 0.1)',
                                                                '&:hover': {
                                                                    background: 'rgba(216, 185, 138, 0.2)',
                                                                    color: 'var(--color-primary-500)'
                                                                }
                                                            }}
                                                        >
                                                            <Edit2 size={16} />
                                                        </MuiIconButton>
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => openDeleteDialog(song)}
                                                            sx={{
                                                                background: 'rgba(220, 38, 38, 0.1)',
                                                                '&:hover': {
                                                                    background: 'rgba(220, 38, 38, 0.2)',
                                                                    color: '#dc2626'
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </MuiIconButton>
                                                    </MuiBox>
                                                </MuiTableCell>
                                            </MuiTableRow>
                                        ))
                                    )}
                                </MuiTableBody>
                            </MuiTable>
                        </MuiTableContainer>
                    </MuiPaper>
                </>
            ) : (
                <MuiPaper
                    elevation={0}
                    sx={{
                        p: 6,
                        background: 'var(--color-surface-dark)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '24px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }
                    }}
                >
                    <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                        <Music size={64} style={{ 
                            color: 'var(--color-text-disabled)', 
                            opacity: 0.5,
                            margin: '0 auto 1.5rem'
                        }} />
                        <MuiTypography variant="h6" sx={{ 
                            color: 'var(--color-text-secondary)', 
                            mb: 2, 
                            fontWeight: 700 
                        }}>
                            اختر فعالية
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                            يرجى اختيار الفعالية لإدارة أغانيها
                        </MuiTypography>
                    </MuiBox>
                </MuiPaper>
            )}

            {/* Add/Edit Song Dialog */}
            <SongDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                song={isEdit ? editingSong : null}
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

// Song Dialog Component
function SongDialog({ open, onClose, song, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        title: song?.title || '',
        artist: song?.artist || '',
        url: song?.url || '',
        duration: song?.duration || '',
        scheduledTime: song?.scheduledTime ? new Date(song.scheduledTime).toISOString().slice(0, 16) : '',
        notes: song?.notes || ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <MuiPaper
                elevation={0}
                sx={{
                    p: 4,
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 4 
                }}>
                    {song ? 'تعديل الأغنية' : 'إضافة أغنية جديدة'}
                </MuiTypography>

                <form onSubmit={handleSubmit}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <MuiTextField
                            label="عنوان الأغنية"
                            value={formData.title}
                            onChange={handleChange('title')}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiTextField
                            label="الفنان"
                            value={formData.artist}
                            onChange={handleChange('artist')}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiTextField
                            label="رابط الأغنية"
                            value={formData.url}
                            onChange={handleChange('url')}
                            required
                            fullWidth
                            placeholder="https://example.com/song.mp3"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiTextField
                            label="المدة"
                            value={formData.duration}
                            onChange={handleChange('duration')}
                            required
                            fullWidth
                            placeholder="04:30"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiTextField
                            label="وقت التشغيل"
                            type="datetime-local"
                            value={formData.scheduledTime}
                            onChange={handleChange('scheduledTime')}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiTextField
                            label="ملاحظات"
                            value={formData.notes}
                            onChange={handleChange('notes')}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiBox sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <MuiButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    borderRadius: '12px',
                                    py: 2,
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: '#1A1A1A',
                                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                    }
                                }}
                            >
                                {loading ? 'جاري الحفظ...' : 'حفظ'}
                            </MuiButton>
                            <MuiButton
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={onClose}
                                sx={{
                                    borderRadius: '12px',
                                    py: 2,
                                    borderColor: 'var(--color-border-glass)',
                                    color: 'var(--color-text-primary-dark)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                    }
                                }}
                            >
                                إلغاء
                            </MuiButton>
                        </MuiBox>
                    </MuiBox>
                </form>
            </MuiPaper>
        </MuiBox>
    )
}
