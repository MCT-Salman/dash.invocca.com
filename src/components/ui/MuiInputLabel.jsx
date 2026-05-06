// src/components/ui/MuiInputLabel.jsx
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';

const StyledInputLabel = styled(InputLabel)(({ theme, error }) => ({
    color: error ? 'var(--color-icon)' : 'var(--color-text-primary)',
    fontFamily: 'Alexandria, var(--font-family-base)',
    fontWeight: 700,
    fontSize: '0.95rem',
    textAlign: 'right',
    direction: 'rtl',
    right: 0,
    left: 'auto',
    transformOrigin: 'top right',
    '&.Mui-focused': {
        color: error ? 'var(--color-icon)' : 'var(--color-text-primary)',
        fontWeight: 700,
    },
    '&.Mui-error': {
        color: 'var(--color-icon)',
    },
    '&.Mui-disabled': {
        color: 'var(--color-text-muted)',
        opacity: 0.5
    },
}));

export default function MuiInputLabel({ className, children, error, ...props }) {
    return (
        <StyledInputLabel className={className} error={error} {...props}>
            {children}
        </StyledInputLabel>
    )
}
