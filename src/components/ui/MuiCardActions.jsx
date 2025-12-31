import { CardActions } from '@mui/material'
import { styled } from '@mui/material/styles'
import { cn } from '@/utils/helpers'

const StyledCardActions = styled(CardActions)(({ theme }) => ({
    padding: theme.spacing(2.5),
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    '& .MuiButton-root': {
        margin: '0 6px',
        padding: theme.spacing(1, 2),
        '& .MuiButton-startIcon': {
            marginLeft: '8px',
            marginRight: '0',
            '& > *:nth-of-type(1)': {
                fontSize: '1rem',
            },
        },
        '& .MuiButton-endIcon': {
            marginRight: '8px',
            marginLeft: '0',
            '& > *:nth-of-type(1)': {
                fontSize: '1rem',
            },
        },
    },
    '& .MuiIconButton-root': {
        margin: '0 4px',
        padding: theme.spacing(1),
    },
}));

export default function MuiCardActions({ className, children, sx, ...props }) {
    return (
        <StyledCardActions className={cn('', className)} sx={sx} {...props}>
            {children}
        </StyledCardActions>
    )
}
