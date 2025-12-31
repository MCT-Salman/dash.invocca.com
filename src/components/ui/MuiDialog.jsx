import Dialog from '@mui/material/Dialog';

const MuiDialog = ({
    open,
    onClose,
    fullWidth = true,
    maxWidth = 'sm',
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '16px',
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                },
                ...sx
            }}
            className={className}
            {...props}
        >
            {children}
        </Dialog>
    );
};

export default MuiDialog;
