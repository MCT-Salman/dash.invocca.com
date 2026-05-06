// src\pages\manager\HallManagementNew.jsx
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAuth, useCRUD, useDialogState } from '@/hooks'
import { formatDate, getImageUrl, formatCurrency } from '@/utils/helpers'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiDialog from '@/components/ui/MuiDialog'
import { LoadingScreen, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerHall, updateHallInfo } from '@/api/manager'
import {
    Building2,
    MapPin,
    Users,
    Edit2,
    CheckCircle,
    Star,
    Tag,
    DollarSign,
    Armchair,
    Table as TableIcon,
    Music,
    Layout,
    X,
    ZoomIn
} from 'lucide-react'
import EditHallDialog from './components/EditHallDialog'

const StatCard = ({ title, value, icon: Icon }) => (
    <MuiPaper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: 2.5
        }}
    >
        <MuiBox sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-icon)', border: '1px solid var(--color-border)' }}>
            <Icon size={26} strokeWidth={2.5} />
        </MuiBox>
        <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>{title}</MuiTypography>
            <MuiTypography variant="h5" sx={{ fontWeight: 800 }}>{value}</MuiTypography>
        </MuiBox>
    </MuiPaper>
)

export default function HallManagement() {
    const [previewImage, setPreviewImage] = useState(null)
    const {
        selectedItem: selectedHall,
        openEditDialog,
        closeDialog,
        isEdit,
    } = useDialogState()

    const {
        handleUpdate,
        isLoading: crudLoading,
    } = useCRUD({
        updateFn: updateHallInfo,
        queryKey: QUERY_KEYS.MANAGER_HALL,
        successMessage: 'تم تحديث معلومات القاعة بنجاح',
    })

    const { data: hallData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_HALL,
        queryFn: getManagerHall,
    })

    const hall = useMemo(() => hallData?.hall || hallData || {}, [hallData])

    const getFullImageUrl = (path) => {
        if (!path) return ''
        if (path.startsWith('http')) return path
        const baseUrl = import.meta.env.VITE_API_BASE || 'http://82.137.244.167:5001'
        const cleanPath = path.startsWith('/') ? path : `/${path}`
        return `${baseUrl}${cleanPath}`
    }

    if (isLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة القاعة | INVOCCA" />

            {/* Header with Stats */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="السعة الإجمالية" value={hall.capacity || 0} icon={Users} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="عدد الطاولات" value={hall.tables || 0} icon={TableIcon} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="عدد الكراسي" value={hall.chairs || 0} icon={Armchair} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="السعر الافتراضي" value={formatCurrency(hall.defaultPrices || 0)} icon={DollarSign} />
                </MuiGrid>
            </MuiGrid>

            {/* Hall Info Card */}
            <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', mb: 4 }}>
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MuiBox sx={{ width: 80, height: 80, borderRadius: '20px', background: 'linear-gradient(135deg, var(--color-icon), var(--color-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-icon)' }}>
                            <Building2 size={40} style={{ color: 'white' }} />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{hall.name || 'اسم القاعة'}</MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-icon)' }}>
                                <MapPin size={18} />
                                <MuiTypography variant="body1" sx={{ fontWeight: 500 }}>{hall.location || 'الموقع غير محدد'}</MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>
                    <MuiButton variant="contained" startIcon={<Edit2 size={18} />} onClick={() => openEditDialog(hall)} sx={{ borderRadius: '12px', px: 3 }}>تعديل البيانات</MuiButton>
                </MuiBox>

                <MuiDivider sx={{ mb: 4 }} />

                <MuiGrid container spacing={4}>
                    <MuiGrid item xs={12} md={8}>
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>عن القاعة</MuiTypography>
                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, mb: 4 }}>
                            {hall.description || 'لا يوجد وصف متاح لهذه القاعة حالياً.'}
                        </MuiTypography>

                        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>الخدمات المتوفرة</MuiTypography>
                        <MuiGrid container spacing={2} sx={{ mb: 4 }}>
                            {hall.services?.map((service, index) => (
                                <MuiGrid item xs={12} sm={6} key={index}>
                                    <MuiPaper sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.01)' }}>
                                        <CheckCircle size={20} style={{ color: 'var(--color-icon)' }} />
                                        <MuiBox>
                                            <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{service.name}</MuiTypography>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(service.price || 0)}</MuiTypography>
                                        </MuiBox>
                                    </MuiPaper>
                                </MuiGrid>
                            ))}
                        </MuiGrid>

                        {hall.images?.length > 0 && (
                            <>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>معرض الصور</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {hall.images.map((img, idx) => (
                                        <MuiGrid item xs={6} sm={4} key={idx}>
                                            <MuiBox 
                                                onClick={() => setPreviewImage(getFullImageUrl(img.url))}
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 120, 
                                                    borderRadius: '12px', 
                                                    overflow: 'hidden', 
                                                    border: '1px solid var(--color-border)',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    '&:hover img': { transform: 'scale(1.1)' },
                                                    '&:hover .overlay': { opacity: 1 }
                                                }}
                                            >
                                                <img src={getFullImageUrl(img.url)} alt={hall.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                                                <MuiBox className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}>
                                                    <ZoomIn color="white" size={24} />
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiGrid>
                                    ))}
                                </MuiGrid>
                            </>
                        )}
                    </MuiGrid>

                    <MuiGrid item xs={12} md={4}>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <MuiPaper sx={{ p: 3, borderRadius: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)' }}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Music size={20} color="var(--color-icon)" /> قائمة الأغاني ({hall.songs?.length || 0})
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {hall.songs?.slice(0, 5).map((song, i) => (
                                        <MuiBox key={i} sx={{ p: 1.5, borderRadius: '10px', border: '1px solid var(--color-border)', bgcolor: 'rgba(255,255,255,0.01)' }}>
                                            <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{song.title}</MuiTypography>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{song.artist}</MuiTypography>
                                        </MuiBox>
                                    ))}
                                </MuiBox>
                            </MuiPaper>

                            <MuiPaper sx={{ p: 3, borderRadius: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)' }}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Layout size={20} color="var(--color-icon)" /> القوالب المستخدمة ({hall.templates?.length || 0})
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {hall.templates?.map((t, i) => (
                                        <MuiBox key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <MuiBox sx={{ width: 40, height: 40, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => setPreviewImage(getFullImageUrl(t.template?.imageUrl))}>
                                                <img src={getFullImageUrl(t.template?.imageUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </MuiBox>
                                            <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{t.template?.templateName || 'قالب دعوة'}</MuiTypography>
                                        </MuiBox>
                                    ))}
                                </MuiBox>
                            </MuiPaper>
                        </MuiBox>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            <EditHallDialog
                open={isEdit}
                onClose={closeDialog}
                hall={hall}
                onSubmit={async (data) => {
                    const result = await handleUpdate(hall._id, data)
                    if (result.success) closeDialog()
                }}
                loading={crudLoading}
            />

            {/* Image Preview Dialog */}
            <MuiDialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="lg">
                <MuiBox sx={{ position: 'relative', p: 1, bgcolor: 'var(--color-paper)' }}>
                    <MuiIconButton onClick={() => setPreviewImage(null)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }, zIndex: 10 }}>
                        <X size={20} />
                    </MuiIconButton>
                    <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px', display: 'block' }} />
                </MuiBox>
            </MuiDialog>
        </MuiBox>
    )
}
