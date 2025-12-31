import MuiBox from '@/components/ui/MuiBox'
import MuiTablePagination from '@/components/ui/MuiTablePagination'

export default function TablePagination({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25],
    sx = {}
}) {
    return (
        <MuiBox
            sx={{
                borderTop: '1px solid var(--color-border-glass)',
                background: 'rgba(26, 26, 26, 0.2)',
                ...sx
            }}
        >
            <MuiTablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                labelRowsPerPage="عدد الصفوف:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
                sx={{
                    color: 'var(--color-text-secondary)',
                    '& .MuiTablePagination-selectIcon': { color: 'var(--color-primary-400)' },
                    '& .MuiTablePagination-actions': { color: 'var(--color-primary-400)' }
                }}
            />
        </MuiBox>
    )
}
