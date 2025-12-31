// src/components/ui/MuiMenu.jsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const MuiMenu = ({
  anchorEl,
  open = false,
  onClose,
  items = [], // [{label, onClick, disabled}]
  className = '',
  ...props
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      className={className}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--color-surface-dark)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          minWidth: 180,
          mt: 1,
        }
      }}
      MenuListProps={{
        sx: {
          p: 1
        }
      }}
      {...props}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={(e) => {
            item.onClick?.(e);
            onClose?.();
          }}
          disabled={item.disabled}
          sx={{
            color: 'var(--color-text-primary-dark)',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderRadius: '8px',
            mx: 0.5,
            my: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(216, 185, 138, 0.1)',
              color: 'var(--color-primary-500)',
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--color-primary-500) !important',
              color: '#000 !important', // Dark text on gold background
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'var(--color-primary-600) !important',
              }
            }
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MuiMenu;
