import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme, variant, color }) => {
  const baseStyles = {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
  };

  if (variant === 'contained') {
    return {
      ...baseStyles,
      background: color === 'primary'
        ? 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)'
        : color === 'secondary'
          ? 'linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-600) 100%)'
          : color === 'error'
            ? 'var(--color-error-500)'
            : undefined,
      color: color === 'secondary' ? '#fff' : '#000', // Primary text black on gold
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      border: 'none',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
        background: color === 'primary'
          ? 'linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)'
          : color === 'secondary'
            ? 'linear-gradient(135deg, var(--color-secondary-600) 0%, var(--color-secondary-700) 100%)'
            : undefined,
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      '&:disabled': {
        background: 'var(--color-surface-dark)',
        color: 'var(--color-text-muted)',
        boxShadow: 'none',
      },
    };
  }

  if (variant === 'outlined') {
    return {
      ...baseStyles,
      border: '1.5px solid',
      borderColor: color === 'primary'
        ? 'var(--color-primary-500)'
        : color === 'secondary'
          ? 'var(--color-secondary-500)'
          : 'var(--color-border-dark)',
      color: color === 'primary'
        ? 'var(--color-primary-500)'
        : color === 'secondary'
          ? 'var(--color-secondary-500)'
          : 'var(--color-text-primary-dark)',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: color === 'primary'
          ? 'rgba(216, 185, 138, 0.1)'
          : color === 'secondary'
            ? 'rgba(109, 109, 109, 0.1)'
            : 'rgba(255, 255, 255, 0.05)',
        borderColor: color === 'primary'
          ? 'var(--color-primary-400)'
          : color === 'secondary'
            ? 'var(--color-secondary-400)'
            : 'var(--color-text-primary-dark)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      '&:disabled': {
        borderColor: 'var(--color-border-dark)',
        color: 'var(--color-text-muted)',
      },
    };
  }

  // text variant
  return {
    ...baseStyles,
    color: color === 'primary'
      ? 'var(--color-primary-500)'
      : color === 'secondary'
        ? 'var(--color-secondary-300)'
        : 'var(--color-text-primary-dark)',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      color: 'var(--color-text-muted)',
    },
  };
});

const MuiButton = ({
  value,
  children,
  variant = 'text',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  selected = false,
  start_icon,
  end_icon,
  onClick,
  type = 'button',
  href,
  target,
  disableRipple = false,
  disableElevation = true,
  disableFocusRipple = false,
  className = '',
  sx,
  ...props
}) => {
  return (
    <StyledButton
      startIcon={start_icon}
      endIcon={end_icon}
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      loading={loading}
      loadingPosition={start_icon ? 'start' : 'end'}
      disabled={disabled || loading}
      selected={selected}
      onClick={onClick}
      type={type}
      href={href}
      target={target}
      disableRipple={disableRipple}
      disableElevation={disableElevation}
      disableFocusRipple={disableFocusRipple}
      className={className}
      sx={{
        padding: size === 'small' ? '8px 16px' : size === 'large' ? '14px 28px' : '10px 20px',
        '& .MuiButton-startIcon': {
          marginLeft: '8px',
          marginRight: '0',
          display: 'flex',
          alignItems: 'center',
          '& > *:nth-of-type(1)': {
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.25rem' : '1rem',
            margin: 0,
          },
        },
        '& .MuiButton-endIcon': {
          marginRight: '8px',
          marginLeft: '0',
          display: 'flex',
          alignItems: 'center',
          '& > *:nth-of-type(1)': {
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.25rem' : '1rem',
            margin: 0,
          },
        },
        ...sx
      }}
      {...props}
    >
      {children || value}
    </StyledButton>
  );
};

export default MuiButton;