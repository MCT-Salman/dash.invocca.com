import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: 'var(--color-surface-dark)',
  backgroundImage: 'linear-gradient(145deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid var(--color-border-glass)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-primary-700))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
    borderColor: 'var(--color-primary-500)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const MuiCard = ({
  title,
  subheader,
  content,
  actions,
  children,
  className = '',
  elevation = 0,
  sx,
  ...props
}) => {
  return (
    <StyledCard
      elevation={0}
      className={className}
      sx={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        ...sx
      }}
      {...props}
    >
      {(title || subheader) && (
        <CardHeader
          title={title}
          subheader={subheader}
          sx={{
            pb: 1,
            '& .MuiCardHeader-title': {
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--color-text-primary-dark)',
              letterSpacing: '-0.01em',
            },
            '& .MuiCardHeader-subheader': {
              color: 'var(--color-text-secondary-dark)',
              fontSize: '0.875rem',
              mt: 0.5,
            }
          }}
        />
      )}
      {content && (
        <CardContent sx={{
          color: 'var(--color-text-primary-dark)',
          '&:last-child': {
            paddingBottom: 2,
          }
        }}>
          {content}
        </CardContent>
      )}
      {children && !content && (
        <CardContent sx={{
          color: 'var(--color-text-primary-dark)',
          '&:last-child': {
            paddingBottom: 2,
          }
        }}>
          {children}
        </CardContent>
      )}
      {actions && (
        <CardActions sx={{
          padding: 2,
          paddingTop: 1,
          gap: 1,
          flexWrap: 'wrap'
        }}>
          {actions}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default MuiCard;
