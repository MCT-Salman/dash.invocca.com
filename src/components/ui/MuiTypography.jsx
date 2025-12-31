// src/components/ui/MuiTypography.jsx
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(({ theme, color, variant }) => {
  const getColor = () => {
    if (color === 'primary') return 'var(--color-primary-500)';
    if (color === 'secondary') return 'var(--color-text-secondary)';
    if (color === 'textPrimary') return 'var(--color-text-primary-dark)'; // Map to correct dark variable
    if (color === 'textSecondary') return 'var(--color-text-secondary)';
    if (color === 'error') return 'var(--color-error-500)';
    if (color === 'success') return 'var(--color-success-500)';
    if (color === 'warning') return 'var(--color-warning-500)';
    if (color === 'info') return 'var(--color-info-500)';
    return color || 'var(--color-text-primary-dark)'; // Default to visible text
  };

  return {
    color: getColor(),
    fontFamily: 'var(--font-family-base)',
    letterSpacing: variant?.includes('h') ? '-0.02em' : 'normal',
    lineHeight: variant?.includes('body') ? 1.6 : 1.2,
    '&.MuiTypography-h1': { fontWeight: 800 },
    '&.MuiTypography-h2': { fontWeight: 700 },
    '&.MuiTypography-h3': { fontWeight: 700 },
    '&.MuiTypography-h4': { fontWeight: 700, color: 'var(--color-primary-500)' }, // Headers often look best in gold
    '&.MuiTypography-h5': { fontWeight: 600 },
    '&.MuiTypography-h6': { fontWeight: 600 },
    '&.MuiTypography-subtitle1': { color: 'var(--color-text-secondary)' },
    '&.MuiTypography-subtitle2': { fontWeight: 600 },
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
