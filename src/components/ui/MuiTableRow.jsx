import TableRow from '@mui/material/TableRow';

const MuiTableRow = ({
    children,
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <TableRow
            sx={sx}
            className={className}
            {...props}
        >
            {children}
        </TableRow>
    );
};

export default MuiTableRow;
