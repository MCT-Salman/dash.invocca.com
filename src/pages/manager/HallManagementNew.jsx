// src/pages/manager/HallManagementNew.jsx
/**
 * Hall Management Page - Enhanced Design
 * إدارة قاعة/صالة - تصميم محسّن ومتجاوب
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth, useCRUD, useDialogState } from '@/hooks'
import { formatDate } from '@/utils/helpers'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS, API_CONFIG } from '@/config/constants'
import { getManagerHall, updateHallInfo } from '@/api/manager'
import { listServices } from '@/api/services'
import { getImageUrl } from '@/utils/helpers'
import EditHallDialog from './components/EditHallDialog'
import {
    Building2,
    MapPin,
    Users,
    Armchair,
    Table,
    Edit2,
    RefreshCw,
    X,
    CheckCircle,
    XCircle,
    Star,
    Award,
    Sparkles,
    Info,
    Phone,
    Mail,
    Tag,
    DollarSign,
    Image as ImageIcon,
    Calendar,
    Clock,
    Hash,
    UserCheck,
    User,
    Music,
    FileImage
} from 'lucide-react'

/**
 * Info Card Component - Premium Design
 */
function InfoCard({ icon: Icon, label, value, color = 'var(--color-primary-500)', gradient }) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3.5,
                height: '100%',
                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(216, 185, 138, 0.15)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${color} 0%, ${color}80 50%, transparent 100%)`,
                    opacity: 0.6,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                },
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${color}20`,
                    borderColor: `${color}60`,
                    '&::after': {
                        opacity: 1,
                    },
                    '& .info-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        background: gradient || `linear-gradient(135deg, ${color}, ${color}CC)`,
                    }
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                <MuiBox
                    className="info-icon"
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${color}30`,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: `0 4px 12px ${color}15`,
                    }}
                >
                    <Icon size={32} style={{ color, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                </MuiBox>
                <MuiBox sx={{ flex: 1 }}>
                    <MuiTypography 
                        variant="body2" 
                        sx={{ 
                            color: 'var(--color-text-secondary)', 
                            mb: 1, 
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            display: 'block',
                        }}
                    >
                        {label}
                    </MuiTypography>
                    <MuiTypography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: typeof value === 'string' && (value.includes('/') || value.includes('ل.س')) ? '1rem' : '1.75rem',
                            color: color,
                        }}
                    >
                        {value}
                    </MuiTypography>
                </MuiBox>
            </MuiBox>
        </MuiPaper>
    )
}

/**
 * Service Card Component - Premium Design
 */
function ServiceCard({ service }) {
    // Extract all service details
    const serviceName = service.name || 'خدمة'
    const serviceDescription = service.description || ''
    const serviceCategory = service.category || ''
    const servicePrice = service.price || service.basePrice || service.customPrice || 0
    const serviceUnit = service.unit || 'per_event'
    const isIncluded = service.isIncluded !== false
    const notes = service.notes || ''

    const categoryLabels = {
        catering: 'الضيافة',
        decoration: 'الديكور',
        photography: 'التصوير',
        entertainment: 'الترفيه',
        music: 'الموسيقى',
        security: 'الأمان',
        cleaning: 'التنظيف',
        other: 'أخرى'
    }

    const unitLabels = {
        per_event: 'لكل فعالية',
        per_person: 'لكل شخص',
        per_hour: 'لكل ساعة',
        per_day: 'لكل يوم',
        fixed: 'ثابت'
    }

    const categoryLabel = categoryLabels[serviceCategory] || serviceCategory || '—'
    const unitLabel = unitLabels[serviceUnit] || serviceUnit || '—'

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3.5,
                height: '100%',
                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.7) 0%, rgba(10, 10, 10, 0.8) 100%)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(216, 185, 138, 0.12)',
                borderRadius: '18px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.08), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                },
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    borderColor: 'rgba(216, 185, 138, 0.5)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(216, 185, 138, 0.2)',
                    '&::before': {
                        opacity: 1,
                    },
                    '& .service-icon': {
                        transform: 'scale(1.15) rotate(-5deg)',
                        boxShadow: '0 8px 20px rgba(216, 185, 138, 0.4)',
                    }
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                    <MuiBox
                        className="service-icon"
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                            border: '2px solid rgba(216, 185, 138, 0.4)',
                            flexShrink: 0,
                        }}
                    >
                        <CheckCircle size={24} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                    </MuiBox>
                    <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography 
                            variant="body1" 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'var(--color-text-primary-dark)',
                                mb: 0.5,
                                fontSize: '1.1rem',
                                lineHeight: 1.4
                            }}
                        >
                            {serviceName}
                        </MuiTypography>
                        {serviceDescription && (
                            <MuiTypography 
                                variant="caption" 
                                sx={{ 
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.6,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {serviceDescription}
                            </MuiTypography>
                        )}
                    </MuiBox>
                </MuiBox>

                {/* Details */}
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Category */}
                    {serviceCategory && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tag size={16} style={{ color: 'var(--color-primary-400)' }} />
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                                الفئة:
                            </MuiTypography>
                            <MuiChip
                                label={categoryLabel}
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                    color: 'var(--color-primary-400)',
                                    fontSize: '0.7rem',
                                    height: 22,
                                    fontWeight: 600
                                }}
                            />
                        </MuiBox>
                    )}

                    {/* Unit */}
                    {serviceUnit && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                                وحدة القياس:
                            </MuiTypography>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.8rem' }}>
                                {unitLabel}
                            </MuiTypography>
                        </MuiBox>
                    )}

                    {/* Price */}
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                            السعر الأساسي:
                        </MuiTypography>
                        <MuiChip
                            label={`${servicePrice.toLocaleString()} ل.س`}
                            size="small"
                            sx={{
                                backgroundColor: '#FFE36C',
                                color: '#1A1A1A',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                height: 24,
                                px: 1,
                                border: '2px solid rgba(255, 227, 108, 0.3)',
                                boxShadow: '0 2px 8px rgba(255, 227, 108, 0.2)',
                            }}
                        />
                    </MuiBox>

                    {/* Included Status */}
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                            الحالة:
                        </MuiTypography>
                        <MuiChip
                            label={isIncluded ? 'مشمول' : 'غير مشمول'}
                            size="small"
                            icon={isIncluded ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            sx={{
                                backgroundColor: isIncluded ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                color: isIncluded ? '#16a34a' : '#dc2626',
                                fontSize: '0.7rem',
                                height: 22,
                                fontWeight: 600
                            }}
                        />
                    </MuiBox>

                    {/* Notes */}
                    {notes && (
                        <MuiBox sx={{ mt: 0.5 }}>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                                ملاحظات:
                            </MuiTypography>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-primary)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                {notes}
                            </MuiTypography>
                        </MuiBox>
                    )}
                </MuiBox>
            </MuiBox>
        </MuiPaper>
    )
}

/**
 * Main Hall Management Component
 */
export default function HallManagement() {
    const { user } = useAuth()

    // Dialog state management
    const {
        dialogOpen,
        openEditDialog,
        closeDialog,
        isEdit,
    } = useDialogState()

    // CRUD operations - Only update for hall
    const {
        updateMutation,
        handleUpdate,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: null, // Not used
        updateFn: updateHallInfo,
        deleteFn: null, // Not used
        queryKey: QUERY_KEYS.MANAGER_HALL,
        successMessage: 'تم تحديث معلومات قاعة/صالة بنجاح',
        errorMessage: 'حدث خطأ أثناء تحديث معلومات قاعة/صالة',
    })

    // Fetch hall info
    const { data: hallData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_HALL,
        queryFn: getManagerHall,
    })

    const hall = hallData?.hall || hallData || {}
    
    // Get service IDs from hall.services
    const hallServiceIds = Array.isArray(hall.services) 
        ? hall.services.map(s => s.service || s.serviceId || s._id).filter(Boolean)
        : []

    // Fetch all services to get details
    const { data: servicesData } = useQuery({
        queryKey: ['services', 'list'],
        queryFn: () => listServices({ limit: 1000 }),
        enabled: hallServiceIds.length > 0,
        staleTime: 5 * 60 * 1000
    })

    // Get all services and filter by hall service IDs
    const allServices = Array.isArray(servicesData?.services) 
        ? servicesData.services 
        : Array.isArray(servicesData?.data) 
            ? servicesData.data 
            : Array.isArray(servicesData) 
                ? servicesData 
                : []

    // Map hall services with full service details - services now include full service object
    const servicesWithDetails = Array.isArray(hall.services) 
        ? hall.services.map(hallService => {
            // Extract service details from hallService.service object (new structure)
            const serviceDetails = hallService.service || {}
            return {
                ...hallService,
                // Service details
                name: serviceDetails.name || hallService.name || 'خدمة',
                description: serviceDetails.description || hallService.description || '',
                category: serviceDetails.category || '',
                basePrice: serviceDetails.basePrice || 0,
                unit: serviceDetails.unit || 'per_event',
                // Hall service specific
                isIncluded: hallService.isIncluded !== false,
                notes: hallService.notes || '',
                customPrice: hallService.customPrice,
                price: hallService.customPrice || serviceDetails.basePrice || 0
            }
        })
        : []

    const handleEdit = () => {
        openEditDialog(hall)
    }

    const handleSave = async (data) => {
        // Clean and prepare data for API - ensure all values are properly formatted
        const cleanData = {
            name: String(data.name || '').trim(),
            location: String(data.location || '').trim(),
            capacity: Number(data.capacity) || 0,
            tables: Number(data.tables) || 0,
            chairs: Number(data.chairs) || 0
        }
        
        // Add description only if it exists and is not empty
        if (data.description && String(data.description).trim()) {
            cleanData.description = String(data.description).trim()
        }
        
        // Use handleUpdate which will call updateMutation
        const result = await handleUpdate(null, cleanData)
        if (result?.success) {
            closeDialog()
        }
    }

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <>
            <SEOHead title="إدارة قاعة/صالة" />

            <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
                {/* Header Section - Premium Welcome Card */}
                <MuiBox
                    sx={{
                        mb: 5,
                        p: { xs: 3, sm: 4.5, md: 5 },
                        borderRadius: '24px',
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(216, 185, 138, 0.2)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(216, 185, 138, 0.1)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.12) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 4s ease-in-out infinite',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-30%',
                            left: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 5s ease-in-out infinite',
                        }
                    }}
                >
                    <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 3 }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                            <MuiBox
                                sx={{
                                    width: { xs: 64, sm: 72 },
                                    height: { xs: 64, sm: 72 },
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--color-primary-400)',
                                    boxShadow: '0 10px 30px rgba(216, 185, 138, 0.3), 0 0 20px rgba(216, 185, 138, 0.2)',
                                }}
                            >
                                <Building2 size={36} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                            </MuiBox>
                            <MuiBox sx={{ flex: 1 }}>
                                <MuiTypography 
                                    variant="h4" 
                                    sx={{ 
                                        color: 'var(--color-text-primary-dark)', 
                                        fontWeight: 800, 
                                        mb: 1,
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                        background: 'linear-gradient(135deg, var(--color-text-primary-dark), var(--color-primary-500))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    إدارة قاعة/صالة
                                </MuiTypography>
                                <MuiTypography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'var(--color-primary-400)',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        fontWeight: 500,
                                        letterSpacing: '0.3px'
                                    }}
                                >
                                    عرض وتحديث معلومات قاعة/صالة والخدمات
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>

                        <MuiBox sx={{ display: 'flex', gap: 2 }}>
                            <MuiButton
                                variant="outlined"
                                startIcon={<RefreshCw size={20} />}
                                onClick={handleRefresh}
                                sx={{
                                    height: '56px',
                                    borderRadius: '14px',
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                    color: 'var(--color-text-secondary)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        background: 'rgba(216, 185, 138, 0.05)'
                                    }
                                }}
                            >
                                تحديث
                            </MuiButton>
                            <MuiButton
                                variant="contained"
                                startIcon={<Edit2 size={20} />}
                                size="large"
                                onClick={handleEdit}
                                sx={{
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '14px',
                                    boxShadow: '0 8px 20px rgba(216, 185, 138, 0.4)',
                                    border: '2px solid rgba(216, 185, 138, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 28px rgba(216, 185, 138, 0.5)',
                                        background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-800))',
                                    }
                                }}
                            >
                                تعديل المعلومات
                            </MuiButton>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                {/* Hall Info Section */}
                <MuiPaper
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        overflow: 'hidden',
                        mb: 4.5,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {/* Header */}
                    <MuiBox 
                        sx={{ 
                            p: { xs: 3, sm: 4, md: 5 },
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                right: '-20%',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                                borderRadius: '50%',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                            <MuiBox 
                                sx={{ 
                                    width: { xs: 64, sm: 80 },
                                    height: { xs: 64, sm: 80 },
                                    borderRadius: '20px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <Building2 size={40} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                            </MuiBox>
                            <MuiBox sx={{ flex: 1 }}>
                                <MuiTypography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#fff',
                                        mb: 1.5,
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    {hall.name || 'قاعة/صالة الأفراح'}
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <MapPin size={18} style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                                    <MuiTypography 
                                        variant="body1" 
                                        sx={{ 
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: 500,
                                            fontSize: { xs: '0.9rem', sm: '1rem' }
                                        }}
                                    >
                                        {hall.location || hall.address || '—'}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    {/* Content */}
                    <MuiBox sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                        {/* Stats Grid */}
                        <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Users}
                                    label="الحد الأقصى للموظفين"
                                    value={hall.maxEmployees || 0}
                                    color="#9333ea"
                                    gradient="linear-gradient(135deg, #9333ea, #7e22ce)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Users}
                                    label="السعة القصوى"
                                    value={hall.capacity || 0}
                                    color="#3b82f6"
                                    gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Armchair}
                                    label="عدد الكراسي"
                                    value={hall.chairs || 0}
                                    color="#FFE36C"
                                    gradient="linear-gradient(135deg, #FFE36C, #ffd93d)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Table}
                                    label="عدد الطاولات"
                                    value={hall.tables || 0}
                                    color="var(--color-primary-500)"
                                    gradient="linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={DollarSign}
                                    label="السعر الافتراضي"
                                    value={hall.defaultPrices ? `${hall.defaultPrices.toLocaleString()} ل.س` : '—'}
                                    color="#16a34a"
                                    gradient="linear-gradient(135deg, #16a34a, #15803d)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Clock}
                                    label="آخر تحديث"
                                    value={hall.updatedAt ? new Date(hall.updatedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '—'}
                                    color="#f59e0b"
                                    gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={Calendar}
                                    label="تاريخ الإنشاء"
                                    value={hall.createdAt ? new Date(hall.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '—'}
                                    color="#3b82f6"
                                    gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <InfoCard
                                    icon={UserCheck}
                                    label="الحالة"
                                    value={hall.isActive !== false ? 'نشط' : 'غير نشط'}
                                    color={hall.isActive !== false ? '#16a34a' : '#dc2626'}
                                    gradient={hall.isActive !== false ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #dc2626, #b91c1c)'}
                                />
                            </MuiGrid>
                        </MuiGrid>

                        {/* Description */}
                        {hall.description && (
                            <>
                                <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)', mb: 3 }} />
                                <MuiBox
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        background: 'rgba(216, 185, 138, 0.05)',
                                        border: '1px solid rgba(216, 185, 138, 0.15)',
                                    }}
                                >
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Info size={20} style={{ color: 'var(--color-primary-500)' }} />
                                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                                            الوصف
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                                        {hall.description}
                                    </MuiTypography>
                                </MuiBox>
                            </>
                        )}


                        {/* Amenities */}
                        {hall.amenities && Array.isArray(hall.amenities) && hall.amenities.length > 0 && (
                            <>
                                <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)', mb: 3, mt: 3 }} />
                                <MuiBox
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        background: 'rgba(216, 185, 138, 0.05)',
                                        border: '1px solid rgba(216, 185, 138, 0.15)',
                                    }}
                                >
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Award size={20} style={{ color: 'var(--color-primary-500)' }} />
                                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                                            المرافق ({hall.amenities.length})
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {hall.amenities.map((amenity, index) => (
                                            <MuiChip
                                                key={index}
                                                label={typeof amenity === 'string' ? amenity : amenity.name || amenity}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                    color: 'var(--color-primary-400)',
                                                    border: '1px solid rgba(216, 185, 138, 0.3)',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                    </MuiBox>
                                </MuiBox>
                            </>
                        )}

                        {/* Images */}
                        {hall.images && Array.isArray(hall.images) && hall.images.length > 0 && (
                            <>
                                <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)', mb: 3, mt: 3 }} />
                                <MuiBox>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <ImageIcon size={20} style={{ color: 'var(--color-primary-500)' }} />
                                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                                            الصور ({hall.images.length})
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiGrid container spacing={2}>
                                        {hall.images.map((image, index) => {
                                            const imageUrl = image.url?.startsWith('http') 
                                                ? image.url 
                                                : `http://82.137.244.167:5001${image.url}`
                                            return (
                                                <MuiGrid item xs={12} sm={6} md={4} key={image._id || index}>
                                                    <MuiPaper
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            background: 'rgba(255,255,255,0.03)',
                                                            border: '1px solid rgba(216, 185, 138, 0.15)',
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <MuiBox
                                                            component="img"
                                                            src={imageUrl}
                                                            alt={image.caption || `صورة ${index + 1}`}
                                                            onClick={() => window.open(imageUrl, '_blank')}
                                                            sx={{
                                                                width: '100%',
                                                                height: '200px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                mb: 1,
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'scale(1.05)',
                                                                }
                                                            }}
                                                        />
                                                        {image.isPrimary && (
                                                            <MuiChip
                                                                label="رئيسية"
                                                                size="small"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 12,
                                                                    right: 12,
                                                                    backgroundColor: 'rgba(22, 163, 74, 0.9)',
                                                                    color: '#fff',
                                                                    fontWeight: 600,
                                                                }}
                                                            />
                                                        )}
                                                        {image.caption && (
                                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                {image.caption}
                                                            </MuiTypography>
                                                        )}
                                                    </MuiPaper>
                                                </MuiGrid>
                                            )
                                        })}
                                    </MuiGrid>
                                </MuiBox>
                            </>
                        )}
                    </MuiBox>
                </MuiPaper>

                {/* Services Section */}
                <MuiPaper
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <MuiBox 
                        sx={{ 
                            p: { xs: 3, sm: 4, md: 5 },
                            background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(255, 227, 108, 0.05))',
                            borderBottom: '1px solid rgba(216, 185, 138, 0.15)',
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MuiBox 
                                sx={{ 
                                    width: { xs: 56, sm: 64 },
                                    height: { xs: 56, sm: 64 },
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 20px rgba(216, 185, 138, 0.3)',
                                    border: '2px solid rgba(216, 185, 138, 0.3)',
                                }}
                            >
                                <Sparkles size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                            </MuiBox>
                            <MuiBox>
                                <MuiTypography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: 'var(--color-text-primary-dark)',
                                        mb: 0.5,
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                    }}
                                >
                                    الخدمات المتوفرة
                                </MuiTypography>
                                <MuiTypography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {servicesWithDetails?.length || 0} خدمة متاحة
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    <MuiBox sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                        {servicesWithDetails && servicesWithDetails.length > 0 ? (
                            <MuiGrid container spacing={3}>
                                {servicesWithDetails.map((service, index) => (
                                    <MuiGrid item xs={12} sm={6} md={4} key={service._id || service.id || index}>
                                        <ServiceCard service={service} />
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        ) : (
                            <EmptyState
                                title="لا توجد خدمات"
                                description="لم يتم إضافة أي خدمات لقاعة/صالة بعد"
                                icon={Sparkles}
                                showPaper={false}
                            />
                        )}
                    </MuiBox>
                </MuiPaper>

                {/* Manager Info Section */}
                {hall.generalManager && (
                    <MuiPaper
                        elevation={0}
                        sx={{
                            borderRadius: '24px',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            overflow: 'hidden',
                            mb: 4.5,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <MuiBox 
                            sx={{ 
                                p: { xs: 3, sm: 4, md: 5 },
                                background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(255, 227, 108, 0.05))',
                                borderBottom: '1px solid rgba(216, 185, 138, 0.15)',
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox 
                                    sx={{ 
                                        width: { xs: 56, sm: 64 },
                                        height: { xs: 56, sm: 64 },
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(216, 185, 138, 0.3)',
                                        border: '2px solid rgba(216, 185, 138, 0.3)',
                                    }}
                                >
                                    <User size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            color: 'var(--color-text-primary-dark)',
                                            mb: 0.5,
                                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                        }}
                                    >
                                        معلومات المدير
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {typeof hall.generalManager === 'object' 
                                            ? (hall.generalManager.name || hall.generalManager.username || '—')
                                            : hall.generalManager
                                        }
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                            <MuiGrid container spacing={3}>
                                {typeof hall.generalManager === 'object' && (
                                    <>
                                        {hall.generalManager.name && (
                                            <MuiGrid item xs={12} md={6}>
                                                <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>الاسم</MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                        {hall.generalManager.name}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiGrid>
                                        )}
                                        {hall.generalManager.username && (
                                            <MuiGrid item xs={12} md={6}>
                                                <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>اسم المستخدم</MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                        {hall.generalManager.username}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiGrid>
                                        )}
                                        {hall.generalManager.phone && (
                                            <MuiGrid item xs={12} md={6}>
                                                <MuiBox sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>رقم الهاتف</MuiTypography>
                                                    <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                        {hall.generalManager.phone}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiGrid>
                                        )}
                                    </>
                                )}
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                )}

                {/* Templates Section */}
                {hall.templates && Array.isArray(hall.templates) && hall.templates.length > 0 && (
                    <MuiPaper
                        elevation={0}
                        sx={{
                            borderRadius: '24px',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            overflow: 'hidden',
                            mb: 4.5,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <MuiBox 
                            sx={{ 
                                p: { xs: 3, sm: 4, md: 5 },
                                background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(255, 227, 108, 0.05))',
                                borderBottom: '1px solid rgba(216, 185, 138, 0.15)',
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox 
                                    sx={{ 
                                        width: { xs: 56, sm: 64 },
                                        height: { xs: 56, sm: 64 },
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(216, 185, 138, 0.3)',
                                        border: '2px solid rgba(216, 185, 138, 0.3)',
                                    }}
                                >
                                    <FileImage size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            color: 'var(--color-text-primary-dark)',
                                            mb: 0.5,
                                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                        }}
                                    >
                                        القوالب ({hall.templates.length})
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        قوالب بطاقات الدعوة المتاحة
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                            <MuiGrid container spacing={2}>
                                {hall.templates.map((templateAssignment, index) => {
                                    const template = templateAssignment.template || {}
                                    const templateImageUrl = template.imageUrl 
                                        ? (template.imageUrl.startsWith('http') 
                                            ? template.imageUrl 
                                            : `${API_CONFIG.BASE_URL}${template.imageUrl}`)
                                        : null
                                    return (
                                        <MuiGrid item xs={12} sm={6} md={4} key={templateAssignment._id || index}>
                                            <MuiBox
                                                sx={{
                                                    position: 'relative',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: '1px solid var(--color-border-glass)',
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    cursor: templateImageUrl ? 'pointer' : 'default',
                                                    transition: 'all 0.2s ease',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    '&:hover': templateImageUrl ? {
                                                        transform: 'scale(1.02)',
                                                        borderColor: 'var(--color-primary-500)',
                                                    } : {}
                                                }}
                                                onClick={() => {
                                                    if (templateImageUrl) window.open(templateImageUrl, '_blank')
                                                }}
                                            >
                                                {templateImageUrl ? (
                                                    <img
                                                        src={templateImageUrl}
                                                        alt={template.templateName || `قالب ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '160px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <MuiBox sx={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(216, 185, 138, 0.1)' }}>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            بدون صورة
                                                        </MuiTypography>
                                                    </MuiBox>
                                                )}
                                                <MuiBox sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <MuiTypography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            color: 'var(--color-text-primary-dark)', 
                                                            mb: 0.5,
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        {template.templateName || template.name || `قالب ${index + 1}`}
                                                    </MuiTypography>
                                                    {template.description && (
                                                        <MuiTypography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: 'var(--color-text-secondary)',
                                                                mb: template.category ? 1 : 0,
                                                                lineHeight: 1.5,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                flex: 1
                                                            }}
                                                        >
                                                            {template.description}
                                                        </MuiTypography>
                                                    )}
                                                    {templateAssignment.isPrimary && (
                                                        <MuiChip
                                                            label="رئيسي"
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                                                color: '#16a34a',
                                                                alignSelf: 'flex-start',
                                                                mt: 'auto'
                                                            }}
                                                        />
                                                    )}
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiGrid>
                                    )
                                })}
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                )}

                {/* Songs Section */}
                {hall.songs && Array.isArray(hall.songs) && hall.songs.length > 0 && (
                    <MuiPaper
                        elevation={0}
                        sx={{
                            borderRadius: '24px',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            overflow: 'hidden',
                            mb: 4.5,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <MuiBox 
                            sx={{ 
                                p: { xs: 3, sm: 4, md: 5 },
                                background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(255, 227, 108, 0.05))',
                                borderBottom: '1px solid rgba(216, 185, 138, 0.15)',
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MuiBox 
                                    sx={{ 
                                        width: { xs: 56, sm: 64 },
                                        height: { xs: 56, sm: 64 },
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(216, 185, 138, 0.3)',
                                        border: '2px solid rgba(216, 185, 138, 0.3)',
                                    }}
                                >
                                    <Music size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            color: 'var(--color-text-primary-dark)',
                                            mb: 0.5,
                                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                        }}
                                    >
                                        الأغاني ({hall.songs.length})
                                    </MuiTypography>
                                    <MuiTypography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        قائمة الأغاني المتاحة
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                            <MuiGrid container spacing={2}>
                                {hall.songs.map((song, index) => (
                                    <MuiGrid item xs={12} sm={6} md={4} key={song._id || index}>
                                        <MuiBox
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid var(--color-border-glass)',
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: 'var(--color-primary-500)',
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                }
                                            }}
                                        >
                                            <MuiTypography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    color: 'var(--color-text-primary-dark)', 
                                                    mb: 0.5
                                                }}
                                            >
                                                {song.name || song.title || `أغنية ${index + 1}`}
                                            </MuiTypography>
                                            {song.artist && (
                                                <MuiTypography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'var(--color-text-secondary)'
                                                    }}
                                                >
                                                    {song.artist}
                                                </MuiTypography>
                                            )}
                                        </MuiBox>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                )}

                {/* Edit Dialog */}
                <EditHallDialog
                    open={isEdit}
                    onClose={closeDialog}
                    onSubmit={handleSave}
                    hall={hall}
                    loading={crudLoading}
                />
            </MuiBox>
        </>
    )
}

