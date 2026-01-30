// src\pages\manager\SongsManagement.jsx
/**
 * Manager Songs Management Page
 * صفحة إدارة أغاني قاعة/صالة للمدير
 */

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// MUI & UI
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiTabs from '@/components/ui/MuiTabs'
import MuiChip from '@/components/ui/MuiChip'

import {
  Music,
  Search,
  Plus,
  RefreshCw,
  Download,
  Trash2,
  Link2,
} from 'lucide-react'

// Common components
import {
  LoadingScreen,
  EmptyState,
  SEOHead,
  DataTable,
  FormDialog,
  ConfirmDialog,
} from '@/components/common'
import { BaseViewDialog } from '@/components/shared'

// Hooks & utils
import { useNotification, useDebounce, useDialogState } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getHallSongs, addHallSong, updateHallSong, deleteHallSong, toggleHallSongActive } from '@/api/manager'
import { formatDate, generateExportFileName } from '@/utils/helpers'
import EventSongsConnectionTab from './components/EventSongsConnectionTab'

export default function ManagerSongsManagement() {
  const { addNotification: showNotification } = useNotification()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 400)
  const [categoryFilter, setCategoryFilter] = useState('all')

  const {
    selectedItem: selectedSong,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isEdit,
    isView,
    isDelete,
  } = useDialogState()

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: '',
    notes: '',
  })

  // Fetch songs for manager hall
  const { data: songsData, isLoading, refetch } = useQuery({
    queryKey: ['manager', 'hall-songs'],
    queryFn: getHallSongs,
    staleTime: 5 * 60 * 1000,
  })

  const songs = useMemo(() => {
    if (Array.isArray(songsData?.data)) return songsData.data
    if (Array.isArray(songsData?.songs)) return songsData.songs
    if (Array.isArray(songsData)) return songsData
    return []
  }, [songsData])

  const filteredSongs = useMemo(() => {
    let list = songs

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (song) =>
          song.title?.toLowerCase().includes(q) ||
          song.artist?.toLowerCase().includes(q) ||
          song.notes?.toLowerCase().includes(q),
      )
    }

    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter((song) => song.category === categoryFilter)
    }

    return list
  }, [songs, debouncedSearch, categoryFilter])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => addHallSong(data),
    onSuccess: () => {
      showNotification({
        title: 'نجاح',
        message: 'تم إضافة الأغنية بنجاح',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['manager', 'hall-songs'] })
      closeDialog()
    },
    onError: (error) => {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || 'فشل في إضافة الأغنية',
        type: 'error',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateHallSong(id, data),
    onSuccess: () => {
      showNotification({
        title: 'نجاح',
        message: 'تم تحديث الأغنية بنجاح',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['manager', 'hall-songs'] })
      closeDialog()
    },
    onError: (error) => {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || 'فشل في تحديث الأغنية',
        type: 'error',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (songId) => deleteHallSong(songId),
    onSuccess: () => {
      showNotification({
        title: 'نجاح',
        message: 'تم حذف الأغنية بنجاح',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['manager', 'hall-songs'] })
      closeDialog()
    },
    onError: (error) => {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || 'فشل في حذف الأغنية',
        type: 'error',
      })
    },
  })

  // Toggle isActive mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleHallSongActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'hall-songs'] })
    },
  })

  const categoryConfig = {
    wedding: { label: 'زفاف', color: 'error' },
    party: { label: 'حفلة', color: 'warning' },
    slow: { label: 'هادئة', color: 'info' },
    other: { label: 'أخرى', color: 'default' },
  }

  const columns = [
    {
      id: 'title',
      label: 'عنوان الأغنية',
      align: 'right',
      format: (value, row) => (
        <MuiBox sx={{ display: 'flex', flexDirection: 'column' }}>
          <MuiTypography
            variant="body2"
            sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
          >
            {value}
          </MuiTypography>
          {row.artist && (
            <MuiTypography
              variant="caption"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              {row.artist}
            </MuiTypography>
          )}
        </MuiBox>
      ),
    },
    {
      id: 'category',
      label: 'الفئة',
      align: 'center',
      format: (value) => {
        const config = categoryConfig[value]
        if (!config && !value) return '—'
        return (
          <MuiChip
            label={config?.label || value}
            color={config?.color}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )
      },
    },
    {
      id: 'notes',
      label: 'ملاحظات',
      align: 'left',
      format: (value) => value || '—',
    },
    {
      id: 'createdAt',
      label: 'تاريخ الإضافة',
      align: 'center',
      format: (value) =>
        value ? formatDate(value, 'DD/MM/YYYY HH:mm') : '—',
    },
    {
      id: 'isActive',
      label: 'الحالة',
      align: 'center',
      format: (value) => (value ? 'نشطة' : 'غير نشطة'),
    },
  ]

  const handleCreateClick = () => {
    openCreateDialog()
    setFormData({
      title: '',
      artist: '',
      category: '',
      notes: '',
    })
  }

  const handleEditClick = (song) => {
    openEditDialog(song)
    setFormData({
      title: song.title || '',
      artist: song.artist || '',
      category: song.category || '',
      notes: song.notes || '',
    })
  }

  const handleDeleteConfirm = async () => {
    const id = selectedSong?._id || selectedSong?.id
    if (!id) return
    await deleteMutation.mutateAsync(id)
  }

  const handleToggleStatus = async (song) => {
    const id = song?._id || song?.id
    if (!id) return
    try {
      await toggleActiveMutation.mutateAsync({ id, isActive: !song.isActive })
      showNotification({
        title: 'تم التحديث',
        message: `تم ${!song.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الأغنية بنجاح`,
        type: 'success',
      })
    } catch (error) {
      showNotification({
        title: 'خطأ',
        message: error?.response?.data?.message || 'فشل في تحديث حالة الأغنية',
        type: 'error',
      })
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    const id = selectedSong?._id || selectedSong?.id

    const payload = {
      title: formData.title,
      artist: formData.artist,
      category: formData.category || 'other',
      notes: formData.notes || '',
    }

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
    } catch {
      // handled in mutation
    }
  }

  const handleRefresh = () => {
    refetch()
    showNotification({
      title: 'تم التحديث',
      message: 'تم تحديث قائمة الأغاني',
      type: 'success',
    })
  }

  const handleExport = () => {
    const dataToExport = filteredSongs.map((song) => ({
      'العنوان': song.title,
      'الفنان': song.artist,
      'الفئة': song.category,
      'ملاحظات': song.notes,
      'تاريخ الإضافة': song.createdAt
        ? formatDate(song.createdAt, 'DD/MM/YYYY HH:mm')
        : '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الأغاني')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, generateExportFileName('أغاني_القاعة'))
  }

  if (isLoading) {
    return <LoadingScreen message="جاري تحميل الأغاني..." />
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead pageKey="managerSongs" title="إدارة أغاني القاعة/الصالة | INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <MuiBox
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-primary-500)',
            }}
          >
            <Music size={26} style={{ color: '#fff' }} />
          </MuiBox>
          <MuiBox>
            <MuiTypography
              variant="h4"
              sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 0.5 }}
            >
              إدارة أغاني القاعة/الصالة
            </MuiTypography>
            <MuiTypography
              variant="body2"
              sx={{ color: 'var(--color-primary-300)' }}
            >
              إدارة أغاني القاعة وربط الأغاني بقوائم التشغيل للفعاليات
            </MuiTypography>
          </MuiBox>
        </MuiBox>
      </MuiBox>

      {/* Tabs */}
      <MuiPaper
        elevation={0}
        sx={{
          mb: 4.5,
          background: 'var(--color-paper)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <MuiTabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          tabs={[
            { label: 'إدارة الأغاني', icon: <Music size={18} /> },
            { label: 'ربط الأغاني', icon: <Link2 size={18} /> }
          ]}
          sx={{
            borderBottom: '1px solid var(--color-border-glass)',
            '& .MuiTab-root': {
              color: 'var(--color-text-secondary)',
              '&.Mui-selected': {
                color: 'var(--color-primary-500)',
              }
            }
          }}
        />
      </MuiPaper>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <>
      {/* Filters */}
      <MuiPaper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'var(--color-paper)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '16px',
        }}
      >
        <MuiGrid container spacing={2} alignItems="center">
          <MuiGrid item xs={12} md={6}>
            <MuiTextField
              fullWidth
              placeholder="بحث عن أغنية أو فنان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <MuiInputAdornment position="start">
                    <Search size={18} style={{ color: 'var(--color-text-secondary)' }} />
                  </MuiInputAdornment>
                ),
              }}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiSelect
              fullWidth
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MuiMenuItem value="all">كل الفئات</MuiMenuItem>
              <MuiMenuItem value="wedding">زفاف</MuiMenuItem>
              <MuiMenuItem value="party">حفلة</MuiMenuItem>
              <MuiMenuItem value="slow">هادئة</MuiMenuItem>
              <MuiMenuItem value="other">أخرى</MuiMenuItem>
            </MuiSelect>
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiBox sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <MuiButton
                variant="contained"
                color="primary"
                startIcon={<Plus size={18} />}
                onClick={handleCreateClick}
              >
                إضافة أغنية
              </MuiButton>
              <MuiIconButton color="info" onClick={handleRefresh}>
                <RefreshCw size={18} />
              </MuiIconButton>
              <MuiIconButton color="success" onClick={handleExport}>
                <Download size={18} />
              </MuiIconButton>
            </MuiBox>
          </MuiGrid>
        </MuiGrid>
      </MuiPaper>

      {/* Table */}
      <MuiPaper
        elevation={0}
        sx={{
          background: 'var(--color-paper)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {filteredSongs.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredSongs}
            onView={openViewDialog}
            onEdit={handleEditClick}
            onDelete={openDeleteDialog}
            onToggleStatus={handleToggleStatus}
            enableRowActions
          />
        ) : (
          <EmptyState
            title="لا توجد أغاني"
            description="لم تتم إضافة أي أغاني بعد لهذه القاعة/الصالة."
            icon={Music}
            showPaper={false}
          />
        )}
      </MuiPaper>

      {/* Create/Edit Dialog */}
      <FormDialog
        open={isCreate || isEdit}
        onClose={closeDialog}
        title={isEdit ? 'تعديل الأغنية' : 'إضافة أغنية جديدة'}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        submitText={isEdit ? 'تحديث' : 'إضافة'}
        cancelText="إلغاء"
        maxWidth="sm"
      >
        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12}>
            <MuiTextField
              fullWidth
              label="عنوان الأغنية"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </MuiGrid>
          <MuiGrid item xs={12}>
            <MuiTextField
              fullWidth
              label="اسم الفنان"
              value={formData.artist}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, artist: e.target.value }))
              }
              required
            />
          </MuiGrid>
          <MuiGrid item xs={12}>
            <MuiSelect
              fullWidth
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              displayEmpty
            >
              <MuiMenuItem value="">
                <em>اختر الفئة</em>
              </MuiMenuItem>
              <MuiMenuItem value="wedding">زفاف</MuiMenuItem>
              <MuiMenuItem value="party">حفلة</MuiMenuItem>
              <MuiMenuItem value="slow">هادئة</MuiMenuItem>
              <MuiMenuItem value="other">أخرى</MuiMenuItem>
            </MuiSelect>
          </MuiGrid>
          <MuiGrid item xs={12}>
            <MuiTextField
              fullWidth
              label="ملاحظات"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </MuiGrid>
        </MuiGrid>
      </FormDialog>

        </>
      ) : (
        <EventSongsConnectionTab />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="حذف الأغنية"
        message={`هل أنت متأكد من حذف الأغنية "${selectedSong?.title || ''}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        loading={deleteMutation.isPending}
        confirmColor="error"
        icon={Trash2}
      />

      {/* View Song Details */}
      <BaseViewDialog
        open={isView && !!selectedSong}
        onClose={closeDialog}
        maxWidth="sm"
        title={selectedSong?.title || 'تفاصيل الأغنية'}
      >
        {selectedSong && (
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12}>
              <MuiTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                معلومات الأغنية
              </MuiTypography>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                العنوان
              </MuiTypography>
              <MuiTypography variant="body1">
                {selectedSong.title || '—'}
              </MuiTypography>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                الفنان
              </MuiTypography>
              <MuiTypography variant="body1">
                {selectedSong.artist || '—'}
              </MuiTypography>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                الفئة
              </MuiTypography>
              <MuiBox sx={{ mt: 0.5 }}>
                {selectedSong.category ? (
                  <MuiChip
                    label={categoryConfig[selectedSong.category]?.label || selectedSong.category}
                    color={categoryConfig[selectedSong.category]?.color}
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <MuiTypography variant="body1">—</MuiTypography>
                )}
              </MuiBox>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                الحالة
              </MuiTypography>
              <MuiTypography variant="body1">
                {selectedSong.isActive ? 'نشطة' : 'غير نشطة'}
              </MuiTypography>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                تاريخ الإضافة
              </MuiTypography>
              <MuiTypography variant="body1">
                {selectedSong.createdAt
                  ? formatDate(selectedSong.createdAt, 'DD/MM/YYYY HH:mm')
                  : '—'}
              </MuiTypography>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6}>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                آخر تحديث
              </MuiTypography>
              <MuiTypography variant="body1">
                {selectedSong.updatedAt
                  ? formatDate(selectedSong.updatedAt, 'DD/MM/YYYY HH:mm')
                  : '—'}
              </MuiTypography>
            </MuiGrid>
            {selectedSong.notes && (
              <MuiGrid item xs={12}>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                  الملاحظات
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedSong.notes}
                </MuiTypography>
              </MuiGrid>
            )}
          </MuiGrid>
        )}
      </BaseViewDialog>
    </MuiBox>
  )
}


