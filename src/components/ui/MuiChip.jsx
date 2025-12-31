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
      transform: 'scale(1.05)',
    },
  };

  if (variant === 'filled') {
    return {
      ...baseStyles,
      backgroundColor: color === 'primary'
        ? 'var(--color-primary-500)'
        : color === 'secondary'
        ? 'var(--color-secondary-500)'
        : color === 'success'
        ? 'var(--color-success-500)'
        : color === 'error'
        ? 'var(--color-error-500)'
        : color === 'warning'
        ? 'var(--color-warning-500)'
        : color === 'info'
        ? 'var(--color-info-500)'
        : 'var(--color-gray-light)',
      color: color === 'primary' || color === 'secondary' || color === 'error' || color === 'info'
        ? '#ffffff'
        : 'var(--color-text-primary)',
      '&:hover': {
        ...baseStyles['&:hover'],
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    };
  }

  // outlined variant
  return {
    ...baseStyles,
    border: '1.5px solid',
    borderColor: color === 'primary'
      ? 'var(--color-primary-500)'
      : color === 'secondary'
      ? 'var(--color-secondary-500)'
      : 'var(--color-border)',
    backgroundColor: 'transparent',
    color: color === 'primary'
      ? 'var(--color-primary-500)'
      : color === 'secondary'
      ? 'var(--color-secondary-700)'
      : 'var(--color-text-primary)',
    '&:hover': {
      ...baseStyles['&:hover'],
      backgroundColor: color === 'primary'
        ? 'var(--color-primary-50)'
        : color === 'secondary'
        ? 'var(--color-secondary-50)'
        : 'rgba(0, 0, 0, 0.04)',
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
