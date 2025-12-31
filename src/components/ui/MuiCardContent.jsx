import { CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'
import { cn } from '@/utils/helpers'

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    },
    '& .MuiBox-root': {
        '& svg': {
            marginLeft: '8px',
            marginRight: '0',
            flexShrink: 0,
        },
    },
    '& .MuiTypography-root': {
        '& svg': {
            marginLeft: '8px',
            marginRight: '0',
            verticalAlign: 'middle',
            flexShrink: 0,
        },
    },
    '& .MuiGrid-item': {
        '& .MuiBox-root': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            '& svg': {
                margin: 0,
                flexShrink: 0,
            },
        },
    },
}));

export default function MuiCardContent({ className, children, sx, ...props }) {
    return (
        <StyledCardContent className={cn('', className)} sx={sx} {...props}>
            {children}
        </StyledCardContent>
    )
}
