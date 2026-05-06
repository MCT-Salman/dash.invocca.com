// src\pages\manager\components\ViewTemplateDialog.jsx
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import { X, Tag, Calendar, Expand } from 'lucide-react'
import { formatDate } from '@/utils/helpers'

export default function ViewTemplateDialog({ open, onClose, template }) {
    if (!template) return null

    const templateInfo = template.template || template
    const name = templateInfo.templateName || template.templateName || 'بدون اسم'
    const imageUrl = templateInfo.imageUrl || template.imageUrl

    return (
        <MuiDialog open={open && !!template} onClose={onClose} maxWidth="md" fullWidth>
            <MuiBox sx={{ p: 3, borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MuiBox>
                    <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{name}</MuiTypography>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tag size={16} color="var(--color-icon)" />
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>قالب {template.type === 'contract' ? 'عقد' : 'فاتورة'}</MuiTypography>
                    </MuiBox>
                </MuiBox>
                <MuiIconButton onClick={onClose}><X size={24} /></MuiIconButton>
            </MuiBox>

            <MuiDialogContent sx={{ p: 3 }}>
                <MuiGrid container spacing={3}>
                    {imageUrl && (
                        <MuiGrid item xs={12}>
                            <MuiBox sx={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE}${imageUrl}`}
                                    alt={name}
                                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </MuiBox>
                        </MuiGrid>
                    )}

                    <MuiGrid item xs={12}>
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>تفاصيل القالب</MuiTypography>
                        <MuiGrid container spacing={2}>
                            {[
                                { icon: Tag, label: 'اسم القالب', value: name },
                                { icon: Calendar, label: 'تاريخ الإضافة', value: formatDate(template.createdAt) },
                                { icon: Calendar, label: 'آخر تحديث', value: formatDate(template.updatedAt) }
                            ].map((item, idx) => (
                                <MuiGrid item xs={12} sm={4} key={idx}>
                                    <MuiPaper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center' }}>
                                        <item.icon size={20} color="var(--color-icon)" style={{ margin: '0 auto 8px' }} />
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>{item.label}</MuiTypography>
                                        <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{item.value}</MuiTypography>
                                    </MuiPaper>
                                </MuiGrid>
                            ))}
                        </MuiGrid>
                    </MuiGrid>

                    {template.description && (
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--color-icon)' }}>الوصف</MuiTypography>
                            <MuiTypography variant="body1" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                {template.description}
                            </MuiTypography>
                        </MuiGrid>
                    )}
                </MuiGrid>
            </MuiDialogContent>

            <MuiDialogActions sx={{ p: 3, borderTop: '1px solid var(--color-border)' }}>
                <MuiButton onClick={onClose} variant="contained" sx={{ px: 4, borderRadius: '12px' }}>إغلاق</MuiButton>
            </MuiDialogActions>
        </MuiDialog>
    )
}
