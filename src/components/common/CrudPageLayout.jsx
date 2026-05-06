// src\components\common\CrudPageLayout.jsx
/**
 * CrudPageLayout Component
 * مكون موحد لتخطيط صفحات CRUD (إنشاء، قراءة، تحديث، حذف)
 * يوفر هيكلًا موحدًا للفلاتر والجدول والأزرار والتصفح
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiButton from '@/components/ui/MuiButton'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { AdvancedFilter, DataTable, CardsView, StatCard, TablePagination } from '@/components/common'
import { Plus, Table, LayoutGrid } from 'lucide-react'

/**
 * مكون تخطيط صفحة CRUD الموحد
 * @param {Object} props - خصائص المكون
 * @param {Array} props.stats - مصفوفة إحصائيات (اختياري)
 * @param {Object} props.filterConfig - إعدادات الفلتر
 * @param {Function} props.onSearch - معالج البحث
 * @param {Function} props.onFilterChange - معالج تغيير الفلتر
 * @param {Function} props.onRefresh - معالج التحديث
 * @param {string} props.searchPlaceholder - نص placeholder للبحث
 * @param {Array} props.columns - أعمدة الجدول
 * @param {Array} props.data - بيانات الجدول
 * @param {boolean} props.loading - حالة التحميل
 * @param {string} props.emptyMessage - رسالة البيانات الفارغة
 * @param {string} props.addButtonLabel - نص زر الإضافة
 * @param {Function} props.onAdd - معالج النقر على زر الإضافة
 * @param {Function} props.onEdit - معالج التعديل
 * @param {Function} props.onDelete - معالج الحذف
 * @param {Function} props.onView - معالج العرض
 * @param {Function} props.onToggleStatus - معالج تبديل الحالة
 * @param {number} props.rowsPerPage - عدد الصفوف في الصفحة
 * @param {Function} props.onRowsPerPageChange - معالج تغيير عدد الصفوف
 * @param {number} props.totalCount - إجمالي عدد السجلات
 * @param {number} props.currentPage - الصفحة الحالية
 * @param {Function} props.onPageChange - معالج تغيير الصفحة
 * @param {string} props.viewMode - وضع العرض ('table' أو 'card')
 * @param {Function} props.renderCard - دالة rendering للبطاقة في وضع العرض البطاقي
 * @param {React.ReactNode} props.extraActions - أزرار إضافية بجانب زر الإضافة (اختياري)
 * @param {Object} props.sx - أنماط إضافية
 */
export default function CrudPageLayout({
    // Stats
    stats = [],
    
    // Filter
    filterConfig,
    onSearch,
    onFilterChange,
    onRefresh,
    searchPlaceholder = 'بحث ...',
    
    // Data Table
    columns,
    data,
    loading = false,
    emptyMessage = 'لا توجد بيانات',
    
    // Actions
    addButtonLabel = 'إضافة جديد',
    onAdd,
    onEdit,
    onDelete,
    onView,
    onToggleStatus,
    
    // Custom Actions
    extraActions,
    
    // Pagination
    rowsPerPage = 10,
    onRowsPerPageChange,
    totalCount,
    currentPage = 1,
    onPageChange,
    
    // View Mode
    viewMode = 'table',
    onViewModeChange,
    renderCard,
    showViewModeToggle = false,
    
    // Styling
    sx = {},
    dataTableSx = {}
}) {
    return (
        <MuiBox sx={{ p: 3, ...sx }}>
            {/* Stats Row */}
            {stats.length > 0 && (
                <MuiGrid container spacing={3} sx={{ mb: 3 }}>
                    {stats.map((stat, index) => (
                        <MuiGrid item xs={12} sm={6} md={3} key={index}>
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                            />
                        </MuiGrid>
                    ))}
                </MuiGrid>
            )}

            {/* Filter Card */}
            <AdvancedFilter
                onSearch={onSearch}
                onFilterChange={onFilterChange}
                filters={filterConfig}
                onRefresh={onRefresh}
                searchPlaceholder={searchPlaceholder}
            />

            {/* Add Button & Pagination Controls */}
            <MuiBox 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 2,
                    mb: 2
                }}
            >
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        عدد الأسطر في الصفحة:
                    </MuiTypography>
                    <MuiSelect
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value))}
                        size="small"
                        sx={{
                            minWidth: 80,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-surface)',
                            }
                        }}
                    >
                        <MuiMenuItem value={5}>5</MuiMenuItem>
                        <MuiMenuItem value={10}>10</MuiMenuItem>
                        <MuiMenuItem value={25}>25</MuiMenuItem>
                        <MuiMenuItem value={50}>50</MuiMenuItem>
                    </MuiSelect>
                </MuiBox>

                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {showViewModeToggle && onViewModeChange && (
                        <MuiBox sx={{ display: 'flex', background: 'var(--color-surface)', p: 0.5, borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <MuiIconButton
                                size="small"
                                onClick={() => onViewModeChange('table')}
                                sx={{
                                    borderRadius: '10px',
                                    color: viewMode === 'table' ? 'var(--color-icon)' : 'var(--color-text-muted)',
                                    background: viewMode === 'table' ? 'var(--color-paper)' : 'transparent',
                                    boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                                    '&:hover': { background: viewMode === 'table' ? 'var(--color-paper)' : 'color-mix(in srgb, var(--color-light) 5%, transparent)' }
                                }}
                            >
                                <Table size={20} />
                            </MuiIconButton>
                            <MuiIconButton
                                size="small"
                                onClick={() => onViewModeChange('card')}
                                sx={{
                                    borderRadius: '10px',
                                    color: viewMode === 'card' ? 'var(--color-icon)' : 'var(--color-text-muted)',
                                    background: viewMode === 'card' ? 'var(--color-paper)' : 'transparent',
                                    boxShadow: viewMode === 'card' ? 'var(--shadow-sm)' : 'none',
                                    '&:hover': { background: viewMode === 'card' ? 'var(--color-paper)' : 'color-mix(in srgb, var(--color-dark) 5%, transparent)' }
                                }}
                            >
                                <LayoutGrid size={20} />
                            </MuiIconButton>
                        </MuiBox>
                    )}

                    {extraActions}

                    {onAdd && (
                        <MuiButton
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            onClick={onAdd}
                            sx={{
                                borderRadius: '10px',
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                }
                            }}
                        >
                            {addButtonLabel}
                        </MuiButton>
                    )}
                </MuiBox>
            </MuiBox>

            {/* Data Table or Cards View */}
            <MuiBox sx={{ overflowX: 'auto' }}>
                {viewMode === 'table' ? (
                    <DataTable
                        columns={columns}
                        data={data}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={onRowsPerPageChange}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        onToggleStatus={onToggleStatus}
                        loading={loading}
                        emptyMessage={emptyMessage}
                        sx={dataTableSx}
                    />
                ) : (
                    <CardsView
                        data={data}
                        renderCard={renderCard}
                        loading={loading}
                        emptyMessage={emptyMessage}
                    />
                )}
            </MuiBox>

            {/* Bottom Pagination */}
            {totalCount > rowsPerPage && (
                <MuiBox sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <TablePagination
                        count={totalCount}
                        page={currentPage}
                        onPageChange={onPageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
                </MuiBox>
            )}
        </MuiBox>
    )
}

// Named exports for individual components
export { CrudPageLayout }
