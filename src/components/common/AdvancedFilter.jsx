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
import { useMediaQuery, useTheme } from '@mui/material'
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
    topActions,
}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
    
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
                p: isSmallMobile ? 2 : isMobile ? 2.5 : 3,
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                ...sx
            }}
        >
            {/* Top Actions Row */}
            {topActions && (
                <MuiBox sx={{ display: 'flex', justifyContent: 'flex-start', mb: isSmallMobile ? 1.5 : 2 }}>
                    {topActions}
                </MuiBox>
            )}
            
            {/* Search and Filters - Single Line Layout */}
            <MuiBox sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                gap: 1.5, 
                alignItems: 'flex-end'
            }}>
                {/* Search Field */}
                <MuiBox sx={{ 
                    flex: isMobile ? '1 1 100%' : '0 1 220px',
                    minWidth: isMobile ? '100%' : '180px'
                }}>
                    <MuiTextField
                        fullWidth
                        size="small"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <MuiInputAdornment position="start">
                                    <Search size={18} style={{ color: 'var(--color-primary-400)' }} />
                                </MuiInputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'var(--color-surface)',
                                height: '40px'
                            }
                        }}
                    />
                </MuiBox>

                {/* Select Filters */}
                {filters
                    .filter(f => f.type === 'select')
                    .map((filter) => (
                        <MuiBox key={filter.key} sx={{ 
                            flex: isMobile ? '1 1 100%' : '0 1 160px',
                            minWidth: isMobile ? '100%' : '140px'
                        }}>
                            <MuiSelect
                                fullWidth
                                size="small"
                                displayEmpty
                                value={filterValues[filter.key] || ''}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                sx={{
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--color-surface)',
                                    height: '40px'
                                }}
                            >
                                <MuiMenuItem value="">
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
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
                        </MuiBox>
                    ))}

                {/* Date Range Filters */}
                {filters
                    .filter(f => f.type === 'dateRange')
                    .map((filter) => (
                        <MuiBox key={filter.key} sx={{ 
                            display: 'flex',
                            gap: 1,
                            flex: isMobile ? '1 1 100%' : '0 1 auto'
                        }}>
                            <MuiTextField
                                size="small"
                                type="date"
                                label={`من`}
                                value={dateRange.from}
                                onChange={(e) => handleDateChange('from', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    flex: 1,
                                    minWidth: '130px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'var(--color-surface)',
                                        height: '40px'
                                    },
                                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                        filter: 'var(--color-date-icon-filter)',
                                        cursor: 'pointer'
                                    }
                                }}
                            />
                            <MuiTextField
                                size="small"
                                type="date"
                                label={`إلى`}
                                value={dateRange.to}
                                onChange={(e) => handleDateChange('to', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    flex: 1,
                                    minWidth: '130px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'var(--color-surface)',
                                        height: '40px'
                                    },
                                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                        filter: 'var(--color-date-icon-filter)',
                                        cursor: 'pointer'
                                    }
                                }}
                            />
                        </MuiBox>
                    ))}

                {/* Action Buttons */}
                <MuiBox sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flex: isMobile ? '1 1 100%' : '0 0 auto',
                    justifyContent: isMobile ? 'flex-start' : 'flex-end',
                    ml: isMobile ? 0 : 'auto'
                }}>
                    {showResetButton && hasActiveFilters && (
                        <MuiButton
                            variant="outlined"
                            size="small"
                            startIcon={<X size={18} />}
                            onClick={handleReset}
                            sx={{
                                borderRadius: '10px',
                                height: '40px',
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
                            size="small"
                            startIcon={<RefreshCw size={18} />}
                            onClick={onRefresh}
                            sx={{
                                borderRadius: '10px',
                                height: '40px',
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
                </MuiBox>
            </MuiBox>

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
