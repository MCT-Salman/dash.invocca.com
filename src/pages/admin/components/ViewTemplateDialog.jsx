import { useState } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { ModernDialog } from '@/components/common'
import { Tag, FileText, Calendar, CheckCircle, XCircle, Expand, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { API_CONFIG } from '@/config/constants'

const getImageUrl = (image) => {
    if (!image) return null
    if (typeof image === 'string') {
        if (image.startsWith('http')) return image
        if (image.startsWith('/')) return `${API_CONFIG.BASE_URL}${image}`
        if (image.includes('/uploads/')) return `${API_CONFIG.BASE_URL}/${image.replace(/^\//, '')}`
        return `${API_CONFIG.BASE_URL}/uploads/templates/${image}`
    }
    if (image.url) {
        if (image.url.startsWith('http')) return image.url
        if (image.url.startsWith('/')) return `${API_CONFIG.BASE_URL}${image.url}`
        if (image.url.includes('/uploads/')) return `${API_CONFIG.BASE_URL}/${image.url.replace(/^\//, '')}`
        return `${API_CONFIG.BASE_URL}/uploads/templates/${image.url}`
    }
    return null
}

export default function ViewTemplateDialog({ open, onClose, template }) {
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [imageZoom, setImageZoom] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)

    // Don't return null early, let the dialog handle the open/close state
    return (
        <>
            <ModernDialog
                open={open && !!template}
                onClose={onClose}
                title={template?.templateName || 'تفاصيل القالب'}
                subtitle={template?.hallId?.name || '—'}
                maxWidth="md"
                showCancel={true}
                cancelText="إغلاق"
                headerIcon={<Tag size={24} />}
            >
                {/* Image Display */}
                {template?.imageUrl ? (
                    <MuiBox 
                        sx={{ 
                            position: 'relative',
                            width: '100%',
                            minHeight: '400px',
                            backgroundColor: 'var(--color-bg)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            mb: 3,
                            '&:hover': {
                                boxShadow: 'none',
                            }
                        }}
                        onClick={() => {
                            setShowImagePreview(true)
                            setImageZoom(1)
                            setImageRotation(0)
                        }}
                    >
                        <img
                            src={getImageUrl(template?.imageUrl)}
                            alt={template?.templateName || ''}
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '400px',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                        <MuiBox
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                backgroundColor: 'var(--color-dark)',
                                color: 'var(--color-text-primary)',
                                px: 2,
                                py: 1,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--color-bg-dark)',
                                }
                            }}
                        >
                            <Expand size={16} />
                            <MuiTypography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                اضغط للتكبير
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                ) : (
                    <MuiBox sx={{ 
                        width: '100%', 
                        minHeight: '400px',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border-glass)',
                        mb: 3
                    }}>
                        <MuiTypography variant="h3" sx={{ color: 'var(--color-icon)', fontWeight: 'bold' }}>
                            {template?.templateName?.[0]}
                        </MuiTypography>
                    </MuiBox>
                )}

                <MuiGrid container spacing={3}>
                    {/* Template Information */}
                    <MuiGrid item xs={12}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <MuiChip
                                label="معلومات القالب"
                                size="small"
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    fontWeight: 600,
                                    border: '1px solid var(--color-border-glass)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                    '& .MuiChip-icon': { color: 'var(--color-dark)' },
                                }}
                            />
                        </MuiBox>
                        <MuiGrid container spacing={2}>
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox sx={{ mb: 2 }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        اسم القالب
                                    </MuiTypography>
                                    <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                        {template?.templateName || '—'}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox sx={{ mb: 2 }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        الحالة
                                    </MuiTypography>
                                    <MuiChip
                                        label={template?.isActive ? 'نشط' : 'غير نشط'}
                                        size="small"
                                        sx={{
                                            backgroundColor: template?.isActive 
                                                ? 'rgba(34, 197, 94, 0.15)' 
                                                : 'rgba(220, 38, 38, 0.15)',
                                            color: template?.isActive ? '#22c55e' : '#dc2626',
                                            border: `1px solid ${template?.isActive ? '#22c55e' : '#dc2626'}`,
                                            fontWeight: 500
                                        }}
                                    />
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <MuiBox sx={{ mb: 2 }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        الوصف
                                    </MuiTypography>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                                        {template?.description || 'لا يوجد وصف'}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                        </MuiGrid>
                    </MuiGrid>

                    <MuiGrid item xs={12}>
                        <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                    </MuiGrid>

                    {/* Associated Halls Information */}
                    <MuiGrid item xs={12}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <MuiChip
                                label={`القاعات المرتبطة (${template?.hallsCount || template?.halls?.length || 0})`}
                                size="small"
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    fontWeight: 600,
                                    border: '1px solid var(--color-border-glass)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                }}
                            />
                        </MuiBox>
                        
                        {Array.isArray(template?.halls) && template.halls.length > 0 ? (
                            <MuiGrid container spacing={2}>
                                {template.halls.map((assignment, index) => (
                                    <MuiGrid item xs={12} md={6} key={assignment._id || index}>
                                        <MuiBox 
                                            sx={{ 
                                                p: 2, 
                                                borderRadius: '12px', 
                                                border: '1px solid var(--color-border-glass)',
                                                backgroundColor: 'color-mix(in srgb, var(--color-light) 2%, transparent)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}
                                        >
                                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <MuiTypography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                                    {assignment.hall?.name || 'قاعة غير معروفة'}
                                                </MuiTypography>
                                                <MuiChip 
                                                    label={assignment.hall?.isActive ? 'نشطة' : 'غير نشطة'} 
                                                    size="small"
                                                    sx={{ 
                                                        height: '20px', 
                                                        fontSize: '0.7rem',
                                                        backgroundColor: assignment.hall?.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                                        color: assignment.hall?.isActive ? '#22c55e' : '#dc2626',
                                                    }}
                                                />
                                            </MuiBox>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                الموقع: {assignment.hall?.location || '—'}
                                            </MuiTypography>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                السعة: {assignment.hall?.capacity || '—'} شخص
                                            </MuiTypography>
                                        </MuiBox>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        ) : (
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                                لا توجد قاعات مرتبطة بهذا القالب حالياً.
                            </MuiTypography>
                        )}
                    </MuiGrid>

                    <MuiGrid item xs={12}>
                        <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />
                    </MuiGrid>

                    {/* Date Information */}
                    <MuiGrid item xs={12}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <MuiChip
                                label="معلومات التاريخ"
                                size="small"
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    fontWeight: 600,
                                    border: '1px solid var(--color-border-glass)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                    '& .MuiChip-icon': { color: 'var(--color-dark)' },
                                }}
                            />
                        </MuiBox>
                        <MuiGrid container spacing={2}>
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox sx={{ mb: 2 }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        تاريخ الإنشاء
                                    </MuiTypography>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                                        {formatDate(template?.createdAt)}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox sx={{ mb: 2 }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        آخر تحديث
                                    </MuiTypography>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                                        {formatDate(template?.updatedAt)}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                        </MuiGrid>
                    </MuiGrid>
                </MuiGrid>
            </ModernDialog>

            {/* Image Preview Dialog */}
            {showImagePreview && (
                <ModernDialog
                    open={showImagePreview}
                    onClose={() => setShowImagePreview(false)}
                    title="معاينة الصورة"
                    maxWidth="lg"
                    showCancel={true}
                    cancelText="إغلاق"
                >
                    <MuiBox sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        p: 2
                    }}>
                        <MuiBox sx={{ 
                            display: 'flex', 
                            gap: 2,
                            mb: 2
                        }}>
                            <MuiChip
                                icon={<ZoomIn size={16} />}
                                label="تكبير"
                                onClick={() => setImageZoom(prev => Math.min(prev + 0.2, 3))}
                                clickable
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                    '& .MuiChip-icon': { color: 'var(--color-dark)' },
                                    '&:hover': {
                                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 20%, transparent)',
                                    }
                                }}
                            />
                            <MuiChip
                                icon={<ZoomOut size={16} />}
                                label="تصغير"
                                onClick={() => setImageZoom(prev => Math.max(prev - 0.2, 0.5))}
                                clickable
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                    '& .MuiChip-icon': { color: 'var(--color-dark)' },
                                    '&:hover': {
                                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 20%, transparent)',
                                    }
                                }}
                            />
                            <MuiChip
                                icon={<RotateCw size={16} />}
                                label="تدوير"
                                onClick={() => setImageRotation(prev => prev + 90)}
                                clickable
                                sx={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    '& .MuiChip-label': { color: 'var(--color-dark)' },
                                    '& .MuiChip-icon': { color: 'var(--color-dark)' },
                                    '&:hover': {
                                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 20%, transparent)',
                                    }
                                }}
                            />
                        </MuiBox>
                        
                        <MuiBox
                            sx={{
                                overflow: 'hidden',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border-glass)',
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                src={getImageUrl(template?.imageUrl)}
                                alt={template?.templateName || ''}
                                style={{
                                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                                    transition: 'transform 0.3s ease',
                                    maxWidth: '100%',
                                    maxHeight: '60vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </MuiBox>
                    </MuiBox>
                </ModernDialog>
            )}
        </>
    )
}
