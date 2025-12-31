import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiButton from '@/components/ui/MuiButton'
import { Search, RefreshCw, Filter } from 'lucide-react'

export default function FilterBar({
    searchPlaceholder = 'بحث...',
    searchValue,
    onSearchChange,
    onRefresh,
    extraFilters = null,
    sx = {}
}) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 2,
                mb: 3,
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '16px',
                ...sx
            }}
        >
            <MuiGrid container spacing={2} alignItems="center">
                <MuiGrid item xs={12} md={onRefresh ? 8 : 12} lg={onRefresh ? 9 : 12}>
                    <MuiTextField
                        fullWidth
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
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
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                        }}
                    />
                </MuiGrid>

                {extraFilters && (
                    <MuiGrid item xs={12}>
                        {extraFilters}
                    </MuiGrid>
                )}

                {onRefresh && (
                    <MuiGrid item xs={12} md={4} lg={3}>
                        <MuiButton
                            fullWidth
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={onRefresh}
                            sx={{
                                height: '56px',
                                borderRadius: '12px',
                                borderColor: 'var(--color-border-glass)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary-500)',
                                    background: 'rgba(216, 185, 138, 0.05)'
                                }
                            }}
                        >
                            تحديث البيانات
                        </MuiButton>
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiPaper>
    )
}
