import { TablePagination } from '@mui/material'
import { cn } from '@/utils/helpers'

export default function MuiTablePagination({ className, ...props }) {
    return (
        <TablePagination className={cn('', className)} {...props} />
    )
}
