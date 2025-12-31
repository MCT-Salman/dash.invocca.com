// src\components\ui\MuiTableContainer.jsx
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider || 'rgba(0, 0, 0, 0.12)'}`,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper || '#ffffff',
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
