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
    rowsPerPage,
    onRowsPerPageChange,
    animatingRows = {}, // Object with rowId: 'move-up' | 'move-down'
    sx = {}
}) {
    const tableData = useMemo(() => rows || data || [], [rows, data])
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const isTablet = useMediaQuery(theme.breakpoints.down('xl'))
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [page, setPage] = useState(0)
    const internalRowsPerPage = rowsPerPage || rowsPerPageOptions[1] || 10
    const [internalRowsPerPageState, setInternalRowsPerPageState] = useState(internalRowsPerPage)
    const currentRowsPerPage = rowsPerPage || internalRowsPerPageState

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10)
        if (onRowsPerPageChange) {
            onRowsPerPageChange(newRowsPerPage)
        } else {
            setInternalRowsPerPageState(newRowsPerPage)
        }
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

    const paginatedData = tableData.slice(page * currentRowsPerPage, page * currentRowsPerPage + currentRowsPerPage)

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

            {isMobile || isTablet ? (
                // Facebook-style Card View
                <MuiBox sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    direction: 'rtl',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                    {paginatedData.map((row, index) => (
                        <MuiPaper
                            key={row.id || index}
                            elevation={0}
                            sx={{
                                p: 0,
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-paper)',
                                transition: 'all 0.2s ease',
                                overflow: 'visible',
                                width: '100%',
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                minWidth: 0,
                                '&:hover': {
                                    borderColor: 'var(--color-primary-200)',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            {/* Card Header */}
                            <MuiBox sx={{
                                p: isSmallMobile ? 1 : 1.5,
                                borderBottom: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <MuiTypography variant="h6" sx={{
                                    fontSize: isSmallMobile ? '0.85rem' : '0.95rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-primary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: isSmallMobile ? 'calc(100% - 150px)' : 'calc(100% - 200px)',
                                    flex: 1,
                                    minWidth: 0
                                }}>
                                    {row.name || row.title || 'عنصر'}
                                </MuiTypography>

                                {/* Actions in header */}
                                <MuiBox sx={{
                                    display: 'flex',
                                    gap: isSmallMobile ? 0.25 : 0.5,
                                    alignItems: 'center',
                                    flexShrink: 0,
                                    minWidth: 'auto'
                                }}>
                                    {onView && (
                                        <MuiIconButton
                                            size="small"
                                            onClick={() => onView(row)}
                                            sx={{
                                                color: 'var(--color-text-secondary)',
                                                padding: isSmallMobile ? '2px' : '3px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--color-surface-hover)',
                                                    color: 'var(--color-primary-500)'
                                                }
                                            }}
                                        >
                                            <Eye size={isSmallMobile ? 14 : 16} />
                                        </MuiIconButton>
                                    )}
                                    {onEdit && (
                                        <MuiIconButton
                                            size="small"
                                            onClick={() => onEdit(row)}
                                            sx={{
                                                color: 'var(--color-text-secondary)',
                                                padding: isSmallMobile ? '2px' : '3px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--color-surface-hover)',
                                                    color: 'var(--color-primary-500)'
                                                }
                                            }}
                                        >
                                            <Edit2 size={isSmallMobile ? 14 : 16} />
                                        </MuiIconButton>
                                    )}
                                    {onToggleStatus && (
                                        <MuiIconButton
                                            size="small"
                                            onClick={() => onToggleStatus(row)}
                                            sx={{
                                                color: row.isActive ? 'var(--color-success-500)' : 'var(--color-text-secondary)',
                                                padding: isSmallMobile ? '2px' : '3px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--color-surface-hover)',
                                                    color: row.isActive ? 'var(--color-success-600)' : 'var(--color-primary-500)'
                                                }
                                            }}
                                        >
                                            {row.isActive ? <ToggleRight size={isSmallMobile ? 14 : 16} /> : <ToggleLeft size={isSmallMobile ? 14 : 16} />}
                                        </MuiIconButton>
                                    )}
                                    {onDelete && (
                                        <MuiIconButton
                                            size="small"
                                            onClick={() => onDelete(row)}
                                            sx={{
                                                color: 'var(--color-text-secondary)',
                                                padding: isSmallMobile ? '2px' : '3px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--color-error-50)',
                                                    color: 'var(--color-error-500)'
                                                }
                                            }}
                                        >
                                            <Trash2 size={isSmallMobile ? 14 : 16} />
                                        </MuiIconButton>
                                    )}
                                </MuiBox>
                            </MuiBox>

                            {/* Card Content */}
                            <MuiBox sx={{
                                p: isSmallMobile ? 1 : 1.5,
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <MuiBox sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: isSmallMobile ? 0.8 : 1,
                                    width: '100%'
                                }}>
                                    {columns
                                        .filter(column => column.id !== 'name' && column.id !== 'title')
                                        .slice(0, isSmallMobile ? 3 : 5)
                                        .map((column) => {
                                            const value = row[column.id]
                                            return (
                                                <MuiBox key={column.id} sx={{
                                                    display: 'flex',
                                                    gap: isSmallMobile ? 0.5 : 1,
                                                    alignItems: 'flex-start',
                                                    flexWrap: 'nowrap',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}>
                                                    <MuiTypography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'var(--color-text-secondary)',
                                                            fontWeight: 500,
                                                            minWidth: isSmallMobile ? '60px' : '80px',
                                                            flexShrink: 0,
                                                            fontSize: isSmallMobile ? '0.7rem' : '0.75rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {column.label}:
                                                    </MuiTypography>
                                                    <MuiTypography
                                                        variant="body2"
                                                        component="div"
                                                        sx={{
                                                            color: 'var(--color-text-primary)',
                                                            fontSize: isSmallMobile ? '0.75rem' : '0.8rem',
                                                            wordBreak: 'break-word',
                                                            flex: 1,
                                                            overflow: 'visible',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: isSmallMobile ? 1 : 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            minWidth: 0,
                                                            width: '0' // Important for flex text truncation
                                                        }}
                                                    >
                                                        {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value || '-')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            )
                                        })}
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    ))}
                </MuiBox>
            ) : (
                // Desktop Table View with Separate Header
                <MuiBox>
                    {/* Separate Header Container */}
                    <MuiBox
                        sx={{
                            borderRadius: '16px 16px 0 0',
                            border: '1px solid var(--color-border)',
                            borderBottom: 'none',
                            background: 'var(--color-surface)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            mb: 0.5,
                            overflow: 'hidden'
                        }}
                    >
                        <MuiBox
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 2,
                                px: 2,
                                gap: 0
                            }}
                        >
                            {columns.map((column) => (
                                <MuiBox
                                    key={column.id}
                                    sx={{
                                        minWidth: column.minWidth,
                                        width: column.minWidth ? undefined : 'auto',
                                        flex: column.minWidth ? undefined : 1,
                                        textAlign: column.align || 'right',
                                        color: 'var(--color-primary-600)',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        whiteSpace: 'nowrap',
                                        px: 1
                                    }}
                                >
                                    {column.label}
                                </MuiBox>
                            ))}
                            {showActions && (onEdit || onDelete || onView || onToggleStatus || customActions) && (
                                <MuiBox
                                    sx={{
                                        minWidth: 120,
                                        textAlign: 'center',
                                        color: 'var(--color-primary-600)',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        px: 1
                                    }}
                                >
                                    الإجراءات
                                </MuiBox>
                            )}
                        </MuiBox>
                    </MuiBox>

                    {/* Table Body Container */}
                    <MuiTableContainer
                        sx={{
                            borderRadius: '0 0 16px 16px',
                            border: '1px solid var(--color-border)',
                            borderTop: 'none',
                            background: 'var(--color-paper)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <MuiTable>
                            <MuiTableHead sx={{ display: 'none' }}>
                                <MuiTableRow />
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
                                                    <MuiTableCell
                                                        key={column.id}
                                                        align={column.align || 'right'}
                                                        sx={{
                                                            color: 'var(--color-text-primary)',
                                                            py: 1.5,
                                                            px: 2,
                                                            fontSize: '0.875rem',
                                                            borderBottom: '1px solid var(--color-border)',
                                                            '&:first-of-type': {
                                                                fontWeight: 500
                                                            }
                                                        }}
                                                    >
                                                        {column.format ? column.format(value, row) : (typeof value === 'object' && value !== null ? (value.label || value.name || String(value)) : value)}
                                                    </MuiTableCell>
                                                )
                                            })}
                                            {showActions && (onEdit || onDelete || onView || onToggleStatus || customActions) && (
                                                <MuiTableCell
                                                    align="center"
                                                    sx={{
                                                        py: 1.5,
                                                        px: 2,
                                                        borderBottom: '1px solid var(--color-border)'
                                                    }}
                                                >
                                                    <MuiBox sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                        {customActions && customActions(row)}
                                                        {onView && (
                                                            <MuiTooltip title="عرض">
                                                                <MuiIconButton
                                                                    size="small"
                                                                    onClick={() => onView(row)}
                                                                    sx={{
                                                                        color: '#ffffff !important',
                                                                        padding: '6px',
                                                                        margin: 0,
                                                                        borderRadius: '6px',
                                                                        backgroundColor: 'var(--color-primary-100)',
                                                                        '&:hover': { transform: 'scale(1.1)', backgroundColor: 'var(--color-primary-100)' },
                                                                        '& svg': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        },
                                                                        '& .lucide': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        }
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
                                                                        color: '#ffffff !important',
                                                                        padding: '6px',
                                                                        margin: 0,
                                                                        borderRadius: '6px',
                                                                        backgroundColor: 'var(--color-primary-100)',
                                                                        '&:hover': { transform: 'scale(1.1)', backgroundColor: 'var(--color-primary-100)' },
                                                                        '& svg': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        },
                                                                        '& .lucide': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        }
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
                                                                        color: '#ffffff !important',
                                                                        padding: '6px',
                                                                        margin: 0,
                                                                        borderRadius: '6px',
                                                                        backgroundColor: 'var(--color-primary-100)',
                                                                        '&:hover': { transform: 'scale(1.1)', backgroundColor: 'var(--color-primary-100)' },
                                                                        '& svg': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        },
                                                                        '& .lucide': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        }
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
                                                                        color: '#ffffff !important',
                                                                        backgroundColor: 'var(--color-error-500)',
                                                                        padding: '6px',
                                                                        margin: 0,
                                                                        borderRadius: '6px',
                                                                        '&:hover': {
                                                                            backgroundColor: 'var(--color-error-700) !important',
                                                                            transform: 'scale(1.05)'
                                                                        },
                                                                        '& svg': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        },
                                                                        '& .lucide': {
                                                                            color: '#ffffff !important',
                                                                            stroke: '#ffffff !important'
                                                                        }
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
                </MuiBox>
            )}

            <MuiTablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={tableData.length}
                rowsPerPage={currentRowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="عدد الأسطر:"
                sx={{
                    color: 'var(--color-text-secondary)',
                    borderTop: 'none',
                    '& .MuiTablePagination-selectIcon': { color: 'var(--color-primary-500)' }
                }}
            />
        </MuiBox>
    )
}
