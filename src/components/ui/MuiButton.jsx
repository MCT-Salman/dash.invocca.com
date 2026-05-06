import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme, variant, color }) => {
  const baseStyles = {
    borderRadius: '16px',
    fontWeight: 700,
    textTransform: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Alexandria, var(--font-family-base)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-light) 20%, transparent), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
  };

  if (variant === 'contained') {
    return {
      ...baseStyles,
      background: color === 'error' ? 'var(--color-icon)' : 'var(--color-icon)',
      color: 'var(--color-dark)',
      boxShadow: 'none',
      border: '1px solid var(--color-border)',
      '&:hover': {
        background: color === 'error' ? 'var(--color-icon)' : 'var(--color-icon)',
        boxShadow: 'none',
        opacity: 0.9,
      },
      '&:active': {
        opacity: 0.9,
      },
      '&:disabled': {
        background: 'var(--color-border)',
        color: 'var(--color-dark)',
        boxShadow: 'none',
        opacity: 0.6,
      },
    };
  }

  if (variant === 'outlined') {
    return {
      ...baseStyles,
      border: '1px solid var(--color-border)',
      borderColor: color === 'error' ? 'var(--color-icon)' : 'var(--color-border)',
      color: color === 'error' ? 'var(--color-icon)' : 'var(--color-text-primary)',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
        borderColor: color === 'error' ? 'var(--color-icon)' : 'var(--color-border)',
        boxShadow: 'none',
      },
      '&:disabled': {
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-muted)',
        opacity: 0.6,
      },
    };
  }

  // text variant
  return {
    ...baseStyles,
    color: color === 'error' ? 'var(--color-icon)' : 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
    },
    '&:disabled': {
      color: 'var(--color-text-muted)',
      opacity: 0.6,
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