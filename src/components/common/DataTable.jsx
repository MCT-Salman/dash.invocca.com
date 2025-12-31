// src\components\common\DataTable.jsx
import { useState, useMemo } from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import MuiBox from '@/components/ui/MuiBox'
import MuiTable from '@/components/ui/MuiTable'
import MuiTableBody from '@/components/ui/MuiTableBody'
import MuiTableContainer from '@/components/ui/MuiTableContainer'
import MuiTableHead from '@/components/ui/MuiTableHead'
import MuiTableRow from '@/components/ui/MuiTableRow'
import MuiTableCell from '@/components/ui/MuiTableCell'
import MuiTablePagination from '@/components/ui/MuiTablePagination'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiTooltip from '@/components/ui/MuiTooltip'
import MuiCircularProgress from '@mui/material/CircularProgress'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import { Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react'
import EmptyState from './EmptyState'

export default function DataTable({
    columns,
    data = [],
    rows, // Alias for data
    onEdit,
    onDelete,
    onView,
    onToggleStatus,
    loading = false,
    emptyMessage = 'لا يوجد بيانات',
    showActions = true,
    rowsPerPageOptions = [5, 10, 25, 50],
    sx = {}
}) {
    const tableData = useMemo(() => rows || data || [], [rows, data])
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[1] || 10)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0

    if (loading && tableData.length === 0) {
        return (
            <MuiBox sx={{ display: 'flex', justifyContent: 'center', p: 8, ...sx }}>
                <MuiCircularProgress sx={{ color: 'var(--color-primary-500)' }} />
            </MuiBox>
        )
    }

    if (!loading && tableData.length === 0) {
        return (
            <EmptyState
                title="لا توجد بيانات"
                description={emptyMessage}
                showPaper={true}
                sx={sx}
            />
        )
    }

    const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <MuiBox sx={{ width: '100%', position: 'relative', ...sx }}>
            {loading && (
                <MuiBox
                    sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(26, 26, 26, 0.3)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 10,
                        borderRadius: '16px'
                    }}
                >
                    <MuiCircularProgress sx={{ color: 'var(--color-primary-500)' }} />
                </MuiBox>
            )}

            {isMobile ? (
                // Mobile Card View
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {paginatedData.map((row, index) => (
                        <MuiPaper
                            key={row.id || index}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: '1px solid var(--color-border-glass)',
                                background: 'var(--color-surface-dark)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                                    borderColor: 'var(--color-primary-500)'
                                }
                            }}
                        >
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {columns.map((column) => {
                                    const value = row[column.id]
                                    return (
                                        <MuiBox key={column.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                                                {column.label}
                                            </MuiTypography>
                                            <MuiTypography variant="body2" component="span" sx={{ color: 'var(--color-text-primary-dark)' }}>
                                                {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value)}
                                            </MuiTypography>
                                        </MuiBox>
                                    )
                                })}

                                {showActions && (onEdit || onDelete || onView || onToggleStatus) && (
                                    <MuiBox sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: '1px solid var(--color-border-glass)' }}>
                                        {onView && (
                                            <MuiTooltip title="عرض">
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => onView(row)}
                                                    sx={{
                                                        color: 'var(--color-primary-400)',
                                                        '&:hover': { background: 'rgba(216, 185, 138, 0.1)' }
                                                    }}
                                                >
                                                    <Eye size={18} />
                                                </MuiIconButton>
                                            </MuiTooltip>
                                        )}
                                        {onEdit && (
                                            <MuiTooltip title="تعديل">
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => onEdit(row)}
                                                    sx={{
                                                        color: '#0284c7',
                                                        '&:hover': { background: 'rgba(2, 132, 199, 0.1)' }
                                                    }}
                                                >
                                                    <Edit2 size={18} />
                                                </MuiIconButton>
                                            </MuiTooltip>
                                        )}
                                        {onToggleStatus && (
                                            <MuiTooltip title={row.isActive ? 'تعطيل' : 'تفعيل'}>
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => onToggleStatus(row)}
                                                    sx={{
                                                        color: row.isActive ? '#16a34a' : '#dc2626',
                                                        '&:hover': { background: row.isActive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)' }
                                                    }}
                                                >
                                                    {row.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                </MuiIconButton>
                                            </MuiTooltip>
                                        )}
                                        {onDelete && (
                                            <MuiTooltip title="حذف">
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => onDelete(row)}
                                                    sx={{
                                                        color: '#dc2626',
                                                        '&:hover': { background: 'rgba(220, 38, 38, 0.1)' }
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                </MuiIconButton>
                                            </MuiTooltip>
                                        )}
                                    </MuiBox>
                                )}
                            </MuiBox>
                        </MuiPaper>
                    ))}
                </MuiBox>
            ) : (
                // Desktop Table View
                <MuiTableContainer
                    sx={{
                        borderRadius: '16px',
                        border: '1px solid var(--color-border-glass)',
                        background: 'var(--color-surface-dark)'
                    }}
                >
                    <MuiTable stickyHeader>
                        <MuiTableHead>
                            <MuiTableRow>
                                {columns.map((column) => (
                                    <MuiTableCell
                                        key={column.id}
                                        align={column.align || 'right'}
                                        sx={{
                                            minWidth: column.minWidth,
                                            background: 'rgba(38, 38, 38, 0.9) !important',
                                            color: 'var(--color-primary-400)',
                                            fontWeight: 700,
                                            borderBottom: '2px solid var(--color-border-glass)',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {column.label}
                                    </MuiTableCell>
                                ))}
                                {showActions && (onEdit || onDelete || onView || onToggleStatus) && (
                                    <MuiTableCell
                                        align="center"
                                        sx={{
                                            minWidth: 120,
                                            background: 'rgba(38, 38, 38, 0.9) !important',
                                            color: 'var(--color-primary-400)',
                                            fontWeight: 700,
                                            borderBottom: '2px solid var(--color-border-glass)'
                                        }}
                                    >
                                        الإجراءات
                                    </MuiTableCell>
                                )}
                            </MuiTableRow>
                        </MuiTableHead>
                        <MuiTableBody>
                            {paginatedData.map((row, index) => (
                                <MuiTableRow
                                    hover
                                    key={row.id || index}
                                    sx={{
                                        '&:hover': { background: 'rgba(216, 185, 138, 0.05) !important' },
                                        '& td': { borderBottom: '1px solid var(--color-border-glass)' }
                                    }}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id]
                                        return (
                                            <MuiTableCell key={column.id} align={column.align || 'right'} sx={{ color: 'var(--color-text-primary-dark)' }}>
                                                {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value)}
                                            </MuiTableCell>
                                        )
                                    })}
                                    {showActions && (onEdit || onDelete || onView || onToggleStatus) && (
                                        <MuiTableCell align="center">
                                            <MuiBox sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                {onView && (
                                                    <MuiTooltip title="عرض">
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => onView(row)}
                                                            sx={{
                                                                color: 'var(--color-primary-400)',
                                                                '&:hover': { background: 'rgba(216, 185, 138, 0.1)' }
                                                            }}
                                                        >
                                                            <Eye size={18} />
                                                        </MuiIconButton>
                                                    </MuiTooltip>
                                                )}
                                                {onEdit && (
                                                    <MuiTooltip title="تعديل">
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => onEdit(row)}
                                                            sx={{
                                                                color: '#0284c7',
                                                                '&:hover': { background: 'rgba(2, 132, 199, 0.1)' }
                                                            }}
                                                        >
                                                            <Edit2 size={18} />
                                                        </MuiIconButton>
                                                    </MuiTooltip>
                                                )}
                                                {onToggleStatus && (
                                                    <MuiTooltip title={row.isActive ? 'تعطيل' : 'تفعيل'}>
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => onToggleStatus(row)}
                                                            sx={{
                                                                color: row.isActive ? '#16a34a' : '#dc2626',
                                                                '&:hover': { background: row.isActive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)' }
                                                            }}
                                                        >
                                                            {row.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                        </MuiIconButton>
                                                    </MuiTooltip>
                                                )}
                                                {onDelete && (
                                                    <MuiTooltip title="حذف">
                                                        <MuiIconButton
                                                            size="small"
                                                            onClick={() => onDelete(row)}
                                                            sx={{
                                                                color: '#dc2626',
                                                                '&:hover': { background: 'rgba(220, 38, 38, 0.1)' }
                                                            }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </MuiIconButton>
                                                    </MuiTooltip>
                                                )}
                                            </MuiBox>
                                        </MuiTableCell>
                                    )}
                                </MuiTableRow>
                            ))}
                        </MuiTableBody>
                    </MuiTable>
                </MuiTableContainer>
            )}

            <MuiTablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    color: 'var(--color-text-secondary)',
                    borderTop: 'none',
                    '& .MuiTablePagination-selectIcon': { color: 'var(--color-primary-400)' }
                }}
            />
        </MuiBox>
    )
}
