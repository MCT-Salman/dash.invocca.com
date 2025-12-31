import { CardMedia } from '@mui/material'
import { cn } from '@/utils/helpers'

export default function MuiCardMedia({ className, children, ...props }) {
    return (
        <CardMedia className={cn('', className)} {...props}>
            {children}
        </CardMedia>
    )
}
