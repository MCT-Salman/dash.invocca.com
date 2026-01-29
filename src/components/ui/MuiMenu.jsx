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
          backgroundColor: 'var(--color-paper)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
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
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderRadius: '8px',
            mx: 0.5,
            my: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'var(--color-surface-hover)',
              color: 'var(--color-primary-500)',
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--color-primary-500) !important',
              color: 'var(--color-text-on-primary) !important',
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
