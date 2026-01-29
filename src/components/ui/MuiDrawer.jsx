import Drawer from '@mui/material/Drawer';

const MuiDrawer = ({
  anchor = 'right',
  open = false,
  onClose,
  variant = 'temporary',
  className = '',
  children,
  ...props
}) => {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      variant={variant}
      className={className}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--color-paper)',
          color: 'var(--color-text-primary)',
          borderLeft: anchor === 'right' ? '1px solid var(--color-border)' : 'none',
          borderRight: anchor === 'left' ? '1px solid var(--color-border)' : 'none',
        }
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
};

export default MuiDrawer;
