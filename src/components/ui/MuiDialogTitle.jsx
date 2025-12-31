import DialogTitle from '@mui/material/DialogTitle';
import MuiTypography from './MuiTypography';

const MuiDialogTitle = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <DialogTitle
            sx={{
                p: 3,
                borderBottom: '1px solid var(--color-border-glass)',
                ...sx
            }}
            className={className}
            {...props}
        >
            {typeof children === 'string' ? (
                <MuiTypography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                    {children}
                </MuiTypography>
            ) : (
                children
            )}
        </DialogTitle>
    );
};

export default MuiDialogTitle;
