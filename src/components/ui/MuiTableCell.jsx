import TableCell from '@mui/material/TableCell';

const MuiTableCell = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <TableCell
            sx={sx}
            className={className}
            {...props}
        >
            {children}
        </TableCell>
    );
};

export default MuiTableCell;
