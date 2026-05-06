// src\pages\admin\components\ViewHallDialog.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { ModernDialog } from '@/components/common'
import { MapPin, Users, Armchair as Chair, Table, User, Phone, DollarSign, CheckCircle, XCircle, Building } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { API_CONFIG } from '@/config/constants'
import { useQuery } from '@tanstack/react-query'
import { getHallTemplates } from '@/api/admin'

const getImageUrl = (image) => {
    if (!image) return null
    if (typeof image === 'string') {
        if (image.startsWith('http')) return image
        return `${API_CONFIG.BASE_URL}/uploads/halls/${image}`
    }
    if (image.url) {
        if (image.url.startsWith('http')) return image.url
        return `${API_CONFIG.BASE_URL}/uploads/halls/${image.url}`
    }
    return null
}

export default function ViewHallDialog({ open, onClose, hall }) {
    const hallId = hall?._id || hall?.id
    
    // Fetch full template details if hall has templates
    const { data: templatesData } = useQuery({
        queryKey: ['admin', 'hall-templates', hallId],
        queryFn: () => getHallTemplates(hallId),
        enabled: open && !!hallId && !!hall?.templates?.length,
        staleTime: 2 * 60 * 1000
    })
    
    // Use fetched templates if available, otherwise use hall.templates
    const templatesToDisplay = templatesData?.templates || hall?.templates || []
    
    // Don't return null early, let the dialog handle the open/close state
    return (
        <ModernDialog
            open={open && !!hall}
            onClose={onClose}
            title={hall?.name || 'تفاصيل القاعة'}
            subtitle={hall?.location}
            maxWidth="md"
            showCancel={true}
            cancelText="إغلاق"
            headerIcon={<Building size={20} />}
        >
            {hall ? (
                <MuiGrid container spacing={3}>
                        {/* Status & Basic Info */}
                        <MuiGrid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <MuiChip
                                label={hall?.isActive ? 'نشطة' : 'غير نشطة'}
                                icon={hall?.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                sx={{
                                    backgroundColor: hall?.isActive 
                                        ? 'rgba(34, 197, 94, 0.15)' 
                                        : 'rgba(220, 38, 38, 0.15)',
                                    color: hall?.isActive ? '#22c55e' : '#dc2626',
                                    border: `1px solid ${hall?.isActive ? '#22c55e' : '#dc2626'}`,
                                    fontWeight: 'bold',
                                    '&.MuiChip-root': {
                                        backgroundColor: hall?.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                                        color: hall?.isActive ? '#22c55e' : '#dc2626',
                                    }
                                }}
                            />
                            <MuiTypography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-icon)' }}>
                                {formatCurrency(hall?.defaultPrices)}
                            </MuiTypography>
                        </MuiGrid>

                        {/* Description */}
                        {hall?.description && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    {hall?.description}
                                </MuiTypography>
                            </MuiGrid>
                        )}

                        <MuiGrid item xs={12}>
                            <MuiDivider sx={{ borderColor: 'var(--color-border)' }} />
                        </MuiGrid>

                        {/* Capacity Details */}
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>تفاصيل السعة</MuiTypography>
                            <MuiGrid container spacing={2}>
                                {[{ icon: Users, label: 'السعة', value: hall?.capacity },
                                { icon: Table, label: 'الطاولات', value: hall?.tables },
                                { icon: Chair, label: 'الكراسي', value: hall?.chairs },
                                { icon: Users, label: 'الموظفين', value: hall?.maxEmployees }].map((item, idx) => (
                                    <MuiGrid item xs={6} sm={3} key={idx}>
                                        <MuiBox sx={{ p: 2, backgroundColor: 'var(--color-surface)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                                            <item.icon size={24} style={{ margin: '0 auto 8px', color: 'var(--color-icon)' }} />
                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{item.label}</MuiTypography>
                                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{item.value}</MuiTypography>
                                        </MuiBox>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        </MuiGrid>

                        {/* Manager Info */}
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>معلومات المدير</MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid var(--color-border)', borderRadius: '12px', backgroundColor: 'var(--color-surface)' }}>
                                <MuiBox sx={{ backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)', p: 1.5, borderRadius: '50%' }}>
                                    <User size={24} style={{ color: 'var(--color-icon)' }} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                                        {hall?.managerName || hall?.generalManager?.name}
                                    </MuiTypography>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                                        <Phone size={14} />
                                        <MuiTypography variant="body2">
                                            {hall?.managerPhone || hall?.generalManager?.phone}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiGrid>

                        {/* Templates */}
                        {templatesToDisplay && templatesToDisplay.length > 0 && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>القوالب</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {templatesToDisplay.map((templateAssignment, index) => {
                                        // Handle both nested template object and direct template properties
                                        // The template data can be in templateAssignment.template or directly in templateAssignment
                                        const template = templateAssignment.template || templateAssignment || {}
                                        
                                        // Try multiple paths to get templateName (check nested object first, then direct)
                                        const templateName = template.templateName 
                                            || template.name 
                                            || templateAssignment.templateName
                                            || templateAssignment.name
                                            || `قالب ${index + 1}`
                                        
                                        // Try multiple paths to get description
                                        const templateDescription = template.description 
                                            || templateAssignment.description 
                                            || ''
                                        
                                        // Try multiple paths to get category
                                        const templateCategory = template.category 
                                            || templateAssignment.category 
                                            || ''
                                        
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
                                                        border: '1px solid var(--color-border)',
                                                        backgroundColor: 'var(--color-surface)',
                                                        cursor: templateImageUrl ? 'pointer' : 'default',
                                                        transition: 'all 0.2s ease',
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        '&:hover': templateImageUrl ? {
                                                            transform: 'scale(1.02)',
                                                            borderColor: 'var(--color-icon)',
                                                        } : {}
                                                    }}
                                                    onClick={() => {
                                                        if (templateImageUrl) window.open(templateImageUrl, '_blank')
                                                    }}
                                                >
                                                    {templateImageUrl ? (
                                                        <img
                                                            src={templateImageUrl}
                                                            alt={templateName}
                                                            style={{
                                                                width: '100%',
                                                                height: '160px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    ) : (
                                                        <MuiBox sx={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)' }}>
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
                                                                color: 'var(--color-text-primary)', 
                                                                mb: 1,
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            {templateName}
                                                        </MuiTypography>
                                                        {templateDescription ? (
                                                            <MuiTypography 
                                                                variant="body2" 
                                                                sx={{ 
                                                                    color: 'var(--color-text-secondary)',
                                                                    mb: templateCategory ? 1 : 0,
                                                                    lineHeight: 1.5,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    flex: 1
                                                                }}
                                                            >
                                                                {templateDescription}
                                                            </MuiTypography>
                                                        ) : (
                                                            <MuiTypography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: 'var(--color-text-secondary)',
                                                                    fontStyle: 'italic',
                                                                    mb: templateCategory ? 1 : 0
                                                                }}
                                                            >
                                                                لا يوجد وصف
                                                            </MuiTypography>
                                                        )}
                                                        {templateCategory && (
                                                            <MuiChip
                                                                label={templateCategory}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.75rem',
                                                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                                                    color: 'var(--color-icon)',
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
                            </MuiGrid>
                        )}

                        {/* Gallery */}
                        {hall?.images && hall?.images.length > 0 && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-text-primary)' }}>معرض الصور</MuiTypography>
                                <MuiGrid container spacing={2}>
                                    {hall?.images?.map((img, index) => {
                                        const imageUrl = getImageUrl(img)
                                        return (
                                            <MuiGrid item xs={6} sm={4} md={3} key={index}>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Gallery ${index}`}
                                                    onClick={() => {
                                                        if (imageUrl) window.open(imageUrl, '_blank')
                                                    }}
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '96px', 
                                                        objectFit: 'cover', 
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.opacity = '0.8'
                                                        e.target.style.transform = 'scale(1.05)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.opacity = '1'
                                                        e.target.style.transform = 'scale(1)'
                                                    }}
                                                />
                                            </MuiGrid>
                                        )
                                    })}
                                </MuiGrid>
                            </MuiGrid>
                        )}
                    </MuiGrid>
            ) : null}
        </ModernDialog>
    )
}
