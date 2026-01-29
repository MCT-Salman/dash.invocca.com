import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme, elevation }) => ({
  borderRadius: '16px',
  backgroundColor: 'var(--color-paper)',
  backgroundImage: 'none',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--color-border)',
  boxShadow: elevation === 0
    ? 'none'
    : elevation === 1
      ? 'var(--shadow-sm)'
      : elevation === 2
        ? 'var(--shadow-base)'
        : 'var(--shadow-md)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  color: 'var(--color-text-primary)',
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
