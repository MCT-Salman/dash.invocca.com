// src/components/ui/MuiTypography.jsx
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(({ theme, color, variant }) => {
  const getColor = () => {
    if (color === 'primary') return 'var(--color-primary-500)';
    if (color === 'secondary') return 'var(--color-text-secondary)';
    if (color === 'textPrimary') return 'var(--color-text-primary)'; // Map to dynamic variable
    if (color === 'textSecondary') return 'var(--color-text-secondary)';
    if (color === 'error') return 'var(--color-error-500)';
    if (color === 'success') return 'var(--color-success-500)';
    if (color === 'warning') return 'var(--color-warning-500)';
    if (color === 'info') return 'var(--color-info-500)';
    return color || 'var(--color-text-primary)'; // Default to visible text
  };

  return {
    color: getColor(),
    fontFamily: 'var(--font-family-base)',
    letterSpacing: variant?.includes('h') ? '-0.02em' : 'normal',
    fontWeight: variant?.includes('h') ? 700 : 400,
    '&.MuiTypography-h1': { fontWeight: 800, fontSize: '3rem' },
    '&.MuiTypography-h2': { fontWeight: 700, fontSize: '2.5rem' },
    '&.MuiTypography-h3': { fontWeight: 700, fontSize: '2rem' },
    '&.MuiTypography-h4': { fontWeight: 710, fontSize: '1.75rem', color: 'var(--color-primary-500)' },
    '&.MuiTypography-h5': { fontWeight: 600, fontSize: '1.5rem' },
    '&.MuiTypography-h6': { fontWeight: 600, fontSize: '1.25rem' },
    '&.MuiTypography-subtitle1': { color: 'var(--color-text-secondary)', fontSize: '1rem' },
    '&.MuiTypography-subtitle2': { fontWeight: 600, fontSize: '0.875rem' },
    '&.MuiTypography-body1': { fontSize: '1rem' },
    '&.MuiTypography-body2': { fontSize: '0.875rem', color: 'var(--color-text-secondary)' },
  };
});

const MuiTypography = ({
  variant = 'body1',
  component,
  gutterBottom = false,
  noWrap = false,
  align = 'inherit',
  color,
  className = '',
  children,
  sx,
  ...props
}) => {
  return (
    <StyledTypography
      variant={variant}
      component={component}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      align={align}
      color={color}
      className={className}
      sx={sx}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

export default MuiTypography;
