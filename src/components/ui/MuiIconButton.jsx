import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme, size, color }) => {
  const getPadding = () => {
    if (size === 'small') return '8px';
    if (size === 'large') return '16px';
    return '12px';
  };

  const getMargin = () => {
    return '4px';
  };

  return {
    padding: getPadding(),
    margin: '0 4px',
    borderRadius: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& svg': {
      margin: 0,
      display: 'block',
    },
    color: color === 'primary'
      ? 'var(--color-primary-500)'
      : color === 'secondary'
        ? 'var(--color-text-secondary)'
        : color === 'error'
          ? 'var(--color-error-500)'
          : color === 'success'
            ? 'var(--color-success-500)'
            : color === 'warning'
              ? 'var(--color-warning-500)'
              : color === 'info'
                ? 'var(--color-info-500)'
                : 'var(--color-text-primary)',
    '&:hover': {
      backgroundColor: color === 'primary'
        ? 'var(--color-primary-50)'
        : color === 'secondary'
          ? 'var(--color-secondary-50)'
          : color === 'error'
            ? 'var(--color-error-50)'
            : color === 'success'
              ? 'var(--color-success-50)'
              : color === 'warning'
                ? 'var(--color-warning-50)'
                : color === 'info'
                  ? 'var(--color-info-50)'
                  : 'var(--color-surface-hover)',
      transform: 'scale(1.1)',
      boxShadow: 'var(--shadow-sm)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&:disabled': {
      color: 'var(--color-text-disabled)',
      backgroundColor: 'transparent',
    },
  };
});

const MuiIconButton = ({
  children,
  color = 'primary',
  size = 'medium',
  edge,
  disabled = false,
  onClick,
  className = '',
  sx,
  ...props
}) => {
  return (
    <StyledIconButton
      color={color}
      size={size}
      edge={edge}
      disabled={disabled}
      onClick={onClick}
      className={className}
      sx={sx}
      {...props}
    >
      {children}
    </StyledIconButton>
  );
};

export default MuiIconButton;
