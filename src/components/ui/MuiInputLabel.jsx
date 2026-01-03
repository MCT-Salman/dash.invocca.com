// src/components/ui/MuiInputLabel.jsx
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';

const StyledInputLabel = styled(InputLabel)(({ theme, error }) => ({
    color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 500,
    fontSize: '0.95rem',
    textAlign: 'right',
    direction: 'rtl',
    right: 0,
    left: 'auto',
    transformOrigin: 'top right',
    '&.Mui-focused': {
        color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
        fontWeight: 600,
    },
    '&.Mui-error': {
        color: 'var(--color-error-500)',
    },
    '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.5)',
    },
}));

export default function MuiInputLabel({ className, children, error, ...props }) {
    return (
        <StyledInputLabel className={className} error={error} {...props}>
            {children}
        </StyledInputLabel>
    )
}
