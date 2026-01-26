import { useState } from 'react'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiDivider from '@/components/ui/MuiDivider'
import { X, Tag, FileText, Calendar, Expand, ZoomIn, ZoomOut, RotateCw, Clock, Building2, MapPin, Users, Table, Armchair } from 'lucide-react'
import { formatDate } from '@/utils/helpers'

export default function ViewTemplateDialog({ open, onClose, template }) {
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [imageZoom, setImageZoom] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e) => {
        if (imageZoom > 1) {
            setIsDragging(true)
            setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
        }
    }

    const handleMouseMove = (e) => {
        if (isDragging && imageZoom > 1) {
            setImagePosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleWheel = (e) => {
        if (showImagePreview) {
            e.preventDefault()
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            setImageZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
        }
    }

    return (
        <>
            <MuiDialog
                open={open && !!template}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'auto',
                        backgroundColor: 'var(--color-surface-dark)',
                        backgroundImage: 'none',
                        border: '1px solid var(--color-border-glass)',
                        zIndex: 1300,
                        maxHeight: '90vh'
                    }
                }}
            >
                {template ? (
                    <MuiBox sx={{ position: 'relative' }}>
                        {/* Header Section */}
                        <MuiBox sx={{ p: 3, borderBottom: '1px solid var(--color-border-glass)' }}>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <MuiBox>
                                    <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                        {template.templateName}
                                    </MuiTypography>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tag size={16} style={{ color: 'var(--color-primary-400)' }} />
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            {template.hallId?.name || '—'}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                                <MuiIconButton
                                    onClick={onClose}
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'var(--color-text-primary)',
                                        border: '1px solid var(--color-border-glass)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <X size={20} />
                                </MuiIconButton>
                            </MuiBox>

                            {/* Image Display */}
                            {template.imageUrl ? (
                                <MuiBox 
                                    sx={{ 
                                        position: 'relative',
                                        width: '100%',
                                        minHeight: '400px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--color-border-glass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                    onClick={() => {
                                        setShowImagePreview(true)
                                        setImageZoom(1)
                                        setImageRotation(0)
                                        setImagePosition({ x: 0, y: 0 })
                                    }}
                                >
                                    <img
                                        src={template.imageUrl.startsWith('http') ? template.imageUrl : `${import.meta.env.VITE_API_BASE}${template.imageUrl}`}
                                        alt={template.templateName}
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: '#fff',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            backdropFilter: 'blur(8px)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
                                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border-glass)'
                                }}>
                                    <MuiTypography variant="h3" sx={{ color: 'var(--color-primary-300)', fontWeight: 'bold' }}>
                                        {template.templateName?.[0]}
                                    </MuiTypography>
                                </MuiBox>
                            )}
                        </MuiBox>

                        <MuiDialogContent sx={{ p: 3 }}>
                            <MuiGrid container spacing={3}>
                                {/* Hall Information */}
                                {template.hallId && (
                                    <>
                                        <MuiGrid item xs={12}>
                                            <MuiDivider sx={{ borderColor: 'rgba(216, 185, 138, 0.15)', mb: 2 }} />
                                        </MuiGrid>
                                        <MuiGrid item xs={12}>
                                            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Building2 size={20} style={{ color: 'var(--color-primary-500)' }} />
                                                معلومات قاعة/صالة
                                            </MuiTypography>
                                            <MuiGrid container spacing={2}>
                                                {typeof template.hallId === 'object' && template.hallId.name && (
                                                    <MuiGrid item xs={12} sm={6} md={4}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                اسم قاعة/صالة
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                                {template.hallId.name}
                                                            </MuiTypography>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )}
                                                {typeof template.hallId === 'object' && template.hallId.location && (
                                                    <MuiGrid item xs={12} sm={6} md={4}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                الموقع
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                                {template.hallId.location}
                                                            </MuiTypography>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )}
                                                {typeof template.hallId === 'object' && template.hallId.capacity && (
                                                    <MuiGrid item xs={12} sm={6} md={4}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                السعة القصوى
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                                {template.hallId.capacity} شخص
                                                            </MuiTypography>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )}
                                                {typeof template.hallId === 'object' && template.hallId.tables && (
                                                    <MuiGrid item xs={12} sm={6} md={4}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                عدد الطاولات
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                                {template.hallId.tables}
                                                            </MuiTypography>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )}
                                                {typeof template.hallId === 'object' && template.hallId.chairs && (
                                                    <MuiGrid item xs={12} sm={6} md={4}>
                                                        <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(216, 185, 138, 0.15)', borderRadius: '12px' }}>
                                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, fontSize: '0.75rem' }}>
                                                                عدد الكراسي
                                                            </MuiTypography>
                                                            <MuiTypography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)' }}>
                                                                {template.hallId.chairs}
                                                            </MuiTypography>
                                                        </MuiPaper>
                                                    </MuiGrid>
                                                )}
                                            </MuiGrid>
                                        </MuiGrid>
                                    </>
                                )}

                                {/* Template Details */}
                                <MuiGrid item xs={12}>
                                    <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', mb: 2, fontWeight: 600 }}>
                                        تفاصيل القالب
                                    </MuiTypography>
                                    <MuiGrid container spacing={2}>
                                        <MuiGrid item xs={12} sm={6} md={3}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Tag size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            اسم القالب
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {template.templateName}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>

                                        <MuiGrid item xs={12} sm={6} md={4}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Calendar size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            تاريخ الإنشاء
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {formatDate(template.createdAt, 'MM/DD/YYYY')}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>

                                        <MuiGrid item xs={12} sm={6} md={4}>
                                            <MuiPaper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '12px' }}>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Clock size={20} style={{ color: 'var(--color-primary-400)' }} />
                                                    <MuiBox>
                                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                            آخر تحديث
                                                        </MuiTypography>
                                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                            {formatDate(template.updatedAt, 'MM/DD/YYYY')}
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>
                                            </MuiPaper>
                                        </MuiGrid>
                                    </MuiGrid>
                                </MuiGrid>

                                {/* Description */}
                                {template.description && (
                                    <MuiGrid item xs={12}>
                                        <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', mb: 2, fontWeight: 600 }}>
                                            الوصف
                                        </MuiTypography>
                                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                                            {template.description}
                                        </MuiTypography>
                                    </MuiGrid>
                                )}
                            </MuiGrid>
                        </MuiDialogContent>

                        <MuiDialogActions sx={{ p: 3, backgroundColor: 'var(--color-surface-dark)', borderTop: '1px solid var(--color-border-glass)' }}>
                            <MuiButton onClick={onClose} variant="contained">
                                إغلاق
                            </MuiButton>
                        </MuiDialogActions>
                    </MuiBox>
                ) : null}
            </MuiDialog>

            {/* Image Preview Modal with Zoom */}
            <MuiDialog
                open={showImagePreview}
                onClose={() => {
                    setShowImagePreview(false)
                    setImageZoom(1)
                    setImageRotation(0)
                    setImagePosition({ x: 0, y: 0 })
                }}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        p: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        borderRadius: '16px',
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                        overflow: 'hidden'
                    }
                }}
                onWheel={handleWheel}
            >
                <MuiBox 
                    sx={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '95vh', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Close Button */}
                    <MuiIconButton
                        onClick={() => {
                            setShowImagePreview(false)
                            setImageZoom(1)
                            setImageRotation(0)
                            setImagePosition({ x: 0, y: 0 })
                        }}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            backdropFilter: 'blur(4px)',
                            zIndex: 10,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.2)',
                            }
                        }}
                    >
                        <X size={20} />
                    </MuiIconButton>

                    {/* Zoom Controls */}
                    <MuiBox
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            display: 'flex',
                            gap: 1,
                            zIndex: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '8px',
                            p: 1,
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <MuiIconButton
                            onClick={() => setImageZoom(prev => Math.min(prev + 0.25, 3))}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                            title="تكبير"
                        >
                            <ZoomIn size={20} />
                        </MuiIconButton>
                        <MuiIconButton
                            onClick={() => setImageZoom(prev => Math.max(prev - 0.25, 0.5))}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                            title="تصغير"
                        >
                            <ZoomOut size={20} />
                        </MuiIconButton>
                        <MuiIconButton
                            onClick={() => setImageRotation(prev => (prev + 90) % 360)}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                            title="تدوير"
                        >
                            <RotateCw size={20} />
                        </MuiIconButton>
                        <MuiIconButton
                            onClick={() => {
                                setImageZoom(1)
                                setImageRotation(0)
                                setImagePosition({ x: 0, y: 0 })
                            }}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                            title="إعادة تعيين"
                        >
                            <Expand size={20} />
                        </MuiIconButton>
                    </MuiBox>

                    {/* Image */}
                    {template?.imageUrl && (
                        <MuiBox
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'auto',
                                p: 4,
                                cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <img
                                src={template.imageUrl.startsWith('http') ? template.imageUrl : `${import.meta.env.VITE_API_BASE}${template.imageUrl}`}
                                alt={template.templateName}
                                style={{ 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                                    userSelect: 'none',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                }}
                                draggable={false}
                            />
                        </MuiBox>
                    )}

                    {/* Zoom Level Indicator */}
                    <MuiBox
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            px: 2,
                            py: 1,
                            borderRadius: '8px',
                            backdropFilter: 'blur(8px)',
                            zIndex: 10
                        }}
                    >
                        <MuiTypography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {Math.round(imageZoom * 100)}%
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            </MuiDialog>
        </>
    )
}
