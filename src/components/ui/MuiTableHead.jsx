import TableHead from '@mui/material/TableHead';

const MuiTableHead = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <TableHead
            sx={sx}
            className={className}
            {...props}
        >
            {children}
        </TableHead>
    );
};

export default MuiTableHead;
