/**
 * CardsView Component
 * مكون لعرض البيانات كبطاقات بدلاً من الجدول
 */
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import MuiCardActions from '@/components/ui/MuiCardActions'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiChip from '@/components/ui/MuiChip'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiButton from '@/components/ui/MuiButton'
import { EmptyState } from './index'
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react'

/**
 * CardsView Component
 * @param {Object} props
 * @param {Array} props.data - Array of data objects
 * @param {Function} props.renderCard - Function to render each card (item, index) => JSX
 * @param {Function} props.onView - View handler
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Boolean} props.loading - Loading state
 * @param {String} props.emptyMessage - Empty state message
 * @param {Object} props.pagination - Pagination config
 * @param {Function} props.onPageChange - Page change handler
 * @param {Function} props.onRowsPerPageChange - Rows per page change handler
 * @param {Number} props.columns - Number of columns (default: responsive)
 */
export default function CardsView({
    data = [],
    renderCard,
    onView,
    onEdit,
    onDelete,
    loading = false,
    emptyMessage = 'لا توجد بيانات',
    columns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
    showActions = true,
    ...props
}) {
    if (!loading && data.length === 0) {
        return (
            <EmptyState
                title={emptyMessage}
                description="لم يتم العثور على أي بيانات تطابق المعايير المحددة"
                showPaper
            />
        )
    }

    return (
        <MuiBox sx={{ width: '100%' }}>
            <MuiGrid
                container
                spacing={3}
                sx={{
                    width: '100%',
                    margin: 0,
                    '& > .MuiGrid-item': {
                        paddingLeft: { xs: 0, sm: 0, md: 3 },
                        paddingTop: { xs: 0, sm: 0, md: 3 },
                    }
                }}
            >
                {data.map((item, index) => (
                    <MuiGrid
                        item
                        {...columns}
                        key={item.id || item._id || index}
                    >
                        {renderCard ? (
                            renderCard(item, index)
                        ) : (
                            <MuiCard
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'var(--color-paper)',
                                    borderRadius: '20px',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        borderColor: 'var(--color-primary-500)',
                                        boxShadow: 'var(--shadow-xl)',
                                        '& .card-overlay': { opacity: 1 }
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, var(--color-primary-500), transparent)',
                                        opacity: 0.8
                                    }
                                }}
                            >
                                <MuiCardContent sx={{ p: 3, flexGrow: 1 }}>
                                    <MuiBox sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                            {item.name || item.title || `عنصر ${index + 1}`}
                                        </MuiTypography>
                                        {item.status && (
                                            <MuiChip
                                                label={item.status}
                                                size="small"
                                                color={item.status === 'نشط' || item.status === 'active' ? 'success' : 'default'}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        )}
                                    </MuiBox>

                                    {item.description && (
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, mb: 2 }}>
                                            {item.description}
                                        </MuiTypography>
                                    )}

                                    {/* Default slots for common metadata if present */}
                                    <MuiGrid container spacing={1}>
                                        {item.location && (
                                            <MuiGrid item xs={12}>
                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    • {item.location}
                                                </MuiTypography>
                                            </MuiGrid>
                                        )}
                                        {item.date && (
                                            <MuiGrid item xs={12}>
                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    • {item.date}
                                                </MuiTypography>
                                            </MuiGrid>
                                        )}
                                    </MuiGrid>
                                </MuiCardContent>

                                {showActions && (onView || onEdit || onDelete) && (
                                    <MuiCardActions sx={{
                                        p: 2,
                                        pt: 0,
                                        gap: 1,
                                        justifyContent: 'flex-end',
                                        borderTop: '1px solid var(--color-divider)',
                                        background: 'rgba(0,0,0,0.02)'
                                    }}>
                                        {onView && (
                                            <MuiIconButton size="small" onClick={() => onView(item)} sx={{ color: 'var(--color-primary-500)' }}>
                                                <Eye size={18} />
                                            </MuiIconButton>
                                        )}
                                        {onEdit && (
                                            <MuiIconButton size="small" onClick={() => onEdit(item)} sx={{ color: 'var(--color-info-500)' }}>
                                                <Pencil size={18} />
                                            </MuiIconButton>
                                        )}
                                        {onDelete && (
                                            <MuiIconButton size="small" onClick={() => onDelete(item)} sx={{ color: 'var(--color-error-500)' }}>
                                                <Trash2 size={18} />
                                            </MuiIconButton>
                                        )}
                                    </MuiCardActions>
                                )}
                            </MuiCard>
                        )}
                    </MuiGrid>
                ))}
            </MuiGrid>
        </MuiBox>
    )
}

