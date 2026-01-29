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
    customActions,
    rowsPerPageOptions = [5, 10, 25, 50],
    animatingRows = {}, // Object with rowId: 'move-up' | 'move-down'
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
                        background: 'var(--color-overlay)',
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
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-paper)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: 'var(--shadow-md)'
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
                                            <MuiTypography variant="body2" component="span" sx={{ color: 'var(--color-text-primary)' }}>
                                                {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value)}
                                            </MuiTypography>
                                        </MuiBox>
                                    )
                                })}

                                {showActions && (onEdit || onDelete || onView || onToggleStatus || customActions) && (
                                    <MuiBox sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'nowrap', mt: 2, pt: 2, borderTop: '1px solid var(--color-border)' }}>
                                        {customActions && customActions(row)}
                                        {onView && (
                                            <MuiTooltip title="عرض">
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => onView(row)}
                                                    sx={{
                                                        color: 'var(--color-primary-500)',
                                                        '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                        color: 'var(--color-info-500)',
                                                        '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                        color: row.isActive ? 'var(--color-success-500)' : 'var(--color-error-500)',
                                                        '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                        color: 'var(--color-error-500)',
                                                        '&:hover': { background: 'var(--color-surface-hover)' }
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
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-paper)'
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
                                            background: 'var(--color-surface) !important',
                                            color: 'var(--color-primary-500)',
                                            fontWeight: 700,
                                            borderBottom: '2px solid var(--color-border)',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {column.label}
                                    </MuiTableCell>
                                ))}
                                {showActions && (onEdit || onDelete || onView || onToggleStatus || customActions) && (
                                    <MuiTableCell
                                        align="center"
                                        sx={{
                                            minWidth: 120,
                                            background: 'var(--color-surface) !important',
                                            color: 'var(--color-primary-500)',
                                            fontWeight: 700,
                                            borderBottom: '2px solid var(--color-border)'
                                        }}
                                    >
                                        الإجراءات
                                    </MuiTableCell>
                                )}
                            </MuiTableRow>
                        </MuiTableHead>
                        <MuiTableBody>
                            {paginatedData.map((row, index) => {
                                const animationType = animatingRows[row.id]
                                return (
                                    <MuiTableRow
                                        hover
                                        key={row.id || index}
                                        sx={{
                                            '&:hover': { background: 'var(--color-surface-hover) !important' },
                                            '& td': { borderBottom: '1px solid var(--color-border)' },
                                            ...(animationType === 'move-up' && {
                                                animation: 'moveUp 0.5s ease-out',
                                            }),
                                            ...(animationType === 'move-down' && {
                                                animation: 'moveDown 0.5s ease-out',
                                            }),
                                        }}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id]
                                            return (
                                                <MuiTableCell key={column.id} align={column.align || 'right'} sx={{ color: 'var(--color-text-primary)' }}>
                                                    {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value)}
                                                </MuiTableCell>
                                            )
                                        })}
                                        {showActions && (onEdit || onDelete || onView || onToggleStatus || customActions) && (
                                            <MuiTableCell align="center">
                                                <MuiBox sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                    {customActions && customActions(row)}
                                                    {onView && (
                                                        <MuiTooltip title="عرض">
                                                            <MuiIconButton
                                                                size="small"
                                                                onClick={() => onView(row)}
                                                                sx={{
                                                                    color: 'var(--color-primary-500)',
                                                                    '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                                    color: 'var(--color-info-500)',
                                                                    '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                                    color: row.isActive ? 'var(--color-success-500)' : 'var(--color-error-500)',
                                                                    '&:hover': { background: 'var(--color-surface-hover)' }
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
                                                                    color: 'var(--color-error-500)',
                                                                    '&:hover': { background: 'var(--color-surface-hover)' }
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
                                )
                            })}
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
                    '& .MuiTablePagination-selectIcon': { color: 'var(--color-primary-500)' }
                }}
            />
        </MuiBox>
    )
}
