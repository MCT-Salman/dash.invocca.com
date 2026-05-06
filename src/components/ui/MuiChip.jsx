import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme, color, variant }) => {
  const baseStyles = {
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.75rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '4px 12px',
    height: 'auto',
    fontFamily: 'Alexandria, var(--font-family-base)',
    '& .MuiChip-icon': {
      marginLeft: '8px',
      marginRight: '0',
      marginTop: 0,
      marginBottom: 0,
    },
    '& .MuiChip-label': {
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    '&:hover': {
      backgroundColor: 'rgba(216, 185, 138, 0.18)',
    },
  };

  if (variant === 'filled') {
    return {
      ...baseStyles,
      border: '1px solid var(--color-border)',
      backgroundColor: color === 'error'
        ? 'var(--color-paper)'
        : color === 'primary'
          ? 'var(--color-icon)'
          : 'rgba(216, 185, 138, 0.15)',
      color: color === 'primary'
        ? 'var(--color-dark)'
        : color === 'error'
          ? 'var(--color-icon)'
          : 'var(--color-dark)',
      '&:hover': {
        ...baseStyles['&:hover'],
        boxShadow: 'none',
      },
    };
  }

  // outlined variant
  return {
    ...baseStyles,
    border: '1px solid var(--color-border)',
    borderColor: color === 'error' ? 'var(--color-icon)' : 'var(--color-border)',
    backgroundColor: 'transparent',
    color: color === 'error' ? 'var(--color-icon)' : 'var(--color-text-primary)',
    '&:hover': {
      ...baseStyles['&:hover'],
      backgroundColor: 'rgba(216, 185, 138, 0.12)',
    },
  };
});

const MuiChip = ({
  label,
  icon,
  onDelete,
  onClick,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  disabled = false,
  className = '',
  sx,
  ...props
}) => {
  return (
    <StyledChip
      label={label}
      icon={icon}
      onDelete={onDelete}
      onClick={onClick}
      color={color}
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      sx={sx}
      {...props}
    />
  );
};

export default MuiChip;
