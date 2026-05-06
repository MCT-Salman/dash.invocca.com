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
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& svg': {
      margin: 0,
      display: 'block',
    },
    color: color === 'error' ? 'var(--color-icon)' : 'var(--color-icon)',
    '&:hover': {
      backgroundColor: color === 'error'
        ? 'var(--color-paper)'
        : 'color-mix(in srgb, var(--color-gold) 12%, transparent)',
      transform: 'scale(1.05)',
      boxShadow: 'none',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&:disabled': {
      color: 'var(--color-text-muted)',
      backgroundColor: 'transparent',
      opacity: 0.6,
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
