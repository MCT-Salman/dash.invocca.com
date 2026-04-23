/**
 * AdvancedFilter Component
 * مكون فلتر متقدم مع البحث واختيارات وتحديد النطاقات الزمنية
 * 
 * الاستخدام:
 * <AdvancedFilter
 *   onSearch={(value) => setSearch(value)}
 *   onFilterChange={(filters) => setFilters(filters)}
 *   filters={[
 *     { key: 'status', label: 'الحالة', type: 'select', options: [...] },
 *     { key: 'category', label: 'الفئة', type: 'select', options: [...] }
 *   ]}
 *   onRefresh={() => refetch()}
 * />
 */

import { useState, useCallback } from 'react'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiChip from '@/components/ui/MuiChip'
import { Search, RefreshCw, X } from 'lucide-react'

export default function AdvancedFilter({
    onSearch,
    onFilterChange,
    filters = [],
    onRefresh,
    searchPlaceholder = 'بحث...',
    sx = {},
    showResetButton = true,
}) {
    const [searchValue, setSearchValue] = useState('')
    const [filterValues, setFilterValues] = useState({})
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    })
    const [activeFilters, setActiveFilters] = useState({})

    // معالجة تغيير البحث
    const handleSearchChange = useCallback((value) => {
        setSearchValue(value)
        onSearch?.(value)
    }, [onSearch])

    // معالجة تغيير الفلاتر
    const handleFilterChange = useCallback((key, value) => {
        setFilterValues(prev => ({
            ...prev,
            [key]: value
        }))

        const newFilters = {
            ...filterValues,
            [key]: value
        }

        // إزالة الفلاتر الفارغة
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k]) delete newFilters[k]
        })

        onFilterChange?.(newFilters)
    }, [filterValues, onFilterChange])

    // معالجة تغيير التاريخ
    const handleDateChange = useCallback((type, value) => {
        const newDateRange = {
            ...dateRange,
            [type]: value
        }
        setDateRange(newDateRange)

        const newFilters = {
            ...filterValues,
            ...(newDateRange.from && { dateFrom: newDateRange.from }),
            ...(newDateRange.to && { dateTo: newDateRange.to })
        }

        // إزالة الفلاتر الفارغة
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k]) delete newFilters[k]
        })

        onFilterChange?.(newFilters)
    }, [dateRange, filterValues, onFilterChange])

    // إعادة تعيين الفلاتر
    const handleReset = useCallback(() => {
        setSearchValue('')
        setFilterValues({})
        setDateRange({ from: '', to: '' })
        onSearch?.('')
        onFilterChange?.({})
    }, [onSearch, onFilterChange])

    // تحديد ما إذا كانت هناك فلاتر نشطة
    const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v) || dateRange.from || dateRange.to

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                background: 'var(--color-paper)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                ...sx
            }}
        >
            <MuiGrid container spacing={1.5} alignItems="flex-end" flexWrap="nowrap">
                {/* Search Field */}
                <MuiGrid item xs="auto" minWidth="200px">
                    <MuiTextField
                        fullWidth
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <MuiInputAdornment position="start">
                                    <Search size={20} style={{ color: 'var(--color-primary-400)' }} />
                                </MuiInputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-surface)',
                            }
                        }}
                    />
                </MuiGrid>

                {/* Select Filters */}
                {filters
                    .filter(f => f.type === 'select')
                    .map((filter) => (
                        <MuiGrid item xs="auto" minWidth="150px" key={filter.key}>
                            <MuiSelect
                                fullWidth
                                displayEmpty
                                value={filterValues[filter.key] || ''}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--color-surface)',
                                    height: '56px'
                                }}
                            >
                                <MuiMenuItem value="">
                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                        {filter.label}
                                    </span>
                                </MuiMenuItem>
                                {filter.options?.map((option) => (
                                    <MuiMenuItem
                                        key={option.value || option.id}
                                        value={option.value || option.id}
                                    >
                                        {option.label || option.name}
                                    </MuiMenuItem>
                                ))}
                            </MuiSelect>
                        </MuiGrid>
                    ))}

                {/* Date Range Filters */}
                {filters
                    .filter(f => f.type === 'dateRange')
                    .map((filter) => (
                        <MuiGrid item container spacing={1} xs={12} md={6} lg={4} key={filter.key}>
                            <MuiGrid item xs={6}>
                                <MuiTextField
                                    fullWidth
                                    type="date"
                                    label={`${filter.label} من`}
                                    value={dateRange.from}
                                    onChange={(e) => handleDateChange('from', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'var(--color-surface)',
                                        }
                                    }}
                                />
                            </MuiGrid>
                            <MuiGrid item xs={6}>
                                <MuiTextField
                                    fullWidth
                                    type="date"
                                    label={`${filter.label} إلى`}
                                    value={dateRange.to}
                                    onChange={(e) => handleDateChange('to', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'var(--color-surface)',
                                        }
                                    }}
                                />
                            </MuiGrid>
                        </MuiGrid>
                    ))}

                {/* Action Buttons */}
                <MuiGrid item xs="auto" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', marginLeft: 'auto' }}>
                    {showResetButton && hasActiveFilters && (
                        <MuiButton
                            variant="outlined"
                            startIcon={<X size={20} />}
                            onClick={handleReset}
                            sx={{
                                borderRadius: '12px',
                                height: '56px',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-error-500)',
                                    color: 'var(--color-error-500)',
                                    background: 'rgba(220, 53, 69, 0.05)'
                                }
                            }}
                        >
                            إعادة تعيين
                        </MuiButton>
                    )}

                    {onRefresh && (
                        <MuiButton
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={onRefresh}
                            sx={{
                                borderRadius: '12px',
                                height: '56px',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary-500)',
                                    background: 'var(--color-surface-hover)'
                                }
                            }}
                        >
                            تحديث
                        </MuiButton>
                    )}
                </MuiGrid>
            </MuiGrid>

            {/* Active Filters Display - Second Line */}
            {hasActiveFilters && (
                <MuiGrid container spacing={1} sx={{ mt: 2 }}>
                    <MuiGrid item xs={12}>
                        <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                الفلاتر النشطة:
                            </span>
                            {searchValue && (
                                <MuiChip
                                    label={`البحث: "${searchValue}"`}
                                    onDelete={() => handleSearchChange('')}
                                    size="small"
                                    sx={{
                                        background: 'rgba(216, 185, 138, 0.1)',
                                        color: 'var(--color-primary-500)'
                                    }}
                                />
                            )}
                            {Object.entries(filterValues).map(([key, value]) => {
                                if (!value) return null
                                const filter = filters.find(f => f.key === key)
                                const filterLabel = filter?.label || key
                                const optionLabel = filter?.options?.find(o => (o.value || o.id) === value)?.label || value
                                return (
                                    <MuiChip
                                        key={key}
                                        label={`${filterLabel}: ${optionLabel}`}
                                        onDelete={() => handleFilterChange(key, '')}
                                        size="small"
                                        sx={{
                                            background: 'rgba(216, 185, 138, 0.1)',
                                            color: 'var(--color-primary-500)'
                                        }}
                                    />
                                )
                            })}
                            {(dateRange.from || dateRange.to) && (
                                <MuiChip
                                    label={`التاريخ: ${dateRange.from || 'N/A'} إلى ${dateRange.to || 'N/A'}`}
                                    onDelete={() => setDateRange({ from: '', to: '' })}
                                    size="small"
                                    sx={{
                                        background: 'rgba(216, 185, 138, 0.1)',
                                        color: 'var(--color-primary-500)'
                                    }}
                                />
                            )}
                        </MuiBox>
                    </MuiGrid>
                </MuiGrid>
            )}
        </MuiPaper>
    )
}
