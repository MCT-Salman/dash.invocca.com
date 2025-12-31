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
    pagination,
    onPageChange,
    onRowsPerPageChange,
    columns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
    showActions = true,
    ...props
}) {
    if (!loading && data.length === 0) {
        return (
            <EmptyState
                title={emptyMessage}
                description="لم يتم العثور على أي بيانات"
                showPaper
            />
        )
    }

    return (
        <MuiBox>
            <MuiGrid 
                container 
                spacing={{ xs: 0, sm: 0, md: 3 }}
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: 0,
                    '& > .MuiGrid-item': {
                        width: '100% !important',
                        maxWidth: '100% !important',
                        minWidth: 0,
                        padding: { xs: '0 !important', sm: '0 !important', md: '12px !important' },
                        marginBottom: { xs: '12px', sm: '16px', md: 0 },
                    }
                }}
            >
                {data.map((item, index) => (
                    <MuiGrid 
                        item 
                        {...columns} 
                        key={item.id || index}
                        sx={{
                            width: '100% !important',
                            maxWidth: '100% !important',
                            minWidth: 0,
                            flexBasis: { xs: '100% !important', sm: '100% !important' },
                        }}
                    >
                        {renderCard ? (
                            renderCard(item, index)
                        ) : (
                            <MuiCard sx={{ width: '100%', maxWidth: '100%' }}>
                                <MuiCardContent>
                                    <MuiTypography variant="h6" sx={{ mb: 1 }}>
                                        {item.name || item.title || `عنصر ${index + 1}`}
                                    </MuiTypography>
                                    {item.description && (
                                        <MuiTypography variant="body2" color="text.secondary">
                                            {item.description}
                                        </MuiTypography>
                                    )}
                                    {item.status && (
                                        <MuiChip
                                            label={item.status}
                                            color={item.status === 'نشط' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </MuiCardContent>
                                {showActions && (onView || onEdit || onDelete) && (
                                    <MuiCardActions sx={{ gap: 1, flexWrap: 'wrap' }}>
                                        {onView && (
                                            <MuiButton
                                                size="small"
                                                variant="outlined"
                                                start_icon={<Eye size={16} />}
                                                onClick={() => onView(item)}
                                            >
                                                عرض
                                            </MuiButton>
                                        )}
                                        {onEdit && (
                                            <MuiButton
                                                size="small"
                                                variant="outlined"
                                                start_icon={<Pencil size={16} />}
                                                onClick={() => onEdit(item)}
                                            >
                                                تعديل
                                            </MuiButton>
                                        )}
                                        {onDelete && (
                                            <MuiButton
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                start_icon={<Trash2 size={16} />}
                                                onClick={() => onDelete(item)}
                                            >
                                                حذف
                                            </MuiButton>
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

