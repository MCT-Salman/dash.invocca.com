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
          boxShadow: 'none',
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
            fontFamily: 'Alexandria, var(--font-family-base)',
            borderRadius: '8px',
            mx: 0.5,
            my: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'color-mix(in srgb, var(--color-gold) 12%, transparent)',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--color-icon) !important',
              color: 'var(--color-dark) !important',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'var(--color-icon) !important',
                opacity: 0.9,
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
