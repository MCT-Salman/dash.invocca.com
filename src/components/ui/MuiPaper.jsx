import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme, elevation }) => ({
  borderRadius: '16px',
  backgroundColor: 'var(--color-surface-dark)', // fallback
  backgroundImage: 'linear-gradient(to bottom right, rgba(20,20,20,0.8), rgba(10,10,10,0.9))',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--color-border-glass)',
  boxShadow: elevation === 0
    ? 'none'
    : elevation === 1
      ? '0 2px 8px rgba(0, 0, 0, 0.4)'
      : elevation === 2
        ? '0 4px 16px rgba(0, 0, 0, 0.6)'
        : '0 8px 24px rgba(0, 0, 0, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  color: 'var(--color-text-primary-dark)',
}));

const MuiPaper = ({
  elevation = 1,
  variant = 'elevation',
  square = false,
  className = '',
  children,
  sx,
  ...props
}) => {
  return (
    <StyledPaper
      elevation={variant === 'elevation' ? elevation : 0}
      variant={variant}
      square={square}
      className={className}
      sx={sx}
      {...props}
    >
      {children}
    </StyledPaper>
  );
};

export default MuiPaper;
