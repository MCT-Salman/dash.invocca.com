// src\components\ui\MuiTableContainer.jsx
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: 'none',
  border: '1px solid var(--color-border)',
  overflow: 'hidden',
  backgroundColor: 'var(--color-paper)',
  '& .MuiTable-root': {
    minWidth: 650,
  },
}));

const MuiTableContainer = ({ children, ...props }) => {
  return (
    <StyledTableContainer component={Paper} {...props}>
      {children}
    </StyledTableContainer>
  );
};

export default MuiTableContainer;
