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
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-2xl)',
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
