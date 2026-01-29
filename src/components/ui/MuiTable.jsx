// src/components/ui/MuiTable.jsx
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';

const StyledTable = styled(Table)(() => ({
  minWidth: 650,
  backgroundColor: 'transparent',
  borderCollapse: 'separate',
  borderSpacing: 0,
  position: 'relative',
  '@keyframes moveUp': {
    '0%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
    '50%': {
      transform: 'translateY(-60px)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  '@keyframes moveDown': {
    '0%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
    '50%': {
      transform: 'translateY(60px)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  '& .MuiTableCell-root': {
    fontFamily: 'var(--font-family-base)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border)',
    padding: '16px 24px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& .MuiTableCell-head': {
    backgroundColor: 'var(--color-surface)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.01em',
    borderBottom: '2px solid var(--color-border)',
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'var(--color-surface-hover)',
    },
    '&:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
  },
}));

const MuiTable = ({ children, ...props }) => {
  return <StyledTable {...props}>{children}</StyledTable>;
};

export default MuiTable;
