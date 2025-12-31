import DialogActions from '@mui/material/DialogActions';

const MuiDialogActions = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <DialogActions
            sx={{
                p: 2,
                px: 3,
                borderTop: '1px solid var(--color-border-glass)',
                ...sx
            }}
            className={className}
            {...props}
        >
            {children}
        </DialogActions>
    );
};

export default MuiDialogActions;
