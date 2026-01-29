import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border)',
        '&:hover': {
            backgroundColor: 'var(--color-surface-hover)',
            borderColor: 'var(--color-primary-500)',
        },
        '&.Mui-selected': {
            backgroundColor: 'var(--color-primary-500)',
            color: 'var(--color-text-on-primary)',
            fontWeight: 700,
            '&:hover': {
                backgroundColor: 'var(--color-primary-600)',
            },
        },
    },
    '& .MuiPaginationItem-ellipsis': {
        color: 'var(--color-text-secondary)',
    },
}));

const MuiPagination = ({
    count,
    page,
    onChange,
    variant = 'outlined',
    shape = 'rounded',
    size = 'medium',
    sx = {},
    className = '',
    ...props
}) => {
    return (
        <StyledPagination
            count={count}
            page={page}
            onChange={onChange}
            variant={variant}
            shape={shape}
            size={size}
            sx={sx}
            className={className}
            {...props}
        />
    );
};

export default MuiPagination;
