// src/components/ui/MuiInputLabel.jsx
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';

const StyledInputLabel = styled(InputLabel)(({ theme, error }) => ({
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-family-base)',
    '&.Mui-focused': {
        color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
    },
    '&.Mui-error': {
        color: 'var(--color-error-500)',
    },
    '&.Mui-disabled': {
        color: 'var(--color-text-muted)',
    },
}));

export default function MuiInputLabel({ className, children, error, ...props }) {
    return (
        <StyledInputLabel className={className} error={error} {...props}>
            {children}
        </StyledInputLabel>
    )
}
