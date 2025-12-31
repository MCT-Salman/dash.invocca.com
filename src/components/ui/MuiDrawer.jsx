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
        className: '!bg-yellow-pale !text-primary-500 !border-l-2 !border-beige-light'
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
};

export default MuiDrawer;
