import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border)',
        fontFamily: 'Alexandria, var(--font-family-base)',
        '&:hover': {
            backgroundColor: 'color-mix(in srgb, var(--color-gold) 15%, transparent)',
            borderColor: 'var(--color-border)',
        },
        '&.Mui-selected': {
            backgroundColor: 'var(--color-icon)',
            color: 'var(--color-dark)',
            fontWeight: 700,
            '&:hover': {
                backgroundColor: 'var(--color-icon)',
                opacity: 0.9,
            },
        },
    },
    '& .MuiPaginationItem-ellipsis': {
        color: 'var(--color-text-secondary)',
        fontFamily: 'Alexandria, var(--font-family-base)',
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
