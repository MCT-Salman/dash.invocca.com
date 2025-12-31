import DialogContent from '@mui/material/DialogContent';

const MuiDialogContent = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <DialogContent
            sx={{
                p: 3,
                ...sx
            }}
            className={className}
            {...props}
        >
            {children}
        </DialogContent>
    );
};

export default MuiDialogContent;
