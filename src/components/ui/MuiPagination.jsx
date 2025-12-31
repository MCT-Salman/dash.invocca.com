import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: 'var(--color-text-secondary, #b3b3b3)',
        borderColor: 'var(--color-border-glass, rgba(255, 255, 255, 0.1))',
        '&:hover': {
            backgroundColor: 'rgba(216, 185, 138, 0.1)',
            borderColor: 'var(--color-primary-500, #D8B98A)',
        },
        '&.Mui-selected': {
            backgroundColor: 'var(--color-primary-500, #D8B98A)',
            color: 'var(--color-primary-950, #1A1A1A)',
            fontWeight: 700,
            '&:hover': {
                backgroundColor: 'var(--color-primary-600, #c4a578)',
            },
        },
    },
    '& .MuiPaginationItem-ellipsis': {
        color: 'var(--color-text-secondary, #b3b3b3)',
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
